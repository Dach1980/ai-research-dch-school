#!/usr/bin/env python3
"""Validate parallel hierarchical catalog v2; production Pages still uses v1."""
import json,sys
from pathlib import Path
from catalog_compat import load_catalog,validate_relationships,CatalogCompatibilityError
ROOT=Path(__file__).resolve().parents[1]; CAT=ROOT/"data/catalog/catalog-v2.json"; SCH=ROOT/"data/catalog/schema-v2.json"
def main():
 try:
  from jsonschema import Draft202012Validator
 except ImportError: print("Install requirements-catalog.txt",file=sys.stderr); return 2
 try:
  schema=json.loads(SCH.read_text(encoding="utf-8")); doc=json.loads(CAT.read_text(encoding="utf-8"))
  Draft202012Validator.check_schema(schema)
  errs=[f"{'.'.join(map(str,e.absolute_path)) or '<root>'}: {e.message}" for e in Draft202012Validator(schema).iter_errors(doc)]
  c=load_catalog(CAT); errs.extend(validate_relationships(c))
  for lesson in c["lessons"]:
   for path in [lesson.get("url"),*lesson.get("url_i18n",{}).values()]:
    if path and not (ROOT/path).is_file(): errs.append("Missing page: "+path)
  if errs:
   print("CATALOG V2 INVALID"); [print("- "+e) for e in errs]; return 1
  print(f"CATALOG V2 VALID: {len(c['tracks'])} tracks, {len(c['themes'])} themes, {len(c['modules'])} modules, {len(c['lessons'])} lessons, {len(c['planets'])} planets")
  return 0
 except (OSError,json.JSONDecodeError,CatalogCompatibilityError) as exc: print(str(exc),file=sys.stderr); return 2
if __name__=="__main__": raise SystemExit(main())
