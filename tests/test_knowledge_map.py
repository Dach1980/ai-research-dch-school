import json,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class KnowledgeMapTests(unittest.TestCase):
 def test_localized_map_pages_and_preserved_controls(self):
  for lang,suffix in [("ru",""),("en","-en"),("zh","-zh")]:
   h=(ROOT/"learning-map"/("index"+suffix+".html")).read_text(encoding="utf-8")
   self.assertIn(f'<html lang="{lang}">',h)
   for token in ['data-planets-root','data-orbit-layer','id="planetDetails"','id="mapMode"','id="listMode"','styles/knowledge-map.css','scripts/planet-map-catalog.js']:self.assertIn(token,h)
 def test_orbits_tooltips_accessibility_and_responsive_layout(self):
  js=(ROOT/"scripts/planet-map-catalog.js").read_text(encoding="utf-8");css=(ROOT/"styles/knowledge-map.css").read_text(encoding="utf-8")
  for token in ['status!=="published"','content_state!=="published"','aria-label','b.title','generatedPlanet','planet-tooltip','ResizeObserver','2*Math.PI*i/g.points.length']:self.assertIn(token,js)
  for token in ['@keyframes orbit-spin','@keyframes counter-spin',':focus-visible','overflow-wrap:anywhere','prefers-reduced-motion']:self.assertIn(token,css)
 def test_catalog_has_localized_published_lessons(self):
  js=(ROOT/"scripts/planet-map-catalog.js").read_text(encoding="utf-8")
  c=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
  lessons=[x for x in c["lessons"] if x.get("track_uid")=="trk-a" and x.get("status")=="published" and x.get("content_state")=="published"]
  canonical=json.loads((ROOT/"data/catalog/curriculum-canonical-v1.json").read_text(encoding="utf-8"))
  accepted={lesson["number"] for track in canonical["tracks"] if track["uid"]=="trk-a" for theme in track["themes"] for module in theme["modules"] for lesson in module["lessons"] if tuple(map(int,lesson["number"].split(".")))<=(10,1,1)}
  self.assertTrue(accepted <= {lesson["code"] for lesson in lessons}, "Accepted Track A lessons must not disappear")
  self.assertEqual(len({lesson["uid"] for lesson in lessons}),len(lessons))
  for lesson in lessons:
   for route in lesson["url_i18n"].values(): self.assertTrue((ROOT/route).is_file(),route)
  self.assertIn("les-a-0018", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0173", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0147", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0148", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0016", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0168", {lesson["uid"] for lesson in lessons})
  module=next(x for x in c["modules"] if x["uid"]=="mod-a-04-02")
  self.assertEqual(set(module["title_i18n"]),{"ru","en","zh"})
  self.assertIn("e.module.title_i18n?.[locale]||moduleNames",js)
  self.assertIn("les-a-0043", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0044", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0045", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0046", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0056", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0015", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0010", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0012", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0013", {lesson["uid"] for lesson in lessons})
  self.assertIn("les-a-0014", {lesson["uid"] for lesson in lessons})
  for x in lessons:
   self.assertEqual(set(x["title_i18n"]),{"ru","en","zh"});self.assertEqual(set(x["url_i18n"]),{"ru","en","zh"})
if __name__=="__main__":unittest.main()
