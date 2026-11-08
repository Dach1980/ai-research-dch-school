from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

PYTHON_LESSONS = [
    "lessons/a-3-how-machines-learn-from-data.html",
    "lessons/a-3-how-machines-learn-from-data-en.html",
    "lessons/a-3-how-machines-learn-from-data-zh.html",
    "lessons/a-4-what-is-machine-learning-model.html",
    "lessons/a-4-what-is-machine-learning-model-en.html",
    "lessons/a-4-what-is-machine-learning-model-zh.html",
    "lessons/a-5-how-to-evaluate-a-model.html",
    "lessons/a-5-how-to-evaluate-a-model-en.html",
    "lessons/a-5-how-to-evaluate-a-model-zh.html",
]


def test_python_examples_are_explicitly_labelled():
    for relative_path in PYTHON_LESSONS:
        source = (ROOT / relative_path).read_text(encoding="utf-8")
        code_blocks = re.findall(r"<pre\b[^>]*>([\s\S]*?)</pre>", source, re.I)
        assert code_blocks, f"No code blocks found in {relative_path}"
        for block in code_blocks:
            assert "<code" in block and "language-python" in block, f"Unlabelled Python code block in {relative_path}"


def test_code_block_runtime_is_loaded_by_python_lessons():
    for relative_path in PYTHON_LESSONS:
        source = (ROOT / relative_path).read_text(encoding="utf-8")
        assert "../scripts/code-blocks.js" in source
        assert "../styles/main.css" in source


def test_site_brand_uses_the_canonical_favicon_asset():
    pages = [
        "index.html",
        "lessons/a-3-how-machines-learn-from-data.html",
        "lessons/reader.html",
        "lessons/xai/01-what-and-why.html",
    ]
    for relative_path in pages:
        source = (ROOT / relative_path).read_text(encoding="utf-8")
        assert "assets/favicon.png" in source
        assert "assets/logo.svg" not in source
