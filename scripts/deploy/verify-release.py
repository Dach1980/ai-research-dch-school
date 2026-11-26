"""Verify exported bytes, local HTML paths and optional local HTTP delivery."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit
from urllib.request import urlopen

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        self.links.extend(v for k, v in attrs if k in {"href", "src", "poster"} and v)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("artifact", type=Path)
    p.add_argument("--http", action="store_true")
    args = p.parse_args()
    root = (args.artifact / "public").resolve()
    expected = json.loads((args.artifact / "release.json").read_text())["files"]
    actual = {f.relative_to(root).as_posix(): f for f in root.rglob("*") if f.is_file()}
    if set(expected) != set(actual) or not expected:
        raise SystemExit("Manifest mismatch")
    for name, f in actual.items():
        if f.is_symlink() or not f.resolve().is_relative_to(root) or any(x.startswith(".") for x in Path(name).parts):
            raise SystemExit(f"Unsafe file: {name}")
        if hashlib.sha256(f.read_bytes()).hexdigest() != expected[name]:
            raise SystemExit(f"Hash mismatch: {name}")
        if args.http:
            with urlopen("http://127.0.0.1:8080/" + quote(name, safe="/"), timeout=15) as res:
                if res.status != 200 or hashlib.sha256(res.read()).hexdigest() != expected[name]:
                    raise SystemExit(f"HTTP mismatch: {name}")
    errors = []
    count = 0
    for name, f in actual.items():
        if f.suffix != ".html" or name.startswith("templates/"):
            continue
        parser = Links()
        parser.feed(f.read_text(encoding="utf-8"))
        for link in parser.links:
            u = urlsplit(link.strip())
            if u.scheme or u.netloc:
                if u.hostname != "dchai.ru" or u.scheme not in {"", "http", "https"}:
                    continue
                target = root / unquote(u.path).lstrip("/")
            elif not u.path:
                continue
            elif u.path.startswith("/"):
                target = root / unquote(u.path).lstrip("/")
            else:
                target = f.parent / unquote(u.path)
            target = target.resolve()
            if target.is_dir():
                target = target / "index.html"
            count += 1
            if not target.is_relative_to(root) or not target.is_file():
                errors.append(f"{name}: {link}")
    for error in errors:
        print("FAIL:", error)
    print(f"Verified {len(actual)} files and {count} HTML references; {len(errors)} failures")
    if errors:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
