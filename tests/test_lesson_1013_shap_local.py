import ast
import json
import math
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class Lesson1013Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        raw=(ROOT/"lessons/data/xai-10-shap-1013.js").read_text(encoding="utf-8")
        cls.payload=json.loads(raw.split("window.DCH_SHAP_1013=",1)[1].split(";\n})();",1)[0])
        cls.catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
    def test_identity(self):
        lessons=self.catalog["lessons"]
        matches=[x for x in lessons if x["uid"]=="les-a-0184"]
        self.assertEqual(len(matches),1)
        row=matches[0]
        self.assertEqual(row["code"],"10.1.3")
        self.assertEqual(row["module_uid"],"mod-a-10-01")
        self.assertEqual(row["prerequisite_uids"],["les-a-0183"])
        self.assertIn((row["status"],row["content_state"]),{("review","localized"),("published","published")})
        self.assertEqual(len({x["uid"] for x in lessons}),len(lessons))
        for path in row["url_i18n"].values():
            html=(ROOT/path).read_text(encoding="utf-8")
            self.assertIn('data-lesson-design="v2"',html)
            self.assertIn("scripts/lesson-planet.js",html)
            self.assertIn("scripts/lesson-design-v2.js",html)
            self.assertIn("scripts/lesson-svg-renderer.js",html)
    def test_content_and_parity(self):
        self.assertEqual(set(self.payload["content"]),{"ru","en","zh"})
        keys=["decomposition","waterfall","force","sigmoid","diagnostic"]
        ref=self.payload["content"]["ru"]
        for d in self.payload["content"].values():
            self.assertEqual(len(d["outcomes"]),9)
            self.assertEqual(len(d["sections"]),9)
            self.assertEqual([s[0] for s in d["sections"]],[s[0] for s in ref["sections"]])
            self.assertEqual([s[3] for s in d["sections"] if s[3]],keys)
            self.assertEqual(len(d["glossary"]),16)
            self.assertTrue(all(len(t)==2 and all(t) for t in d["glossary"]))
            self.assertEqual(len(d["quiz"]),12)
            self.assertEqual([q[2] for q in d["quiz"]],[q[2] for q in ref["quiz"]])
            self.assertGreaterEqual(len(d["sources"]),8)
            self.assertEqual(d["sources"],ref["sources"])
            for q,options,answer,explanation in d["quiz"]:
                self.assertEqual(len(options),3)
                self.assertIn(answer,range(3))
                self.assertTrue(q and explanation and all(options))
            for key in ("decomposition","waterfall","force"):
                spec=d["diagrams"][key]
                self.assertEqual([x["value"] for x in spec["features"]],[1.8,.7,-.6,-.2])
                self.assertAlmostEqual(spec["baseline"]+sum(x["value"] for x in spec["features"]),spec["prediction"])
    def test_numeric(self):
        values=[1.8,.7,-.6,-.2]
        total=6
        for phi,target in zip(values,[7.8,8.5,7.9,7.7]):
            total+=phi
            self.assertAlmostEqual(total,target)
        self.assertAlmostEqual(sum(x for x in values if x>0),2.5)
        self.assertAlmostEqual(sum(x for x in values if x<0),-.8)
        sigmoid=lambda z:1/(1+math.exp(-z))
        self.assertAlmostEqual(sigmoid(-.4),.401312339887548,places=12)
        self.assertAlmostEqual(sigmoid(.3),.574442516811659,places=12)
        self.assertAlmostEqual(sigmoid(.3)-sigmoid(-.4),.173130176924111,places=12)
    def test_practice(self):
        source=(ROOT/"lessons/practice/a-10-1-3-shap-local-explanations.py").read_text(encoding="utf-8")
        ast.parse(source)
        self.assertEqual(source,self.payload["practiceCode"])
        for marker in ("TreeExplainer","interventional","all_train","small_train","assert_allclose","shap.plots.waterfall","shap.plots.force"):
            self.assertIn(marker,source)
