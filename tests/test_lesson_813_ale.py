import ast, json, re, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
UID="les-a-0176"
ROUTES={"ru":"lessons/a-8-1-3-les-a-0176.html","en":"lessons/a-8-1-3-les-a-0176-en.html","zh":"lessons/a-8-1-3-les-a-0176-zh.html"}
class Lesson813ALETests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
  cls.lesson=next(x for x in cls.catalog["lessons"] if x["uid"]==UID)
  cls.source=(ROOT/"lessons/data/xai-08-ale.js").read_text(encoding="utf-8")
  m=re.search(r"const content=(\{.*\});\nconst practiceCode=",cls.source,re.S)
  if not m: raise AssertionError("Cannot extract ALE locale data")
  cls.data=json.loads(m.group(1))
  p=re.search(r"const practiceCode=(.*);\nwindow\.DCH_ALE_813",cls.source,re.S)
  cls.python=json.loads(p.group(1)) if p else ""
  cls.renderer=(ROOT/"scripts/xai-ale-lesson.js").read_text(encoding="utf-8")
 def test_catalog_review_and_uid(self):
  self.assertEqual(self.lesson["code"],"8.1.3");self.assertEqual(self.lesson["status"],"published");self.assertEqual(self.lesson["content_state"],"published");self.assertEqual(self.lesson["prerequisite_uids"],["les-a-0175"])
  self.assertEqual(len({x["uid"] for x in self.catalog["lessons"]}),len(self.catalog["lessons"]))
 def test_routes_dom_and_shared_scripts(self):
  for locale,route in ROUTES.items():
   page=(ROOT/route).read_text(encoding="utf-8");ids=['id="lesson-outcomes"','id="lesson-sections"','id="lesson-practice"','id="lesson-sources"','id="lesson-navigation"','id="lesson-glossary"','id="lesson-quiz"'];pos=[page.index('class="lesson-intro"')]+[page.index(x) for x in ids];self.assertEqual(pos,sorted(pos));self.assertIn('class="footer"',page);self.assertIn("xai-ale-lesson.js",page);self.assertEqual(self.lesson["url_i18n"][locale],route)
 def test_locale_parity(self):
  for locale in ("ru","en","zh"):
   d=self.data[locale];self.assertEqual(len(d["outcomes"]),12);self.assertEqual(len(d["sections"]),8);self.assertEqual(len(d["glossary"]),12);self.assertEqual(len(d["quiz"]),12);self.assertEqual(len(d["sources"]),5)
  self.assertEqual([x[0] for x in self.data["ru"]["sections"]],[x[0] for x in self.data["en"]["sections"]]);self.assertEqual([x[0] for x in self.data["en"]["sections"]],[x[0] for x in self.data["zh"]["sections"]])
 def test_ale_math_and_scientific_diagrams(self):
  self.assertIn("Δ̂ⱼₖ",self.source)
  self.assertIn("∫₍z₀₎ᶻ",self.renderer)
  self.assertIn("ale-scientific-v2",self.renderer)
  self.assertIn('kind==="dependence"',self.renderer)
  self.assertIn('kind==="algorithm"',self.renderer)
  self.assertIn('s[0]==="choices"?"comparison":"algorithm"',self.renderer)
  for locale in ("ru","en","zh"):
   self.assertIn("4/3",self.data[locale]["sections"][3][2][2])
 def test_practice_python_syntax_and_core_algorithm(self):
  ast.parse(self.python)
  for token in ("accumulated_local_effects","np.quantile","np.cumsum","RandomForestRegressor","PartialDependenceDisplay","SEED = 42"):self.assertIn(token,self.python)
if __name__=="__main__":unittest.main()
