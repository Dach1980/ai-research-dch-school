import re
import subprocess
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "lessons"


class ScriptCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.current = None

    def handle_starttag(self, tag, attrs):
        if tag.lower() != "script":
            return
        attrs = dict(attrs)
        self.current = {"src": attrs.get("src"), "type": (attrs.get("type") or "").lower(), "body": ""}

    def handle_data(self, data):
        if self.current is not None:
            self.current["body"] += data

    def handle_endtag(self, tag):
        if tag.lower() == "script" and self.current is not None:
            self.scripts.append(self.current)
            self.current = None


class LessonJavaScriptSyntaxTests(unittest.TestCase):
    def test_all_lesson_scripts_parse_without_syntax_errors(self):
        node = subprocess.run(["node", "--version"], capture_output=True, text=True)
        self.assertEqual(node.returncode, 0, "Node.js is required for lesson JavaScript syntax validation")

        checked_files = set()
        checked_inline = 0
        failures = []

        for html_path in sorted(LESSONS.rglob("*.html")):
            parser = ScriptCollector()
            parser.feed(html_path.read_text(encoding="utf-8"))
            for index, script in enumerate(parser.scripts):
                script_type = script["type"]
                if script_type and script_type not in ("text/javascript", "application/javascript", "module"):
                    continue

                if script["src"]:
                    src = urlsplit(script["src"])
                    if src.scheme or src.netloc:
                        continue
                    relative = src.path.lstrip("/")
                    candidates = [ROOT / relative, html_path.parent / relative]
                    target = next((path.resolve() for path in candidates if path.is_file()), None)
                    if target is None:
                        failures.append(f"{html_path.relative_to(ROOT)}: missing local script {script['src']}")
                        continue
                    if target in checked_files:
                        continue
                    checked_files.add(target)
                    result = subprocess.run(["node", "--check", str(target)], capture_output=True, text=True)
                    if result.returncode:
                        failures.append(f"{target.relative_to(ROOT)}\\n{result.stderr.strip()}")
                elif script["body"].strip():
                    checked_inline += 1
                    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8") as temp:
                        temp.write(script["body"])
                        temp.flush()
                        result = subprocess.run(["node", "--check", temp.name], capture_output=True, text=True)
                    if result.returncode:
                        failures.append(f"{html_path.relative_to(ROOT)} inline script #{index + 1}\\n{result.stderr.strip()}")

        self.assertGreater(checked_files.__len__() + checked_inline, 0, "No lesson JavaScript was discovered")
        self.assertEqual(failures, [], "Lesson JavaScript syntax errors detected:\\n" + "\\n\\n".join(failures))


if __name__ == "__main__":
    unittest.main()
