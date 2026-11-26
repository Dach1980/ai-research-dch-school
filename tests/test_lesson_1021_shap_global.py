import ast
import json
import itertools
import math
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class GlobalSHAPTests(unittest.TestCase):
    def test_content(self):
        raw=(ROOT/"lessons/data/xai-10-shap-1021.js").read_text(encoding="utf-8")
        p=json.loads(raw.split("window.DCH_SHAP_1021=",1)[1].split(";\n})();",1)[0])
        self.assertEqual(set(p["content"]),{"ru","en","zh"})
        for d in p["content"].values():
            self.assertEqual(len(d["outcomes"]),9)
            self.assertEqual(len(d["sections"]),9)
            self.assertEqual(len(d["diagrams"]),5)
            self.assertGreaterEqual(len(d["glossary"]),14)
            self.assertEqual(len(d["quiz"]),12)
            self.assertGreaterEqual(len(d["sources"]),8)
            self.assertEqual([q[2] for q in d["quiz"]],[q[2] for q in p["content"]["ru"]["quiz"]])
        code=(ROOT/"lessons/practice/a-10-2-1-shap-global-importance.py").read_text(encoding="utf-8")
        self.assertEqual(code,p["practiceCode"])
        ast.parse(code)
        c=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        x=next(x for x in c["lessons"] if x["uid"]=="les-a-0185")
        self.assertEqual(x["prerequisite_uids"],["les-a-0184"])
        self.assertEqual(x["module_uid"],"mod-a-10-02")
        for route in x["url_i18n"].values():
            self.assertIn('data-lesson-design="v2"',(ROOT/route).read_text(encoding="utf-8"))
    def test_numeric(self):
        a=[2,-2,2,-2];b=[1]*4
        self.assertEqual([5+x+y for x,y in zip(a,b)],[8,4,8,4])
        self.assertEqual([sum(map(abs,a))/4,sum(a)/4,sum(map(abs,b))/4,sum(b)/4],[2,0,1,1])
        self.assertEqual([(3*x+y)/4 for x,y in zip([3,1],[1,2])],[2.5,1.25])
        z=sorted(sum(t)/4 for t in itertools.product(range(4),repeat=4))
        def quantile(p):
            a=p*(len(z)-1);i=math.floor(a)
            return z[i]+(a-i)*(z[min(i+1,len(z)-1)]-z[i])
        self.assertEqual((quantile(.025),quantile(.975)),(.5,2.5))
    def test_global_svg_dispatch_and_canonical_download(self):
        renderer=(ROOT/"scripts/lesson-svg-renderer.js").read_text(encoding="utf-8")
        self.assertEqual(renderer.count("function render(spec)"),1)
        dispatch=renderer.split("function render(spec)",1)[1]
        for kind in ("matrix","bars","cohorts","methods","interval"):
            self.assertIn("shap-global-"+kind,dispatch)
        self.assertIn("return globalSHAP(spec)",dispatch)
        script=(ROOT/"scripts/xai-shap-1021-lesson.js").read_text(encoding="utf-8")
        self.assertIn('labLink.href="practice/a-10-2-1-shap-global-importance.py"',script)
        self.assertNotIn('labLink.href="practice/a-10-1-3-shap-global-explanations.py"',script)
