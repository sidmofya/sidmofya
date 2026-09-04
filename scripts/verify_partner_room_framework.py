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


def require_in_order(section: str, values: tuple[str, ...], label: str) -> None:
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


def verify_content(page_texts: list[str]) -> int:
    normalized_pages = [normalized(page) for page in page_texts]
    text = normalized("\n".join(normalized_pages))
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

    if len(normalized_pages) < 2:
        raise AssertionError("The closing content must belong to a distinct final page.")

    content_before_final = normalized("\n".join(normalized_pages[:-1]))
    final_page = normalized_pages[-1]
    architecture_positions: list[int] = []
    cursor = 0
    for architecture in ARCHITECTURES:
        position = content_before_final.find(architecture, cursor)
        if position == -1:
            raise AssertionError(
                f"Could not locate the {architecture!r} architecture section in order."
            )
        architecture_positions.append(position)
        cursor = position + len(architecture)

    comparison_title = "Same Company. Different Room."
    comparison_position = content_before_final.find(comparison_title, cursor)
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
        section = content_before_final[start:end]
        require_in_order(section, RECURRING_SUBHEADINGS, architecture)

    comparison_section = content_before_final[comparison_position:]
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
    require_in_order(
        comparison_section,
        comparison_content,
        "Same Company. Different Room.",
    )

    leaked_comparison_content = [
        value
        for value in (*COMPANY_FACTS, *ROOM_LABELS, *EXACT_JUDGMENTS)
        if normalized(value) in content_before_final[:comparison_position]
    ]
    if leaked_comparison_content:
        raise AssertionError(
            "Same Company. Different Room. content appears outside its section: "
            f"{leaked_comparison_content}"
        )

    closing_statement = normalized(" ".join(CLOSING_CONTENT[:-1]))
    if closing_statement not in final_page or CLOSING_CONTENT[-1] not in final_page:
        raise AssertionError(
            "The exact Partner Room closing statement and URL must appear on the final page."
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
