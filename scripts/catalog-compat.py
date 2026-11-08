"""Read v1 split catalogs and v2 hierarchical bundle through a stable interface."""
from __future__ import annotations
import json
from pathlib import Path
from typing import Any
ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "data" / "catalog"
class CatalogCompatibilityError(ValueError): pass
def _read(path: Path) -> dict[str, Any]:
    try: return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc: raise CatalogCompatibilityError(f"Cannot read {path}: {exc}") from exc
def load_catalog(source: str | Path | None = None) -> dict[str, Any]:
    """Load legacy v1 directory or v2 bundle; return a normalized v2-shaped object."""
    target = Path(source) if source is not None else CATALOG_DIR
    if target.is_dir():
        tracks=_read(target/"tracks.json"); modules=_read(target/"modules.json")
        lessons=_read(target/"lessons.json"); planets=_read(target/"planets.json")
        if any(x.get("schema_version") != 1 for x in (tracks,modules,lessons,planets)):
            raise CatalogCompatibilityError("Expected split catalog schema_version 1")
        track_index={x["id"]:x for x in tracks.get("tracks",[])}
        themes=[]; module_rows=modules.get("modules",[])
        for module in module_rows:
            if module.get("track_id") not in track_index: raise CatalogCompatibilityError(f"Unknown track for module {module.get('id')}")
            tid="theme-a1-foundations" if module["id"]=="module-11" and module["track_id"]=="track-a" else "legacy-theme-"+module["track_id"].removeprefix("track-")
            module["theme_id"]=tid
            if not any(t["id"]==tid for t in themes):
                track=track_index[module["track_id"]]
                themes.append({"id":tid,"track_id":module["track_id"],"code":"A1" if tid=="theme-a1-foundations" else track["code"]+"0","title":"Основы AI и машинного обучения" if tid=="theme-a1-foundations" else track["title"]+" (legacy grouping)","status":"in_progress"})
        module_index={x["id"]:x for x in module_rows}
        for lesson in lessons.get("lessons",[]):
            module=module_index.get(lesson.get("module_id"))
            if module is None or lesson.get("track_id")!=module.get("track_id"):
                raise CatalogCompatibilityError(f"Lesson {lesson.get('id')} has invalid module/track relation")
        return {"schema_version":2,"source_schema_version":1,"tracks":tracks.get("tracks",[]),"themes":themes,"modules":module_rows,"lessons":lessons.get("lessons",[]),"planets":planets.get("planets",[])}
    doc=_read(target)
    if doc.get("schema_version")!=2: raise CatalogCompatibilityError("Expected catalog bundle schema_version 2")
    tracks={x["id"]:x for x in doc.get("tracks",[])}; themes={x["id"]:x for x in doc.get("themes",[])}
    modules={x["id"]:x for x in doc.get("modules",[])}
    for theme in doc.get("themes",[]):
        if theme.get("track_id") not in tracks: raise CatalogCompatibilityError(f"Theme {theme['id']} references unknown track")
    for module in doc.get("modules",[]):
        theme=themes.get(module.get("theme_id"))
        if theme is None: raise CatalogCompatibilityError(f"Module {module['id']} references unknown theme")
        module["track_id"]=theme["track_id"] # bridge for legacy consumers
    for lesson in doc.get("lessons",[]):
        module=modules.get(lesson.get("module_id"))
        if module is None: raise CatalogCompatibilityError(f"Lesson {lesson['id']} references unknown module")
        lesson["track_id"]=module["track_id"] # bridge for legacy consumers
    result=dict(doc); result["source_schema_version"]=2
    return result
def validate_relationships(catalog: dict[str, Any]) -> list[str]:
    errors=[]; tracks={x["id"]:x for x in catalog.get("tracks",[])}
    themes={x["id"]:x for x in catalog.get("themes",[])}
    modules={x["id"]:x for x in catalog.get("modules",[])}
    lessons={x["id"]:x for x in catalog.get("lessons",[])}
    for theme in catalog.get("themes",[]):
        if theme.get("track_id") not in tracks: errors.append(f"Theme {theme.get('id')} references missing track")
    for module in catalog.get("modules",[]):
        theme=themes.get(module.get("theme_id"))
        if theme is None: errors.append(f"Module {module.get('id')} references missing theme")
        elif module.get("track_id",theme["track_id"])!=theme["track_id"]: errors.append(f"Module {module.get('id')} track/theme mismatch")
    for lesson in catalog.get("lessons",[]):
        module=modules.get(lesson.get("module_id"))
        if module is None: errors.append(f"Lesson {lesson.get('id')} references missing module")
        elif lesson.get("track_id")!=module.get("track_id"): errors.append(f"Lesson {lesson.get('id')} track/module mismatch")
        for prereq in lesson.get("prerequisites",[]):
            if prereq not in lessons: errors.append(f"Lesson {lesson.get('id')} missing prerequisite {prereq}")
    return errors
