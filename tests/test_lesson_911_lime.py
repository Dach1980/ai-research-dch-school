import ast, json, re, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
UID="les-a-0177"
ROUTES={"ru":"lessons/a-9-1-1-les-a-0177.html","en":"lessons/a-9-1-1-les-a-0177-en.html","zh":"lessons/a-9-1-1-les-a-0177-zh.html"}
class Lesson911LIMETests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
  cls.lesson=next((x for x in cls.catalog["lessons"] if x["uid"]==UID),None)
  cls.data=(ROOT/"lessons/data/xai-09-lime.js").read_text(encoding="utf-8")
  cls.renderer=(ROOT/"scripts/xai-lime-lesson.js").read_text(encoding="utf-8")
  cls.svg_renderer=(ROOT/"scripts/lesson-svg-renderer.js").read_text(encoding="utf-8")
  cls.practice=(ROOT/"lessons/practice/a-9-1-1-local-explanation.py").read_text(encoding="utf-8")
 def test_catalog_uid_routes_and_review(self):
  self.assertIsNotNone(self.lesson);self.assertEqual(self.lesson["code"],"9.1.1");self.assertEqual(self.lesson["status"],"review");self.assertEqual(self.lesson["content_state"],"localized")
  self.assertEqual(self.lesson["theme_uid"],"thm-a-09");self.assertEqual(self.lesson["module_uid"],"mod-a-09-01");self.assertEqual(self.lesson["prerequisite_uids"],["les-a-0176"])
  ids=[x["uid"] for x in self.catalog["lessons"]];self.assertEqual(len(ids),len(set(ids)));self.assertEqual(max(int(re.search(r"([0-9]+)$",x).group(1)) for x in ids),177)
  for locale,path in ROUTES.items():self.assertEqual(self.lesson["url_i18n"][locale],path);self.assertTrue((ROOT/path).is_file())
 def test_locales_dom_and_shared_scripts(self):
  for locale,path in ROUTES.items():
   page=(ROOT/path).read_text(encoding="utf-8");self.assertIn('lang="'+locale+'"',page)
   blocks=['class="lesson-intro"','id="lesson-outcomes"','id="lesson-sections"','id="lesson-practice"','id="lesson-sources"','id="lesson-navigation"','id="lesson-glossary"','id="lesson-quiz"','class="footer"']
   positions=[page.index(x) for x in blocks];self.assertEqual(positions,sorted(positions))
   for script in ("lesson-glossary.js","lesson-svg-renderer.js","xai-lime-lesson.js","lesson-layout.js"):self.assertIn(script,page)
 def test_content_parity_and_components(self):
  for locale in ("ru","en","zh"):
   self.assertIn('"outcomes"',self.data);self.assertIn('"sections"',self.data);self.assertIn('"glossary"',self.data);self.assertIn('"quiz"',self.data)
  self.assertEqual(self.data.count('"id": "motivation"'),3);self.assertEqual(self.data.count('"id": "instance"'),3);self.assertEqual(self.data.count('"id": "approximation"'),3)
  self.assertIn("DCHLessonSVG.render(spec)",self.renderer);self.assertNotIn("createElementNS",self.renderer);self.assertIn("DCHLessonComponents.renderGlossary",self.renderer)
  for heading in ("Словарь терминов","Key terms","术语词典"):self.assertIn(heading,self.renderer)
 def test_python_practice_syntax_and_scope(self):
  ast.parse(self.practice)
  for token in ("make_moons","RandomForestClassifier","DecisionTreeRegressor","local_mse","global_mse","SEED = 42","NOT an implementation of LIME"):self.assertIn(token,self.practice)
 def test_review_lesson_not_added_to_planets(self):
  self.assertEqual(self.lesson["status"],"review");self.assertEqual(self.lesson["content_state"],"localized")
  self.assertNotIn(UID,[x.get("lesson_id") for x in self.catalog.get("planets",[])])
 def test_russian_table_headers_are_localized(self):
  match=re.search(r'"ru": \{.*?"headers": \[(.*?)\]',self.data,re.S)
  self.assertIsNotNone(match,"Russian example table must exist")
  headers=re.findall(r'"([^"]+)"',match.group(1))
  self.assertEqual(headers,["Вариант входа","Исходная модель f","Локальное приближение gₓ₀"])
  self.assertFalse(re.search(r"[\u4e00-\u9fff]",match.group(1)),"Chinese characters must not appear in RU table headers")
 def test_neighborhood_diagram_contains_actual_points_and_boundary(self):
  self.assertIn('layout:"scatter"',self.renderer)
  self.assertIn('neighborhood:{center:',self.renderer)
  for token in ('data-role":"neighborhood-boundary"','data-role":"nearby-point"','data-role":"distant-point"','data-role":"explained-instance"','data-role":"instance-label"'):
   self.assertIn(token,self.svg_renderer)
  self.assertIn('n.nearby||[]',self.svg_renderer)
  self.assertIn('n.distant||[]',self.svg_renderer)
if __name__=="__main__":unittest.main()
