"""Mutation-style tests for the Partner Room PDF content verifier."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path


sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.verify_partner_room_framework import verify_content  # noqa: E402


ARCHITECTURES = (
    "Structured Disagreement",
    "Collective Outlier Judgment",
    "Conviction-Weighted",
    "Autonomous Sponsor",
    "Collective Consensus",
    "Formal Institutional IC",
)

HEADINGS = (
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

FACTS = (
    "$2.1M ARR",
    "Strong founder-market fit",
    "A rapidly expanding category",
    "A technical advantage that appears genuinely difficult to reproduce",
    "Weak retention evidence",
    "An expensive go-to-market motion that has not yet been proven at scale",
)

ROOMS = (
    (
        "ROOM A - Autonomous Sponsor",
        "Retention is unresolved. I know that. But I think the technical wedge is rare enough that I want to own finding out.",
    ),
    (
        "ROOM B - Collective Consensus",
        "I like the company. But if none of us can explain why retention improves as the business scales, I don’t think we can get the partnership there.",
    ),
    (
        "ROOM C - Formal Institutional IC",
        "We may believe the technology. But at this entry price, with this retention profile and these reserve requirements, the investment does not clear our portfolio threshold.",
    ),
)

CLOSING = (
    "The company is real.",
    "The investors are real.",
    "The deliberation is real.",
    "The only thing not on the line is the financing itself.",
    "partnerroom.sidmofya.com",
)


def valid_pages() -> list[str]:
    pages = [
        "HOW VENTURE ROOMS DECIDE\nSix recurring architectures of investment judgment\n"
        "Your Series A is decided in a room you will never be in.",
        "ORIENTATION\nThe decision system behind the decision",
    ]
    pages.extend(
        "\n".join((architecture, *HEADINGS)) for architecture in ARCHITECTURES
    )
    pages.append(
        "\n".join(
            (
                "Same Company. Different Room.",
                "The company",
                *FACTS,
                ROOMS[0][0],
                ROOMS[0][1],
                "The rooms",
                ROOMS[1][0],
                ROOMS[1][1],
                ROOMS[2][0],
                ROOMS[2][1],
            )
        )
    )
    pages.append("\n".join(CLOSING))
    return pages


class ContentLocalityTests(unittest.TestCase):
    def test_valid_content_passes(self) -> None:
        verify_content(valid_pages())

    def test_heading_cannot_be_borrowed_from_another_architecture(self) -> None:
        pages = valid_pages()
        pages[2] = pages[2].replace("\nExample", "")
        pages[3] += "\nExample"

        with self.assertRaisesRegex(
            AssertionError, r"Structured Disagreement.*Example"
        ):
            verify_content(pages)

    def test_heading_word_in_prose_does_not_replace_an_exact_heading_line(self) -> None:
        pages = valid_pages()
        pages[2] = pages[2].replace(
            "\nExample",
            "\nThis prose retains the word Example without retaining its heading.",
        )

        with self.assertRaisesRegex(
            AssertionError, r"Structured Disagreement.*Example"
        ):
            verify_content(pages)

    def test_architecture_headings_must_remain_in_order(self) -> None:
        pages = valid_pages()
        pages[4] = pages[4].replace(
            "How authority is distributed\nHow conviction forms",
            "How conviction forms\nHow authority is distributed",
        )

        with self.assertRaisesRegex(
            AssertionError, r"Conviction-Weighted.*order"
        ):
            verify_content(pages)

    def test_company_fact_cannot_be_borrowed_from_an_architecture_section(self) -> None:
        pages = valid_pages()
        pages[8] = pages[8].replace("\n$2.1M ARR", "")
        pages[7] += "\n$2.1M ARR"

        with self.assertRaisesRegex(
            AssertionError, r"Same Company.*\$2\.1M ARR"
        ):
            verify_content(pages)

    def test_room_judgments_must_follow_their_labels_in_abc_order(self) -> None:
        pages = valid_pages()
        comparison = pages[8]
        room_b = f"{ROOMS[1][0]}\n{ROOMS[1][1]}"
        room_c = f"{ROOMS[2][0]}\n{ROOMS[2][1]}"
        pages[8] = comparison.replace(f"{room_b}\n{room_c}", f"{room_c}\n{room_b}")

        with self.assertRaisesRegex(AssertionError, r"Same Company.*order"):
            verify_content(pages)

    def test_closing_content_must_belong_to_the_final_page(self) -> None:
        pages = valid_pages()
        pages[0] += "\n" + "\n".join(CLOSING)
        pages[-1] = "PARTNER ROOM"

        with self.assertRaisesRegex(AssertionError, r"final page"):
            verify_content(pages)

    def test_closing_statements_must_remain_four_distinct_lines(self) -> None:
        pages = valid_pages()
        pages[-1] = " ".join(CLOSING[:-1]) + "\n" + CLOSING[-1]

        with self.assertRaisesRegex(AssertionError, r"final page"):
            verify_content(pages)


if __name__ == "__main__":
    unittest.main()
