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
        self.assertEqual(len(a_themes), 10)
        self.assertEqual(len(self.catalog["modules"]), 40)
        self.assertEqual([sum(x["theme_uid"] == t["uid"] for x in self.catalog["modules"]) for t in a_themes], [5, 8, 2, 8, 9, 2, 2, 1, 2, 1])


    def test_track_a_theme_eight_pdp_module_is_registered(self):
        theme = next(x for x in self.catalog["themes"] if x["uid"] == "thm-a-08")
        module = next(x for x in self.catalog["modules"] if x["uid"] == "mod-a-08-01")
        lesson = next(x for x in self.catalog["lessons"] if x["uid"] == "les-a-0174")
        self.assertEqual(theme["number"], 8)
        self.assertEqual(module["theme_uid"], theme["uid"])
        self.assertEqual(module["number"], 1)
        self.assertEqual(lesson["code"], "8.1.1")
        self.assertEqual(lesson["module_uid"], module["uid"])
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(lesson["content_state"], "published")

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
        linear_mapping = next(x for x in mappings if x["mapping_id"] == "map-xai-models")
        self.assertEqual(linear_mapping["target_codes"][0], "6.1.3")
        self.assertEqual(linear_mapping["target_lesson_uids"][0], "les-a-0016")
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
        self.assertIn("4.2.2", {x["code"] for x in self.catalog["lessons"]})
        self.assertIn("3.1.6", {x["code"] for x in self.catalog["lessons"]})
        self.assertIn("2.2.1", {x["code"] for x in self.catalog["lessons"]})

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
        self.assertEqual(by_new["A.1.1.7"]["v3_target_codes"], ["1.1.2"])
        self.assertEqual(by_new["A.1.1.8"]["v3_target_codes"], ["1.2.2"])

    def test_reordered_track_a_lessons_use_canonical_urls_and_prerequisites(self):
        by_uid = {item["uid"]: item for item in self.catalog["lessons"]}
        lesson_113 = by_uid["les-a-0002"]
        lesson_114 = by_uid["les-a-0052"]
        self.assertEqual(lesson_113["code"], "1.2.1")
        self.assertEqual(lesson_114["code"], "1.2.2")
        self.assertEqual(lesson_113["prerequisite_uids"], ["les-a-0051"])
        self.assertEqual(lesson_114["prerequisite_uids"], ["les-a-0002"])
        self.assertEqual(lesson_113["url_i18n"]["ru"], "lessons/a-1-2-1-les-a-0002.html")
        self.assertEqual(lesson_114["url_i18n"]["ru"], "lessons/a-1-2-2-les-a-0052.html")

    def test_duplicate_codes_are_rejected_for_visible_lessons_only(self):
        import copy
        catalog = copy.deepcopy(self.catalog)
        self.assertEqual(compat.validate_v3_relationships(catalog), [])
        original = next(
            item for item in catalog["lessons"]
            if item.get("status") == "published" and item.get("content_state") == "published"
        )
        duplicate = dict(original)
        duplicate["uid"] = "test-visible-duplicate-code"
        duplicate["prerequisite_uids"] = []
        catalog["lessons"].append(duplicate)
        errors = compat.validate_v3_relationships(catalog)
        self.assertTrue(any("Duplicate lesson code" in error for error in errors))

    def test_python_native_v3_reader_and_relationships(self):
        loaded = compat.load_catalog_v3(ROOT / "data/catalog/catalog-v3.json")
        self.assertEqual(loaded["schema_version"], 3)
        self.assertEqual(compat.validate_v3_relationships(loaded), [])

    def test_v1_v2_compatibility_sources_remain_unchanged(self):
        v1 = compat.load_catalog(ROOT / "data/catalog")
        v2 = compat.load_catalog(ROOT / "data/catalog/catalog-v2.json")
        self.assertEqual(v1["schema_version"], 2)
        self.assertEqual(v2["schema_version"], 2)
        self.assertEqual(len(v1["lessons"]), 8)
        self.assertEqual(len(v2["lessons"]), 9)

if __name__ == "__main__":
    unittest.main()
