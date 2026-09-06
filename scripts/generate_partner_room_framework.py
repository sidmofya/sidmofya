"""Build the Partner Room Decision Architecture field guide.

The manuscript is the source of truth. This module implements only the small
Markdown subset used by that manuscript so PDF output remains deterministic.
"""

from __future__ import annotations

import html
import re
from pathlib import Path
from typing import Iterable

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
MANUSCRIPT = ROOT / "docs" / "partner-room" / "how-venture-rooms-decide.md"
ARCHIVE_PDF = ROOT / "output" / "pdf" / "how-venture-rooms-decide.pdf"
PUBLIC_PDF = ROOT / "public" / "downloads" / "how-venture-rooms-decide.pdf"

PAPER = colors.HexColor("#F6F1E8")
PAPER_ELEVATED = colors.HexColor("#FBF7EF")
INK = colors.HexColor("#1A1815")
MUTED_INK = colors.HexColor("#5C5751")
RULE = colors.HexColor("#E3D9C7")
COPPER = colors.HexColor("#A45A2A")
COPPER_SOFT = colors.HexColor("#C77B4A")

DISPLAY_FONT = "Times-Roman"
DISPLAY_ITALIC = "Times-Italic"
BODY_FONT = "Helvetica"
BODY_BOLD = "Helvetica-Bold"

PAGE_WIDTH, PAGE_HEIGHT = LETTER
BODY_LEFT = 58
BODY_RIGHT = 58
BODY_TOP = 78
BODY_BOTTOM = 58
CONTENT_WIDTH = PAGE_WIDTH - BODY_LEFT - BODY_RIGHT

EXPECTED_METADATA = {
    "title": "HOW VENTURE ROOMS DECIDE",
    "subtitle": "Six recurring architectures of investment judgment",
    "author": "Sid Mofya",
    "imprint": "Partner Room",
}


class DeterministicCanvas(canvas.Canvas):
    """Canvas with stable metadata, timestamps, IDs and uncompressed text."""

    def __init__(self, *args, **kwargs):
        kwargs["invariant"] = 1
        kwargs["pageCompression"] = 0
        super().__init__(*args, **kwargs)
        self.setTitle(EXPECTED_METADATA["title"])
        self.setAuthor(EXPECTED_METADATA["author"])
        self.setSubject(EXPECTED_METADATA["subtitle"])
        self.setCreator(EXPECTED_METADATA["imprint"])


def _draw_paper_background(pdf: canvas.Canvas) -> None:
    pdf.saveState()
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    pdf.restoreState()


def _draw_cover(pdf: canvas.Canvas, document: BaseDocTemplate) -> None:
    _draw_paper_background(pdf)
    pdf.saveState()
    pdf.setStrokeColor(COPPER)
    pdf.setLineWidth(1.2)
    pdf.line(BODY_LEFT, PAGE_HEIGHT - 58, PAGE_WIDTH - BODY_RIGHT, PAGE_HEIGHT - 58)
    pdf.setFont(BODY_BOLD, 8)
    pdf.setFillColor(COPPER)
    pdf.drawString(BODY_LEFT, PAGE_HEIGHT - 47, "PARTNER ROOM")
    pdf.setFont(BODY_FONT, 7.5)
    pdf.setFillColor(MUTED_INK)
    pdf.drawRightString(PAGE_WIDTH - BODY_RIGHT, 42, "DECISION ARCHITECTURE FIELD GUIDE")
    pdf.restoreState()


def _draw_body(pdf: canvas.Canvas, document: BaseDocTemplate) -> None:
    _draw_paper_background(pdf)
    pdf.saveState()
    pdf.setStrokeColor(RULE)
    pdf.setLineWidth(0.65)
    pdf.line(BODY_LEFT, PAGE_HEIGHT - 49, PAGE_WIDTH - BODY_RIGHT, PAGE_HEIGHT - 49)
    pdf.line(BODY_LEFT, 42, PAGE_WIDTH - BODY_RIGHT, 42)
    pdf.setFont(BODY_BOLD, 7.2)
    pdf.setFillColor(COPPER)
    pdf.drawString(BODY_LEFT, PAGE_HEIGHT - 39, "PARTNER ROOM")
    pdf.setFont(BODY_FONT, 7.2)
    pdf.setFillColor(MUTED_INK)
    pdf.drawRightString(
        PAGE_WIDTH - BODY_RIGHT,
        PAGE_HEIGHT - 39,
        "HOW VENTURE ROOMS DECIDE",
    )
    pdf.setFont(BODY_FONT, 7.5)
    pdf.drawString(BODY_LEFT, 29, "SIX RECURRING ARCHITECTURES OF INVESTMENT JUDGMENT")
    pdf.setFont(BODY_BOLD, 8)
    pdf.setFillColor(COPPER)
    pdf.drawRightString(PAGE_WIDTH - BODY_RIGHT, 29, f"{document.page:02d}")
    pdf.restoreState()


