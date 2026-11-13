#!/usr/bin/env python3
"""Validate the staging v3 curriculum and its legacy migration manifest."""
from __future__ import annotations
import json
import sys
from pathlib import Path
from jsonschema import Draft202012Validator
from catalog_compat import load_catalog_v3, validate_v3_relationships, CatalogCompatibilityError

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data/catalog/catalog-v3.json"
SCHEMA = ROOT / "data/catalog/schema-v3.json"
MANIFEST = ROOT / "data/catalog/migration-manifest-v3.json"

def main() -> int:
    try:
        schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        catalog = load_catalog_v3(CATALOG)
        errors = [f"{'.'.join(map(str, e.absolute_path)) or '<root>'}: {e.message}"
                  for e in Draft202012Validator(schema).iter_errors(catalog)]
        errors.extend(validate_v3_relationships(catalog))
        lesson_index = {x["uid"]: x for x in catalog["lessons"]}
        legacy_ids = {x["legacy_id"] for x in manifest["legacy_entities"]}
        for entity in manifest["legacy_entities"]:
            for uid in entity.get("target_lesson_uids", []):
                if uid not in lesson_index:
                    errors.append(f"Legacy entity {entity['legacy_id']} references missing target UID {uid}")
            for locale, path in entity.get("localized_urls", {}).items():
                if not (ROOT / path).is_file():
                    errors.append(f"Missing legacy URL ({locale}): {path}")
        for alias in manifest.get("external_aliases", []):
            if alias.get("access_behavior") != "resolve_only":
                errors.append(f"Alias {alias.get('alias_value')} has unsafe access behavior")
            if not alias.get("target_lesson_uids"):
                errors.append(f"Alias {alias.get('alias_value')} has no target UID")
            for uid in alias.get("target_lesson_uids", []):
                if uid not in lesson_index:
                    errors.append(f"Alias {alias.get('alias_value')} references missing target UID {uid}")
        for mapping in manifest["content_mappings"]:
            if mapping["source_legacy_id"] not in legacy_ids:
                errors.append(f"Unknown legacy source: {mapping['source_legacy_id']}")
            if not mapping.get("source_fragment_topics"):
                errors.append(f"Mapping {mapping['mapping_id']} has no source fragment topics")
            for uid in mapping["target_lesson_uids"]:
                if uid not in lesson_index:
                    errors.append(f"Mapping {mapping['mapping_id']} references missing target UID {uid}")
            for code, uid in zip(mapping.get("target_codes", []), mapping["target_lesson_uids"]):
                if lesson_index[uid]["code"] != code:
                    errors.append(f"Mapping {mapping['mapping_id']} code/UID mismatch: {code}")
        if errors:
            print("CATALOG V3 INVALID")
            for error in errors:
                print("- " + error)
            return 1
        print(f"CATALOG V3 VALID (staging): {len(catalog['tracks'])} tracks, "
              f"{len(catalog['themes'])} themes, {len(catalog['modules'])} modules, "
              f"{len(catalog['lessons'])} outlined lessons, "
              f"{len(manifest['legacy_entities'])} legacy entities, "
              f"{len(manifest['content_mappings'])} fragment mappings")
        return 0
    except (OSError, json.JSONDecodeError, CatalogCompatibilityError) as exc:
        print(str(exc), file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
