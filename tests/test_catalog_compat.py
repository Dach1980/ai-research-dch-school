import importlib.util,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
S=importlib.util.spec_from_file_location("catalog_compat",ROOT/"scripts"/"catalog_compat.py");c=importlib.util.module_from_spec(S);S.loader.exec_module(c)
class Tests(unittest.TestCase):
 def test_v1_to_hierarchical_ids_and_urls(self):
  x=c.load_catalog(ROOT/"data/catalog");a={z["id"]:z for z in x["lessons"]}
  self.assertEqual(set(a),{f"A.1.1.{i}" for i in range(1,7)})
  self.assertEqual(a["A.1.1.1"]["legacy_id"],"A.1")
  self.assertEqual(a["A.1.1.1"]["url"],"lessons/a-1-what-is-artificial-intelligence.html")
  self.assertEqual(a["A.1.1.6"]["url_i18n"]["zh"],"lessons/a-6-generalization-and-overfitting-zh.html")
  self.assertEqual(a["A.1.1.2"]["prerequisites"],["A.1.1.1"]);self.assertEqual(c.validate_relationships(x),[])
 def test_v2_tree(self):
  x=c.load_catalog(ROOT/"data/catalog/catalog-v2.json");a={z["id"]:z for z in x["lessons"]}
  self.assertEqual(x["themes"][0]["id"],"A.1");self.assertEqual({z["id"] for z in x["modules"]},{"A.1.1","A.1.2"})
  self.assertEqual({z["id"] for z in x["lessons"]},{f"A.1.1.{i}" for i in range(1,7)}|{"A.1.2.1"})
  self.assertEqual(a["A.1.2.1"]["status"],"review")
  self.assertEqual(a["A.1.2.1"]["prerequisites"],["A.1.1.6"])
  self.assertNotIn("A.1.2.1",{z["lesson_id"] for z in x["planets"]})
  self.assertEqual(c.validate_relationships(x),[])
 def test_crosswalk_and_planets(self):
  a=c.load_catalog(ROOT/"data/catalog");b=c.load_catalog(ROOT/"data/catalog/catalog-v2.json")
  legacy={z["id"]:z for z in a["lessons"]};hierarchical={z["id"]:z for z in b["lessons"]}
  for old_id,old_lesson in legacy.items():
   new_id="A.1.1."+old_id.split(".")[-1];new_lesson=hierarchical[new_id]
   self.assertEqual((new_lesson["legacy_id"],new_lesson["url"],new_lesson.get("url_i18n")),(old_id,old_lesson["url"],old_lesson.get("url_i18n")))
  self.assertEqual({z["id"]:z["lesson_id"] for z in a["planets"]},{z["id"]:z["lesson_id"] for z in b["planets"]})
 def test_missing_parent_rejected(self):
  x=c.load_catalog(ROOT/"data/catalog/catalog-v2.json");x["modules"][0]["theme_id"]="missing"
  self.assertTrue(any("missing theme" in z for z in c.validate_relationships(x)))
if __name__=="__main__":unittest.main()
