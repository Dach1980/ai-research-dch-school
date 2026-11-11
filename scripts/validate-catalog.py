#!/usr/bin/env python3
"""Validate the DCH School catalog against JSON Schema 2020-12 and site invariants."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path, PurePosixPath
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "catalog"
SCHEMA_PATH = CATALOG / "schema.json"
FILES = {
    "tracks": CATALOG / "tracks.json",
    "modules": CATALOG / "modules.json",
    "lessons": CATALOG / "lessons.json",
    "planets": CATALOG / "planets.json",
}
ID_RE = re.compile(r"^[A-Z][0-9]*\.[0-9]+$")


class CatalogError(Exception):
    pass


def load_json(path: Path) -> Any:
    try:
        with path.open("r", encoding="utf-8") as stream:
            return json.load(stream)
    except FileNotFoundError as exc:
        raise CatalogError(f"Файл не найден: {path.relative_to(ROOT)}") from exc
    except json.JSONDecodeError as exc:
        raise CatalogError(
            f"Некорректный JSON в {path.relative_to(ROOT)}: "
            f"строка {exc.lineno}, столбец {exc.colno}: {exc.msg}"
        ) from exc


def unique_index(items: list[dict[str, Any]], key: str, label: str, errors: list[str]) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for index, item in enumerate(items):
        value = item.get(key)
        if not isinstance(value, str) or not value:
            errors.append(f"{label}[{index}]: поле {key!r} должно быть непустой строкой")
            continue
        if value in result:
            errors.append(f"{label}: повторяющийся {key}={value!r}")
        else:
            result[value] = item
    return result


def validate_relative_html_path(value: Any, label: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not value:
        errors.append(f"{label}: URL должен быть непустой строкой")
        return
    path = PurePosixPath(value)
    if (
        value.startswith("/")
        or re.match(r"^[A-Za-z][A-Za-z0-9+.-]*:", value)
        or "\\" in value
        or any(part in {"", ".", ".."} for part in value.split("/"))
        or path.suffix.lower() != ".html"
    ):
        errors.append(f"{label}: допускается только безопасный относительный путь к .html: {value!r}")
        return
    target = ROOT.joinpath(*path.parts)
    try:
        target.resolve().relative_to(ROOT.resolve())
    except ValueError:
        errors.append(f"{label}: путь выходит за пределы репозитория: {value!r}")
        return
    if not target.is_file():
        errors.append(f"{label}: целевая HTML-страница не найдена: {value}")


def validate_cross_references(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    tracks = data["tracks"].get("tracks", [])
    modules = data["modules"].get("modules", [])
    lessons = data["lessons"].get("lessons", [])
    planets = data["planets"].get("planets", [])

    track_index = unique_index(tracks, "id", "tracks", errors)
    module_index = unique_index(modules, "id", "modules", errors)
    lesson_index = unique_index(lessons, "id", "lessons", errors)
    planet_index = unique_index(planets, "id", "planets", errors)
    unique_index(planets, "lesson_id", "planets.lesson_id", errors)

    for module in modules:
        if module.get("track_id") not in track_index:
            errors.append(f"Модуль {module.get('id')}: неизвестный track_id {module.get('track_id')!r}")

    for lesson in lessons:
        lesson_id = lesson.get("id", "<unknown>")
        module = module_index.get(lesson.get("module_id"))
        if module is None:
            errors.append(f"Урок {lesson_id}: неизвестный module_id {lesson.get('module_id')!r}")
        elif module.get("track_id") != lesson.get("track_id"):
            errors.append(f"Урок {lesson_id}: track_id не совпадает с направлением его модуля")
        if lesson.get("track_id") not in track_index:
            errors.append(f"Урок {lesson_id}: неизвестный track_id {lesson.get('track_id')!r}")

        low, high = lesson.get("duration_min"), lesson.get("duration_max")
        if isinstance(low, int) and isinstance(high, int) and low > high:
            errors.append(f"Урок {lesson_id}: duration_min больше duration_max")

        outcomes = lesson.get("learning_outcomes")
        if outcomes is not None and (not isinstance(outcomes, list) or not outcomes):
            errors.append(f"Урок {lesson_id}: learning_outcomes, если указано, должно быть непустым массивом")

        prerequisites = lesson.get("prerequisites", [])
        if not isinstance(prerequisites, list):
            errors.append(f"Урок {lesson_id}: prerequisites должно быть массивом")
            continue
        for prerequisite in prerequisites:
            if prerequisite == lesson_id:
                errors.append(f"Урок {lesson_id}: урок не может быть собственным prerequisite")
            elif prerequisite not in lesson_index:
                errors.append(f"Урок {lesson_id}: prerequisite {prerequisite!r} отсутствует в каталоге")

    # Detect prerequisite cycles with a three-state depth-first traversal.
    graph = {
        lesson.get("id"): lesson.get("prerequisites", [])
        for lesson in lessons
        if isinstance(lesson.get("id"), str) and isinstance(lesson.get("prerequisites", []), list)
    }
    state: dict[str, int] = {}

    def visit(node: str, trail: list[str]) -> None:
        marker = state.get(node, 0)
        if marker == 1:
            errors.append("Цикл prerequisites: " + " -> ".join(trail + [node]))
            return
        if marker == 2:
            return
        state[node] = 1
        for dependency in graph.get(node, []):
            if dependency in graph:
                visit(dependency, trail + [node])
        state[node] = 2

    for lesson_id in graph:
        if state.get(lesson_id, 0) == 0:
            visit(lesson_id, [])

    published = {lesson.get("id") for lesson in lessons if lesson.get("status") == "published"}
    planet_lessons = {planet.get("lesson_id") for planet in planets}
    for planet in planets:
        if planet.get("lesson_id") not in lesson_index:
            errors.append(f"Планета {planet.get('id')}: неизвестный lesson_id {planet.get('lesson_id')!r}")
        elif planet.get("lesson_id") not in published:
            errors.append(f"Планета {planet.get('id')}: нельзя показывать неопубликованный урок")
    for lesson_id in sorted(published - planet_lessons):
        errors.append(f"Опубликованный урок {lesson_id}: отсутствует соответствующая планета")
    for lesson_id in sorted(planet_lessons - published):
        errors.append(f"Планета ссылается на неопубликованный урок {lesson_id}")

    for track in tracks:
        validate_relative_html_path(track.get("url"), f"Направление {track.get('id')}", errors)
    for lesson in lessons:
        lesson_id = lesson.get("id")
        validate_relative_html_path(lesson.get("url"), f"Урок {lesson_id}", errors)
        localized_urls = lesson.get("url_i18n")
        if localized_urls is not None:
            if not isinstance(localized_urls, dict) or set(localized_urls) != {"ru", "en", "zh"}:
                errors.append(f"Урок {lesson_id}: url_i18n должен содержать ровно ru, en и zh")
            else:
                for locale in ("ru", "en", "zh"):
                    validate_relative_html_path(
                        localized_urls.get(locale), f"Урок {lesson_id} ({locale})", errors
                    )
            if lesson.get("languages") != ["ru", "en", "zh"]:
                errors.append(f"Урок {lesson_id}: languages должен быть [ru, en, zh]")

    return errors


def main() -> int:
    try:
        try:
            from jsonschema import Draft202012Validator
        except ImportError:
            raise CatalogError(
                "Не установлен jsonschema. Выполните: "
                "python -m pip install -r requirements-catalog.txt"
            )

        schema = load_json(SCHEMA_PATH)
        Draft202012Validator.check_schema(schema)
        validator = Draft202012Validator(schema)
        data = {name: load_json(path) for name, path in FILES.items()}

        errors: list[str] = []
        for name, document in data.items():
            for error in sorted(validator.iter_errors(document), key=lambda item: list(map(str, item.path))):
                location = ".".join(str(part) for part in error.absolute_path) or "<root>"
                errors.append(f"{name}.json:{location}: {error.message}")

        if not errors:
            errors.extend(validate_cross_references(data))

        if errors:
            print("ПРОВЕРКА КАТАЛОГА НЕ ПРОЙДЕНА")
            for error in errors:
                print(f"- {error}")
            return 1

        print("ПРОВЕРКА КАТАЛОГА ПРОЙДЕНА")
        print(f"Направлений: {len(data['tracks']['tracks'])}")
        print(f"Модулей: {len(data['modules']['modules'])}")
        print(f"Уроков: {len(data['lessons']['lessons'])}; опубликовано: "
              f"{sum(item['status'] == 'published' for item in data['lessons']['lessons'])}")
        print(f"Планет: {len(data['planets']['planets'])}")
        print("JSON Schema Draft 2020-12, межфайловые ссылки, prerequisites, циклы и локальные URL проверены.")
        return 0
    except CatalogError as error:
        print(f"ОШИБКА: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
