import ast, html, json, re, unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {"ru": ROOT/"lessons/a-1-4-5.html", "en": ROOT/"lessons/a-1-4-5-en.html", "zh": ROOT/"lessons/a-1-4-5-zh.html"}
TITLES = {"ru":"Гиперпараметры и настройка модели","en":"Hyperparameters and Model Tuning","zh":"超参数与模型调优"}

class LinkParser(HTMLParser):
    def __init__(self): super().__init__(); self.hrefs=[]
    def handle_starttag(self, tag, attrs):
        if tag=="a":
            href=dict(attrs).get("href")
            if href:self.hrefs.append(href)

class Lesson145Tests(unittest.TestCase):
    def test_locales_links_and_shell(self):
        for locale,path in FILES.items():
            source=path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{locale}">',source)
            self.assertIn(TITLES[locale],source)
            self.assertIn('rel="canonical"',source)
            self.assertIn("lesson-145.css",source)
            self.assertIn("lesson-design-system.css",source)
            self.assertIn("lesson-assessment.js",source)
            parser=LinkParser(); parser.feed(source)
            for href in parser.hrefs:
                if href.startswith(("http://","https://","mailto:","#")): continue
                target=(path.parent/href.split("#",1)[0]).resolve()
                self.assertTrue(target.exists(),f"{path.name}: missing {href}")
    def test_core_content_and_localized_assessment(self):
        for locale,path in FILES.items():
            source=path.read_text(encoding="utf-8")
            self.assertEqual(source.count('class="formula"'),2)
            self.assertEqual(source.count('class="lesson-145-figure"'),3)
            self.assertEqual(source.count("<title id="),3)
            self.assertEqual(source.count("<desc id="),3)
            self.assertEqual(source.count('class="glossary-entry"'),10)
            self.assertEqual(source.count('class="lesson-check-question"'),8)
            self.assertEqual(source.count('class="lesson-check-button"'),8)
            self.assertEqual(source.count('class="lesson-check-feedback"'),8)
            self.assertEqual(source.count('class="lesson-outcomes"'),1)
            self.assertIn('class="lesson-sources"',source)
            self.assertIn('class="lesson-nav"',source)
            self.assertIn('class="lesson-problem lesson-practice-task"',source)
            self.assertIn('data-mode="single"',source)
            self.assertEqual(len(re.findall(r'data-correct="[abc]"',source)),8)
            self.assertNotRegex(source,r'data-explanation="[abc]"')
            nav=source.split('class="lesson-nav"',1)[1].split("</nav>",1)[0]
            self.assertEqual(nav.count('class="button'),5)
            self.assertIn("a-1-4-4",nav)
            self.assertIn('class="language-python"',source)
            match=re.search(r'<pre class="language-python"><code>(.*?)</code></pre>',source,re.S)
            self.assertIsNotNone(match)
            ast.parse(html.unescape(match.group(1)))
    def test_catalog_uid_prerequisite_and_publication(self):
        catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson=next(x for x in catalog["lessons"] if x["uid"]=="les-a-0014")
        self.assertEqual(lesson["code"],"1.4.5")
        self.assertEqual(lesson["status"],"published")
        self.assertEqual(lesson["content_state"],"published")
        self.assertEqual(lesson["prerequisite_uids"],["les-a-0013"])
        self.assertEqual(set(lesson["url_i18n"]),{"ru","en","zh"})

if __name__=="__main__": unittest.main()
