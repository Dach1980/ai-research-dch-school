"""Real-browser regression test for text escaping lesson cards.

Checks localized 1.4.x and 1.5.1–1.5.3 lessons at desktop/tablet/mobile widths in both themes.
Intentional horizontal scrollers (math, code and tables) are excluded from the
no-overflow rule and remain independently scrollable.
"""
import unittest
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LESSONS = sorted([* (ROOT / "lessons").glob("a-1-4-*.html"), * (ROOT / "lessons").glob("a-1-5-1*.html"), * (ROOT / "lessons").glob("a-1-5-2*.html"), * (ROOT / "lessons").glob("a-1-5-3*.html"), * (ROOT / "lessons").glob("a-1-5-4*.html")])
VIEWPORTS = (360, 390, 768, 1024, 1440)
THEMES = ("dark", "light")
CARD_SELECTOR = (
    ".lesson-callout, .lesson-practice, .lesson-note, .lesson-outcomes, "
    ".lesson-problem, .definition, .glossary-entry, .lesson-check, "
    ".lesson-check-question, .lesson-check-option, .lesson-planet-banner, "
    ".lesson-hero-card, .learning-box, .reflection-box, .quiz-item"
)

class LessonLayoutOverflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not LESSONS:
            raise AssertionError("No Track A 1.4.x lesson pages found")

    def test_text_stays_inside_cards_on_all_viewports_and_themes(self):
        failures = []
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            for lesson in LESSONS:
                url = lesson.as_uri()
                for width in VIEWPORTS:
                    for theme in THEMES:
                        page.set_viewport_size({"width": width, "height": 900})
                        page.goto(url, wait_until="domcontentloaded")
                        page.evaluate(
                            "(theme) => document.documentElement.setAttribute('data-theme', theme)",
                            theme,
                        )
                        page.evaluate("() => document.fonts ? document.fonts.ready.then(() => true) : true")
                        if lesson.name.startswith(("a-1-4-5", "a-1-5-1", "a-1-5-4")):
                            expected_entries = 5 if lesson.name.startswith(("a-1-5-1", "a-1-5-4")) else 10
                            expected_children = 4 if lesson.name.startswith("a-1-5-1") else 3 if lesson.name.startswith("a-1-5-4") else 2
                            glossary = page.evaluate("""([expectedEntries, expectedChildren]) => {
                              const container = document.querySelector('.lesson-glossary');
                              if (!container) return {error: 'lesson-glossary missing'};
                              const entries = [...container.querySelectorAll(':scope > .glossary-entry')];
                              const structureValid = entries.length === expectedEntries && entries.every(entry =>
                                entry.children.length === expectedChildren &&
                                (expectedChildren === 4
                                  ? entry.children[0].classList.contains('term-index') &&
                                    entry.children[1].tagName === 'STRONG' &&
                                    entry.children[2].classList.contains('term-en') &&
                                    entry.children[3].tagName === 'P'
                                  : expectedChildren === 3
                                    ? entry.children[0].tagName === 'STRONG' &&
                                      entry.children[1].classList.contains('glossary-equivalent') &&
                                      entry.children[2].tagName === 'SPAN'
                                    : entry.children[0].tagName === 'STRONG' &&
                                      entry.children[1].tagName === 'SPAN')
                              );
                              return {
                                entries: entries.length,
                                structureValid,
                                display: getComputedStyle(container).display,
                                cardDisplay: entries[0] ? getComputedStyle(entries[0]).display : null,
                                cardDirection: entries[0] ? getComputedStyle(entries[0]).flexDirection : null
                              };
                            }""", [expected_entries, expected_children])
                            if glossary.get("error") or glossary["entries"] != expected_entries or not glossary["structureValid"] or glossary["display"] != "grid" or glossary["cardDisplay"] != "flex" or glossary["cardDirection"] != "column":
                                failures.append(
                                    f"{lesson.name} | {width}px | {theme}: non-canonical glossary structure {glossary}"
                                )
                        result = page.evaluate("""(selector) => {
                          const cards = [...document.querySelectorAll(selector)];
                          const problems = [];
                          for (const card of cards) {
                            const box = card.getBoundingClientRect();
                            if (card.scrollWidth > card.clientWidth + 1) {
                              problems.push({
                                type: 'card-horizontal-overflow',
                                className: card.className,
                                scrollWidth: card.scrollWidth,
                                clientWidth: card.clientWidth
                              });
                            }
                            const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
                            let node;
                            while ((node = walker.nextNode())) {
                              if (!node.nodeValue.trim()) continue;
                              const range = document.createRange();
                              range.selectNodeContents(node);
                              for (const rect of range.getClientRects()) {
                                if (rect.width === 0 || rect.height === 0) continue;
                                if (rect.left < box.left - 1 || rect.right > box.right + 1) {
                                  problems.push({
                                    type: 'text-outside-card',
                                    className: card.className,
                                    text: node.nodeValue.trim().slice(0, 70),
                                    left: rect.left, right: rect.right,
                                    cardLeft: box.left, cardRight: box.right
                                  });
                                  break;
                                }
                              }
                            }
                          }
                          for (const svg of document.querySelectorAll('.lesson-144-figure svg')) {
                            const svgBox = svg.getBoundingClientRect();
                            for (const label of svg.querySelectorAll('text')) {
                              const node = label.previousElementSibling;
                              if (!node || node.tagName.toLowerCase() !== 'rect') continue;
                              const textBox = label.getBoundingClientRect();
                              const nodeBox = node.getBoundingClientRect();
                              if (textBox.left < nodeBox.left - 1 || textBox.right > nodeBox.right + 1 ||
                                  textBox.top < nodeBox.top - 1 || textBox.bottom > nodeBox.bottom + 1) {
                                problems.push({
                                  type: 'svg-label-outside-node',
                                  text: label.textContent,
                                  textBox: {left:textBox.left,right:textBox.right,top:textBox.top,bottom:textBox.bottom},
                                  nodeBox: {left:nodeBox.left,right:nodeBox.right,top:nodeBox.top,bottom:nodeBox.bottom},
                                  svgWidth: svgBox.width
                                });
                              }
                            }
                          }
                          return problems;
                        }""", CARD_SELECTOR)
                        if result:
                            failures.append(
                                f"{lesson.name} | {width}px | {theme}: {result[:8]}"
                            )
            browser.close()
        self.assertFalse(
            failures,
            "Lesson text overflow detected:\n" + "\n".join(failures)
        )

if __name__ == "__main__":
    unittest.main()
