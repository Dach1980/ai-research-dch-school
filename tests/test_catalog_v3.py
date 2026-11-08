import json
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("catalog_compat_v3", ROOT / "scripts/catalog_compat.py")
compat = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(compat)

class CatalogV3Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.manifest = json.loads((ROOT / "data/catalog/migration-manifest-v3.json").read_text(encoding="utf-8"))

    def test_track_a_has_approved_hierarchy(self):
        a_themes = [x for x in self.catalog["themes"] if x["track_uid"] == "trk-a"]
        self.assertEqual(len(a_themes), 5)
        self.assertEqual(len(self.catalog["modules"]), 27)
        self.assertEqual([sum(x["theme_uid"] == t["uid"] for x in self.catalog["modules"]) for t in a_themes], [5, 8, 2, 7, 5])

    def test_uid_is_separate_from_display_code(self):
        rows = self.catalog["tracks"] + self.catalog["themes"] + self.catalog["modules"] + self.catalog["lessons"]
        uids = [x["uid"] for x in rows]
        self.assertEqual(len(uids), len(set(uids)))
        for lesson in self.catalog["lessons"]:
            self.assertNotEqual(lesson["uid"], lesson["code"])
            self.assertEqual(len(lesson["code"].split(".")), 3)

    def test_fragment_manifest_supports_many_to_many(self):
        mappings = self.manifest["content_mappings"]
        self.assertTrue(any(x["source_legacy_id"] == "A.3" and len(x["target_lesson_uids"]) > 1 for x in mappings))
        self.assertTrue(any(x["source_legacy_id"] == "A.1.2.1" and len(x["target_lesson_uids"]) > 1 for x in mappings))
        target_uids = {x["uid"] for x in self.catalog["lessons"]}
        self.assertTrue(all(uid in target_uids for m in mappings for uid in m["target_lesson_uids"]))

    def test_legacy_pages_are_preserved_and_present(self):
        for entity in self.manifest["legacy_entities"]:
            self.assertIn(entity["status"], {"published", "review"})
            for path in entity.get("localized_urls", {}).values():
                self.assertTrue((ROOT / path).is_file(), path)
        self.assertEqual(self.manifest["migration_status"], "staging_not_applied")

    def test_python_native_v3_reader_and_relationships(self):
        loaded = compat.load_catalog_v3(ROOT / "data/catalog/catalog-v3.json")
        self.assertEqual(loaded["schema_version"], 3)
        self.assertEqual(compat.validate_v3_relationships(loaded), [])

    def test_v1_v2_compatibility_sources_remain_unchanged(self):
        v1 = compat.load_catalog(ROOT / "data/catalog")
        v2 = compat.load_catalog(ROOT / "data/catalog/catalog-v2.json")
        self.assertEqual(v1["schema_version"], 2)
        self.assertEqual(v2["schema_version"], 2)
        self.assertEqual(len(v1["lessons"]), 6)
        self.assertEqual(len(v2["lessons"]), 7)

if __name__ == "__main__":
    unittest.main()
