import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = {
    "ru": ("", "Что такое XAI и зачем нужно объяснять модели?"),
    "en": ("-en", "What is XAI and why should models be explained?"),
    "zh": ("-zh", "什么是 XAI？为什么需要解释模型？"),
}


class CanonicalXaiLessonTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.manifest = json.loads((ROOT / "data/catalog/migration-manifest-v3.json").read_text(encoding="utf-8"))
        cls.data = (ROOT / "lessons/data/xai-01-what-and-why.js").read_text(encoding="utf-8")
        cls.renderer = (ROOT / "scripts/xai-canonical-lesson.js").read_text(encoding="utf-8")
        cls.styles = (ROOT / "styles/xai-canonical-lesson.css").read_text(encoding="utf-8")

    def test_three_canonical_locale_pages_use_the_shared_lesson_shell(self):
        for locale, (suffix, title) in LOCALES.items():
            path = ROOT / "lessons" / ("a-4-2-1" + suffix + ".html")
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn('<html lang="' + ("zh-CN" if locale == "zh" else locale) + '"', source)
                self.assertIn("../styles/lesson-design-system.css", source)
                self.assertIn("../styles/lesson-standard.css", source)
                self.assertIn("../styles/lesson-reference-111.css", source)
                self.assertIn("../scripts/xai-canonical-lesson.js", source)
                self.assertIn("../scripts/lesson-layout.js", source)
                self.assertIn('<nav class="lesson-nav"', source)
                self.assertIn(title, source)
                self.assertIn("xai-01-what-and-why.js", source)
                self.assertNotIn("lesson-assessment.js", source)

    def test_all_eight_original_sections_and_localizations_are_rendered(self):
        for page_id in ("why", "xai-mi", "applications", "regulation", "terms", "taxonomy", "methods-passport", "summary"):
            self.assertIn('"id": "' + page_id + '"', self.data)
        self.assertIn('lesson.pages.forEach', self.renderer)
        self.assertIn('page.content[locale] || page.content.ru', self.renderer)
        self.assertEqual(self.data.count('"ru": "<'), 8)
        for marker in ("<svg", "knowledge-check", "quiz-summary", "Самопроверка"):
            self.assertIn(marker, self.data)

    def test_taxonomy_diagram_labels_wrap_inside_cards_in_all_locales(self):
        for label in ("Вклад", "График", "Суррогат", "Контрпример", "Обосновать", "Контролировать", "Обнаружить", "Улучшить", "Attribution", "Plot", "Surrogate", "Counterfactual", "Justify", "Control", "Discover", "Improve", "归因", "图表", "代理模型", "反事实", "说明", "控制", "发现", "改进"):
            with self.subTest(label=label):
                self.assertIn(label, self.data)
        self.assertGreaterEqual(self.data.count('dy=\\\"18\\\"'), 18)
        self.assertNotIn("Вклад · График · Суррогат · Контрпример</text>", self.data)
        self.assertNotIn("Attribution · Plot · Surrogate · Counterfactual</text>", self.data)
        self.assertNotIn("归因 · 图表 · 代理模型 · 反事实</text>", self.data)

    def test_local_global_diagram_captions_wrap_in_all_locales(self):
        for fragment in ('Локальные выводы нельзя автоматически', 'переносить на всю популяцию.', 'A local finding cannot automatically be', 'generalised to the population.', '不能把局部结论自动推广到', '整个群体。'):
            with self.subTest(fragment=fragment):
                self.assertIn(fragment, self.data)
        self.assertGreaterEqual(self.data.count('dy=\\"20\\"'), 6)

    def test_method_passport_is_compact_and_text_is_not_larger_than_body(self):
        self.assertIn('.xai-svg-figure{', self.styles)
        self.assertIn('max-width:640px', self.styles)
        self.assertIn('font-size=\\\"12\\\"', self.data)
        self.assertIn('font-size=\\\"15\\\"', self.data)

    def test_score_equation_uses_the_shared_display_formula_style_in_all_locales(self):
        equation = "score = 0.50 + 0.30 × debt_ratio − 0.10 × employment_norm"
        self.assertEqual(self.data.count("formula-expression"), 3)
        self.assertEqual(self.data.count(equation), 3)
        self.assertNotIn("formula-block", self.data)
        self.assertIn(".xai-canonical-section-content .formula{", self.styles)
        self.assertIn(".xai-canonical-section-content .formula-expression{", self.styles)
        self.assertIn("var(--lds-math-bg)", self.styles)
        self.assertIn("var(--lds-math-ink)", self.styles)
        self.assertIn("overflow-x:auto", self.styles)

    def test_learning_outcomes_card_keeps_contrast_in_light_theme(self):
        self.assertIn('.lesson #xai-outcomes', self.styles)
        self.assertIn('color:#d5e0f2', self.styles)
        self.assertIn('color:#9fc4ff', self.styles)
        self.assertIn('color:#ffffff', self.styles)

    def test_original_self_check_is_wired_to_the_canonical_page(self):
        for answer in ('q1: "a"', 'q2: "c"', 'q3: "a"', 'q4: "c"', 'q5: "c"', 'q6: "a"', 'q7: "c"', 'q8: "c"'):
            self.assertIn(answer, self.renderer)
        self.assertIn('document.addEventListener("submit"', self.renderer)
        self.assertIn('localStorage.setItem(storageKey', self.renderer)

    def test_catalog_keeps_uid_and_legacy_mapping_but_uses_canonical_urls(self):
        lesson = next(item for item in self.catalog["lessons"] if item["uid"] == "les-a-0018")
        self.assertEqual(lesson["code"], "4.2.1")
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(lesson["url_i18n"], {
            "ru": "lessons/a-4-2-1.html",
            "en": "lessons/a-4-2-1-en.html",
            "zh": "lessons/a-4-2-1-zh.html",
        })
        mappings = self.manifest["content_mappings"]
        self.assertTrue(any(
            item["source_legacy_id"] == "A.1.2.1" and "les-a-0018" in item["target_lesson_uids"]
            for item in mappings
        ))
        self.assertEqual(self.manifest["migration_status"], "staging_not_applied")

    def test_old_reader_url_remains_a_redirect_and_no_progress_migration_is_attempted(self):
        source = (ROOT / "lessons/xai/01-what-and-why.html").read_text(encoding="utf-8")
        self.assertIn('window.location.replace("../a-4-2-1"', source)
        self.assertIn('localStorage.getItem("dch-language")', source)
        self.assertIn('noindex,follow', source)
        self.assertNotIn('localStorage.setItem("dch-reader:', source)


if __name__ == "__main__":
    unittest.main()
