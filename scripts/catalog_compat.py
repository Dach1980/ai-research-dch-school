"""Legacy v1 to hierarchical v2 catalog compatibility adapter."""
from __future__ import annotations
import json
from pathlib import Path
from typing import Any
ROOT=Path(__file__).resolve().parents[1]
CATALOG_DIR=ROOT/"data"/"catalog"
class CatalogCompatibilityError(ValueError): pass
def _read(path:Path)->dict[str,Any]:
    try:return json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc:raise CatalogCompatibilityError(str(exc)) from exc
def _hid(old:str)->str:
    import re
    m=re.fullmatch(r"A\.(\d+)",old)
    return "A.1.1."+m.group(1) if m else old
def load_catalog(source:str|Path|None=None)->dict[str,Any]:
    target=Path(source) if source is not None else CATALOG_DIR
    if target.is_dir():
        t=_read(target/"tracks.json");md=_read(target/"modules.json");ld=_read(target/"lessons.json");pd=_read(target/"planets.json")
        if any(x.get("schema_version")!=1 for x in (t,md,ld,pd)):raise CatalogCompatibilityError("Expected v1 split catalog")
        track_index={x["id"]:x for x in t["tracks"]};themes=[];modules=[];legacy_modules={}
        for old in md["modules"]:
            track=track_index.get(old.get("track_id"))
            if not track:raise CatalogCompatibilityError("Unknown track for "+old["id"])
            theme_id="A.1" if old["id"]=="module-11" and old["track_id"]=="track-a" else track["code"]+".1"
            module_id="A.1.1" if theme_id=="A.1" else theme_id+".1"
            if not any(x["id"]==theme_id for x in themes):
                themes.append({"id":theme_id,"track_id":old["track_id"],"code":theme_id,"title":"Основы AI и машинного обучения" if theme_id=="A.1" else track["title"],"status":"in_progress"})
            m={"id":module_id,"legacy_id":old["id"],"theme_id":theme_id,"title":old["title"],"status":old["status"],"track_id":old["track_id"]}
            modules.append(m);legacy_modules[old["id"]]=m
        idmap={x["id"]:_hid(x["id"]) for x in ld["lessons"]};lessons=[]
        for old in ld["lessons"]:
            m=legacy_modules.get(old.get("module_id"))
            if not m or m["track_id"]!=old.get("track_id"):raise CatalogCompatibilityError("Invalid legacy module/track relation: "+old["id"])
            x=dict(old);x["legacy_id"]=old["id"];x["id"]=idmap[old["id"]];x["module_id"]=m["id"];x["prerequisites"]=[idmap.get(p,p) for p in x.get("prerequisites",[])];lessons.append(x)
        planets=[{**p,"lesson_id":idmap.get(p["lesson_id"],p["lesson_id"])} for p in pd["planets"]]
        return {"schema_version":2,"source_schema_version":1,"tracks":t["tracks"],"themes":themes,"modules":modules,"lessons":lessons,"planets":planets}
    doc=json.loads(target.read_text(encoding="utf-8"))
    if doc.get("schema_version")!=2:raise CatalogCompatibilityError("Expected v2 catalog")
    out=json.loads(json.dumps(doc));tracks={x["id"]:x for x in out["tracks"]};themes={x["id"]:x for x in out["themes"]};modules={x["id"]:x for x in out["modules"]}
    for theme in out["themes"]:
        if theme["track_id"] not in tracks:raise CatalogCompatibilityError("Unknown track for theme "+theme["id"])
    for module in out["modules"]:
        theme=themes.get(module["theme_id"])
        if not theme:raise CatalogCompatibilityError("Unknown theme for module "+module["id"])
        module["track_id"]=theme["track_id"]
    for lesson in out["lessons"]:
        module=modules.get(lesson["module_id"])
        if not module:raise CatalogCompatibilityError("Unknown module for lesson "+lesson["id"])
        lesson["track_id"]=module["track_id"]
    out["source_schema_version"]=2
    return out
def validate_relationships(c:dict[str,Any])->list[str]:
    e=[];tracks={x["id"]:x for x in c["tracks"]};themes={x["id"]:x for x in c["themes"]};modules={x["id"]:x for x in c["modules"]};lessons={x["id"]:x for x in c["lessons"]}
    for t in c["themes"]:
        if t["track_id"] not in tracks:e.append("Theme "+t["id"]+" references missing track")
    for m in c["modules"]:
        t=themes.get(m["theme_id"])
        if not t:e.append("Module "+m["id"]+" references missing theme")
        elif m.get("track_id",t["track_id"])!=t["track_id"]:e.append("Module "+m["id"]+" track/theme mismatch")
    for l in c["lessons"]:
        m=modules.get(l["module_id"])
        if not m:e.append("Lesson "+l["id"]+" references missing module")
        elif l.get("track_id")!=m.get("track_id"):e.append("Lesson "+l["id"]+" track/module mismatch")
        for p in l.get("prerequisites",[]):
            if p not in lessons:e.append("Lesson "+l["id"]+" missing prerequisite "+p)
    for p in c["planets"]:
        if p["lesson_id"] not in lessons:e.append("Planet "+p["id"]+" references missing lesson")
    return e
