import ast
import json
import math
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class Lesson1012Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        raw = (ROOT / "lessons/data/xai-11-shap-1012.js").read_text(encoding="utf-8")
        cls.payload = json.loads(raw.split("window.DCH_SHAP_1012=",1)[1].split(";\n})();",1)[0])
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
    def test_catalog(self):
        matches = [x for x in self.catalog["lessons"] if x["uid"] == "les-a-0183"]
        self.assertEqual(len(matches), 1)
        row = matches[0]
        self.assertEqual(row["code"], "10.1.2")
        self.assertEqual(row["module_uid"], "mod-a-10-01")
        self.assertEqual(row["prerequisite_uids"], ["les-a-0182"])
        self.assertIn((row["status"],row["content_state"]), {("review","localized"),("published","published")})
        self.assertEqual(len({x["uid"] for x in self.catalog["lessons"]}),len(self.catalog["lessons"]))
        for route in row["url_i18n"].values():
            page=(ROOT / route).read_text(encoding="utf-8")
            self.assertIn("scripts/lesson-svg-renderer.js",page)
            self.assertIn("xai-shap-1012-lesson.js",page)
    def test_content_parity(self):
        self.assertEqual(set(self.payload["content"]), {"ru","en","zh"})
        for data in self.payload["content"].values():
            self.assertEqual(len(data["outcomes"]),9)
            self.assertEqual(len(data["sections"]),9)
            self.assertEqual([s[3] for s in data["sections"] if s[3]],["pipeline","masking","growth","comparison","choice"])
            self.assertEqual(len(data["glossary"]),15)
            self.assertEqual(len(data["quiz"]),10)
            self.assertGreaterEqual(len(data["sources"]),8)
            for q,options,answer,explanation in data["quiz"]:
                self.assertEqual(len(options),3)
                self.assertIn(answer,range(3))
                self.assertTrue(q and explanation)
            for m,coalitions,orders in data["diagrams"]["growth"]["rows"]:
                self.assertEqual(int(coalitions),2**int(m))
                self.assertEqual(int(orders),math.factorial(int(m)))
    def test_math(self):
        kernel=lambda m,k:(m-1)/(math.comb(m,k)*k*(m-k))
        self.assertAlmostEqual(kernel(6,1),1/6)
        self.assertAlmostEqual(kernel(6,3),1/36)
        for v_a,v_r,expected in [(8,6,(2,0)),(8,8,(1,1))]:
            a=((v_a-6)+(8-v_r))/2
            r=((v_r-6)+(8-v_a))/2
            self.assertEqual((a,r),expected)
            self.assertEqual(6+a+r,8)
    def test_practice(self):
        code=(ROOT / "lessons/practice/a-10-1-2-shap-computation.py").read_text(encoding="utf-8")
        ast.parse(code)
        self.assertEqual(code,self.payload["practiceCode"])
        for required in ("TreeExplainer","KernelExplainer","interventional","assert_allclose","l1_reg=0"):
            self.assertIn(required,code)
