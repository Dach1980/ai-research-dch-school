"""Real-browser regression test for text escaping lesson cards.

Checks every localized 1.4.x lesson at desktop/tablet/mobile widths in both themes.
Intentional horizontal scrollers (math, code and tables) are excluded from the
no-overflow rule and remain independently scrollable.
"""
import unittest
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LESSONS = sorted((ROOT / "lessons").glob("a-1-4-*.html"))
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
                        if lesson.name.startswith("a-1-4-5"):
                            glossary = page.evaluate("""() => {
                              const container = document.querySelector('.lesson-glossary');
                              if (!container) return {error: 'lesson-glossary missing'};
                              const entries = [...container.querySelectorAll(':scope > .glossary-entry')];
                              const structureValid = entries.length === 10 && entries.every(entry =>
                                entry.children.length === 2 &&
                                entry.children[0].tagName === 'STRONG' &&
                                entry.children[1].tagName === 'SPAN'
                              );
                              return {
                                entries: entries.length,
                                structureValid,
                                display: getComputedStyle(container).display
                              };
                            }""")
                            if glossary.get("error") or glossary["entries"] != 10 or not glossary["structureValid"] or glossary["display"] != "grid":
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
