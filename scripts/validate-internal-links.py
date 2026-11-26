"""Check literal local HTML resources, including canonical-domain URLs."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {"archive", "drafts", "templates", "reference", "tests", "supabase", "docs"}

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        self.links.extend(v for k, v in attrs if k in {"href", "src", "poster"} and v)

def main():
    paths = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0")
    errors = []
    count = 0
    for name in paths:
        page = ROOT / name
        if page.suffix != ".html" or Path(name).parts[0] in EXCLUDED:
            continue
        parser = Links()
        parser.feed(page.read_text(encoding="utf-8"))
        for link in parser.links:
            try:
                url = urlsplit(link.strip())
            except ValueError:
                errors.append((name, link))
                continue
            if url.scheme or url.netloc:
                if url.hostname != "dchai.ru" or url.scheme not in {"", "http", "https"}:
                    continue
                target = ROOT / unquote(url.path).lstrip("/")
            elif not url.path:
                continue
            elif url.path.startswith("/"):
                target = ROOT / unquote(url.path).lstrip("/")
            else:
                target = page.parent / unquote(url.path)
            target = target.resolve()
            count += 1
            if target.is_dir():
                target = target / "index.html"
            if not target.is_relative_to(ROOT) or not target.is_file():
                errors.append((name, link))
    for name, link in errors:
        print(f"FAIL: {name}: {link}")
    print(f"Checked {count} links; {len(errors)} failures")
    return bool(errors)

if __name__ == "__main__":
    sys.exit(main())
