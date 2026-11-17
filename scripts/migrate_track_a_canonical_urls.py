#!/usr/bin/env python3
"""One-time migration of published Track A lesson URLs to canonical numbering."""
from __future__ import annotations
import csv, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CROSSWALK = ROOT / "docs/management/CANONICAL_LESSON_MIGRATION_CROSSWALK_2026-11-17.csv"
CATALOG = ROOT / "data/catalog/catalog-v3.json"
SEQUENCE = ROOT / "data/curriculum-sequence-track-a.json"
LAYOUT = ROOT / "scripts/lesson-layout.js"

with CROSSWALK.open(encoding="utf-8-sig", newline="") as f:
    rows = list(csv.DictReader(f))
published = [r for r in rows if r["source_catalog_status"] == "published"]
changed = [r for r in published if r["source_legacy_number"] != r["target_lesson_number"]]
assert len(changed) == 28, f"Expected 28 renumbered published lessons, got {len(changed)}"

def canonical_path(row, locale):
    suffix = "" if locale == "ru" else f"-{locale}"
    stem = f'a-{row["target_lesson_number"].replace(".", "-")}-{row["source_catalog_uid"]}{suffix}.html'
    return f"lessons/{stem}"

# Keep the already migrated first lesson in the same UID-qualified URL scheme.
url_map = {}
for row in changed:
    uid = row["source_catalog_uid"]
    url_map[uid] = {loc: canonical_path(row, loc) for loc in ("ru", "en", "zh")}

# Read all original sources before replacing any legacy page with a redirect.
originals = {}
for row in changed:
    uid = row["source_catalog_uid"]
    if uid == "les-a-0002":
        continue
    for loc in ("ru", "en", "zh"):
        old = ROOT / row[f"source_{loc}_url"]
        canonical = ROOT / url_map[uid][loc]
        source = canonical if canonical.exists() else old
        if not source.exists():
            raise FileNotFoundError(source)
        text = source.read_text(encoding="utf-8")
        if re.search(r"Redirecting to lesson|Урок переехал|课程地址已更新", text[:1000]):
            raise RuntimeError(f"Expected canonical lesson content, found redirect: {source}")
        originals[(uid, loc)] = text

# Update links across the website to the canonical filenames. Historical management
# documents and the crosswalk remain unchanged; old URLs continue to work as redirects.
filename_map = {}
for row in changed:
    for loc in ("ru", "en", "zh"):
        old_name = Path(row[f"source_{loc}_url"]).name
        new_name = Path(url_map[row["source_catalog_uid"]][loc]).name
        filename_map[old_name] = new_name

website_suffixes = {".html", ".js", ".json"}
for path in ROOT.rglob("*"):
    if not path.is_file() or path.suffix.lower() not in website_suffixes:
        continue
    rel = path.relative_to(ROOT).as_posix()
    if rel.startswith(".git/") or rel == "scripts/migrate_track_a_canonical_urls.py":
        continue
    # Source lesson pages are copied from the in-memory originals below, then replaced.
    if any(rel == row[f"source_{loc}_url"] for row in changed for loc in ("ru", "en", "zh")):
        continue
    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    updated = content
    for old_name, new_name in filename_map.items():
        updated = updated.replace(old_name, new_name)
    if updated != content:
        path.write_text(updated, encoding="utf-8")

def update_page(content, row, locale):
    old_code = row["source_legacy_number"]
    new_code = row["target_lesson_number"]
    new_path = url_map[row["source_catalog_uid"]][locale]
    canonical = "https://dchai.ru/" + new_path
    content = re.sub(
        r'<link\s+rel=["\']canonical["\']\s+href=["\'][^"\']*["\']\s*/?>',
        f'<link rel="canonical" href="{canonical}">',
        content, count=1, flags=re.I
    )
    if not re.search(r'<link\s+rel=["\']canonical["\']', content, flags=re.I):
        content = content.replace("</head>", f'<link rel="canonical" href="{canonical}"></head>', 1)
    content = re.sub(r'(<title>\s*)' + re.escape(old_code) + r'(?=\s*[—–-])',
                     lambda m: m.group(1) + new_code, content, count=1, flags=re.I)
    content = re.sub(r'(<meta[^>]+property=["\']og:title["\'][^>]+content=["\'])' +
                      re.escape(old_code) + r'(?=\s*[—–-])',
                      lambda m: m.group(1) + new_code, content, count=1, flags=re.I)
    content = re.sub(r'(LESSON\s+|УРОК\s+)' + re.escape(old_code) + r'\b',
                     lambda m: m.group(1) + new_code, content, flags=re.I)
    content = re.sub(r'((?:Урок|Lesson)\s+)' + re.escape(old_code) + r'\b',
                     lambda m: m.group(1) + new_code, content, flags=re.I)
    return content

