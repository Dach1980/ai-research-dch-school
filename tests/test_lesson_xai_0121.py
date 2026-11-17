import json
import re
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "lessons/data/xai-01-what-and-why.js"
SHELL = ROOT / "lessons/a-7-1-1-les-a-0018.html"
LEGACY = ROOT / "lessons/xai/01-what-and-why.html"
READER = ROOT / "scripts/lesson-reader.js"
CSS = ROOT / "styles/xai-lesson.css"
LOCALES = ("ru", "en", "zh")


def load_lesson():
    source = DATA.read_text(encoding="utf-8")
    payload = source.split("window.DCH_DEMO_LESSON =", 1)[1].strip().removesuffix(";")
    return json.loads(payload)


def normalize_svg(svg):
    svg = re.sub(r"<text\b[^>]*>[\s\S]*?</text>", "<text/>", svg, flags=re.I)
    svg = re.sub(r"<title\b[^>]*>[\s\S]*?</title>", "<title/>", svg, flags=re.I)
    svg = re.sub(r"<desc\b[^>]*>[\s\S]*?</desc>", "<desc/>", svg, flags=re.I)
    svg = re.sub(r"\s+(?:aria-label|aria-labelledby|role)=(['\"]).*?\1", "", svg, flags=re.I)
    return re.sub(r">\s+<", "><", svg).strip()


class XaiLessonTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lesson = load_lesson()
        cls.shell = SHELL.read_text(encoding="utf-8")
        cls.reader = READER.read_text(encoding="utf-8")
        cls.renderer = (ROOT / "scripts/xai-canonical-lesson.js").read_text(encoding="utf-8")

    def test_stable_identity_and_complete_locales(self):
        self.assertEqual(self.lesson["id"], "xai-01-what-and-why")
        self.assertEqual(len(self.lesson["pages"]), 8)
        ids = [page["id"] for page in self.lesson["pages"]]
        self.assertEqual(len(ids), len(set(ids)))
        for page in self.lesson["pages"]:
            self.assertEqual(set(page["title"]), set(LOCALES))
            self.assertEqual(set(page["content"]), set(LOCALES))
            for locale in LOCALES:
                self.assertGreater(len(page["content"][locale]), 600 if locale == "zh" else 900)

    def test_core_concepts_are_present_in_every_locale(self):
        required = {
            "ru": ("Прогноз — не объяснение", "Intrinsic", "post-hoc", "Local", "Global", "Interpretability", "Explainability", "причин"),
            "en": ("A prediction is not an explanation", "Intrinsic", "post-hoc", "Local", "Global", "Interpretability", "Explainability", "causal"),
            "zh": ("预测不等于解释", "Intrinsic", "post-hoc", "Local", "Global", "Interpretability", "Explainability", "因果")
        }
        combined = {locale: " ".join(page["content"][locale] for page in self.lesson["pages"]) for locale in LOCALES}
        for locale, phrases in required.items():
            for phrase in phrases:
                self.assertIn(phrase.lower(), combined[locale].lower(), f"{locale}: missing {phrase}")

    def test_svg_accessibility_localization_and_geometry_parity(self):
        diagrams = {}
        for locale in LOCALES:
            content = " ".join(page["content"][locale] for page in self.lesson["pages"])
            svgs = re.findall(r"<svg\b[\s\S]*?</svg>", content, flags=re.I)
            self.assertEqual(len(svgs), 4, f"{locale}: expected four SVG diagrams")
            diagrams[locale] = [normalize_svg(svg) for svg in svgs]
            for svg in svgs:
                root = ET.fromstring(svg)
                ns = {"s": "http://www.w3.org/2000/svg"}
                self.assertIsNotNone(root.find("s:title", ns))
                self.assertIsNotNone(root.find("s:desc", ns))
                self.assertTrue(root.attrib.get("aria-labelledby"))
                self.assertTrue(root.findall(".//s:text", ns))
        self.assertEqual(diagrams["ru"], diagrams["en"])
        self.assertEqual(diagrams["ru"], diagrams["zh"])

    def test_quiz_has_eight_questions_and_matching_answer_keys(self):
        summary = next(page["content"] for page in self.lesson["pages"] if page["id"] == "summary")
        for locale in LOCALES:
            source = summary[locale]
            self.assertEqual(len(re.findall(r'<fieldset><legend>', source)), 8)
            self.assertNotIn('name="q9"', source)
            self.assertNotIn('name="q10"', source)
        for key in ("q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"):
            self.assertIn(f'{key}: "', self.renderer)
        self.assertIn('score + " / 8"', self.renderer)
        self.assertIn('score + " / " + fields.length', self.renderer)

    def test_shell_localization_theme_and_mobile_styles(self):
        self.assertIn("styles/xai-lesson.css", self.shell)
        self.assertIn("styles/xai-canonical-lesson.css", self.shell)
        self.assertIn('<nav class="lesson-nav"', self.shell)
        self.assertIn("../scripts/lesson-layout.js", self.shell)
        self.assertIn("../scripts/language-switcher.js", self.shell)
        self.assertIn("../scripts/theme-system.js", self.shell)
        for key in ("outcomesTitle", "lesson.pages.forEach", "quiz-summary"):
            self.assertIn(key, self.renderer)
        self.assertIn("@media(max-width:640px)", CSS.read_text(encoding="utf-8"))
        self.assertIn("var(--diagram-box)", self.lesson["pages"][0]["content"]["ru"])

    def test_catalog_publication_and_knowledge_map(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v2.json").read_text(encoding="utf-8"))
        lesson = next(item for item in catalog["lessons"] if item["id"] == "A.1.2.1")
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(set(lesson["languages"]), set(LOCALES))
        self.assertTrue(any(item["lesson_id"] == "A.1.2.1" for item in catalog["planets"]))
        v3 = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        intro = next(item for item in v3["lessons"] if item["uid"] == "les-a-0018")
        self.assertEqual((intro["status"], intro["content_state"]), ("published", "published"))
        self.assertEqual(intro["url_i18n"]["ru"], "lessons/a-7-1-1-les-a-0018.html")

    def test_local_practice_link_resolves(self):
        content = next(page["content"]["ru"] for page in self.lesson["pages"] if page["id"] == "methods-passport")
        hrefs = re.findall(r'href="([^"]+)"', content)
        target = (LEGACY.parent / "../practice/xai-a1-2-1-passport.py").resolve()
        self.assertTrue(target.is_file(), f"missing mini-lab script: {target}")
        self.assertIn("../practice/xai-a1-2-1-passport.py", hrefs)


if __name__ == "__main__":
    unittest.main()
