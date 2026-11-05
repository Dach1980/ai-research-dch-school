#!/usr/bin/env python3
"""Validate RU/EN/ZH lesson pages, language navigation and diagram parity."""

from __future__ import annotations

import json
import re
import sys
from html import unescape
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("ru", "en", "zh")


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def read_page(relative: str, errors: list[str]) -> str:
    path = ROOT / relative
    if not path.is_file():
        fail(errors, f"Missing page: {relative}")
        return ""
    return path.read_text(encoding="utf-8")


def normalized_svg(svg: str) -> str:
    svg = re.sub(r"<text\b[^>]*>[\s\S]*?</text>", "<text/>", svg, flags=re.I)
    svg = re.sub(r"<title\b[^>]*>[\s\S]*?</title>", "<title/>", svg, flags=re.I)
    svg = re.sub(r"\s+(?:aria-label|aria-labelledby|role)=(['\"]).*?\1", "", svg, flags=re.I)
    return re.sub(r">\s+<", "><", svg).strip()


def local_html_links(page: str, relative: str, errors: list[str]) -> None:
    base = (ROOT / relative).parent
    for raw in re.findall(r"""\bhref\s*=\s*(['"])(.*?)\1""", page, flags=re.I):
        href = unescape(raw[1]).strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
            continue
        parsed = urlsplit(href)
        if parsed.scheme or parsed.netloc:
            continue
        target = (base / parsed.path).resolve()
        try:
            target.relative_to(ROOT.resolve())
        except ValueError:
            fail(errors, f"{relative}: local link escapes repository: {href}")
            continue
        if parsed.path.endswith(".html") and not target.is_file():
            fail(errors, f"{relative}: broken local HTML link: {href}")


def main() -> int:
    errors: list[str] = []
    catalog_path = ROOT / "data/catalog/lessons.json"
    try:
        catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"Cannot read lesson catalog: {exc}", file=sys.stderr)
        return 2

    lessons = {item["id"]: item for item in catalog.get("lessons", [])}
    for lesson_id in ("A.1", "A.2", "A.3", "A.4", "A.5"):
        lesson = lessons.get(lesson_id)
        if not lesson:
            fail(errors, f"Catalog entry missing: {lesson_id}")
            continue
        localized = lesson.get("url_i18n", {})
        if set(localized) != set(LOCALES):
            fail(errors, f"{lesson_id}: url_i18n must contain ru/en/zh")
            continue

        pages: dict[str, str] = {}
        diagrams: dict[str, list[str]] = {}
        for locale in LOCALES:
            relative = localized[locale]
            page = read_page(relative, errors)
            pages[locale] = page
            if not page:
                continue
            html_lang = re.search(r"<html\b[^>]*\blang=['\"]([^'\"]+)", page, flags=re.I)
            if not html_lang or html_lang.group(1).lower() != locale:
                fail(errors, f"{lesson_id}/{locale}: html lang must be {locale}")
            if "scripts/language-switcher.js" not in page:
                fail(errors, f"{lesson_id}/{locale}: language switcher script is missing")
            if locale != "ru" and re.search(r"Concept diagram|概念示意图", page, flags=re.I):
                fail(errors, f"{lesson_id}/{locale}: placeholder diagram caption remains")
            local_html_links(page, relative, errors)
            diagrams[locale] = [
                normalized_svg(match.group(0))
                for match in re.finditer(r"<svg\b[\s\S]*?</svg>", page, flags=re.I)
            ]
            if locale != "ru":
                svg_accessible_text = []
                for svg_match in re.finditer(r"<svg\b[\s\S]*?</svg>", page, flags=re.I):
                    svg = svg_match.group(0)
                    svg_accessible_text.extend(re.findall(r"<(?:text|title|desc)\b[^>]*>([\s\S]*?)</(?:text|title|desc)>", svg, flags=re.I))
                    svg_accessible_text.extend(re.findall(r"""aria-label=["']([^"']+)""", svg, flags=re.I))
                if any(re.search(r"[А-Яа-яЁё]", re.sub(r"<[^>]+>", "", value)) for value in svg_accessible_text):
                    fail(errors, f"{lesson_id}/{locale}: Russian text remains in localized diagram labels")
                if lesson_id == "A.5":
                    required = ("ROC-AUC", "Average Precision", "StratifiedKFold", "DummyClassifier", "LogisticRegression")
                    missing = [term for term in required if term not in page]
                    if missing:
                        fail(errors, f"A.5/{locale}: missing expanded evaluation content: {', '.join(missing)}")

            parent = Path(relative).parent
            filename = Path(relative).name
            base = re.sub(r"-(en|zh)(?=\.html$)", "", filename)
            for target_locale in LOCALES:
                suffix = "" if target_locale == "ru" else f"-{target_locale}"
                target = (parent / (base[:-5] + suffix + ".html")).as_posix()
                if not (ROOT / target).is_file():
                    fail(errors, f"{lesson_id}/{locale}: language switcher target missing: {target_locale} -> {target}")

        if all(pages.get(locale) for locale in LOCALES):
            def visible_text(page: str) -> str:
                page = re.sub(r"<script\b[\s\S]*?</script>", " ", page, flags=re.I)
                page = re.sub(r"<style\b[\s\S]*?</style>", " ", page, flags=re.I)
                return re.sub(r"<[^>]+>", " ", page)

            ru_words = len(re.findall(r"[\\w]+", visible_text(pages["ru"]), flags=re.UNICODE))
            en_words = len(re.findall(r"[\\w]+", visible_text(pages["en"]), flags=re.UNICODE))
            zh_characters = len(re.findall(r"[\u3400-\u9fff]", visible_text(pages["zh"])))
            if ru_words and en_words < ru_words * 0.65:
                fail(errors, f"{lesson_id}: English text volume is too short ({en_words}/{ru_words} words; minimum 65%)")
            if zh_characters < 1000:
                fail(errors, f"{lesson_id}: Chinese translation appears incomplete ({zh_characters} CJK characters; minimum 1000)")

        if all(locale in diagrams for locale in LOCALES):
            counts = {locale: len(diagrams[locale]) for locale in LOCALES}
            if len(set(counts.values())) != 1:
                fail(errors, f"{lesson_id}: diagram count differs by language: {counts}")
            else:
                reference = diagrams["ru"]
                for locale in ("en", "zh"):
                    for index, (expected, actual) in enumerate(zip(reference, diagrams[locale]), start=1):
                        if expected != actual:
                            fail(errors, f"{lesson_id}/{locale}: diagram {index} geometry/structure differs from RU")

        for locale in ("en", "zh"):
            if lesson_id != "A.5" and 'class="lesson-extension"' not in pages.get(locale, ""):
                fail(errors, f"{lesson_id}/{locale}: expanded full-coverage translation section is missing")

    if errors:
        print("MULTILINGUAL LESSON VALIDATION FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    print("MULTILINGUAL LESSON VALIDATION PASSED")
    print("A.1–A.5: RU/EN/ZH pages, HTML language, local HTML links, language switcher, diagram counts and shared diagram geometry checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
