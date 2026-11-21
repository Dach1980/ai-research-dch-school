import ast, json, re, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
UID="les-a-0179"
ROUTES={"ru":"lessons/a-9-1-3-les-a-0179.html","en":"lessons/a-9-1-3-les-a-0179-en.html","zh":"lessons/a-9-1-3-les-a-0179-zh.html"}
class Lesson913LIMETests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
  cls.lesson=next((x for x in cls.catalog["lessons"] if x["uid"]==UID),None)
  cls.data=(ROOT/"lessons/data/xai-09-lime-913.js").read_text(encoding="utf-8")
  cls.renderer=(ROOT/"scripts/xai-lime-913-lesson.js").read_text(encoding="utf-8")
  cls.shared=(ROOT/"scripts/lesson-svg-renderer.js").read_text(encoding="utf-8")
  cls.practice=(ROOT/"lessons/practice/a-9-1-3-lime-tabular.py").read_text(encoding="utf-8")
 def test_catalog_sequence_identity_and_review(self):
  self.assertIsNotNone(self.lesson)
  self.assertEqual((self.lesson["code"],self.lesson["status"],self.lesson["content_state"]),("9.1.3","review","localized"))
  ids=[x["uid"] for x in self.catalog["lessons"]]
  self.assertEqual(len(ids),len(set(ids)))
  seq=[x["code"] for x in self.catalog["lessons"] if x["uid"] in {"les-a-0177","les-a-0178","les-a-0179"}]
  self.assertEqual(seq,["9.1.1","9.1.2","9.1.3"])
  self.assertEqual(self.lesson["prerequisite_uids"],["les-a-0178"])
  for locale,path in ROUTES.items():
   self.assertEqual(self.lesson["url_i18n"][locale],path)
   self.assertTrue((ROOT/path).is_file())
 def test_localized_pages_and_canonical_dom_order(self):
  for locale,path in ROUTES.items():
   page=(ROOT/path).read_text(encoding="utf-8")
   self.assertIn('lang="'+("zh-CN" if locale=="zh" else locale)+'"',page)
   blocks=['class="lesson-intro"','id="lesson-outcomes"','id="lesson-sections"','id="lesson-practice"','id="lesson-sources"','id="lesson-navigation"','id="lesson-glossary"','id="lesson-quiz"','class="footer"']
   positions=[page.index(x) for x in blocks]
   self.assertEqual(positions,sorted(positions))
   for script in ("lesson-glossary.js","lesson-svg-renderer.js","xai-09-lime-913.js","xai-lime-913-lesson.js","lesson-layout.js"):self.assertIn(script,page)
 def test_localized_content_parity_and_shared_components(self):
  payload=self.data.split("content:",1)[1].split(",practiceCode:",1)[0]
  content=json.loads(payload)
  for locale in ("ru","en","zh"):
   self.assertEqual(len(content[locale]["outcomes"]),12)
   self.assertEqual(len(content[locale]["sections"]),9)
   self.assertEqual(len(content[locale]["glossary"]),15)
   self.assertEqual(len(content[locale]["quiz"]),12)
   self.assertGreaterEqual(sum(1 for section in content[locale]["sections"] if len(section)>3 and section[3]),3)
  for token in ('"ru"','"en"','"zh"','"outcomes"','"sections"','"glossary"','"quiz"'):
   self.assertIn(token,self.data)
  for heading in ("Словарь терминов","Key terms","术语词典"):self.assertIn(heading,self.renderer)
  self.assertIn("DCHLessonSVG.render",self.renderer)
  self.assertNotIn("createElementNS",self.renderer)
  self.assertIn("DCHLessonComponents.renderGlossary",self.renderer)
  self.assertEqual(self.data.count('"bridge"'),3)
  self.assertEqual(self.data.count('"practice-interpret"'),3)
 def test_each_section_uses_its_own_semantic_diagram(self):
  payload=self.data.split("content:",1)[1].split(",practiceCode:",1)[0]
  content=json.loads(payload)
  expected=["workflow","represent","perturb","blackbox","weights","fit","select","walkthrough","practice"]
  for locale in ("ru","en","zh"):
   self.assertEqual([section[3] for section in content[locale]["sections"]],expected)
  for kind in expected:
   self.assertIn('kind==="'+kind+'"',self.renderer)
  self.assertIn("Unknown LIME lesson diagram type",self.renderer)
  self.assertIn('"weighted-scatter"',self.renderer)
  self.assertIn('"bars"',self.renderer)
  self.assertIn('"table"',self.renderer)
  self.assertIn('spec.sequence&&spec.serpentine',self.shared)
  self.assertIn('data-role":"workflow-arrow"',self.shared)
  self.assertIn('V ${ey}',self.shared)
  self.assertNotIn('annotations:[{',self.renderer)
  self.assertIn("d(x₀, zᵢ)",self.renderer)
  self.assertIn("πₓ₀(zᵢ)",self.renderer)
  self.assertNotIn("Larger marker",self.shared)
  self.assertIn("Marker size is illustrative",self.renderer)
  self.assertIn("renderWeightedScatter(spec)",self.shared)
  self.assertIn("renderBars(spec)",self.shared)
  self.assertIn("renderTable(spec)",self.shared)
  self.assertIn("perturbed-sample",self.shared)
  self.assertIn("perturbation-region",self.shared)
 def test_practice_api_and_python_syntax(self):
  ast.parse(self.practice)
  for token in ("LimeTabularExplainer","classifier_fn=model.predict_proba","num_samples=3000","random_state=SEED","explanation.as_list","explanation.local_pred","explanation.score"):
   self.assertIn(token,self.practice)
  self.assertNotIn("predict_fn=",self.practice)

 def _lesson_content(self):
     payload = self.data.split("content:", 1)[1].split(",practiceCode:", 1)[0]
     return json.loads(payload)

 def test_text_and_diagrams_share_one_explained_customer_scenario(self):
     content = self._lesson_content()
     anchors = {
         "ru": {
             "instance": ("42", "85 000", "возраст > 40", "доход > 72 000", "годовой"),
             "perturb": ("z₁", "z₂", "z₃", "z₄", "синтетические варианты", "sampler"),
             "blackbox": ("f(zᵢ)", "вероятности классов", "истинные метки y", "класс 1"),
             "weights": ("d(x₀,zᵢ)", "wᵢ", "σ", "0,980", "0,546"),
             "fit": ("z′ᵢ", "f(zᵢ)", "wᵢ", "не является дополнительным признаком"),
             "select": ("класс 1", "0,78", "+0,18", "−0,11", "+0,07", "не причинн"),
             "walkthrough": ("0,78", "0,980", "0,546", "0,74", "+0,18", "−0,11", "+0,07", "практическая работа ниже"),
             "practice-interpret": ("exp.local_pred", "exp.score", "exp.as_list"),
         },
         "en": {
             "instance": ("42", "85,000", "age > 40", "income > 72,000", "annual"),
             "perturb": ("z₁", "z₂", "z₃", "z₄", "synthetic variants", "sampler"),
             "blackbox": ("f(zᵢ)", "class probabilities", "ground-truth labels y", "class 1"),
             "weights": ("d(x₀,zᵢ)", "wᵢ", "σ", "0.980", "0.546"),
             "fit": ("z′ᵢ", "f(zᵢ)", "wᵢ", "weight is not another customer feature"),
             "select": ("class 1", "0.78", "+0.18", "−0.11", "+0.07", "causal"),
             "walkthrough": ("0.78", "0.980", "0.546", "0.74", "+0.18", "−0.11", "+0.07", "practical lab below"),
             "practice-interpret": ("exp.local_pred", "exp.score", "exp.as_list"),
         },
         "zh": {
             "instance": ("42", "85,000", "年龄 > 40", "收入 > 72,000", "年度"),
             "perturb": ("z₁", "z₂", "z₃", "z₄", "合成变体", "sampler"),
             "blackbox": ("f(zᵢ)", "类别概率", "真实标签 y", "类别 1"),
             "weights": ("d(x₀,zᵢ)", "wᵢ", "σ", "0.980", "0.546"),
             "fit": ("z′ᵢ", "f(zᵢ)", "wᵢ", "权重不是客户的另一项特征"),
             "select": ("类别 1", "0.78", "+0.18", "−0.11", "+0.07", "因果"),
             "walkthrough": ("0.78", "0.980", "0.546", "0.74", "+0.18", "−0.11", "+0.07", "实践任务"),
             "practice-interpret": ("Breast Cancer Wisconsin", "exp.local_pred", "exp.score", "exp.as_list"),
         },
     }
     for locale, sections in content.items():
         by_id = {section[0]: section for section in sections["sections"]}
         for section_id, required in anchors[locale].items():
             text = " ".join(by_id[section_id][2]).lower()
             for token in required:
                 with self.subTest(locale=locale, section=section_id, token=token):
                     self.assertIn(token.lower(), text)

 def test_section_seven_explains_every_feature_coefficient_before_figure(self):
     content = self._lesson_content()
     expected = {
         "ru": ("банк", "класс 1", "надёжный клиент", "0,78", "стаж", "высок", "договор", "+0,18", "−0,11", "+0,07", "не процентные пункты", "причин"),
         "en": ("bank", "class 1", "reliable customer", "0.78", "tenure", "debt", "contract", "+0.18", "−0.11", "+0.07", "percentage-point", "causal"),
         "zh": ("银行", "类别 1", "可靠客户", "0.78", "工作年限", "债务", "合同", "+0.18", "−0.11", "+0.07", "百分点", "因果"),
     }
     for locale, tokens in expected.items():
         section = content[locale]["sections"][6]
         narrative = " ".join(section[2]).lower()
         for token in tokens:
             with self.subTest(locale=locale, token=token):
                 self.assertIn(token.lower(), narrative)
         self.assertEqual(section[3], "select")

 def test_hypothetical_customer_example_is_separate_from_runtime_lab(self):
     content = self._lesson_content()
     for locale in ("ru", "en", "zh"):
         with self.subTest(locale=locale):
             walkthrough = " ".join(content[locale]["sections"][7][2]).lower()
             practice = " ".join(content[locale]["sections"][8][2]).lower()
             self.assertIn("0,78" if locale == "ru" else "0.78", walkthrough)
             self.assertIn("0,74" if locale == "ru" else "0.74", walkthrough)
             self.assertIn("illustrative" if locale == "en" else ("условн" if locale == "ru" else "示意"), walkthrough)
             self.assertTrue(any(x in walkthrough for x in ("другой набор данных", "different dataset", "另一数据集")))
             self.assertIn("breast cancer wisconsin", content[locale]["practice"]["intro"].lower())

 def test_diagram_labels_are_explained_and_no_placeholder_labels_remain(self):
     for forbidden in ("Признак 1 (схема)", "Признак 2 (схема)", "Feature 1 (schematic)", "Feature 2 (schematic)"):
         self.assertNotIn(forbidden, self.renderer)
     self.assertIn("0,18", self.data)
     self.assertIn("0,11", self.data)
     self.assertIn("0,07", self.data)
     self.assertIn("selected-class", self.renderer.lower())
     self.assertIn("Условные учебные значения", self.renderer)
     self.assertIn("Hypothetical teaching values", self.renderer)
     self.assertIn("虚构教学数值", self.renderer)

 def test_grid_diagrams_have_no_automatic_connectors_by_default(self):
     self.assertIn('if(spec.layout==="grid"&&spec.connectSequence===true)', self.shared)
     self.assertIn("connectSequence:false", self.renderer)
     self.assertIn('data-role":"workflow-arrow"', self.shared)


 def test_customer_tables_use_explicit_feature_columns(self):
     self.assertIn('columns:en?["Feature","Original x₀","Interpretable x′"]', self.renderer)
     self.assertIn('columns:en?["Instance","Age","Annual income","Contract"]', self.renderer)
     self.assertIn('["Объект","Возраст","Годовой доход","Договор"]', self.renderer)
     self.assertIn("const count=Math.max(1,columns.length)", self.shared)
     self.assertIn("row.forEach((value,j)", self.shared)
     self.assertNotIn('Age | income | contract', self.renderer)
     self.assertNotIn('Возраст | доход | договор', self.renderer)

if __name__=="__main__":unittest.main()
