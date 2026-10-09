"""Build Sid Mofya's capability statement.

data/profile.json is the source of truth and is shared with the generated CV
(scripts/generate_cv.py), so the two documents cannot drift.

Unlike the CV, this document is public: it is written straight into
public/downloads/ and linked from /about. It keeps clients anonymised and shows
only the employment entries carrying a `capabilitySummary`. Named clients and
the full history stay in the CV, which is sent on request.

Deliberately plain. One reader: a bid lead at an implementing contractor
checking whether Sid fits a technical proposal, with thirty seconds to spend.
"""

from __future__ import annotations

import json
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
PROFILE = ROOT / "data" / "profile.json"
OUTPUT = ROOT / "public" / "downloads" / "sid-mofya-capability-statement.pdf"

CONTACT_EMAIL = "sid@sidmofya.com"
SITE = "sidmofya.com"

# The site's own tokens, from app/globals.css.
INK = colors.HexColor("#1A1815")
MUTED_INK = colors.HexColor("#5C5751")
COPPER = colors.HexColor("#A45A2A")
RULE = colors.HexColor("#E3D9C7")

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 18 * mm
CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN)

DISPLAY = "Times-Roman"
BODY = "Helvetica"
BOLD = "Helvetica-Bold"


def style(name: str, size: float, leading: float, colour, font: str = BODY) -> ParagraphStyle:
    return ParagraphStyle(
        name, fontName=font, fontSize=size, leading=leading, textColor=colour
    )


TITLE = style("title", 22, 26, INK, DISPLAY)
HEADING = style("heading", 7.4, 10, COPPER, BOLD)
LABEL = style("label", 6.8, 9, MUTED_INK, BOLD)
CELL = style("cell", 8.6, 11.5, INK)
CELL_MUTED = style("cell-muted", 8.6, 11.5, MUTED_INK)
NOTE = style("note", 7.8, 10.5, MUTED_INK)

ROW_PADDING = 5


def text(value: str) -> str:
    """Escape for Paragraph markup. Hyphens stand in for em dashes, as in the CV."""
    return escape(value.replace("—", "-"))


def cell(value: str, para_style: ParagraphStyle = CELL) -> Paragraph:
    return Paragraph(text(value), para_style)


def label(value: str) -> Paragraph:
    return Paragraph(text(value.upper()), LABEL)


def heading(value: str) -> list:
    return [Spacer(1, 16), Paragraph(text(value.upper()), HEADING), Spacer(1, 5)]


def ruled_table(rows: list[list], col_widths: list[float], header: bool = False) -> Table:
    """Rows separated by hairlines, matching the ruled lists on the site."""
    table = Table(rows, colWidths=col_widths, repeatRows=1 if header else 0)
    first_ruled_row = 1 if header else 0
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (-1, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), ROW_PADDING),
                ("BOTTOMPADDING", (0, 0), (-1, -1), ROW_PADDING),
                ("LINEABOVE", (0, first_ruled_row), (-1, -1), 0.5, RULE),
            ]
        )
    )
    return table


def entry_table(entries: list[tuple[str, str]], left_width: float) -> Table:
    return ruled_table(
        [[cell(left), cell(right, CELL_MUTED)] for left, right in entries],
        [left_width, CONTENT_WIDTH - left_width],
    )


def profile_block(profile: dict) -> Table:
    rows = [
        ("Name", profile["name"]),
        ("Current roles", profile["currentRoles"]),
        ("Contracting entity", profile["contractingEntity"]),
        ("Location", profile["location"]),
        ("Availability", profile["availability"]),
    ]
    left = 42 * mm
    return ruled_table(
        [[label(name), cell(value)] for name, value in rows],
        [left, CONTENT_WIDTH - left],
    )


def assignments_block(assignments: list[dict]) -> Table:
    columns = ["client", "jurisdiction", "sector", "role", "dates"]
    widths = [0.20, 0.15, 0.20, 0.30, 0.15]
    rows = [[label(column) for column in columns]]
    rows += [[cell(row[column]) for column in columns] for row in assignments]
    return ruled_table(rows, [CONTENT_WIDTH * w for w in widths], header=True)