def _draw_closing(pdf: canvas.Canvas, document: BaseDocTemplate) -> None:
    pdf.saveState()
    pdf.setFillColor(INK)
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    pdf.setStrokeColor(COPPER)
    pdf.setLineWidth(1.2)
    pdf.line(BODY_LEFT, PAGE_HEIGHT - 58, PAGE_WIDTH - BODY_RIGHT, PAGE_HEIGHT - 58)
    pdf.line(BODY_LEFT, 58, PAGE_WIDTH - BODY_RIGHT, 58)
    pdf.setFont(BODY_BOLD, 8)
    pdf.setFillColor(COPPER_SOFT)
    pdf.drawString(BODY_LEFT, PAGE_HEIGHT - 47, "PARTNER ROOM")
    pdf.setFont(BODY_FONT, 7.5)
    pdf.setFillColor(PAPER)
    pdf.drawRightString(PAGE_WIDTH - BODY_RIGHT, 43, "HOW VENTURE ROOMS DECIDE")
    pdf.restoreState()


def _styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()["Normal"]
    common = {
        "fontName": BODY_FONT,
        "fontSize": 9.6,
        "leading": 13.5,
        "textColor": INK,
        "spaceAfter": 8,
        "allowWidows": 0,
        "allowOrphans": 0,
        "splitLongWords": 0,
    }
    return {
        "body": ParagraphStyle("Body", parent=base, **common),
        "cover_title": ParagraphStyle(
            "CoverTitle",
            parent=base,
            fontName=DISPLAY_FONT,
            fontSize=35,
            leading=38,
            textColor=INK,
            spaceBefore=168,
            spaceAfter=18,
            allowWidows=0,
            allowOrphans=0,
        ),
        "cover_subtitle": ParagraphStyle(
            "CoverSubtitle",
            parent=base,
            fontName=DISPLAY_FONT,
            fontSize=19,
            leading=24,
            textColor=COPPER,
            spaceAfter=28,
            allowWidows=0,
            allowOrphans=0,
        ),
        "cover_meta": ParagraphStyle(
            "CoverMeta",
            parent=base,
            fontName=BODY_FONT,
            fontSize=9,
            leading=14,
            textColor=MUTED_INK,
            spaceAfter=5,
            allowWidows=0,
            allowOrphans=0,
        ),
        "cover_quote": ParagraphStyle(
            "CoverQuote",
            parent=base,
            fontName=DISPLAY_ITALIC,
            fontSize=14,
            leading=19,
            textColor=INK,
            leftIndent=18,
            borderColor=COPPER,
            borderWidth=0,
            borderPadding=(0, 0, 0, 12),
            spaceBefore=34,
            allowWidows=0,
            allowOrphans=0,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base,
            fontName=BODY_BOLD,
            fontSize=8,
            leading=10,
            textColor=COPPER,
            spaceBefore=2,
            spaceAfter=10,
            keepWithNext=1,
            allowWidows=0,
            allowOrphans=0,
        ),
        "heading": ParagraphStyle(
            "Heading",
            parent=base,
            fontName=DISPLAY_FONT,
            fontSize=24,
            leading=28,
            textColor=INK,
            spaceAfter=15,
            keepWithNext=1,
            allowWidows=0,
            allowOrphans=0,
        ),
        "label": ParagraphStyle(
            "Label",
            parent=base,
            fontName=BODY_BOLD,
            fontSize=9,
            leading=11,
            textColor=COPPER,
            spaceBefore=7,
            spaceAfter=3,
            keepWithNext=1,
            allowWidows=0,
            allowOrphans=0,
        ),
        "quote": ParagraphStyle(
            "Quote",
            parent=base,
            fontName=DISPLAY_ITALIC,
            fontSize=13,
            leading=18,
            textColor=INK,
            leftIndent=18,
            rightIndent=12,
            borderColor=COPPER,
            borderWidth=0,
            borderPadding=(2, 2, 2, 12),
            spaceBefore=5,
            spaceAfter=12,
            allowWidows=0,
            allowOrphans=0,
        ),
        "list": ParagraphStyle(
            "List",
            parent=base,
            fontName=BODY_FONT,
            fontSize=9.6,
            leading=13.5,
            textColor=INK,
            leftIndent=0,
            spaceAfter=4,
            allowWidows=0,
            allowOrphans=0,
        ),
        "closing_title": ParagraphStyle(
            "ClosingTitle",
            parent=base,
            fontName=BODY_BOLD,
            fontSize=9,
            leading=12,
            textColor=COPPER_SOFT,
            spaceBefore=138,
            spaceAfter=28,
            alignment=TA_LEFT,
            allowWidows=0,
            allowOrphans=0,
        ),
        "closing_quote": ParagraphStyle(
            "ClosingQuote",
            parent=base,
            fontName=DISPLAY_FONT,
            fontSize=24,
            leading=32,
            textColor=PAPER,
            spaceAfter=42,
            allowWidows=0,
            allowOrphans=0,
        ),
        "closing_meta": ParagraphStyle(
            "ClosingMeta",
            parent=base,
            fontName=BODY_FONT,
            fontSize=10,
            leading=14,
            textColor=COPPER_SOFT,
            alignment=TA_LEFT,
            allowWidows=0,
            allowOrphans=0,
        ),
    }


