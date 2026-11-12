import ast,json,re,unittest
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
FILES={"ru":ROOT/"lessons/a-1-3-6.html","en":ROOT/"lessons/a-1-3-6-en.html","zh":ROOT/"lessons/a-1-3-6-zh.html"}
TITLES={"ru":"Генеративные модели и современные подходы ИИ","en":"Generative Models and Modern AI Approaches","zh":"生成式模型与现代人工智能方法"}
class Parser(HTMLParser):
 def error(self,message): raise AssertionError(message)
class Lesson136Tests(unittest.TestCase):
 def test_locales_and_html(self):
  for lang,path in FILES.items():
   h=path.read_text(encoding="utf-8");self.assertIn(f'<html lang="{lang}">',h);self.assertIn(TITLES[lang],h);self.assertIn('content="index,follow"',h);self.assertIn('rel="canonical"',h);self.assertNotIn("undefined",h);self.assertNotIn("{{",h);Parser().feed(h)
 def test_svg_and_mobile(self):
  css=(ROOT/"styles/lesson-136.css").read_text(encoding="utf-8")
  self.assertIn("@media(max-width:560px)",css);self.assertIn("width:900px",css)
  for p in FILES.values():
   h=p.read_text(encoding="utf-8");self.assertEqual(h.count('<figure class="lesson-figure lesson-136-figure">'),3);self.assertEqual(h.count("<title id="),3);self.assertEqual(h.count("<desc id="),3);self.assertIn("d136-arrow",h)
 def test_definitions_sources_glossary_quiz(self):
  for p in FILES.values():
   h=p.read_text(encoding="utf-8");self.assertEqual(h.count('class="definition"'),10);self.assertEqual(h.count('class="definition-term"'),10);self.assertEqual(h.count('class="definition-text"'),10);self.assertEqual(h.count('class="glossary-entry"'),10);self.assertEqual(h.count('class="lesson-check-question"'),8);self.assertEqual(h.count('class="lesson-check-feedback"'),8);self.assertEqual(h.count("<li><a href="),7);self.assertLess(h.index('class="lesson-sources"'),h.index('class="lesson-nav"'));self.assertLess(h.index('class="lesson-nav"'),h.index('class="lesson-glossary"'));self.assertLess(h.index('class="lesson-glossary"'),h.index('class="lesson-check"'))
 def test_quiz_explanations(self):
  expected=["a","a","a","a","a","a","a","a,b,c"]
  for p in FILES.values():
   h=p.read_text(encoding="utf-8");self.assertEqual(re.findall(r'data-correct="([^"]+)"',h),expected);ex=re.findall(r'data-explanation="([^"]+)"',h);self.assertEqual(len(ex),8);self.assertTrue(all(len(x)>35 for x in ex))
 def test_python_and_navigation_catalog(self):
  for lang,p in FILES.items():
   h=p.read_text(encoding="utf-8");m=re.search(r'<pre class="language-python"><code>(.*?)</code></pre>',h,re.S);self.assertIsNotNone(m);ast.parse(m.group(1).replace("&lt;","<").replace("&gt;",">").replace("&amp;","&"));suf="" if lang=="ru" else "-en" if lang=="en" else "-zh";self.assertIn(f'href="a-1-3-5{suf}.html"',h);self.assertNotIn(f'href="a-1-3-7{suf}.html"',h)
  c=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"));x=next(v for v in c["lessons"] if v["code"]=="1.3.6");self.assertEqual(x["uid"],"les-a-0009");self.assertEqual(x["status"],"published");self.assertEqual(x["content_state"],"published");self.assertEqual(x["url_i18n"],{"ru":"lessons/a-1-3-6.html","en":"lessons/a-1-3-6-en.html","zh":"lessons/a-1-3-6-zh.html"})
if __name__=="__main__":unittest.main()