def sectors_and_jurisdictions(profile: dict) -> Table:
    """Two side-by-side columns, as on the original page."""
    gutter = 10 * mm
    column = (CONTENT_WIDTH - gutter) / 2

    sectors: list = [Paragraph("SECTORS", HEADING), Spacer(1, 5)]
    for sector in profile["sectors"]:
        sectors.append(cell(sector["name"]))
        sectors.append(Paragraph(text(sector["scope"]), NOTE))
        sectors.append(Spacer(1, 5))
    sectors.append(Spacer(1, 2))
    sectors.append(
        Paragraph(
            "Sector scope reflects both the assignments above and the roles "
            "held under Professional history below.",
            NOTE,
        )
    )

    juris = profile["jurisdictions"]
    jurisdictions: list = [Paragraph("JURISDICTIONS", HEADING), Spacer(1, 5)]
    jurisdictions.append(label("Primary"))
    jurisdictions.append(Spacer(1, 3))
    jurisdictions += [cell(name) for name in juris["primary"]]
    jurisdictions.append(Spacer(1, 3))
    jurisdictions.append(Paragraph("Lived and worked.", NOTE))
    jurisdictions.append(Spacer(1, 10))
    jurisdictions.append(label("Also delivered"))
    jurisdictions.append(Spacer(1, 3))
    jurisdictions += [cell(name) for name in juris["other"]]

    table = Table([[sectors, "", jurisdictions]], colWidths=[column, gutter, column])
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return table


def footer(pdf, doc) -> None:
    pdf.saveState()
    pdf.setStrokeColor(RULE)
    pdf.setLineWidth(0.5)
    pdf.line(MARGIN, MARGIN - 2, PAGE_WIDTH - MARGIN, MARGIN - 2)
    pdf.setFont(BODY, 7)
    pdf.setFillColor(MUTED_INK)
    pdf.drawString(MARGIN, MARGIN - 12, f"Sid Mofya  |  Capability statement  |  {SITE}")
    pdf.drawRightString(PAGE_WIDTH - MARGIN, MARGIN - 12, f"Page {doc.page}")
    pdf.restoreState()


def build(profile: dict) -> Path:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        # The frame pads its contents by 6pt; pull the margins in by the same
        # amount so paragraphs and full-width tables share one left edge.
        leftMargin=MARGIN - 6,
        rightMargin=MARGIN - 6,
        topMargin=MARGIN,
        bottomMargin=MARGIN + 6,
        title=f"{profile['name']} - Capability statement",
        author=profile["name"],
        subject="Capability statement: roles, assignments, sectors, jurisdictions, "
        "qualifications and languages.",
        creator=SITE,
    )

    # Only the employment entries carrying a capabilitySummary surface here. The
    # CV lists the full history; this shows the ones that establish standing.
    history = [
        (role["employer"], role["capabilitySummary"])
        for role in profile["employment"]
        if role.get("capabilitySummary")
    ]
    entity_width = 70 * mm

    story: list = [
        Paragraph("Capability statement", TITLE),
        Spacer(1, 12),
        profile_block(profile),
        *heading("Assignments"),
        assignments_block(profile["assignments"]),
        Spacer(1, 16),
        sectors_and_jurisdictions(profile),
        KeepTogether(
            [
                *heading("Qualifications and awards"),
                entry_table(
                    [(q["entity"], q["detail"]) for q in profile["qualifications"]],
                    entity_width,
                ),
            ]
        ),
        KeepTogether(
            [
                *heading("Certifications and memberships"),
                entry_table(
                    [(c["entity"], c["detail"]) for c in profile["certifications"]],
                    entity_width,
                ),
            ]
        ),
        KeepTogether(
            [*heading("Professional history"), entry_table(history, entity_width)]
        ),
        KeepTogether(
            [
                *heading("Languages"),
                *[cell(language) for language in profile["languages"]],
            ]
        ),
        KeepTogether(
            [
                Spacer(1, 16),
                HRFlowable(width="100%", thickness=0.5, color=RULE, spaceAfter=10),
                Paragraph("DOCUMENTS AND CONTACT", HEADING),
                Spacer(1, 5),
                # The CV is sent on request rather than published: it carries
                # named clients this document deliberately anonymises.
                cell(
                    "Full CV, including named clients and detailed employment "
                    "history, available on request."
                ),
                Spacer(1, 6),
                Paragraph(
                    f'<a href="mailto:{CONTACT_EMAIL}" color="#A45A2A">{CONTACT_EMAIL}</a>',
                    CELL,
                ),
            ]
        ),
    ]

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return OUTPUT


def main() -> None:
    profile = json.loads(PROFILE.read_text(encoding="utf-8"))
    output = build(profile)
    print(f"Built {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