def _parse_front_matter(lines: list[str]) -> tuple[dict[str, str], int]:
    if not lines or lines[0].strip() != "---":
        raise ValueError("Manuscript must start with YAML-style metadata.")
    metadata: dict[str, str] = {}
    index = 1
    while index < len(lines) and lines[index].strip() != "---":
        key, separator, value = lines[index].partition(":")
        if not separator:
            raise ValueError(f"Malformed metadata line: {lines[index]}")
        metadata[key.strip()] = value.strip()
        index += 1
    if index >= len(lines):
        raise ValueError("Manuscript metadata is not closed.")
    if metadata != EXPECTED_METADATA:
        raise ValueError(f"Unexpected manuscript metadata: {metadata}")
    return metadata, index + 1


def _escape(text: str) -> str:
    return html.escape(text, quote=False)


def _paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(_escape(text), style)


def _next_content_index(lines: list[str], start: int) -> int:
    index = start
    while index < len(lines) and not lines[index].strip():
        index += 1
    return index


def _is_control(line: str) -> bool:
    stripped = line.strip()
    return (
        not stripped
        or stripped.startswith("#")
        or stripped.startswith("-")
        or stripped.startswith(">")
        or stripped.startswith("<!--")
    )


def _read_paragraph(lines: list[str], start: int) -> tuple[str, int]:
    parts: list[str] = []
    index = start
    while index < len(lines) and not _is_control(lines[index]):
        parts.append(lines[index].strip())
        index += 1
    return " ".join(parts), index


def _read_quote(lines: list[str], start: int) -> tuple[str, int]:
    parts: list[str] = []
    index = start
    while index < len(lines):
        stripped = lines[index].strip()
        if not stripped.startswith(">"):
            break
        value = stripped[1:].strip()
        parts.append(_escape(value) if value else "<br/>")
        index += 1
    return "<br/>".join(parts), index


def _read_list(lines: list[str], start: int, style: ParagraphStyle) -> tuple[KeepTogether, int]:
    items: list[Paragraph] = []
    index = start
    while index < len(lines) and lines[index].strip().startswith("- "):
        value = lines[index].strip()[2:].strip()
        items.append(
            Paragraph(
                f'<font color="#A45A2A"><b>-</b></font>&nbsp;&nbsp;{_escape(value)}',
                style,
            )
        )
        index += 1
    items.append(Spacer(1, 6))
    return KeepTogether(items), index


