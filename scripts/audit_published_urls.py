#!/usr/bin/env python3
"""Read-only HTTP smoke test for published RU/EN/ZH lesson URLs.

Uses only Python's standard library. Does not modify the catalog or lesson pages.
Run from any machine with internet access:
  python scripts/audit_published_urls.py
"""
from __future__ import annotations

import csv
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

REPO_RAW = "https://raw.githubusercontent.com/Dach1980/ai-research-dch-school/main/data/catalog/catalog-v3.json"
PAGES_BASE = "https://dach1980.github.io/ai-research-dch-school/"
OUT = Path("docs/management/PUBLISHED_LESSON_HTTP_SMOKE_TEST_2026-11-17.csv")
LANGS = ("ru", "en", "zh")


class TrackingRedirectHandler(urllib.request.HTTPRedirectHandler):
    def __init__(self):
        super().__init__()
        self.chain: list[dict[str, str | int]] = []

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.chain.append({"status": code, "url": newurl})
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch(url: str, timeout: int = 25):
    redirects = TrackingRedirectHandler()
    opener = urllib.request.build_opener(redirects)
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "DCH-School-Published-URL-Audit/1.0", "Range": "bytes=0-1023"},
        method="GET",
    )
    started = time.monotonic()
    try:
        with opener.open(request, timeout=timeout) as response:
            response.read(1024)
            return {
                "http_status": response.status,
                "final_url": response.geturl(),
                "redirect_chain": json.dumps(redirects.chain, ensure_ascii=False),
                "content_type": response.headers.get("Content-Type", ""),
                "elapsed_ms": round((time.monotonic() - started) * 1000),
                "error": "",
            }
    except urllib.error.HTTPError as exc:
        return {
            "http_status": exc.code,
            "final_url": exc.geturl(),
            "redirect_chain": json.dumps(redirects.chain, ensure_ascii=False),
            "content_type": exc.headers.get("Content-Type", "") if exc.headers else "",
            "elapsed_ms": round((time.monotonic() - started) * 1000),
            "error": str(exc),
        }
    except Exception as exc:
        return {
            "http_status": "",
            "final_url": "",
            "redirect_chain": json.dumps(redirects.chain, ensure_ascii=False),
            "content_type": "",
            "elapsed_ms": round((time.monotonic() - started) * 1000),
            "error": f"{type(exc).__name__}: {exc}",
        }


def main():
    with urllib.request.urlopen(REPO_RAW, timeout=25) as response:
        catalog = json.load(response)
    published = [lesson for lesson in catalog["lessons"] if lesson.get("status") == "published"]
    fields = [
        "uid", "code", "title_ru", "language", "catalog_path", "requested_url",
        "http_status", "final_url", "redirect_chain", "content_type", "elapsed_ms", "error",
    ]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        for lesson in published:
            paths = lesson.get("url_i18n") or {}
            for lang in LANGS:
                path = paths.get(lang, "")
                url = PAGES_BASE + path.lstrip("/") if path else ""
                result = fetch(url) if url else {
                    "http_status": "", "final_url": "", "redirect_chain": "[]",
                    "content_type": "", "elapsed_ms": 0, "error": "Missing URL in catalog",
                }
                writer.writerow({
                    "uid": lesson.get("uid", ""),
                    "code": lesson.get("code", ""),
                    "title_ru": lesson.get("title", ""),
                    "language": lang,
                    "catalog_path": path,
                    "requested_url": url,
                    **result,
                })
                print(f'{lesson.get("uid")} {lang}: {result["http_status"] or result["error"]} -> {result["final_url"]}')
    print(f"\nChecked {len(published)} lessons / {len(published) * len(LANGS)} URLs.")
    print(f"CSV report: {OUT}")


if __name__ == "__main__":
    main()
