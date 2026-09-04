"""Verify the structural and textual contract of the Partner Room PDF."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import pdfplumber
from pypdf import PdfReader


ARCHITECTURES = (
    "Structured Disagreement",
    "Collective Outlier Judgment",
    "Conviction-Weighted",
    "Autonomous Sponsor",
    "Collective Consensus",
    "Formal Institutional IC",
)

RECURRING_SUBHEADINGS = (
    "What it is",
    "How authority is distributed",
    "How conviction forms",
    "How disagreement is resolved",
    "The dispositive question",
    "What founders commonly misunderstand",
    "Evidence that performs well",
    "What can kill the investment",
    "Example",
)

REQUIRED_TEXT = (
    "HOW VENTURE ROOMS DECIDE",
    "Six recurring architectures of investment judgment",
    "Same Company. Different Room.",
    "Your Series A is decided in a room you will never be in.",
    "The company is real.",
    "The investors are real.",
    "The deliberation is real.",
    "The only thing not on the line is the financing itself.",
    "partnerroom.sidmofya.com",
    "$2.1M ARR",
    "Strong founder-market fit",
    "A rapidly expanding category",
    "A technical advantage that appears genuinely difficult to reproduce",
    "Weak retention evidence",
    "An expensive go-to-market motion that has not yet been proven at scale",
    "ROOM A - Autonomous Sponsor",
    "ROOM B - Collective Consensus",
    "ROOM C - Formal Institutional IC",
)

EXACT_JUDGMENTS = (
    "Retention is unresolved. I know that. But I think the technical wedge is rare enough that I want to own finding out.",
    "I like the company. But if none of us can explain why retention improves as the business scales, I don’t think we can get the partnership there.",
    "We may believe the technology. But at this entry price, with this retention profile and these reserve requirements, the investment does not clear our portfolio threshold.",
)

COMPANY_FACTS = (
    "$2.1M ARR",
    "Strong founder-market fit",
    "A rapidly expanding category",
    "A technical advantage that appears genuinely difficult to reproduce",
    "Weak retention evidence",
    "An expensive go-to-market motion that has not yet been proven at scale",
)

ROOM_LABELS = (
    "ROOM A - Autonomous Sponsor",
    "ROOM B - Collective Consensus",
    "ROOM C - Formal Institutional IC",
)

CLOSING_CONTENT = (
    "The company is real.",
    "The investors are real.",
    "The deliberation is real.",
    "The only thing not on the line is the financing itself.",
    "partnerroom.sidmofya.com",
)


def normalized(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def normalized_lines(text: str) -> list[str]:
    return [line for raw_line in text.splitlines() if (line := normalized(raw_line))]


def require_text_in_order(section: str, values: tuple[str, ...], label: str) -> None:
    cursor = 0
    for value in values:
        needle = normalized(value)
        position = section.find(needle, cursor)
        if position == -1:
            if needle in section:
                raise AssertionError(
                    f"{label} required content is out of order at {value!r}."
                )
            raise AssertionError(f"{label} is missing required content: {value!r}.")
        cursor = position + len(needle)


def exact_line_position(lines: list[str], value: str, start: int = 0) -> int:
    needle = normalized(value)
    return next(
        (position for position in range(start, len(lines)) if lines[position] == needle),
        -1,
    )


def require_exact_lines_in_order(
    lines: list[str], values: tuple[str, ...], label: str, start: int = 0
) -> int:
    cursor = start
    for value in values:
        needle = normalized(value)
        position = exact_line_position(lines, needle, cursor)
        if position == -1:
            if needle in lines:
                raise AssertionError(
                    f"{label} exact line order is incorrect at {value!r}."
                )
            if any(needle in line for line in lines):
                raise AssertionError(
                    f"{label} must contain {value!r} as its own exact normalized line."
                )
            raise AssertionError(f"{label} is missing exact line: {value!r}.")
        cursor = position + 1
    return cursor


def require_distinct_statements_in_order(
    lines: list[str], statements: tuple[str, ...], label: str
) -> int:
    """Match each statement to distinct adjacent extraction lines in order."""

    cursor = 0
    for statement in statements:
        needle = normalized(statement)
        next_cursor = -1
        for start in range(cursor, len(lines)):
            for end in range(start + 1, len(lines) + 1):
                candidate = normalized(" ".join(lines[start:end]))
                if candidate == needle:
                    next_cursor = end
                    break
                if not needle.startswith(candidate):
                    break
            if next_cursor != -1:
                break
        if next_cursor == -1:
            raise AssertionError(
                f"{label} must contain {statement!r} as a distinct exact normalized line."
            )
        cursor = next_cursor
    return cursor


def verify_content(page_texts: list[str]) -> int:
    page_lines = [normalized_lines(page) for page in page_texts]
    text = normalized("\n".join("\n".join(lines) for lines in page_lines))
    if "(cid:" in text:
        raise AssertionError("PDF text extraction contains an unresolved glyph reference.")

    missing = [
        value
        for value in (*ARCHITECTURES, *REQUIRED_TEXT, *EXACT_JUDGMENTS)
        if normalized(value) not in text
    ]
    if missing:
        raise AssertionError(f"Missing required text: {missing}")

    insufficient = {
        heading: text.count(heading)
        for heading in RECURRING_SUBHEADINGS
        if text.count(heading) < len(ARCHITECTURES)
    }
    if insufficient:
        raise AssertionError(
            f"Recurring architecture subheadings are incomplete: {insufficient}"
        )

    if len(page_lines) < 2:
        raise AssertionError("The closing content must belong to a distinct final page.")

    content_before_final_lines = [
        line for lines in page_lines[:-1] for line in lines
    ]
    content_before_final = normalized("\n".join(content_before_final_lines))
    final_page_lines = page_lines[-1]
    architecture_positions: list[int] = []
    cursor = 0
    for architecture in ARCHITECTURES:
        position = exact_line_position(
            content_before_final_lines, architecture, cursor
        )
        if position == -1:
            raise AssertionError(
                f"Could not locate the exact {architecture!r} architecture title line in order."
            )
        architecture_positions.append(position)
        cursor = position + 1

    comparison_title = "Same Company. Different Room."
    comparison_position = exact_line_position(
        content_before_final_lines, comparison_title, cursor
    )
    if comparison_position == -1:
        raise AssertionError(
            "Could not locate the Same Company. Different Room. section after all architectures."
        )

    architecture_boundaries = [
        *architecture_positions[1:],
        comparison_position,
    ]
    for architecture, start, end in zip(
        ARCHITECTURES, architecture_positions, architecture_boundaries
    ):
        section_lines = content_before_final_lines[start:end]
        require_exact_lines_in_order(
            section_lines, RECURRING_SUBHEADINGS, architecture
        )

    comparison_section = normalized(
        "\n".join(content_before_final_lines[comparison_position:])
    )
    comparison_content = (
        comparison_title,
        "The company",
        *COMPANY_FACTS,
        ROOM_LABELS[0],
        EXACT_JUDGMENTS[0],
        "The rooms",
        ROOM_LABELS[1],
        EXACT_JUDGMENTS[1],
        ROOM_LABELS[2],
        EXACT_JUDGMENTS[2],
    )
    require_text_in_order(
        comparison_section,
        comparison_content,
        "Same Company. Different Room.",
    )

    prior_to_comparison = normalized(
        "\n".join(content_before_final_lines[:comparison_position])
    )
    leaked_comparison_content = [
        value
        for value in (*COMPANY_FACTS, *ROOM_LABELS, *EXACT_JUDGMENTS)
        if normalized(value) in prior_to_comparison
    ]
    if leaked_comparison_content:
        raise AssertionError(
            "Same Company. Different Room. content appears outside its section: "
            f"{leaked_comparison_content}"
        )

    closing_cursor = require_distinct_statements_in_order(
        final_page_lines,
        CLOSING_CONTENT[:-1],
        "The final page",
    )
    require_exact_lines_in_order(
        final_page_lines,
        (CLOSING_CONTENT[-1],),
        "The final page URL",
        closing_cursor,
    )

    earlier_closing_content = [
        value
        for value in CLOSING_CONTENT
        if normalized(value) in content_before_final
    ]
    if earlier_closing_content:
        raise AssertionError(
            "Partner Room closing content must belong only to the final page: "
            f"{earlier_closing_content}"
        )

    return len(text)


def verify(pdf_path: Path) -> dict[str, object]:
    if not pdf_path.is_file():
        raise AssertionError(f"PDF does not exist: {pdf_path}")

    reader = PdfReader(str(pdf_path))
    page_count = len(reader.pages)
    if page_count < 10:
        raise AssertionError(f"Expected at least 10 pages; found {page_count}.")

    metadata = reader.metadata
    title = (metadata.title or "").strip() if metadata else ""
    author = (metadata.author or "").strip() if metadata else ""
    if not title or not author:
        raise AssertionError("PDF title and author metadata must be non-empty.")
    if title != "HOW VENTURE ROOMS DECIDE" or author != "Sid Mofya":
        raise AssertionError(f"Unexpected metadata: title={title!r}, author={author!r}")

    with pdfplumber.open(str(pdf_path)) as document:
        page_texts = [page.extract_text() or "" for page in document.pages]
    empty_pages = [number for number, text in enumerate(page_texts, start=1) if not text.strip()]
    if empty_pages:
        raise AssertionError(f"Pages without extractable text: {empty_pages}")

    character_count = verify_content(page_texts)

    return {
        "path": str(pdf_path),
        "pages": page_count,
        "title": title,
        "author": author,
        "characters": character_count,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    args = parser.parse_args()
    print(json.dumps(verify(args.pdf), sort_keys=True))


if __name__ == "__main__":
    main()
