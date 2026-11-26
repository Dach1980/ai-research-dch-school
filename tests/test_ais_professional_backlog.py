import json
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

class AISProfessionalBacklogTests(unittest.TestCase):
    def test_persisted_backlog(self):
        data=json.loads((ROOT/"data/ais-reference-checklist.json").read_text(encoding="utf-8"))
        ids=[x["id"] for x in data["checklist"]]
        self.assertEqual(len(ids),len(set(ids)))
        required=["AUDIT-00-01","AUDIT-01-01","AUDIT-01-02","AUDIT-02-01","AUDIT-02-02","AUDIT-02-03","AUDIT-02-04","AUDIT-02-05","AUDIT-02-06","AUDIT-04-01","AUDIT-04-02","AUDIT-04-03","AUDIT-04-04","AUDIT-04-05","AUDIT-04-06","AUDIT-07-01","AUDIT-07-02","AUDIT-07-03","AUDIT-07-04","AUDIT-07-05","AUDIT-07-06","AUDIT-07-07","AUDIT-07-08","AUDIT-PRO-01","AUDIT-PRO-02","AUDIT-PRO-03","AUDIT-SRC-01","AUDIT-SRC-02","AUDIT-UI-01","AUDIT-GOV-01"]
        self.assertTrue(set(required).issubset(ids))
        road=json.loads((ROOT/"data/audit-roadmap.json").read_text(encoding="utf-8"))
        self.assertIn("AUD-AIS-5-MODULES-2026-11-26",{x["id"] for x in road["audit_log"]})
        for path in ("docs/management/AIS_FIVE_MODULES_ACTION_PLAN_2026-11-26.md","docs/prompts/lessons/track-a/10.2.1-shap-global-feature-importance.md","docs/standards/PROFESSIONAL_LESSON_PEDAGOGY_V1.md"):
            self.assertTrue((ROOT/path).is_file(),path)
