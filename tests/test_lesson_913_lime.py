import ast, json, re, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
UID="les-a-0179"
ROUTES={"ru":"lessons/a-9-1-3-les-a-0179.html","en":"lessons/a-9-1-3-les-a-0179-en.html","zh":"lessons/a-9-1-3-les-a-0179-zh.html"}
class Lesson913LIMETests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
  cls.lesson=next((x for x in cls.catalog["lessons"] if x["uid"]==UID),None)
  cls.data=(ROOT/"lessons/data/xai-09-lime-913.js").read_text(encoding="utf-8")
  cls.renderer=(ROOT/"scripts/xai-lime-913-lesson.js").read_text(encoding="utf-8")
  cls.practice=(ROOT/"lessons/practice/a-9-1-3-lime-tabular.py").read_text(encoding="utf-8")
 def test_catalog_sequence_identity_and_review(self):
  self.assertIsNotNone(self.lesson)
  self.assertEqual((self.lesson["code"],self.lesson["status"],self.lesson["content_state"]),("9.1.3","review","localized"))
  ids=[x["uid"] for x in self.catalog["lessons"]]
  self.assertEqual(len(ids),len(set(ids)))
  seq=[x["code"] for x in self.catalog["lessons"] if x["uid"] in {"les-a-0177","les-a-0178","les-a-0179"}]
  self.assertEqual(seq,["9.1.1","9.1.2","9.1.3"])
  self.assertEqual(self.lesson["prerequisite_uids"],["les-a-0178"])
  for locale,path in ROUTES.items():
   self.assertEqual(self.lesson["url_i18n"][locale],path)
   self.assertTrue((ROOT/path).is_file())
 def test_localized_pages_and_canonical_dom_order(self):
  for locale,path in ROUTES.items():
   page=(ROOT/path).read_text(encoding="utf-8")
   self.assertIn('lang="'+("zh-CN" if locale=="zh" else locale)+'"',page)
   blocks=['class="lesson-intro"','id="lesson-outcomes"','id="lesson-sections"','id="lesson-practice"','id="lesson-sources"','id="lesson-navigation"','id="lesson-glossary"','id="lesson-quiz"','class="footer"']
   positions=[page.index(x) for x in blocks]
   self.assertEqual(positions,sorted(positions))
   for script in ("lesson-glossary.js","lesson-svg-renderer.js","xai-09-lime-913.js","xai-lime-913-lesson.js","lesson-layout.js"):self.assertIn(script,page)
 def test_localized_content_parity_and_shared_components(self):
  payload=self.data.split("content:",1)[1].split(",practiceCode:",1)[0]
  content=json.loads(payload)
  for locale in ("ru","en","zh"):
   self.assertEqual(len(content[locale]["outcomes"]),12)
   self.assertEqual(len(content[locale]["sections"]),9)
   self.assertEqual(len(content[locale]["glossary"]),15)
   self.assertEqual(len(content[locale]["quiz"]),12)
   self.assertGreaterEqual(sum(1 for section in content[locale]["sections"] if len(section)>3 and section[3]),3)
  for token in ('"ru"','"en"','"zh"','"outcomes"','"sections"','"glossary"','"quiz"'):
   self.assertIn(token,self.data)
  for heading in ("Словарь терминов","Key terms","术语词典"):self.assertIn(heading,self.renderer)
  self.assertIn("DCHLessonSVG.render",self.renderer)
  self.assertNotIn("createElementNS",self.renderer)
  self.assertIn("DCHLessonComponents.renderGlossary",self.renderer)
  self.assertEqual(self.data.count('"bridge"'),3)
  self.assertEqual(self.data.count('"practice-interpret"'),3)
 def test_practice_api_and_python_syntax(self):
  ast.parse(self.practice)
  for token in ("LimeTabularExplainer","classifier_fn=model.predict_proba","num_samples=3000","random_state=SEED","explanation.as_list","explanation.local_pred","explanation.score"):
   self.assertIn(token,self.practice)
  self.assertNotIn("predict_fn=",self.practice)
if __name__=="__main__":unittest.main()
