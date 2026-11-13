import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "ru": ROOT / "lessons/a-1-4-3.html",
    "en": ROOT / "lessons/a-1-4-3-en.html",
    "zh": ROOT / "lessons/a-1-4-3-zh.html",
}
TITLES = {"ru":"Переобучение и недообучение","en":"Overfitting and Underfitting","zh":"过拟合与欠拟合"}

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links=[]
    def handle_starttag(self,tag,attrs):
        if tag=="a":
            href=dict(attrs).get("href")
            if href:self.links.append(href)

class Lesson143Tests(unittest.TestCase):
    def test_localized_pages_and_local_links(self):
        for lang,path in FILES.items():
            self.assertTrue(path.exists(),path)
            source=path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{lang}">',source)
            self.assertIn(TITLES[lang],source)
            self.assertIn('rel="canonical"',source)
            self.assertIn('lesson-143.css',source)
            parser=LinkParser();parser.feed(source);parser.close()
            for href in parser.links:
                if href.startswith(("http://","https://","mailto:","#")):continue
                target=(path.parent/href.split("#",1)[0]).resolve()
                self.assertTrue(target.exists(),f"{path.name}: missing {href}")

    def test_parallel_lesson_components(self):
        for path in FILES.values():
            source=path.read_text(encoding="utf-8")
            self.assertEqual(source.count('class="lesson-143-figure"'),4)
            self.assertEqual(source.count('class="formula"'),4)
            self.assertEqual(source.count('class="glossary-entry"'),10)
            self.assertEqual(source.count('class="lesson-check-question"'),8)
            self.assertEqual(source.count('class="lesson-check-feedback"'),8)
            self.assertIn("early stopping",source.lower())
            self.assertIn("validation",source.lower())
            self.assertIn("a-1-4-2",source)
            self.assertIn('aria-live="polite"',source)

    def test_catalog_record_is_published_and_localized(self):
        import json
        catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        item=next(x for x in catalog["lessons"] if x["uid"]=="les-a-0012")
        self.assertEqual(item["code"],"1.4.3")
        self.assertEqual(item["status"],"published")
        self.assertEqual(item["content_state"],"published")
        self.assertEqual(set(item["url_i18n"]),{"ru","en","zh"})

if __name__=="__main__":unittest.main()
