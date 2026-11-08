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

    def test_a4_a5_are_editorially_reconciled(self):
        states = {x["legacy_id"]: x["mapping_state"] for x in self.manifest["legacy_entities"]}
        self.assertEqual(states["A.4"], "editorial_approved")
        self.assertEqual(states["A.5"], "editorial_approved")
        self.assertNotIn("A.4", {x["legacy_id"] for x in self.manifest["unresolved_legacy_mappings"]})
        self.assertNotIn("A.5", {x["legacy_id"] for x in self.manifest["unresolved_legacy_mappings"]})
        self.assertIn("1.5.7", {x["code"] for x in self.catalog["lessons"]})
        self.assertIn("3.1.6", {x["code"] for x in self.catalog["lessons"]})
        self.assertIn("1.2.4", {x["code"] for x in self.catalog["lessons"]})

    def test_supabase_aliases_are_resolve_only_and_many_to_many(self):
        aliases = self.manifest["external_aliases"]
        self.assertTrue(aliases)
        self.assertTrue(all(x["access_behavior"] == "resolve_only" for x in aliases))
        a3 = next(x for x in aliases if x["source_system"] == "supabase.lesson_catalog" and x["alias_value"] == "a-3-how-machines-learn-from-data")
        self.assertGreater(len(a3["target_lesson_uids"]), 1)
        a4 = next(x for x in aliases if x["source_system"] == "supabase.lesson_catalog" and x["alias_value"] == "a-4-what-is-machine-learning-model")
        self.assertEqual(len(a4["target_lesson_uids"]), 4)
        a5 = next(x for x in aliases if x["source_system"] == "supabase.lesson_catalog" and x["alias_value"] == "a-5-how-to-evaluate-a-model")
        self.assertEqual(len(a5["target_lesson_uids"]), 10)

    def test_legacy_projection_preserves_ids_urls_statuses_and_planets(self):
        legacy = compat.load_catalog(ROOT / "data/catalog/catalog-v2.json")
        projected = compat.load_legacy_projection(ROOT / "data/catalog")
        self.assertEqual(projected["compatibility"]["projection"], "legacy_preserving")
        self.assertEqual([x["id"] for x in projected["lessons"]], [x["id"] for x in legacy["lessons"]])
        self.assertEqual([x["status"] for x in projected["lessons"]], [x["status"] for x in legacy["lessons"]])
        self.assertEqual([x["url_i18n"] for x in projected["lessons"]], [x["url_i18n"] for x in legacy["lessons"]])
        self.assertEqual(projected["planets"], legacy["planets"])
        by_legacy = {x.get("legacy_id"): x for x in projected["lessons"]}
        self.assertGreater(len(by_legacy["A.3"]["v3_target_uids"]), 1)
        self.assertEqual(len(by_legacy["A.4"]["v3_target_uids"]), 4)
        self.assertEqual(len(by_legacy["A.5"]["v3_target_uids"]), 10)
        self.assertEqual(by_legacy["A.4"]["id"], "A.1.1.4")
        by_new = {x["id"]: x for x in projected["lessons"]}
        self.assertEqual(by_new["lesson-history-of-ai"]["v3_target_codes"], ["1.1.2"])
        self.assertEqual(by_new["lesson-symbolic-ai-ml"]["v3_target_codes"], ["1.1.3"])

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
        self.assertEqual(len(v2["lessons"]), 9)

if __name__ == "__main__":
    unittest.main()
