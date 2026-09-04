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


def normalized(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


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

    text = normalized("\n".join(page_texts))
    if "(cid:" in text:
        raise AssertionError("PDF text extraction contains an unresolved glyph reference.")
    missing = [value for value in (*ARCHITECTURES, *REQUIRED_TEXT, *EXACT_JUDGMENTS) if normalized(value) not in text]
    if missing:
        raise AssertionError(f"Missing required text: {missing}")

    insufficient = {
        heading: text.count(heading)
        for heading in RECURRING_SUBHEADINGS
        if text.count(heading) < len(ARCHITECTURES)
    }
    if insufficient:
        raise AssertionError(f"Recurring architecture subheadings are incomplete: {insufficient}")

    return {
        "path": str(pdf_path),
        "pages": page_count,
        "title": title,
        "author": author,
        "characters": len(text),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    args = parser.parse_args()
    print(json.dumps(verify(args.pdf), sort_keys=True))


if __name__ == "__main__":
    main()