def _story_from_manuscript(source: Path) -> tuple[list, dict[str, str]]:
    lines = source.read_text(encoding="utf-8").splitlines()
    metadata, index = _parse_front_matter(lines)
    styles = _styles()
    story: list = []
    template = "cover"
    pending_label: Paragraph | None = None

    def add(flowable) -> None:
        nonlocal pending_label
        if pending_label is not None:
            story.append(KeepTogether([pending_label, flowable]))
            pending_label = None
        else:
            story.append(flowable)

    while index < len(lines):
        stripped = lines[index].strip()
        if not stripped:
            index += 1
            continue

        template_match = re.fullmatch(r"<!-- template: (cover|body|closing) -->", stripped)
        if template_match:
            template = template_match.group(1)
            if template != "cover":
                story.append(NextPageTemplate(template))
            index += 1
            continue
        if stripped == "<!-- page-break -->":
            if pending_label is not None:
                story.append(pending_label)
                pending_label = None
            story.append(PageBreak())
            index += 1
            continue

        if stripped.startswith("### "):
            if pending_label is not None:
                story.append(pending_label)
            pending_label = _paragraph(stripped[4:].strip(), styles["label"])
            index += 1
            continue
        if stripped.startswith("## "):
            add(_paragraph(stripped[3:].strip(), styles["cover_subtitle"] if template == "cover" else styles["heading"]))
            index += 1
            continue
        if stripped.startswith("# "):
            if template == "cover":
                style = styles["cover_title"]
            elif template == "closing":
                style = styles["closing_title"]
            else:
                style = styles["section"]
            add(_paragraph(stripped[2:].strip(), style))
            index += 1
            continue
        if stripped.startswith(">"):
            quote, index = _read_quote(lines, index)
            style = styles["closing_quote"] if template == "closing" else styles["cover_quote"] if template == "cover" else styles["quote"]
            add(Paragraph(quote, style))
            continue
        if stripped.startswith("- "):
            item_list, index = _read_list(lines, index, styles["list"])
            add(item_list)
            continue

        paragraph_text, index = _read_paragraph(lines, index)
        if template == "cover":
            style = styles["cover_meta"]
        elif template == "closing":
            style = styles["closing_meta"]
        else:
            style = styles["body"]
        add(_paragraph(paragraph_text, style))

    if pending_label is not None:
        story.append(pending_label)
    return story, metadata


def _page_templates() -> Iterable[PageTemplate]:
    cover_frame = Frame(
        BODY_LEFT,
        BODY_BOTTOM,
        CONTENT_WIDTH,
        PAGE_HEIGHT - BODY_TOP - BODY_BOTTOM,
        id="cover-frame",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    body_frame = Frame(
        BODY_LEFT,
        BODY_BOTTOM,
        CONTENT_WIDTH,
        PAGE_HEIGHT - BODY_TOP - BODY_BOTTOM,
        id="body-frame",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    closing_frame = Frame(
        BODY_LEFT,
        BODY_BOTTOM,
        CONTENT_WIDTH,
        PAGE_HEIGHT - BODY_TOP - BODY_BOTTOM,
        id="closing-frame",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    return (
        PageTemplate(id="cover", frames=[cover_frame], onPage=_draw_cover),
        PageTemplate(id="body", frames=[body_frame], onPage=_draw_body),
        PageTemplate(id="closing", frames=[closing_frame], onPage=_draw_closing),
    )


def build_pdf(source: Path = MANUSCRIPT, destination: Path = ARCHIVE_PDF) -> Path:
    story, metadata = _story_from_manuscript(source)
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(".pdf.tmp")
    document = BaseDocTemplate(
        str(temporary),
        pagesize=LETTER,
        leftMargin=BODY_LEFT,
        rightMargin=BODY_RIGHT,
        topMargin=BODY_TOP,
        bottomMargin=BODY_BOTTOM,
        title=metadata["title"],
        author=metadata["author"],
        subject=metadata["subtitle"],
        creator=metadata["imprint"],
    )
    document.addPageTemplates(list(_page_templates()))
    document.build(story, canvasmaker=DeterministicCanvas)
    temporary.replace(destination)
    return destination


def main() -> None:
    archive = build_pdf()
    PUBLIC_PDF.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_PDF.write_bytes(archive.read_bytes())
    print(f"Built {archive.relative_to(ROOT)} and {PUBLIC_PDF.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
