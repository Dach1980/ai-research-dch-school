import re
import unicodedata
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "lessons"


def text_width_units(value):
    """Conservative width estimate in em units for SVG labels."""
    width = 0.0
    for char in value:
        if char.isspace():
            width += 0.34
        elif unicodedata.east_asian_width(char) in ("W", "F"):
            width += 1.0
        elif char.isupper():
            width += 0.68
        elif char.isdigit():
            width += 0.58
        elif unicodedata.category(char).startswith("P"):
            width += 0.36
        else:
            width += 0.59
    return width * 1.12


class SvgTextFitTests(unittest.TestCase):
    def test_annotated_svg_labels_fit_inside_their_nodes(self):
        checked = 0
        for page in sorted(LESSONS.glob("*.html")):
            source = page.read_text(encoding="utf-8")
            for svg_index, svg_match in enumerate(re.finditer(r"<svg\b[\s\S]*?</svg>", source)):
                try:
                    root = ET.fromstring(svg_match.group(0))
                except ET.ParseError as exc:
                    self.fail(f"{page.name} SVG {svg_index + 1}: invalid SVG: {exc}")

                boxes = {}
                labels = {}
                for element in root.iter():
                    tag = element.tag.rsplit("}", 1)[-1]
                    box_id = element.attrib.get("data-text-box")
                    label_id = element.attrib.get("data-text-for")
                    if tag == "rect" and box_id:
                        boxes[box_id] = element
                    elif tag == "text" and label_id:
                        labels[label_id] = element

                self.assertEqual(set(boxes), set(labels),
                    f"{page.name} SVG {svg_index + 1}: every text box must have exactly one matching label")
                for label_id, label in labels.items():
                    box = boxes[label_id]
                    box_width = float(box.attrib["width"])
                    font_size = 13.0
                    style = label.attrib.get("style", "")
                    match = re.search(r"font-size\s*:\s*([0-9.]+)px", style)
                    if match:
                        font_size = float(match.group(1))
                    tspans = [child for child in label if child.tag.rsplit("}", 1)[-1] == "tspan"]
                    lines = ["".join(t.itertext()) for t in tspans] if tspans else ["".join(label.itertext())]
                    max_width = max((text_width_units(line) * font_size for line in lines), default=0)
                    available = box_width - 20
                    self.assertLessEqual(max_width, available,
                        f"{page.name} SVG {svg_index + 1}, node {label_id}: estimated line width "
                        f"{max_width:.1f}px exceeds available {available:.1f}px; wrap or shorten the label")
                    self.assertEqual(label.attrib.get("text-anchor"), "middle",
                        f"{page.name} SVG {svg_index + 1}, node {label_id}: centered labels need text-anchor=middle")
                    checked += 1
        self.assertGreater(checked, 0, "No annotated SVG node labels found; annotate labels to enable this gate")


if __name__ == "__main__":
    unittest.main()