for row in changed:
    uid = row["source_catalog_uid"]
    if uid == "les-a-0002":
        continue
    for loc in ("ru", "en", "zh"):
        old_path = ROOT / row[f"source_{loc}_url"]
        new_path = ROOT / url_map[uid][loc]
        content = originals[(uid, loc)]
        for old_name, new_name in filename_map.items():
            content = content.replace(old_name, new_name)
        content = update_page(content, row, loc)
        new_path.parent.mkdir(parents=True, exist_ok=True)
        new_path.write_text(content, encoding="utf-8")
        label = {"ru": "Урок переехал.", "en": "The lesson has moved.", "zh": "课程地址已更新。"}[loc]
        lang = loc
        new_name = new_path.name
        canonical = "https://dchai.ru/" + url_map[uid][loc]
        redirect = (
            f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8">'
            f'<meta name="robots" content="noindex"><title>Redirecting to lesson {row["target_lesson_number"]}</title>'
            f'<link rel="canonical" href="{canonical}"></head><body><p>{label} '
            f'<a href="{new_name}">{row["target_lesson_number"]}</a></p>'
            f'<script>location.replace("{new_name}"+location.search+location.hash);</script>'
            f'</body></html>'
        )
        old_path.write_text(redirect, encoding="utf-8")

# Update the canonical catalog URLs and lesson codes without changing UIDs or progress IDs.
catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
for row in changed:
    lesson = next(x for x in catalog["lessons"] if x["uid"] == row["source_catalog_uid"])
    lesson["code"] = row["target_lesson_number"]
    lesson["url_i18n"] = url_map[row["source_catalog_uid"]]
catalog["catalog_version"] = "3.2.1-numbering-overlay"
CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

sequence = json.loads(SEQUENCE.read_text(encoding="utf-8"))
for row in changed:
    for step in sequence["steps"]:
        if step.get("kind") == "lesson" and step.get("lesson_uid") == row["source_catalog_uid"]:
            step["code"] = row["target_lesson_number"]
sequence["updated_at"] = "2026-11-17"
SEQUENCE.write_text(json.dumps(sequence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

# Move the display overlay keys to canonical route names; the UID is the stable identity.
layout = LAYOUT.read_text(encoding="utf-8")
for row in changed:
    old_name = Path(row["source_ru_url"]).name
    new_name = Path(url_map[row["source_catalog_uid"]]["ru"]).name
    layout = layout.replace(f'"{old_name}": {{', f'"{new_name}": {{')
layout = layout.replace(
    'canonicalLessonByRoute["a-1-2-1-les-a-0002.html"] = canonicalLessonByRoute["a-1-1-3.html"];\n', ""
)
LAYOUT.write_text(layout, encoding="utf-8")

# Guardrails: canonical files exist, old paths redirect, catalog and sequence agree.
for row in changed:
    uid = row["source_catalog_uid"]
    for loc in ("ru", "en", "zh"):
        new_file = ROOT / url_map[uid][loc]
        old_file = ROOT / row[f"source_{loc}_url"]
        assert new_file.exists(), f"Missing canonical page: {new_file}"
        assert "Redirecting to lesson" in old_file.read_text(encoding="utf-8")[:1000], f"Missing legacy redirect: {old_file}"
        item = next(x for x in catalog["lessons"] if x["uid"] == uid)
        assert item["url_i18n"][loc] == url_map[uid][loc]
    step = next(x for x in sequence["steps"] if x.get("kind") == "lesson" and x.get("lesson_uid") == uid)
    assert step["code"] == row["target_lesson_number"]
print(f"Canonical URL migration prepared: {len(changed)} lessons, {len(changed)*3} canonical pages, {len(changed)*3} legacy redirects.")
