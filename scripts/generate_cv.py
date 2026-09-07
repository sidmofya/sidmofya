"""Build Sid Mofya's one-page CV.

data/profile.json is the source of truth and is shared with /capability, so the
page and this document cannot drift.

The output goes to output/cv/, never to public/. The CV names employers and
carries fuller detail than the public page; it is sent on request rather than
published. Do not add a copy step into public/ without a deliberate decision to
make it public.
"""

from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
PROFILE = ROOT / "data" / "profile.json"
OUTPUT = ROOT / "output" / "cv" / "sid-mofya-cv.pdf"

# The site's own tokens, from app/globals.css.
INK = colors.HexColor("#1A1815")
MUTED_INK = colors.HexColor("#5C5751")
COPPER = colors.HexColor("#A45A2A")
RULE = colors.HexColor("#E3D9C7")

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 16 * mm
CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN)

BODY = "Helvetica"
BOLD = "Helvetica-Bold"


def style(name: str, size: float, leading: float, colour, font: str = BODY) -> ParagraphStyle:
    return ParagraphStyle(
        name, fontName=font, fontSize=size, leading=leading, textColor=colour
    )


SUMMARY = style("summary", 8.2, 11, INK)
ENTRY_BODY = style("entry", 7.6, 10, MUTED_INK)


def draw_paragraph(pdf: canvas.Canvas, text: str, y: float, width: float, para_style) -> float:
    """Draw wrapped text with its top edge at y. Returns the new y."""
    paragraph = Paragraph(text, para_style)
    _, height = paragraph.wrap(width, PAGE_HEIGHT)
    paragraph.drawOn(pdf, MARGIN, y - height)
    return y - height


def section_heading(pdf: canvas.Canvas, label: str, y: float) -> float:
    y -= 6
    pdf.setFont(BOLD, 7.2)
    pdf.setFillColor(COPPER)
    pdf.drawString(MARGIN, y, label.upper())
    y -= 3.5
    pdf.setStrokeColor(RULE)
    pdf.setLineWidth(0.5)
    pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
    return y - 9


def header(pdf: canvas.Canvas, profile: dict, y: float) -> float:
    pdf.setFont(BOLD, 17)
    pdf.setFillColor(INK)
    pdf.drawString(MARGIN, y, profile["name"])
    y -= 13

    pdf.setFont(BODY, 7.6)
    pdf.setFillColor(MUTED_INK)
    # Plain ASCII separator: the middle dot did not render in the base fonts.
    meta = "  |  ".join(
        [profile["location"], profile["contractingEntity"], "sid@sidmofya.com"]
    )
    pdf.drawString(MARGIN, y, meta)
    y -= 12

    return draw_paragraph(pdf, profile["currentRoles"], y, CONTENT_WIDTH, SUMMARY)


def employment(pdf: canvas.Canvas, entries: list[dict], y: float) -> float:
    y = section_heading(pdf, "Experience", y)

    for entry in entries:
        pdf.setFont(BOLD, 8.4)
        pdf.setFillColor(INK)
        pdf.drawString(MARGIN, y, f"{entry['title']}, {entry['employer']}")

        pdf.setFont(BODY, 7.4)
        pdf.setFillColor(MUTED_INK)
        dates = entry["dates"]
        pdf.drawRightString(PAGE_WIDTH - MARGIN, y, dates)
        y -= 8.5

        pdf.setFont(BODY, 7.2)
        pdf.drawString(MARGIN, y, entry["location"])
        y -= 9

        y = draw_paragraph(pdf, entry["summary"], y, CONTENT_WIDTH, ENTRY_BODY)
        y -= 7

    return y


def two_column_list(pdf: canvas.Canvas, rows: list[tuple[str, str]], y: float) -> float:
    for left, right in rows:
        pdf.setFont(BOLD, 7.8)
        pdf.setFillColor(INK)
        pdf.drawString(MARGIN, y, left)
        pdf.setFont(BODY, 7.6)
        pdf.setFillColor(MUTED_INK)
        pdf.drawString(MARGIN + 62 * mm, y, right)
        y -= 10
    return y


def build(profile: dict) -> Path:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4)
    pdf.setTitle(f"{profile['name']} — Curriculum Vitae")
    pdf.setAuthor(profile["name"])
    pdf.setSubject("Curriculum Vitae")
    pdf.setCreator("sidmofya.com")

    y = PAGE_HEIGHT - MARGIN - 6
    y = header(pdf, profile, y)
    y = employment(pdf, profile["employment"], y)

    y = section_heading(pdf, "Qualifications and awards", y)
    y = two_column_list(
        pdf, [(q["entity"], q["detail"]) for q in profile["qualifications"]], y
    )

    y = section_heading(pdf, "Certifications and memberships", y)
    y = two_column_list(
        pdf, [(c["entity"], c["detail"]) for c in profile["certifications"]], y
    )

    y = section_heading(pdf, "Jurisdictions and languages", y)
    juris = profile["jurisdictions"]
    y = two_column_list(
        pdf,
        [
            ("Lived and worked", ", ".join(juris["primary"])),
            ("Also delivered", ", ".join(juris["other"])),
            ("Languages", "; ".join(profile["languages"]).replace("—", "-")),
        ],
        y,
    )

    pdf.setFont(BODY, 7)
    pdf.setFillColor(MUTED_INK)
    pdf.drawString(
        MARGIN,
        MARGIN - 4,
        "Full assignment record, sectors and jurisdictions: sidmofya.com/capability",
    )

    # The CV is deliberately one page. Adding entries to data/profile.json will
    # eventually push content into the footer, so fail loudly rather than ship a
    # document with text sitting on top of the footer line.
    floor = MARGIN + 6
    if y < floor:
        raise SystemExit(
            f"CV overflowed its single page: content ended {floor - y:.1f}pt below "
            f"the floor. Trim an entry in data/profile.json, or shorten a summary."
        )

    pdf.showPage()
    pdf.save()
    return OUTPUT


def main() -> None:
    profile = json.loads(PROFILE.read_text(encoding="utf-8"))
    output = build(profile)
    print(f"Built {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
