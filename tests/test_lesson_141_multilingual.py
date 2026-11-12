import ast,json,re,unittest
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
FILES={"ru":ROOT/"lessons/a-1-4-1.html","en":ROOT/"lessons/a-1-4-1-en.html","zh":ROOT/"lessons/a-1-4-1-zh.html"}
TITLES={"ru":"Понятие модели и параметров","en":"The Model and Its Parameters","zh":"模型与参数的概念"}
class Parser(HTMLParser):
    def error(self,message): raise AssertionError(message)
class Lesson141Tests(unittest.TestCase):
    def test_locales_html_and_public_indexing(self):
        for lang,path in FILES.items():
            h=path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{lang}">',h)
            self.assertIn(TITLES[lang],h)
            self.assertNotIn('content="noindex,nofollow"',h)
            self.assertIn('rel="canonical"',h)
            self.assertNotIn("undefined",h)
            self.assertNotIn("{{",h)
            Parser().feed(h)
    def test_structure_definitions_formulas_and_diagrams(self):
        for p in FILES.values():
            h=p.read_text(encoding="utf-8")
            self.assertEqual(h.count('class="definition"'),12)
            self.assertEqual(h.count('class="definition-term"'),12)
            self.assertEqual(h.count('class="definition-text"'),12)
            self.assertEqual(h.count('class="formula"'),2)
            self.assertEqual(h.count('class="lesson-figure lesson-141-figure"'),3)
            self.assertEqual(h.count("<title id="),3)
            self.assertEqual(h.count("<desc id="),3)
            self.assertEqual(h.count('class="glossary-entry"'),10)
            self.assertEqual(h.count('class="lesson-check-question"'),8)
            self.assertEqual(h.count('class="lesson-check-feedback"'),8)
            self.assertLess(h.index('class="lesson-sources"'),h.index('class="lesson-nav"'))
            self.assertLess(h.index('class="lesson-nav"'),h.index('class="lesson-glossary"'))
            self.assertLess(h.index('class="lesson-glossary"'),h.index('class="lesson-check"'))
            for svg in re.findall(r'<svg.*?</svg>',h,re.S):
                self.assertIn("<tspan",svg)
                self.assertIn('role="img"',svg)
    def test_python_example_is_valid(self):
        for p in FILES.values():
            h=p.read_text(encoding="utf-8")
            m=re.search(r'<pre class="language-python"><code>(.*?)</code></pre>',h,re.S)
            self.assertIsNotNone(m)
            code=m.group(1).replace("&lt;","<").replace("&gt;",">").replace("&amp;","&")
            ast.parse(code)
    def test_navigation_and_catalog_review_mapping(self):
        for lang,p in FILES.items():
            h=p.read_text(encoding="utf-8")
            suffix="" if lang=="ru" else "-en" if lang=="en" else "-zh"
            self.assertIn(f'href="a-1-3-6{suffix}.html"',h)
            self.assertNotIn(f'href="a-1-4-2{suffix}.html"',h)
        c=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        x=next(v for v in c["lessons"] if v["uid"]=="les-a-0010")
        self.assertEqual(x["code"],"1.4.1")
        self.assertEqual(x["status"],"published")
        self.assertEqual(x["content_state"],"published")
        self.assertEqual(set(x["url_i18n"]),{"ru","en","zh"})
if __name__=="__main__": unittest.main()
