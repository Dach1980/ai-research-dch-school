import importlib.util, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("catalog_compat",ROOT/"scripts"/"catalog-compat.py")
compat=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(compat)
class CatalogCompatibilityTests(unittest.TestCase):
 def test_v1_is_readable_and_urls_are_retained(self):
  c=compat.load_catalog(ROOT/"data"/"catalog"); self.assertEqual(c["source_schema_version"],1)
  a={x["id"]:x for x in c["lessons"]}
  self.assertEqual(set(a),{"A.1","A.2","A.3","A.4","A.5","A.6"})
  self.assertEqual(a["A.1"]["url"],"lessons/a-1-what-is-artificial-intelligence.html")
  self.assertEqual(a["A.6"]["url_i18n"]["zh"],"lessons/a-6-generalization-and-overfitting-zh.html")
  self.assertEqual(compat.validate_relationships(c),[])
 def test_v2_explicit_parent_chain(self):
  c=compat.load_catalog(ROOT/"data"/"catalog"/"catalog-v2.json")
  t={x["id"]:x for x in c["themes"]}; m={x["id"]:x for x in c["modules"]}
  self.assertEqual(t["theme-a1-foundations"]["track_id"],"track-a")
  self.assertEqual(m["module-11"]["theme_id"],"theme-a1-foundations")
  self.assertEqual(m["module-11"]["track_id"],"track-a")
  self.assertEqual({x["id"] for x in c["lessons"] if x["module_id"]=="module-11"},{"A.1","A.2","A.3","A.4","A.5","A.6"})
  self.assertEqual(compat.validate_relationships(c),[])
 def test_all_public_ids_and_urls_unchanged(self):
  old=compat.load_catalog(ROOT/"data"/"catalog"); new=compat.load_catalog(ROOT/"data"/"catalog"/"catalog-v2.json")
  sig=lambda c: ({x["id"]:(x["url"],x.get("url_i18n")) for x in c["lessons"]},{x["id"]:x["lesson_id"] for x in c["planets"]})
  self.assertEqual(sig(old),sig(new))
 def test_v2_rejects_missing_parent(self):
  c=compat.load_catalog(ROOT/"data"/"catalog"/"catalog-v2.json"); c["modules"][0]["theme_id"]="theme-missing"
  self.assertTrue(any("missing theme" in x for x in compat.validate_relationships(c)))
if __name__=="__main__": unittest.main()
