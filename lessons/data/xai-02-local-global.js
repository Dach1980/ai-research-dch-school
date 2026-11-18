/* DCH School — complete multilingual lesson 7.1.2. Russian is the canonical editorial version. */
window.DCH_LOCAL_GLOBAL_LESSON = {
  id: "xai-local-global-712",
  code: "7.1.2",
  uid: "les-a-0169",
  duration: {ru:"45–60 минут · теория, примеры и практическая лаборатория",en:"45–60 minutes · theory, worked examples and practical lab",zh:"45–60 分钟 · 理论、案例与实践实验"},
  title: {
    ru:"Локальные и глобальные объяснения",
    en:"Local and Global Explanations",
    zh:"局部解释与全局解释"
  },
  lead: {
    ru:"Научимся выбирать масштаб объяснения под исследовательский вопрос: разбирать отдельный прогноз, описывать поведение модели на выборке и не смешивать эти два уровня.",
    en:"Learn to match explanation scope to a research question: inspect one prediction, describe model behaviour across a dataset, and avoid confusing these two levels.",
    zh:"学习根据研究问题选择解释范围：分析单个预测、描述模型在数据集上的整体行为，并避免混淆这两个层次。"
  },
  outcomes: {
    ru:[
      "Различать локальный, групповой и глобальный уровни объяснения и формулировать вопрос для каждого уровня.",
      "Объяснять, что именно показывают локальные атрибуции, permutation importance, PDP и ICE.",
      "Интерпретировать знак, величину и контекст вклада признака, не превращая ассоциацию в причинный вывод.",
      "Понимать, почему усреднение локальных объяснений может скрывать неоднородность и взаимодействия.",
      "Воспроизводить анализ одной модели на обучающей и тестовой выборках с помощью Python и scikit-learn."
    ],
    en:[
      "Distinguish local, subgroup and global explanation scopes and formulate a question for each.",
      "Explain what local attributions, permutation importance, PDP and ICE actually show.",
      "Interpret the sign, magnitude and context of a feature contribution without turning association into causation.",
      "Understand why averaging local explanations can hide heterogeneity and interactions.",
      "Reproduce an analysis of one model on training and test data with Python and scikit-learn."
    ],
    zh:[
      "区分局部、群体和全局解释，并为每个层次提出恰当的问题。",
      "说明局部归因、置换重要性、PDP 和 ICE 实际展示的内容。",
      "解释特征贡献的方向、大小与上下文，而不把关联误认为因果关系。",
      "理解为什么对局部解释求平均可能掩盖异质性和特征交互。",
      "使用 Python 和 scikit-learn 在训练集与测试集上复现同一模型的分析。"
    ]
  },
  pages: [
    {
      id:"scope",
      title:{ru:"1. Масштаб объяснения начинается с вопроса",en:"1. Explanation scope starts with the question",zh:"1. 解释范围始于研究问题"},
      content:{
        ru:`<p>Представим модель, которая оценивает риск просрочки платежа. Для клиента A модель выдала высокий риск. Аналитику нужно ответить: <em>почему именно этому клиенту присвоен такой балл?</em> Руководителю риск-функции нужен другой ответ: <em>на какие закономерности модель в целом опирается на текущем портфеле?</em> Это связанные, но разные задачи.</p>
        <p><strong>Локальное объяснение (local explanation)</strong> описывает поведение модели в отношении конкретного объекта или отдельного прогноза. <strong>Глобальное объяснение (global explanation)</strong> характеризует поведение модели на выбранной совокупности объектов, в заданной области входов или в целом в рамках определённой задачи.</p>
        <p>Между ними полезно выделять <strong>групповой уровень (subgroup explanation)</strong>: анализ сегмента — например, новых клиентов, определённого региона или диапазона значений признака. Он помогает обнаружить неоднородность, которую среднее по всей выборке скрывает.</p>
        <figure class="xai-visual xai-svg-figure"><figcaption>Три масштаба одного анализа</figcaption><svg class="xai-svg" viewBox="0 0 720 300" role="img" aria-label="Локальный уровень — один объект; групповой — сегмент объектов; глобальный — вся выбранная совокупность"><rect x="12" y="20" width="214" height="248" rx="18" fill="var(--diagram-box)" stroke="var(--diagram-box-stroke)" stroke-width="2"/><rect x="253" y="20" width="214" height="248" rx="18" fill="var(--diagram-box2)" stroke="var(--diagram-box2-stroke)" stroke-width="2"/><rect x="494" y="20" width="214" height="248" rx="18" fill="var(--diagram-box3)" stroke="var(--diagram-box3-stroke)" stroke-width="2"/><g fill="var(--diagram-title)" font-size="19" font-weight="700" text-anchor="middle"><text x="119" y="54">LOCAL</text><text x="360" y="54">SUBGROUP</text><text x="601" y="54">GLOBAL</text></g><g fill="var(--diagram-muted)" font-size="14" text-anchor="middle"><text x="119" y="84">Один объект</text><text x="360" y="84">Сегмент объектов</text><text x="601" y="84">Выбранная совокупность</text></g><circle cx="119" cy="151" r="23" fill="#4d8de0"/><g fill="#8ab5ef"><circle cx="307" cy="137" r="12"/><circle cx="343" cy="137" r="12"/><circle cx="379" cy="137" r="12"/><circle cx="325" cy="174" r="12"/><circle cx="361" cy="174" r="12"/><circle cx="397" cy="174" r="12"/></g><g fill="#7bbf9b"><circle cx="543" cy="130" r="9"/><circle cx="571" cy="130" r="9"/><circle cx="599" cy="130" r="9"/><circle cx="627" cy="130" r="9"/><circle cx="655" cy="130" r="9"/><circle cx="557" cy="160" r="9"/><circle cx="585" cy="160" r="9"/><circle cx="613" cy="160" r="9"/><circle cx="641" cy="160" r="9"/><circle cx="543" cy="190" r="9"/><circle cx="571" cy="190" r="9"/><circle cx="599" cy="190" r="9"/><circle cx="627" cy="190" r="9"/><circle cx="655" cy="190" r="9"/></g><g fill="var(--diagram-title)" font-size="13" text-anchor="middle"><text x="119" y="226">«Почему этот прогноз?»</text><text x="360" y="226">«Для кого модель ведёт</text><text x="360" y="244">себя иначе?»</text><text x="601" y="226">«Как модель ведёт</text><text x="601" y="244">себя в целом?»</text></g></svg></figure>
        <p>Масштаб — не декоративная настройка визуализации. Он определяет единицу анализа, допустимые выводы, выбор данных и метод. Локальный метод может быть рассчитан для одной строки, но глобальный вывод требует изучить распределение результатов по репрезентативной выборке. И наоборот: глобальная сводка не отвечает автоматически на вопрос о конкретном человеке.</p>
        <div class="lesson-callout"><strong>Правило:</strong> сначала сформулируйте, чьё поведение и на каком наборе случаев вы хотите понять; затем выбирайте метод и только после этого — визуализацию.</div>
        <h3>Три формулировки исследовательского вопроса</h3>
        <ul><li><strong>Локальный:</strong> какие входные признаки связаны с прогнозом модели для объекта (x_i), и в каком направлении?</li><li><strong>Групповой:</strong> отличаются ли объяснения для новых и постоянных клиентов?</li><li><strong>Глобальный:</strong> какие признаки в среднем сильнее связаны с изменением качества или прогнозов модели на тестовой выборке?</li></ul>`,
        en:`<p>Imagine a model that estimates payment-default risk. It assigns a high score to customer A. An analyst asks: <em>why did this particular customer receive this score?</em> A risk manager asks a different question: <em>which patterns does the model rely on across the current portfolio?</em> These questions are related, but they are not interchangeable.</p>
        <p>A <strong>local explanation</strong> describes model behaviour for one instance or prediction. A <strong>global explanation</strong> characterises model behaviour over a selected population, an input region, or the model as a whole within a defined task.</p>
        <p>Between them, a useful <strong>subgroup explanation</strong> studies a segment — for example, new customers, one region, or a range of a feature. It can reveal heterogeneity hidden by a dataset-wide average.</p>
        <figure class="xai-visual xai-svg-figure"><figcaption>Three scopes of one analysis</figcaption><svg class="xai-svg" viewBox="0 0 720 300" role="img" aria-label="Local: one instance; subgroup: a segment; global: the selected population"><rect x="12" y="20" width="214" height="248" rx="18" fill="var(--diagram-box)" stroke="var(--diagram-box-stroke)" stroke-width="2"/><rect x="253" y="20" width="214" height="248" rx="18" fill="var(--diagram-box2)" stroke="var(--diagram-box2-stroke)" stroke-width="2"/><rect x="494" y="20" width="214" height="248" rx="18" fill="var(--diagram-box3)" stroke="var(--diagram-box3-stroke)" stroke-width="2"/><g fill="var(--diagram-title)" font-size="19" font-weight="700" text-anchor="middle"><text x="119" y="54">LOCAL</text><text x="360" y="54">SUBGROUP</text><text x="601" y="54">GLOBAL</text></g><g fill="var(--diagram-muted)" font-size="14" text-anchor="middle"><text x="119" y="84">One instance</text><text x="360" y="84">A segment</text><text x="601" y="84">Selected population</text></g><circle cx="119" cy="151" r="23" fill="#4d8de0"/><g fill="#8ab5ef"><circle cx="307" cy="137" r="12"/><circle cx="343" cy="137" r="12"/><circle cx="379" cy="137" r="12"/><circle cx="325" cy="174" r="12"/><circle cx="361" cy="174" r="12"/><circle cx="397" cy="174" r="12"/></g><g fill="#7bbf9b"><circle cx="543" cy="130" r="9"/><circle cx="571" cy="130" r="9"/><circle cx="599" cy="130" r="9"/><circle cx="627" cy="130" r="9"/><circle cx="655" cy="130" r="9"/><circle cx="557" cy="160" r="9"/><circle cx="585" cy="160" r="9"/><circle cx="613" cy="160" r="9"/><circle cx="641" cy="160" r="9"/><circle cx="543" cy="190" r="9"/><circle cx="571" cy="190" r="9"/><circle cx="599" cy="190" r="9"/><circle cx="627" cy="190" r="9"/><circle cx="655" cy="190" r="9"/></g><g fill="var(--diagram-title)" font-size="13" text-anchor="middle"><text x="119" y="226">“Why this prediction?”</text><text x="360" y="226">“Where does behaviour</text><text x="360" y="244">differ?”</text><text x="601" y="226">“How does the model</text><text x="601" y="244">behave overall?”</text></g></svg></figure>
        <p>Scope is not a cosmetic chart setting. It determines the unit of analysis, permissible conclusions, data selection and method. A local method may be computed for one row, but a global conclusion requires studying a representative distribution of cases. Conversely, a global summary does not automatically answer a question about one person.</p>
        <div class="lesson-callout"><strong>Rule:</strong> first specify whose behaviour you want to understand and over which cases; then choose the method, and only then the visualisation.</div>
        <h3>Three research questions</h3><ul><li><strong>Local:</strong> which input features are associated with the model output for instance (x_i), and in what direction?</li><li><strong>Subgroup:</strong> do explanations differ for new and returning customers?</li><li><strong>Global:</strong> which features are most strongly associated with changes in model performance or predictions on the test set?</li></ul>`,
        zh:`<p>设想一个模型用于估计逾期付款风险。模型给客户 A 赋予了较高的风险分数。分析人员会问：<em>为什么这个客户得到这样的分数？</em> 风险管理人员则会问：<em>模型在整个客户组合中主要依赖哪些模式？</em> 这两个问题相关，但不能互相替代。</p>
        <p><strong>局部解释（local explanation）</strong>描述模型对某个样本或某次预测的行为。<strong>全局解释（global explanation）</strong>描述模型在选定样本群体、输入空间某一区域或特定任务中的整体行为。</p>
        <p>两者之间还可以研究<strong>子群体解释（subgroup explanation）</strong>，例如新客户、某个地区或某个特征取值范围。它有助于发现被全体平均值掩盖的异质性。</p>
        <figure class="xai-visual xai-svg-figure"><figcaption>同一分析的三个范围</figcaption><svg class="xai-svg" viewBox="0 0 720 300" role="img" aria-label="局部：单个样本；子群体：一组样本；全局：选定总体"><rect x="12" y="20" width="214" height="248" rx="18" fill="var(--diagram-box)" stroke="var(--diagram-box-stroke)" stroke-width="2"/><rect x="253" y="20" width="214" height="248" rx="18" fill="var(--diagram-box2)" stroke="var(--diagram-box2-stroke)" stroke-width="2"/><rect x="494" y="20" width="214" height="248" rx="18" fill="var(--diagram-box3)" stroke="var(--diagram-box3-stroke)" stroke-width="2"/><g fill="var(--diagram-title)" font-size="19" font-weight="700" text-anchor="middle"><text x="119" y="54">LOCAL</text><text x="360" y="54">SUBGROUP</text><text x="601" y="54">GLOBAL</text></g><g fill="var(--diagram-muted)" font-size="14" text-anchor="middle"><text x="119" y="84">单个样本</text><text x="360" y="84">样本子集</text><text x="601" y="84">选定总体</text></g><circle cx="119" cy="151" r="23" fill="#4d8de0"/><g fill="#8ab5ef"><circle cx="307" cy="137" r="12"/><circle cx="343" cy="137" r="12"/><circle cx="379" cy="137" r="12"/><circle cx="325" cy="174" r="12"/><circle cx="361" cy="174" r="12"/><circle cx="397" cy="174" r="12"/></g><g fill="#7bbf9b"><circle cx="543" cy="130" r="9"/><circle cx="571" cy="130" r="9"/><circle cx="599" cy="130" r="9"/><circle cx="627" cy="130" r="9"/><circle cx="655" cy="130" r="9"/><circle cx="557" cy="160" r="9"/><circle cx="585" cy="160" r="9"/><circle cx="613" cy="160" r="9"/><circle cx="641" cy="160" r="9"/><circle cx="543" cy="190" r="9"/><circle cx="571" cy="190" r="9"/><circle cx="599" cy="190" r="9"/><circle cx="627" cy="190" r="9"/><circle cx="655" cy="190" r="9"/></g><g fill="var(--diagram-title)" font-size="13" text-anchor="middle"><text x="119" y="226">“为什么是这个预测？”</text><text x="360" y="226">“哪些群体行为</text><text x="360" y="244">有所不同？”</text><text x="601" y="226">“模型整体如何</text><text x="601" y="244">运行？”</text></g></svg></figure>
        <p>解释范围不是图表的装饰选项。它决定分析单位、可得出的结论、数据选择和方法。局部方法可以针对一行数据计算，但全局结论必须考察具有代表性的案例分布。反过来，全局汇总也不能自动回答某个具体个体的问题。</p>
        <div class="lesson-callout"><strong>原则：</strong>先明确要理解谁的行为、覆盖哪些案例，再选择方法，最后才选择可视化方式。</div>
        <h3>三个研究问题</h3><ul><li><strong>局部：</strong>对于样本 (x_i)，哪些输入特征与模型输出相关，方向如何？</li><li><strong>子群体：</strong>新客户与老客户的解释是否不同？</li><li><strong>全局：</strong>在测试集上，哪些特征与模型性能或预测变化的关联最强？</li></ul>`
      }
    },
    {
      id:"local",
      title:{ru:"2. Локальные объяснения: почему получен этот прогноз",en:"2. Local explanations: why this prediction?",zh:"2. 局部解释：为什么得到这个预测？"},
      content:{
        ru:`<p>Локальное объяснение относится к конкретному объекту (x_i) и выходу модели (f(x_i)). В атрибуционных методах результат часто представляют как набор вкладов признаков относительно некоторой базовой точки или ожидаемого выхода:</p>
        <div class="formula"><span class="formula-expression">f(x_i) ≈ φ_0 + Σ_j φ_j(x_i)</span><span class="muted">Схематическая аддитивная запись; конкретные гарантии зависят от метода</span></div>
        <p>(φ_0) — базовое значение, а (φ_j(x_i)) — приписанный методу вклад признака (j) для данного объекта. Положительный и отрицательный знаки интерпретируются относительно выбранной шкалы выхода и baseline. Для классификатора это могут быть логиты, вероятность или другая величина — нельзя менять шкалу в середине объяснения.</p>
        <h3>Пример</h3><p>Модель оценивает риск просрочки и для заявки A выдаёт 0,72. Условное локальное разложение на шкале риска может выглядеть так: baseline 0,30; высокая долговая нагрузка добавляет +0,25; недавние просрочки +0,22; длительная занятость уменьшает оценку на −0,05. Сумма даёт 0,72. Это учебная иллюстрация принципа атрибуции, а не результат конкретного алгоритма.</p>
        <p>Локальное объяснение полезно для разбора отдельного решения, поиска необычного поведения, проверки гипотезы о конкретном случае и подготовки предметного обсуждения с экспертом. Оно не описывает автоматически соседние объекты: два похожих клиента могут иметь разные объяснения из-за нелинейности, взаимодействий или разных локальных областей модели.</p>
        <h3>Методы и способы получить локальный ответ</h3><ul><li><strong>SHAP для объекта:</strong> распределяет разницу между прогнозом и baseline по признакам согласно значениям Шепли при заданной постановке игры и способе моделирования отсутствующих признаков.</li><li><strong>LIME:</strong> строит локальную аппроксимацию поведения сложной модели в окрестности выбранного объекта. Качество зависит от определения окрестности и возмущений.</li><li><strong>Контрфактическое объяснение:</strong> ищет изменение входа, при котором прогноз меняется заданным образом. Оно отвечает на вопрос «что должно измениться?», а не «что было причиной?».</li><li><strong>Локальная чувствительность:</strong> измеряет реакцию выхода на контролируемое изменение признака. Это анализ чувствительности, а не обязательно аддитивная атрибуция.</li></ul>
        <div class="lesson-callout"><strong>Осторожно:</strong> знак «+» в локальном объяснении означает вклад в выбранный выход относительно baseline, а не моральную оценку признака и не причинное воздействие на результат в реальном мире.</div>`,
        en:`<p>A local explanation refers to a particular instance (x_i) and model output (f(x_i)). Attribution methods often represent the result as feature contributions relative to a baseline or expected output:</p>
        <div class="formula"><span class="formula-expression">f(x_i) ≈ φ_0 + Σ_j φ_j(x_i)</span><span class="muted">A schematic additive form; guarantees depend on the method</span></div>
        <p>(φ_0) is the baseline and (φ_j(x_i)) is the method-assigned contribution of feature (j) for this instance. Signs are interpreted relative to the chosen output scale and baseline. A classifier may be explained in logits, probabilities or another quantity; do not silently switch scales.</p>
        <h3>Worked example</h3><p>A default-risk model returns 0.72 for application A. A hypothetical local decomposition on the risk scale is: baseline 0.30; high debt burden +0.25; recent missed payments +0.22; long employment duration −0.05. The sum is 0.72. This illustrates an attribution idea; it is not the output of a named algorithm.</p>
        <p>Local explanations help review one decision, investigate unusual behaviour, test a case-specific hypothesis and support discussion with a domain expert. They do not automatically describe nearby instances: two similar customers may receive different explanations because of non-linearity, interactions or different local regions of the model.</p>
        <h3>Methods for local questions</h3><ul><li><strong>SHAP for one instance:</strong> allocates the difference between a prediction and a baseline among features using Shapley values under a specified game and missing-feature treatment.</li><li><strong>LIME:</strong> fits a local approximation of a complex model around the selected instance. Its quality depends on the neighbourhood and perturbation design.</li><li><strong>Counterfactual explanation:</strong> searches for an input change that alters the prediction in a specified way. It asks “what would need to change?”, not “what caused the outcome?”.</li><li><strong>Local sensitivity:</strong> measures output response to a controlled feature change. It is sensitivity analysis, not necessarily additive attribution.</li></ul>
        <div class="lesson-callout"><strong>Caution:</strong> a “+” contribution means an effect on the selected model output relative to a baseline; it is not a moral judgement about the feature or a causal effect in the real world.</div>`,
        zh:`<p>局部解释针对特定样本 (x_i) 及模型输出 (f(x_i))。归因方法通常将结果表示为相对于基准点或期望输出的特征贡献：</p>
        <div class="formula"><span class="formula-expression">f(x_i) ≈ φ_0 + Σ_j φ_j(x_i)</span><span class="muted">示意性的加法形式；具体保证取决于所用方法</span></div>
        <p>(φ_0) 是基准值，(φ_j(x_i)) 是方法为该样本中特征 (j) 分配的贡献。正负方向必须结合所选输出尺度和基准值解释。分类器可以在 logit、概率或其他尺度上解释，不能在分析中悄悄切换尺度。</p>
        <h3>案例示范</h3><p>某逾期风险模型对申请 A 输出 0.72。假设在风险尺度上进行局部加法分解：基准值 0.30；较高负债率贡献 +0.25；近期逾期记录 +0.22；较长就业年限贡献 −0.05。总和为 0.72。这只是归因原理示例，并非某个具体算法的计算结果。</p>
        <p>局部解释适合审查单次决策、调查异常行为、检验个案假设以及支持专家讨论。但它不会自动描述相邻样本：两个相似客户也可能因模型非线性、特征交互或处于不同局部区域而得到不同解释。</p>
        <h3>回答局部问题的方法</h3><ul><li><strong>单样本 SHAP：</strong>在指定的博弈定义和缺失特征处理方式下，使用 Shapley 值将预测与基准值之差分配给各特征。</li><li><strong>LIME：</strong>在选定样本附近拟合复杂模型的局部近似模型。效果取决于邻域定义和扰动设计。</li><li><strong>反事实解释：</strong>寻找能够按指定方向改变预测的输入变化。它回答“需要改变什么？”，而不是“现实结果由什么造成？”。</li><li><strong>局部敏感性：</strong>衡量对某个特征进行受控修改时模型输出的响应。它属于敏感性分析，不一定是加法归因。</li></ul>
        <div class="lesson-callout"><strong>注意：</strong>局部解释中的“+”表示相对于基准值对所选模型输出的贡献，并不代表对特征的道德评价，也不代表现实世界中的因果效应。</div>`
      }
    },
    {
      id:"global",
      title:{ru:"3. Глобальные объяснения: как модель ведёт себя в целом",en:"3. Global explanations: how the model behaves overall",zh:"3. 全局解释：模型整体如何运行"},
      content:{
        ru:`<p>Глобальное объяснение описывает поведение модели на множестве объектов, а не на одной строке. Но «глобальность» всегда относительна: глобально <em>для какой популяции, периода, распределения и области входов?</em> Отчёт по тестовой выборке не доказывает, что модель ведёт себя так же на другом рынке или после сдвига данных.</p>
        <h3>Permutation Feature Importance</h3><p>Permutation importance оценивает, насколько ухудшается выбранная метрика, если значения одного признака перемешать между объектами. Если после перемешивания качество заметно падает, модель использовала информацию этого признака для достижения качества на данной выборке.</p>
        <div class="formula"><span class="formula-expression">I_j = S(f, X, y) - S(f, π_j(X), y)</span><span class="muted">S — выбранная метрика; π_j — перестановка значений признака j</span></div>
        <p>Важно: это измерение зависимости качества модели от признака в конкретной оценочной процедуре. Оно не является вкладом признака в отдельный прогноз, не доказывает причинность и может делить важность между коррелирующими признаками.</p>
        <h3>Partial Dependence Plot (PDP)</h3><p>PDP показывает средний прогноз модели при фиксации интересующего признака на разных значениях и усреднении по остальным признакам из выбранной выборки:</p>
        <div class="formula"><span class="formula-expression">PD_j(z) = E_{X_{-j}}[f(z, X_{-j})]</span><span class="muted">Усреднение прогноза при заданном значении признака j</span></div>
        <p>Кривая помогает увидеть общую форму зависимости, но усреднение скрывает различия между объектами. При сильной корреляции признаков PDP может создавать комбинации, редко встречающиеся или невозможные в реальных данных.</p>
        <h3>ICE — Individual Conditional Expectation</h3><p>ICE строит отдельную зависимость для каждого объекта: меняется один признак, остальные значения объекта удерживаются фиксированными. Множество ICE-кривых показывает, одинаково ли реагируют разные объекты. PDP можно понимать как среднюю кривую по этим индивидуальным траекториям при согласованном наборе точек.</p>
        <figure class="xai-visual xai-svg-figure"><figcaption>Одна средняя кривая может скрывать разные индивидуальные реакции</figcaption><svg class="xai-svg" viewBox="0 0 680 330" role="img" aria-label="Иллюстрация: несколько ICE-кривых расходятся, а PDP показывает усреднённую линию"><path d="M65 30 V270 H635" fill="none" stroke="var(--diagram-border)" stroke-width="2"/><path d="M65 220 C180 205 260 160 360 125 S520 70 620 55" fill="none" stroke="#4d8de0" stroke-width="4"/><path d="M65 230 C180 210 280 180 370 150 S520 125 620 110" fill="none" stroke="#7bbf9b" stroke-width="2.5" opacity=".9"/><path d="M65 190 C180 185 260 145 360 120 S520 90 620 75" fill="none" stroke="#d69a48" stroke-width="2.5" opacity=".9"/><path d="M65 245 C180 230 270 205 370 195 S520 185 620 180" fill="none" stroke="#a58ad7" stroke-width="2.5" opacity=".9"/><path d="M65 210 C180 200 270 170 365 145 S520 115 620 100" fill="none" stroke="#4d8de0" stroke-width="4" stroke-dasharray="7 6"/><g fill="var(--diagram-muted)" font-size="13"><text x="70" y="22">Прогноз</text><text x="570" y="300">Значение признака →</text><text x="78" y="290">ICE: отдельные траектории</text><text x="430" y="45">PDP: среднее</text></g></svg></figure>
        <p>Если ICE-кривые расходятся, пересекаются или имеют разные наклоны, средняя PDP-кривая может не описывать ни одного типичного объекта. Полезно показывать не только среднюю линию, но и разброс, сегменты и плотность данных вдоль оси признака.</p>
        <h3>Глобальная агрегация локальных атрибуций</h3><p>Например, среднее абсолютное значение SHAP по выборке часто используют как сводку силы атрибуций. Оно отвечает на вопрос «насколько велики вклады в среднем», но теряет знак. Если усреднять подписанные вклады, большие положительные и отрицательные значения могут взаимно компенсироваться. Поэтому важно указывать, что именно агрегируется.</p>`,
        en:`<p>A global explanation describes model behaviour across many instances, not one row. Yet “global” is always relative: global <em>for which population, period, distribution and input region?</em> A report on a test set does not prove the model behaves the same in another market or after data drift.</p>
        <h3>Permutation Feature Importance</h3><p>Permutation importance measures how much a selected metric deteriorates when values of one feature are shuffled across instances. If performance drops substantially, the model relied on information in that feature to achieve its score on this evaluation set.</p>
        <div class="formula"><span class="formula-expression">I_j = S(f, X, y) - S(f, π_j(X), y)</span><span class="muted">S is the chosen score; π_j permutes feature j</span></div>
        <p>This measures the model's performance dependence on a feature under a specific evaluation procedure. It is not a contribution to one prediction, does not establish causality, and may divide importance among correlated features.</p>
        <h3>Partial Dependence Plot (PDP)</h3><p>A PDP shows the model's average prediction when the feature of interest is fixed at several values and predictions are averaged over the remaining features in the selected data:</p>
        <div class="formula"><span class="formula-expression">PD_j(z) = E_{X_{-j}}[f(z, X_{-j})]</span><span class="muted">Average prediction at a specified value of feature j</span></div>
        <p>The curve reveals an overall shape, but averaging hides instance-level differences. With strongly correlated features, PDP may evaluate combinations rarely observed or impossible in real data.</p>
        <h3>ICE — Individual Conditional Expectation</h3><p>ICE draws a separate curve for each instance: one feature changes while the instance's other values stay fixed. A collection of ICE curves shows whether instances respond similarly. With a consistent grid, PDP can be viewed as the average of these individual trajectories.</p>
        <figure class="xai-visual xai-svg-figure"><figcaption>One average curve can hide different individual responses</figcaption><svg class="xai-svg" viewBox="0 0 680 330" role="img" aria-label="Several ICE curves diverge while PDP shows their average"><path d="M65 30 V270 H635" fill="none" stroke="var(--diagram-border)" stroke-width="2"/><path d="M65 220 C180 205 260 160 360 125 S520 70 620 55" fill="none" stroke="#4d8de0" stroke-width="4"/><path d="M65 230 C180 210 280 180 370 150 S520 125 620 110" fill="none" stroke="#7bbf9b" stroke-width="2.5"/><path d="M65 190 C180 185 260 145 360 120 S520 90 620 75" fill="none" stroke="#d69a48" stroke-width="2.5"/><path d="M65 245 C180 230 270 205 370 195 S520 185 620 180" fill="none" stroke="#a58ad7" stroke-width="2.5"/><path d="M65 210 C180 200 270 170 365 145 S520 115 620 100" fill="none" stroke="#4d8de0" stroke-width="4" stroke-dasharray="7 6"/><g fill="var(--diagram-muted)" font-size="13"><text x="70" y="22">Prediction</text><text x="570" y="300">Feature value →</text><text x="78" y="290">ICE: individual paths</text><text x="430" y="45">PDP: average</text></g></svg></figure>
        <p>When ICE curves diverge, cross or have different slopes, the average PDP curve may describe no typical instance. Consider showing spread, subgroups and the data density along the feature axis, not only the mean line.</p>
        <h3>Aggregating local attributions globally</h3><p>For example, mean absolute SHAP values across a dataset are often used to summarise attribution magnitude. This answers “how large are contributions on average?” but discards sign. Averaging signed contributions can cancel large positive and negative values. Always state what is being aggregated.</p>`,
        zh:`<p>全局解释描述模型在大量样本上的行为，而不是单独一行数据。但“全局”始终有适用范围：是针对<em>哪个群体、时期、数据分布和输入区域</em>而言？在测试集上的报告不能证明模型在另一个市场或数据漂移之后仍然如此。</p>
        <h3>Permutation Feature Importance（置换特征重要性）</h3><p>置换重要性衡量：将某个特征的值在样本之间打乱后，指定指标下降多少。如果性能明显下降，说明模型在该评估数据上利用了该特征的信息。</p>
        <div class="formula"><span class="formula-expression">I_j = S(f, X, y) - S(f, π_j(X), y)</span><span class="muted">S 为所选指标；π_j 表示打乱特征 j 的值</span></div>
        <p>它衡量的是在特定评估流程下模型对某个特征的性能依赖，不是单次预测的贡献，也不能证明因果关系；相关特征之间还可能分摊重要性。</p>
        <h3>Partial Dependence Plot（PDP，部分依赖图）</h3><p>PDP 将关注的特征固定为不同取值，并对选定数据中其余特征进行平均，从而展示模型的平均预测：</p>
        <div class="formula"><span class="formula-expression">PD_j(z) = E_{X_{-j}}[f(z, X_{-j})]</span><span class="muted">特征 j 取指定值时的平均预测</span></div>
        <p>曲线可以揭示整体关系形状，但平均会隐藏样本之间的差异。特征高度相关时，PDP 可能评估现实数据中很少出现甚至不可能出现的组合。</p>
        <h3>ICE — Individual Conditional Expectation（个体条件期望）</h3><p>ICE 为每个样本绘制一条曲线：改变一个特征，同时保持该样本其他特征不变。多条 ICE 曲线可以显示不同样本的响应是否一致。在网格一致时，PDP 可以理解为这些个体轨迹的平均值。</p>
        <figure class="xai-visual xai-svg-figure"><figcaption>一条平均曲线可能掩盖不同的个体响应</figcaption><svg class="xai-svg" viewBox="0 0 680 330" role="img" aria-label="多条 ICE 曲线分散，而 PDP 显示其平均值"><path d="M65 30 V270 H635" fill="none" stroke="var(--diagram-border)" stroke-width="2"/><path d="M65 220 C180 205 260 160 360 125 S520 70 620 55" fill="none" stroke="#4d8de0" stroke-width="4"/><path d="M65 230 C180 210 280 180 370 150 S520 125 620 110" fill="none" stroke="#7bbf9b" stroke-width="2.5"/><path d="M65 190 C180 185 260 145 360 120 S520 90 620 75" fill="none" stroke="#d69a48" stroke-width="2.5"/><path d="M65 245 C180 230 270 205 370 195 S520 185 620 180" fill="none" stroke="#a58ad7" stroke-width="2.5"/><path d="M65 210 C180 200 270 170 365 145 S520 115 620 100" fill="none" stroke="#4d8de0" stroke-width="4" stroke-dasharray="7 6"/><g fill="var(--diagram-muted)" font-size="13"><text x="70" y="22">预测值</text><text x="570" y="300">特征值 →</text><text x="78" y="290">ICE：个体曲线</text><text x="430" y="45">PDP：平均值</text></g></svg></figure>
        <p>如果 ICE 曲线分散、交叉或斜率不同，平均 PDP 可能并不代表任何典型样本。除平均线外，还应考虑展示离散程度、子群体以及特征轴上的数据密度。</p>
        <h3>将局部归因汇总为全局结果</h3><p>例如，常用整个数据集上的 SHAP 绝对值均值来汇总归因强度。它回答“平均贡献有多大”，但会丢失方向。对带符号的贡献求平均时，大的正负值可能相互抵消。因此必须说明究竟汇总了什么。</p>`
      }
    },
    {
      id:"aggregation",
      title:{ru:"4. Почему усреднение локальных объяснений опасно",en:"4. Why averaging local explanations can be dangerous",zh:"4. 为什么对局部解释求平均可能产生误导"},
      content:{
        ru:`<p>Рассмотрим простую модель с двумя группами. Для группы A увеличение признака (z) повышает прогноз, для группы B — снижает. Если усреднить локальные наклоны, итог может оказаться близким к нулю. Ошибочно заключить, что признак не важен: на деле он важен для обеих групп, но действует в разных направлениях.</p>
        <figure class="xai-visual xai-svg-figure"><figcaption>Противоположные локальные эффекты могут взаимно компенсироваться</figcaption><svg class="xai-svg" viewBox="0 0 680 300" role="img" aria-label="Две противоположные линии групп A и B и почти горизонтальная средняя линия"><path d="M65 28 V245 H630" fill="none" stroke="var(--diagram-border)" stroke-width="2"/><path d="M85 210 L590 70" fill="none" stroke="#4d8de0" stroke-width="4"/><path d="M85 70 L590 210" fill="none" stroke="#d69a48" stroke-width="4"/><path d="M85 140 L590 140" fill="none" stroke="#7bbf9b" stroke-width="4" stroke-dasharray="8 6"/><g fill="var(--diagram-title)" font-size="14"><text x="480" y="55">Группа A: рост</text><text x="480" y="235">Группа B: снижение</text><text x="100" y="126">Среднее ≈ 0</text></g></svg></figure>
        <p>Это не редкая математическая странность, а типичная проблема агрегирования неоднородных эффектов. Среднее может скрывать:</p><ul><li><strong>разные направления:</strong> вклад положителен в одной группе и отрицателен в другой;</li><li><strong>разную силу:</strong> признак важен только для небольшой, но критичной группы;</li><li><strong>взаимодействия:</strong> эффект одного признака зависит от значения другого;</li><li><strong>разные распределения:</strong> группы представлены в выборке неравномерно;</li><li><strong>локальную нестабильность:</strong> небольшое изменение входа или выборки меняет объяснение.</li></ul>
        <h3>Практика корректного агрегирования</h3><ol><li>Покажите распределение локальных вкладов, а не только одно среднее.</li><li>Сравните signed mean и mean absolute attribution — они отвечают на разные вопросы.</li><li>Разбейте данные на заранее обоснованные сегменты и проверьте размер каждого сегмента.</li><li>Сравните PDP с ICE и добавьте плотность наблюдений.</li><li>Проверьте устойчивость результата на нескольких выборках или фолдах.</li><li>Не выбирайте сегменты постфактум только потому, что в них получилась удобная история.</li></ol>
        <div class="lesson-callout"><strong>Важно:</strong> локальные объяснения можно агрегировать, но агрегат — новый статистический объект с собственными предположениями и потерями информации. Он не становится автоматически полным глобальным объяснением.</div>`,
        en:`<p>Consider a simple model with two groups. Increasing feature (z) raises predictions in group A but lowers them in group B. Averaging local slopes may produce a value close to zero. It would be wrong to conclude that the feature does not matter: it matters in both groups, but in opposite directions.</p>
        <figure class="xai-visual xai-svg-figure"><figcaption>Opposing local effects can cancel out</figcaption><svg class="xai-svg" viewBox="0 0 680 300" role="img" aria-label="Opposite group A and B lines and a nearly horizontal average"><path d="M65 28 V245 H630" fill="none" stroke="var(--diagram-border)" stroke-width="2"/><path d="M85 210 L590 70" fill="none" stroke="#4d8de0" stroke-width="4"/><path d="M85 70 L590 210" fill="none" stroke="#d69a48" stroke-width="4"/><path d="M85 140 L590 140" fill="none" stroke="#7bbf9b" stroke-width="4" stroke-dasharray="8 6"/><g fill="var(--diagram-title)" font-size="14"><text x="480" y="55">Group A: increase</text><text x="480" y="235">Group B: decrease</text><text x="100" y="126">Average ≈ 0</text></g></svg></figure>
        <p>This is not a mathematical curiosity; it is a common aggregation problem. An average can hide:</p><ul><li><strong>opposite directions:</strong> a contribution is positive in one group and negative in another;</li><li><strong>different magnitudes:</strong> a feature matters only for a small but critical subgroup;</li><li><strong>interactions:</strong> the effect of one feature depends on another;</li><li><strong>different distributions:</strong> groups are represented unequally;</li><li><strong>local instability:</strong> small input or sample changes alter the explanation.</li></ul>
        <h3>How to aggregate responsibly</h3><ol><li>Show the distribution of local contributions, not just one mean.</li><li>Compare signed means with mean absolute attribution; they answer different questions.</li><li>Use substantively justified segments and report each segment's size.</li><li>Compare PDP with ICE and show observation density.</li><li>Check stability across samples or folds.</li><li>Do not invent post-hoc subgroups merely because they produce a convenient story.</li></ol>
        <div class="lesson-callout"><strong>Important:</strong> local explanations can be aggregated, but the aggregate is a new statistical object with its own assumptions and information loss. It does not automatically become a complete global explanation.</div>`,
        zh:`<p>考虑一个包含两个群体的简单模型。特征 (z) 增大时，群体 A 的预测上升，而群体 B 的预测下降。对局部斜率求平均可能得到接近零的结果。此时若断言该特征不重要，就是错误的：它对两个群体都重要，只是方向相反。</p>
        <figure class="xai-visual xai-svg-figure"><figcaption>方向相反的局部效应可能相互抵消</figcaption><svg class="xai-svg" viewBox="0 0 680 300" role="img" aria-label="群体 A 与 B 的相反曲线，以及接近水平的平均线"><path d="M65 28 V245 H630" fill="none" stroke="var(--diagram-border)" stroke-width="2"/><path d="M85 210 L590 70" fill="none" stroke="#4d8de0" stroke-width="4"/><path d="M85 70 L590 210" fill="none" stroke="#d69a48" stroke-width="4"/><path d="M85 140 L590 140" fill="none" stroke="#7bbf9b" stroke-width="4" stroke-dasharray="8 6"/><g fill="var(--diagram-title)" font-size="14"><text x="480" y="55">群体 A：上升</text><text x="480" y="235">群体 B：下降</text><text x="100" y="126">平均值 ≈ 0</text></g></svg></figure>
        <p>这并非罕见的数学现象，而是异质性聚合中的常见问题。平均值可能掩盖：</p><ul><li><strong>方向不同：</strong>某特征在一个群体中为正向贡献，在另一个群体中为负向贡献；</li><li><strong>强度不同：</strong>某特征只对人数较少但十分关键的子群体重要；</li><li><strong>特征交互：</strong>一个特征的作用取决于另一个特征的取值；</li><li><strong>分布不同：</strong>各群体在样本中的比例不均衡；</li><li><strong>局部不稳定：</strong>输入或样本的轻微变化就可能改变解释。</li></ul>
        <h3>如何负责任地进行汇总</h3><ol><li>展示局部贡献的分布，而不只是一个平均值。</li><li>同时比较带符号均值和绝对归因均值；两者回答不同问题。</li><li>使用有实际依据的分组，并报告各组样本量。</li><li>将 PDP 与 ICE 对照，并显示观测密度。</li><li>在不同样本或交叉验证折上检查稳定性。</li><li>不要仅仅因为某些事后分组能产生方便的结论就采用它们。</li></ol>
        <div class="lesson-callout"><strong>重要：</strong>局部解释可以汇总，但汇总结果是一个具有自身假设和信息损失的新统计对象，并不会自动成为完整的全局解释。</div>`
      }
    },
    {
      id:"method-choice",
      title:{ru:"5. Как выбрать метод под масштаб и вопрос",en:"5. Choosing a method for the scope and question",zh:"5. 根据解释范围与问题选择方法"},
      content:{
        ru:`<p>Не существует универсального рейтинга методов. Выбор зависит от вопроса, модели, доступных данных, вычислительного бюджета, целевой аудитории и того, какой тип вывода нужен.</p>
        <div class="xai-table-wrap"><table><thead><tr><th>Метод</th><th>Типичный масштаб</th><th>Что показывает</th><th>Ключевое ограничение</th></tr></thead><tbody><tr><td>SHAP</td><td>Локальный; агрегация для global</td><td>Атрибуции относительно baseline</td><td>Зависит от background и предположений о зависимых признаках</td></tr><tr><td>LIME</td><td>Локальный</td><td>Локальную аппроксимацию модели</td><td>Чувствителен к окрестности и случайным возмущениям</td></tr><tr><td>Permutation importance</td><td>Глобальный / групповой</td><td>Падение метрики после перемешивания признака</td><td>Зависит от метрики, выборки и корреляций</td></tr><tr><td>PDP</td><td>Глобальный</td><td>Среднюю зависимость прогноза от признака</td><td>Может усреднять нереалистичные сочетания</td></tr><tr><td>ICE</td><td>Локальные кривые, сравнение групп</td><td>Индивидуальные траектории при изменении признака</td><td>Много линий трудно читать; не причинный эффект</td></tr><tr><td>Counterfactuals</td><td>Локальный</td><td>Изменения входа для заданного изменения прогноза</td><td>Нужны ограничения реализуемости и правдоподобия</td></tr></tbody></table></div>
        <h3>Контрольный список выбора</h3><ol><li>Какой объект вывода: одна запись, сегмент или вся оценочная выборка?</li><li>Нужно объяснить конкретный прогноз, зависимость, качество модели или изменение результата?</li><li>Есть ли доступ к внутренностям модели или только к API predict?</li><li>Какие признаки коррелируют, а какие сочетания невозможны?</li><li>Кто будет читать объяснение и какие решения он вправе принимать?</li><li>Как будет проверяться fidelity, stability и соответствие объяснения поведению модели?</li></ol>
        <p>Практически полезно сочетать масштабы: начать с глобальной диагностики, обнаружить важные сегменты, затем исследовать локальные случаи внутри сегментов. Но локальные примеры должны проверять гипотезу, а не служить иллюстрациями заранее выбранной истории.</p>`,
        en:`<p>There is no universal ranking of methods. The choice depends on the question, model, available data, computational budget, audience and the type of conclusion required.</p>
        <div class="xai-table-wrap"><table><thead><tr><th>Method</th><th>Typical scope</th><th>What it shows</th><th>Main limitation</th></tr></thead><tbody><tr><td>SHAP</td><td>Local; aggregate for global summaries</td><td>Attributions relative to a baseline</td><td>Depends on background data and assumptions about dependent features</td></tr><tr><td>LIME</td><td>Local</td><td>A local approximation of the model</td><td>Sensitive to neighbourhood and random perturbations</td></tr><tr><td>Permutation importance</td><td>Global / subgroup</td><td>Metric drop after shuffling a feature</td><td>Depends on metric, sample and correlations</td></tr><tr><td>PDP</td><td>Global</td><td>Average prediction dependence on a feature</td><td>May average unrealistic combinations</td></tr><tr><td>ICE</td><td>Local curves; subgroup comparison</td><td>Individual trajectories as a feature changes</td><td>Many lines are hard to read; not a causal effect</td></tr><tr><td>Counterfactuals</td><td>Local</td><td>Input changes for a specified prediction change</td><td>Requires feasibility and plausibility constraints</td></tr></tbody></table></div>
        <h3>Method-selection checklist</h3><ol><li>What is the unit: one record, a segment or the full evaluation sample?</li><li>Do you need to explain one prediction, a dependence, model performance or a change in output?</li><li>Can you inspect model internals, or only call a prediction API?</li><li>Which features are correlated, and which combinations are impossible?</li><li>Who will read the explanation, and what decisions are they entitled to make?</li><li>How will you test fidelity, stability and consistency with model behaviour?</li></ol>
        <p>A useful workflow combines scopes: start with global diagnostics, identify relevant subgroups, then inspect local cases within them. Local examples should test a hypothesis, not decorate a story chosen in advance.</p>`,
        zh:`<p>不存在适用于所有场景的方法排名。选择取决于研究问题、模型、可用数据、计算预算、受众以及所需结论的类型。</p>
        <div class="xai-table-wrap"><table><thead><tr><th>方法</th><th>典型范围</th><th>展示内容</th><th>主要局限</th></tr></thead><tbody><tr><td>SHAP</td><td>局部；可汇总为全局概览</td><td>相对于基准值的特征归因</td><td>取决于背景数据及相关特征的假设</td></tr><tr><td>LIME</td><td>局部</td><td>模型的局部近似</td><td>对邻域定义和随机扰动敏感</td></tr><tr><td>Permutation importance</td><td>全局／子群体</td><td>打乱特征后指标的下降</td><td>取决于指标、样本和特征相关性</td></tr><tr><td>PDP</td><td>全局</td><td>预测对某特征的平均依赖关系</td><td>可能对不现实的特征组合求平均</td></tr><tr><td>ICE</td><td>局部曲线；群体比较</td><td>特征变化时各样本的个体轨迹</td><td>曲线过多难以阅读；不是因果效应</td></tr><tr><td>反事实</td><td>局部</td><td>使预测按指定方向变化的输入修改</td><td>需要可行性和合理性约束</td></tr></tbody></table></div>
        <h3>方法选择清单</h3><ol><li>分析单位是什么：单条记录、某个群体，还是完整评估样本？</li><li>需要解释单次预测、特征依赖、模型性能，还是输出变化？</li><li>能否访问模型内部，还是只能调用 predict API？</li><li>哪些特征相关，哪些组合在现实中不可能出现？</li><li>谁来阅读解释？他们有权据此作出哪些决定？</li><li>如何检验忠实度、稳定性以及解释与模型行为的一致性？</li></ol>
        <p>实践中可以结合不同范围：先进行全局诊断，识别重要子群体，再研究其中的局部案例。但局部案例应当用于检验假设，而不是为预先选定的故事提供装饰。</p>`
      }
    },
    {
      id:"lab",
      title:{ru:"6. Практическая лаборатория: одна модель, два масштаба",en:"6. Practical lab: one model, two scopes",zh:"6. 实践实验：同一模型、两种解释范围"},
      content:{
        ru:`<p><strong>Цель:</strong> на одной нелинейной модели сравнить локальную чувствительность конкретного объекта и глобальную важность признаков, затем увидеть общую и индивидуальную зависимость через PDP/ICE. Лаборатория работает на CPU и синтетических данных; внешние файлы и GPU не нужны.</p>
        <h3>Шаг 1. Установка и данные</h3><pre><code class="language-python"># Python 3.10+
# Установка один раз:
# python -m pip install numpy pandas matplotlib scikit-learn

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance, PartialDependenceDisplay
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(42)
n = 1800

X = pd.DataFrame({
    "income": rng.normal(70, 18, n).clip(20, 140),
    "debt_ratio": rng.beta(2, 5, n),
    "employment_years": rng.gamma(2.2, 3.0, n).clip(0, 30),
    "savings": rng.lognormal(2.7, 0.65, n).clip(0, 80),
    "late_payments": rng.poisson(0.7, n).clip(0, 6),
    "utilization": rng.beta(2, 3, n)
})

noise = rng.normal(0, 0.06, n)
y = (
    0.35 * X["debt_ratio"]
    + 0.10 * X["utilization"]
    + 0.055 * X["late_payments"]
    - 0.0025 * X["income"]
    - 0.006 * X["employment_years"]
    - 0.0015 * X["savings"]
    + 0.22 * X["debt_ratio"] * X["utilization"]
    + noise
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=7
)
print(X.head())
print("Train:", X_train.shape, "Test:", X_test.shape)</code></pre>
        <p><strong>Что происходит:</strong> генератор с фиксированным seed создаёт воспроизводимые данные. Шесть признаков имеют разные распределения; целевая величина построена из нелинейной комбинации признаков, включая взаимодействие долговой нагрузки и использования лимита. Это учебный риск-индекс, а не реальная вероятность дефолта.</p>
        <h3>Шаг 2. Обучение и проверка модели</h3><pre><code class="language-python">model = RandomForestRegressor(
    n_estimators=250,
    min_samples_leaf=8,
    random_state=11,
    n_jobs=-1
)
model.fit(X_train, y_train)

pred = model.predict(X_test)
print("R2:", round(r2_score(y_test, pred), 3))
print("MAE:", round(mean_absolute_error(y_test, pred), 3))</code></pre>
        <p>Случайный лес выбран как нелинейная модель, для которой полезно сравнить разные виды объяснения. (R^2) и MAE — проверка качества прогноза, а не метрики качества объяснения. Низкое качество модели нельзя исправить красивым графиком атрибуции.</p>
        <h3>Шаг 3. Локальный анализ одного объекта</h3><pre><code class="language-python">row_id = 12
x_one = X_test.iloc[[row_id]].copy()
baseline = X_train.median(numeric_only=True)

base_prediction = float(model.predict(x_one)[0])
rows = []

for feature in X.columns:
    changed = x_one.copy()
    changed.loc[:, feature] = baseline[feature]
    changed_prediction = float(model.predict(changed)[0])
    rows.append({
        "feature": feature,
        "prediction_after_replacement": changed_prediction,
        "delta_vs_original": changed_prediction - base_prediction
    })

local_sensitivity = (
    pd.DataFrame(rows)
    .sort_values("delta_vs_original", key=lambda s: s.abs(), ascending=False)
)
print("Original prediction:", round(base_prediction, 3))
print(local_sensitivity.round(3).to_string(index=False))</code></pre>
        <p><strong>Как читать результат:</strong> для каждого признака мы по очереди заменяем его значение у выбранного объекта на медиану обучающей выборки, остальные признаки оставляем неизменными. Разность — реакция этой модели в этой точке на конкретную замену. Это простой локальный анализ чувствительности, а не SHAP, не LIME и не причинный эффект. При взаимодействиях результат зависит от выбранного baseline и порядка/способа вмешательства.</p>
        <h3>Шаг 4. Глобальная permutation importance</h3><pre><code class="language-python">perm = permutation_importance(
    model, X_test, y_test,
    scoring="r2",
    n_repeats=20,
    random_state=21,
    n_jobs=-1
)

global_importance = pd.DataFrame({
    "feature": X.columns,
    "mean_r2_drop": perm.importances_mean,
    "std": perm.importances_std
}).sort_values("mean_r2_drop", ascending=False)

print(global_importance.round(4).to_string(index=False))

ax = global_importance.sort_values("mean_r2_drop").plot.barh(
    x="feature", y="mean_r2_drop", xerr="std", legend=False,
    figsize=(8, 4), title="Global permutation importance (R2 drop)"
)
ax.set_xlabel("Decrease in test R2 after permutation")
ax.set_ylabel("Feature")
plt.tight_layout()
plt.show()</code></pre>
        <p>Теперь единица анализа — тестовая выборка, а не один клиент. Перемешивание разрушает связь признака с целевой величиной, сохраняя остальные столбцы. Падение (R^2) — оценка того, насколько модель опирается на признак для качества на этой выборке. Отрицательные значения возможны из-за шума и вариативности оценки; они не означают «отрицательную причинную важность».</p>
        <h3>Шаг 5. PDP и ICE для одного признака</h3><pre><code class="language-python">fig, ax = plt.subplots(figsize=(8, 5))
PartialDependenceDisplay.from_estimator(
    model,
    X_test,
    features=["debt_ratio"],
    kind="both",       # PDP + individual ICE curves
    subsample=60,
    random_state=5,
    ax=ax
)
ax.set_title("Debt ratio: PDP and ICE")
plt.tight_layout()
plt.show()</code></pre>
        <p>Толстая средняя линия показывает PDP, тонкие линии — ICE для отдельных объектов (точное оформление зависит от версии scikit-learn). Если ICE расходятся, средняя зависимость скрывает различия. Смотрите также, где находятся реальные наблюдения: интерпретация вне плотной области данных особенно ненадёжна.</p>
        <h3>Шаг 6. Сопоставьте уровни</h3><ol><li>Сравните признаки с наибольшими локальными (|Delta|) для выбранной строки с лидерами глобальной permutation importance.</li><li>Отметьте, совпадают ли порядок и направление. Не ожидайте полного совпадения: методы измеряют разные величины.</li><li>Посмотрите на ICE: есть ли разные наклоны или пересечения?</li><li>Повторите локальный расчёт для другого объекта (например, (row_id=40)). Меняется ли локальная картина?</li><li>Сформулируйте вывод строго в пределах синтетического набора и обученной модели.</li></ol>
        <div class="lesson-callout"><strong>Ключ лаборатории:</strong> локальная замена отвечает «как изменится прогноз этого объекта при выбранной замене признака?», а permutation importance — «как изменится качество модели на тестовой выборке, если разрушить информацию этого признака?». Это разные вопросы, поэтому числа не обязаны совпадать.</div>
        <h3>Типичные ошибки</h3><ul><li>Называть локальную замену медианой SHAP-значением — это не SHAP.</li><li>Интерпретировать синтетический индекс как вероятность — у него нет такой калибровки.</li><li>Считать permutation importance причинным эффектом признака.</li><li>Сравнивать локальные (Delta) и глобальное падение (R^2) как одну шкалу.</li><li>Делать вывод о реальных клиентах по искусственным данным.</li></ul>`,
        en:`<p><strong>Goal:</strong> use one non-linear model to compare local sensitivity for one instance with global feature importance, then inspect average and individual dependence with PDP/ICE. The lab runs on CPU with synthetic data; no external files or GPU are required.</p>
        <h3>Step 1. Install and create data</h3><pre><code class="language-python"># Python 3.10+
# Install once:
# python -m pip install numpy pandas matplotlib scikit-learn

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance, PartialDependenceDisplay
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(42)
n = 1800

X = pd.DataFrame({
    "income": rng.normal(70, 18, n).clip(20, 140),
    "debt_ratio": rng.beta(2, 5, n),
    "employment_years": rng.gamma(2.2, 3.0, n).clip(0, 30),
    "savings": rng.lognormal(2.7, 0.65, n).clip(0, 80),
    "late_payments": rng.poisson(0.7, n).clip(0, 6),
    "utilization": rng.beta(2, 3, n)
})

noise = rng.normal(0, 0.06, n)
y = (
    0.35 * X["debt_ratio"]
    + 0.10 * X["utilization"]
    + 0.055 * X["late_payments"]
    - 0.0025 * X["income"]
    - 0.006 * X["employment_years"]
    - 0.0015 * X["savings"]
    + 0.22 * X["debt_ratio"] * X["utilization"]
    + noise
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=7
)
print(X.head())
print("Train:", X_train.shape, "Test:", X_test.shape)</code></pre>
        <p><strong>What happens:</strong> a fixed seed makes the data reproducible. Six features have different distributions; the target is a non-linear combination that includes an interaction between debt ratio and credit utilisation. It is a teaching risk index, not a real default probability.</p>
        <h3>Step 2. Fit and evaluate the model</h3><pre><code class="language-python">model = RandomForestRegressor(
    n_estimators=250,
    min_samples_leaf=8,
    random_state=11,
    n_jobs=-1
)
model.fit(X_train, y_train)

pred = model.predict(X_test)
print("R2:", round(r2_score(y_test, pred), 3))
print("MAE:", round(mean_absolute_error(y_test, pred), 3))</code></pre>
        <p>A random forest is a useful non-linear model for comparing explanation types. (R^2) and MAE evaluate predictive performance, not explanation quality. A beautiful attribution plot cannot repair a poorly performing model.</p>
        <h3>Step 3. Local analysis of one instance</h3><pre><code class="language-python">row_id = 12
x_one = X_test.iloc[[row_id]].copy()
baseline = X_train.median(numeric_only=True)

base_prediction = float(model.predict(x_one)[0])
rows = []

for feature in X.columns:
    changed = x_one.copy()
    changed.loc[:, feature] = baseline[feature]
    changed_prediction = float(model.predict(changed)[0])
    rows.append({
        "feature": feature,
        "prediction_after_replacement": changed_prediction,
        "delta_vs_original": changed_prediction - base_prediction
    })

local_sensitivity = (
    pd.DataFrame(rows)
    .sort_values("delta_vs_original", key=lambda s: s.abs(), ascending=False)
)
print("Original prediction:", round(base_prediction, 3))
print(local_sensitivity.round(3).to_string(index=False))</code></pre>
        <p><strong>How to read it:</strong> we replace one feature at a time with its training-set median and keep the other values fixed. The difference is this model's response at this point to that specific replacement. This is simple local sensitivity analysis — not SHAP, not LIME and not a causal effect. With interactions, the result depends on the baseline and intervention design.</p>
        <h3>Step 4. Global permutation importance</h3><pre><code class="language-python">perm = permutation_importance(
    model, X_test, y_test,
    scoring="r2",
    n_repeats=20,
    random_state=21,
    n_jobs=-1
)

global_importance = pd.DataFrame({
    "feature": X.columns,
    "mean_r2_drop": perm.importances_mean,
    "std": perm.importances_std
}).sort_values("mean_r2_drop", ascending=False)

print(global_importance.round(4).to_string(index=False))

ax = global_importance.sort_values("mean_r2_drop").plot.barh(
    x="feature", y="mean_r2_drop", xerr="std", legend=False,
    figsize=(8, 4), title="Global permutation importance (R2 drop)"
)
ax.set_xlabel("Decrease in test R2 after permutation")
ax.set_ylabel("Feature")
plt.tight_layout()
plt.show()</code></pre>
        <p>The unit of analysis is now the test set, not one customer. Shuffling breaks the feature's association with the target while leaving other columns unchanged. The (R^2) drop estimates how much the model relies on that feature for performance on this sample. Negative values can occur due to noise and estimation variability; they are not “negative causal importance”.</p>
        <h3>Step 5. PDP and ICE for one feature</h3><pre><code class="language-python">fig, ax = plt.subplots(figsize=(8, 5))
PartialDependenceDisplay.from_estimator(
    model,
    X_test,
    features=["debt_ratio"],
    kind="both",       # PDP + individual ICE curves
    subsample=60,
    random_state=5,
    ax=ax
)
ax.set_title("Debt ratio: PDP and ICE")
plt.tight_layout()
plt.show()</code></pre>
        <p>The thick average line is PDP; thin lines are ICE curves for individual instances (exact styling depends on the scikit-learn version). Diverging ICE curves indicate heterogeneity. Also inspect where observations lie: interpretation outside dense data regions is especially unreliable.</p>
        <h3>Step 6. Compare the scopes</h3><ol><li>Compare the largest local (|Delta|) values for the selected row with the top features in global permutation importance.</li><li>Check whether rank and direction agree. Do not expect an exact match: the methods measure different quantities.</li><li>Inspect ICE for different slopes or crossings.</li><li>Repeat the local calculation for another instance (for example, (row_id=40)). Does the local picture change?</li><li>State conclusions only about this synthetic dataset and fitted model.</li></ol>
        <div class="lesson-callout"><strong>Lab takeaway:</strong> local median replacement asks “how does this instance's prediction change under this chosen feature replacement?” Permutation importance asks “how does test-set model performance change if information in this feature is disrupted?” They are different questions, so their numbers need not agree.</div>
        <h3>Common mistakes</h3><ul><li>Calling median replacement a SHAP value — it is not SHAP.</li><li>Interpreting the synthetic index as a probability — it is not calibrated that way.</li><li>Treating permutation importance as a causal feature effect.</li><li>Comparing local (Delta) and global (R^2) drop as if they were the same scale.</li><li>Drawing conclusions about real customers from synthetic data.</li></ul>`,
        zh:`<p><strong>目标：</strong>使用同一个非线性模型，对比单个样本的局部敏感性与全局特征重要性，然后通过 PDP/ICE 查看平均依赖关系和个体依赖关系。实验仅使用 CPU 和合成数据，无需外部文件或 GPU。</p>
        <h3>步骤 1：安装并生成数据</h3><pre><code class="language-python"># Python 3.10+
# 只需安装一次：
# python -m pip install numpy pandas matplotlib scikit-learn

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance, PartialDependenceDisplay
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(42)
n = 1800

X = pd.DataFrame({
    "income": rng.normal(70, 18, n).clip(20, 140),
    "debt_ratio": rng.beta(2, 5, n),
    "employment_years": rng.gamma(2.2, 3.0, n).clip(0, 30),
    "savings": rng.lognormal(2.7, 0.65, n).clip(0, 80),
    "late_payments": rng.poisson(0.7, n).clip(0, 6),
    "utilization": rng.beta(2, 3, n)
})

noise = rng.normal(0, 0.06, n)
y = (
    0.35 * X["debt_ratio"]
    + 0.10 * X["utilization"]
    + 0.055 * X["late_payments"]
    - 0.0025 * X["income"]
    - 0.006 * X["employment_years"]
    - 0.0015 * X["savings"]
    + 0.22 * X["debt_ratio"] * X["utilization"]
    + noise
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=7
)
print(X.head())
print("Train:", X_train.shape, "Test:", X_test.shape)</code></pre>
        <p><strong>说明：</strong>固定随机种子保证可复现。六个特征具有不同分布；目标值由非线性特征组合生成，其中包含负债率与额度使用率的交互项。这是教学用风险指数，不是真实违约概率。</p>
        <h3>步骤 2：训练并评估模型</h3><pre><code class="language-python">model = RandomForestRegressor(
    n_estimators=250,
    min_samples_leaf=8,
    random_state=11,
    n_jobs=-1
)
model.fit(X_train, y_train)

pred = model.predict(X_test)
print("R2:", round(r2_score(y_test, pred), 3))
print("MAE:", round(mean_absolute_error(y_test, pred), 3))</code></pre>
        <p>随机森林是一种适合比较不同解释方式的非线性模型。(R^2) 和 MAE 评价预测性能，而不是解释质量。漂亮的归因图无法弥补模型性能不足。</p>
        <h3>步骤 3：对单个样本进行局部分析</h3><pre><code class="language-python">row_id = 12
x_one = X_test.iloc[[row_id]].copy()
baseline = X_train.median(numeric_only=True)

base_prediction = float(model.predict(x_one)[0])
rows = []

for feature in X.columns:
    changed = x_one.copy()
    changed.loc[:, feature] = baseline[feature]
    changed_prediction = float(model.predict(changed)[0])
    rows.append({
        "feature": feature,
        "prediction_after_replacement": changed_prediction,
        "delta_vs_original": changed_prediction - base_prediction
    })

local_sensitivity = (
    pd.DataFrame(rows)
    .sort_values("delta_vs_original", key=lambda s: s.abs(), ascending=False)
)
print("Original prediction:", round(base_prediction, 3))
print(local_sensitivity.round(3).to_string(index=False))</code></pre>
        <p><strong>如何解读：</strong>每次只将一个特征替换为训练集的中位数，其他特征保持不变。差值表示模型在该样本点对这次特定替换的响应。这是简单的局部敏感性分析，不是 SHAP、LIME，也不是因果效应。存在交互时，结果取决于基准值和干预设计。</p>
        <h3>步骤 4：全局置换重要性</h3><pre><code class="language-python">perm = permutation_importance(
    model, X_test, y_test,
    scoring="r2",
    n_repeats=20,
    random_state=21,
    n_jobs=-1
)

global_importance = pd.DataFrame({
    "feature": X.columns,
    "mean_r2_drop": perm.importances_mean,
    "std": perm.importances_std
}).sort_values("mean_r2_drop", ascending=False)

print(global_importance.round(4).to_string(index=False))

ax = global_importance.sort_values("mean_r2_drop").plot.barh(
    x="feature", y="mean_r2_drop", xerr="std", legend=False,
    figsize=(8, 4), title="Global permutation importance (R2 drop)"
)
ax.set_xlabel("Decrease in test R2 after permutation")
ax.set_ylabel("Feature")
plt.tight_layout()
plt.show()</code></pre>
        <p>现在分析单位变成测试集，而不是单个客户。打乱操作破坏特征与目标之间的关联，同时保留其他列。(R^2) 的下降用于估计模型在该样本上对特征信息的依赖程度。由于噪声和估计波动，结果可能为负；这并不代表“负向因果重要性”。</p>
        <h3>步骤 5：绘制一个特征的 PDP 和 ICE</h3><pre><code class="language-python">fig, ax = plt.subplots(figsize=(8, 5))
PartialDependenceDisplay.from_estimator(
    model,
    X_test,
    features=["debt_ratio"],
    kind="both",       # PDP + individual ICE curves
    subsample=60,
    random_state=5,
    ax=ax
)
ax.set_title("Debt ratio: PDP and ICE")
plt.tight_layout()
plt.show()</code></pre>
        <p>较粗的平均线是 PDP，较细的线是各样本的 ICE 曲线（具体样式取决于 scikit-learn 版本）。如果 ICE 曲线分散，说明存在异质性。还要观察真实样本集中在哪些区域：远离数据密集区域的解释尤其不可靠。</p>
        <h3>步骤 6：比较不同范围</h3><ol><li>将所选样本中最大的局部 (|Delta|) 与全局置换重要性排名靠前的特征进行比较。</li><li>观察排名和方向是否一致。不要期待完全相同，因为两种方法测量的是不同量。</li><li>检查 ICE 曲线是否有不同斜率或交叉。</li><li>对另一个样本（例如 (row_id=40)）重复局部计算。局部图景是否改变？</li><li>只针对这组合成数据和训练好的模型陈述结论。</li></ol>
        <div class="lesson-callout"><strong>实验要点：</strong>局部中位数替换回答“对该样本进行这种特征替换后，预测会如何变化？”置换重要性回答“破坏该特征信息后，测试集上的模型性能会如何变化？”这是两个不同问题，数值不必一致。</div>
        <h3>常见错误</h3><ul><li>把中位数替换称为 SHAP 值——这是错误的。</li><li>把合成指数解释为概率——它并未按概率校准。</li><li>把置换重要性当作特征的因果效应。</li><li>将局部 (Delta) 与全局 (R^2) 下降视为同一尺度。</li><li>根据合成数据对真实客户作出结论。</li></ul>`
      }
    },
    {
      id:"limits",
      title:{ru:"7. Ограничения, проверка и корректная отчётность",en:"7. Limitations, validation and responsible reporting",zh:"7. 局限、验证与规范报告"},
      content:{
        ru:`<p>Любое объяснение условно: оно зависит от модели, выбранного набора данных, метрики, baseline, способа обращения с коррелирующими признаками и исследовательского вопроса. Поэтому объяснение нужно проверять так же внимательно, как и сам прогноз.</p>
        <h3>Что проверить</h3><ul><li><strong>Представительность:</strong> соответствует ли выборка целевой популяции и периоду использования?</li><li><strong>Устойчивость:</strong> меняется ли объяснение при небольшом изменении объекта, seed, подвыборки или фонового набора?</li><li><strong>Fidelity:</strong> насколько локальная аппроксимация воспроизводит поведение исходной модели в интересующей области?</li><li><strong>Корреляции и поддержка данных:</strong> остаются ли исследуемые комбинации признаков реалистичными?</li><li><strong>Сегменты:</strong> не скрывает ли среднее различия между группами и малочисленные критические случаи?</li><li><strong>Утечка и качество:</strong> не объясняет ли модель артефакт данных или утечку целевой переменной?</li></ul>
        <h3>Как писать вывод</h3><p>Корректная формулировка указывает объект анализа, популяцию, период, модель и версию данных, метод, шкалу выхода, baseline, метрику и ограничения. Например: «На тестовой выборке из 450 объектов permutation importance при метрике (R^2) показала наибольшее падение качества после перемешивания debt_ratio. Результат характеризует зависимость качества данной модели от признака в этой выборке; причинный эффект не оценивается».</p>
        <p>Избегайте фраз «модель принимает решение из-за признака X», если метод показывает лишь ассоциацию или чувствительность. Лучше: «в рамках выбранной процедуры изменение/перемешивание X связано с…». Для индивидуального решения локальное объяснение не заменяет проверку исходных данных, регламента и человеческий пересмотр.</p>
        <div class="lesson-callout"><strong>Итог:</strong> локальное объяснение помогает исследовать отдельный случай; глобальное — закономерности на выбранной совокупности; групповое — неоднородность. Надёжный анализ связывает эти уровни, сообщает границы применимости и не делает причинных выводов без причинного дизайна.</div>`,
        en:`<p>Every explanation is conditional: it depends on the model, selected data, metric, baseline, treatment of correlated features and research question. Explanations therefore need validation as carefully as predictions do.</p>
        <h3>What to check</h3><ul><li><strong>Representativeness:</strong> does the sample match the target population and deployment period?</li><li><strong>Stability:</strong> does the explanation change under small changes to the instance, seed, sample or background data?</li><li><strong>Fidelity:</strong> does a local surrogate reproduce the original model in the region of interest?</li><li><strong>Correlations and data support:</strong> are the feature combinations being evaluated realistic?</li><li><strong>Subgroups:</strong> does an average hide group differences or small but critical cases?</li><li><strong>Leakage and quality:</strong> is the model explaining a data artefact or target leakage?</li></ul>
        <h3>How to report a finding</h3><p>A responsible statement specifies the unit, population, period, model and data version, method, output scale, baseline, metric and limitations. For example: “On a 450-instance test set, permutation importance under (R^2) showed the largest performance drop after shuffling debt_ratio. This describes this model's performance dependence on the feature in this sample; no causal effect is estimated.”</p>
        <p>Avoid saying “the model made the decision because of feature X” when the method shows association or sensitivity only. Prefer: “under this procedure, changing/shuffling X is associated with…”. For an individual decision, a local explanation does not replace checking source data, policy and human review.</p>
        <div class="lesson-callout"><strong>Takeaway:</strong> local explanations investigate one case; global explanations describe patterns in a selected population; subgroup explanations reveal heterogeneity. A sound analysis connects these levels, states its scope and avoids causal claims without a causal design.</div>`,
        zh:`<p>任何解释都具有条件性：它取决于模型、所选数据、指标、基准值、相关特征的处理方式以及研究问题。因此，对解释的验证应当像对预测本身一样严谨。</p>
        <h3>需要检查的内容</h3><ul><li><strong>代表性：</strong>样本是否符合目标总体和实际部署时期？</li><li><strong>稳定性：</strong>轻微改变样本、随机种子、子样本或背景数据时，解释是否发生变化？</li><li><strong>忠实度（Fidelity）：</strong>局部近似模型能否在关注区域内复现原模型行为？</li><li><strong>相关性与数据支持：</strong>所评估的特征组合是否现实？</li><li><strong>子群体：</strong>平均值是否掩盖了群体差异或人数少但重要的案例？</li><li><strong>泄漏与数据质量：</strong>模型解释的是数据伪影或目标泄漏吗？</li></ul>
        <h3>如何报告结果</h3><p>规范的结论应注明分析对象、总体、时期、模型与数据版本、方法、输出尺度、基准值、指标和局限。例如：“在包含 450 个样本的测试集上，使用 (R^2) 指标的置换重要性分析显示，打乱 debt_ratio 后性能下降最大。该结果描述了此模型在该样本上对该特征的性能依赖，并未估计因果效应。”</p>
        <p>如果方法仅显示关联或敏感性，应避免写成“模型因为特征 X 而作出决定”。更准确的说法是：“在该分析流程下，改变／打乱 X 与……相关”。对于个体决策，局部解释不能替代原始数据核查、业务规则检查和人工复核。</p>
        <div class="lesson-callout"><strong>总结：</strong>局部解释用于研究单个案例；全局解释描述选定总体中的模式；子群体解释揭示异质性。可靠分析应连接这些层次、说明适用范围，并且在没有因果研究设计时避免因果结论。</div>`
      }
    },
    {
      id:"summary",
      title:{ru:"8. Итоги, практическое задание и дальнейший маршрут",en:"8. Summary, assignment and next steps",zh:"8. 总结、实践任务与后续学习"},
      content:{
        ru:`<h3>Ключевые выводы</h3><ul><li>Локальный масштаб отвечает на вопрос об одном объекте и конкретном прогнозе.</li><li>Глобальный масштаб описывает модель на определённой совокупности и зависит от её репрезентативности.</li><li>Групповой анализ помогает выявлять неоднородность между сегментами.</li><li>SHAP/LIME могут давать локальные объяснения; permutation importance, PDP и ICE помогают исследовать поведение на множестве объектов — но отвечают на разные вопросы.</li><li>Усреднение локальных вкладов может скрывать знак, разброс, взаимодействия и малые группы.</li><li>Объяснение не доказывает причинность, справедливость или правильность решения.</li></ul>
        <h3>Практическое задание</h3><p>На собственном или открытом табличном датасете выберите одну модель и выполните небольшой аудит масштаба объяснения:</p><ol><li>Опишите исследовательский вопрос и целевую популяцию.</li><li>Постройте глобальную permutation importance на отложенной выборке.</li><li>Выберите два объекта с разными прогнозами и рассчитайте локальную чувствительность либо SHAP-объяснения.</li><li>Для одного числового признака постройте PDP и ICE; отметьте расхождения индивидуальных кривых.</li><li>Если есть обоснованные сегменты, сравните их отдельно.</li><li>Напишите вывод до 300 слов: что установлено, для какой выборки, какие ограничения и что нельзя заключать.</li></ol>
        <p><strong>Критерий качества:</strong> отчёт явно различает локальные и глобальные величины, не сравнивает несовместимые шкалы, сообщает baseline/метрику и не делает причинных заявлений.</p>
        <h3>Глоссарий</h3><dl><dt><strong>Local explanation</strong></dt><dd>Объяснение поведения модели для одного объекта или прогноза.</dd><dt><strong>Global explanation</strong></dt><dd>Описание поведения модели на выбранной совокупности или области входов.</dd><dt><strong>Subgroup analysis</strong></dt><dd>Анализ отдельного сегмента объектов для выявления неоднородности.</dd><dt><strong>Baseline</strong></dt><dd>Опорное значение, относительно которого интерпретируются прогноз или вклады.</dd><dt><strong>Permutation importance</strong></dt><dd>Изменение выбранной метрики после перемешивания значений признака.</dd><dt><strong>PDP</strong></dt><dd>Средний прогноз модели при фиксированном значении одного признака.</dd><dt><strong>ICE</strong></dt><dd>Индивидуальные кривые прогноза при изменении одного признака.</dd><dt><strong>Heterogeneity</strong></dt><dd>Различия поведения модели или эффектов между объектами и группами.</dd></dl>
        <h3>Источники и дополнительное чтение</h3><ol><li>Molnar, C. <em>Interpretable Machine Learning</em>, разделы Global Model-Agnostic Methods, Partial Dependence, Permutation Feature Importance. <a href="https://christophm.github.io/interpretable-ml-book/" target="_blank" rel="noopener">Открытая книга</a>.</li><li>Friedman, J. H. (2001). Greedy Function Approximation: A Gradient Boosting Machine. <em>Annals of Statistics</em>, 29(5), 1189–1232. <a href="https://doi.org/10.1214/aos/1013203451" target="_blank" rel="noopener">DOI</a>.</li><li>Goldstein, A. et al. (2015). Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation. <em>Journal of Computational and Graphical Statistics</em>, 24(1), 44–65. <a href="https://doi.org/10.1080/10618600.2014.907095" target="_blank" rel="noopener">DOI</a>.</li><li>Apley, D. W. & Zhu, J. (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. <em>JRSS Series B</em>, 82(4), 1059–1086. <a href="https://doi.org/10.1111/rssb.12377" target="_blank" rel="noopener">DOI (ALE)</a>.</li><li>Lundberg, S. M. & Lee, S.-I. (2017). A Unified Approach to Interpreting Model Predictions. <em>NeurIPS</em>. <a href="https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html" target="_blank" rel="noopener">Paper</a>.</li><li>Ribeiro, M. T., Singh, S. & Guestrin, C. (2016). “Why Should I Trust You?” Explaining the Predictions of Any Classifier. <em>KDD</em>. <a href="https://doi.org/10.1145/2939672.2939778" target="_blank" rel="noopener">DOI</a>.</li><li>scikit-learn documentation: <a href="https://scikit-learn.org/stable/modules/permutation_importance.html" target="_blank" rel="noopener">Permutation feature importance</a>; <a href="https://scikit-learn.org/stable/modules/partial_dependence.html" target="_blank" rel="noopener">Partial dependence and ICE</a>.</li></ol>
        <p class="source-note">Авторский учебный материал AI Research DCH School. Числовые примеры и лабораторный набор синтетические; они не являются финансовой рекомендацией или оценкой реальных заёмщиков.</p>
        <p><strong>Следующий урок:</strong> 7.1.3 — Intrinsic и Post-hoc методы.</p>`,
        en:`<h3>Key takeaways</h3><ul><li>Local scope answers a question about one instance and one prediction.</li><li>Global scope describes a model over a defined population and depends on its representativeness.</li><li>Subgroup analysis reveals heterogeneity between segments.</li><li>SHAP/LIME can provide local explanations; permutation importance, PDP and ICE help study many instances but answer different questions.</li><li>Averaging local contributions can hide sign, spread, interactions and small groups.</li><li>An explanation does not prove causality, fairness or correctness.</li></ul>
        <h3>Practical assignment</h3><p>Using your own or an open tabular dataset, select one model and perform a small explanation-scope audit:</p><ol><li>State the research question and target population.</li><li>Compute global permutation importance on a held-out set.</li><li>Select two instances with different predictions and calculate local sensitivity or SHAP explanations.</li><li>Plot PDP and ICE for one numeric feature; note where individual curves diverge.</li><li>If justified subgroups exist, compare them separately.</li><li>Write a report of up to 300 words: what was found, for which sample, what the limitations are and what cannot be concluded.</li></ol>
        <p><strong>Quality criterion:</strong> distinguish local and global quantities, do not compare incompatible scales, state the baseline/metric and avoid causal claims.</p>
        <h3>Glossary</h3><dl><dt><strong>Local explanation</strong></dt><dd>An explanation of model behaviour for one instance or prediction.</dd><dt><strong>Global explanation</strong></dt><dd>A description of model behaviour over a selected population or input region.</dd><dt><strong>Subgroup analysis</strong></dt><dd>Analysis of a segment to identify heterogeneity.</dd><dt><strong>Baseline</strong></dt><dd>A reference value against which predictions or contributions are interpreted.</dd><dt><strong>Permutation importance</strong></dt><dd>Change in a selected metric after shuffling a feature.</dd><dt><strong>PDP</strong></dt><dd>Average model prediction at a fixed value of one feature.</dd><dt><strong>ICE</strong></dt><dd>Individual prediction curves as one feature changes.</dd><dt><strong>Heterogeneity</strong></dt><dd>Differences in model behaviour or effects across instances and groups.</dd></dl>
        <h3>References and further reading</h3><ol><li>Molnar, C. <em>Interpretable Machine Learning</em>, Global Model-Agnostic Methods, Partial Dependence and Permutation Feature Importance. <a href="https://christophm.github.io/interpretable-ml-book/" target="_blank" rel="noopener">Open book</a>.</li><li>Friedman, J. H. (2001). Greedy Function Approximation: A Gradient Boosting Machine. <em>Annals of Statistics</em>, 29(5), 1189–1232. <a href="https://doi.org/10.1214/aos/1013203451" target="_blank" rel="noopener">DOI</a>.</li><li>Goldstein, A. et al. (2015). Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation. <em>Journal of Computational and Graphical Statistics</em>, 24(1), 44–65. <a href="https://doi.org/10.1080/10618600.2014.907095" target="_blank" rel="noopener">DOI</a>.</li><li>Apley, D. W. & Zhu, J. (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. <em>JRSS Series B</em>, 82(4), 1059–1086. <a href="https://doi.org/10.1111/rssb.12377" target="_blank" rel="noopener">DOI (ALE)</a>.</li><li>Lundberg, S. M. & Lee, S.-I. (2017). A Unified Approach to Interpreting Model Predictions. <em>NeurIPS</em>. <a href="https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html" target="_blank" rel="noopener">Paper</a>.</li><li>Ribeiro, M. T., Singh, S. & Guestrin, C. (2016). “Why Should I Trust You?” Explaining the Predictions of Any Classifier. <em>KDD</em>. <a href="https://doi.org/10.1145/2939672.2939778" target="_blank" rel="noopener">DOI</a>.</li><li>scikit-learn documentation: <a href="https://scikit-learn.org/stable/modules/permutation_importance.html" target="_blank" rel="noopener">Permutation feature importance</a>; <a href="https://scikit-learn.org/stable/modules/partial_dependence.html" target="_blank" rel="noopener">Partial dependence and ICE</a>.</li></ol>
        <p class="source-note">Original AI Research DCH School learning material. Numerical examples and the lab dataset are synthetic; they are not financial advice or assessments of real borrowers.</p>
        <p><strong>Next lesson:</strong> 7.1.3 — Intrinsic and Post-hoc Methods.</p>`,
        zh:`<h3>核心结论</h3><ul><li>局部范围回答关于单个样本和单次预测的问题。</li><li>全局范围描述模型在明确总体上的行为，并依赖该总体的代表性。</li><li>子群体分析有助于发现不同群体之间的异质性。</li><li>SHAP/LIME 可以提供局部解释；置换重要性、PDP 和 ICE 可用于研究多个样本，但回答的问题不同。</li><li>对局部贡献求平均可能掩盖方向、离散程度、交互作用和小群体。</li><li>解释本身不能证明因果关系、公平性或正确性。</li></ul>
        <h3>实践任务</h3><p>使用自己的或公开的表格数据集，选择一个模型，完成一次解释范围小型审计：</p><ol><li>说明研究问题和目标总体。</li><li>在留出集上计算全局置换重要性。</li><li>选择两个预测不同的样本，计算局部敏感性或 SHAP 解释。</li><li>对一个数值特征绘制 PDP 和 ICE，并指出个体曲线分歧的位置。</li><li>如果存在有依据的子群体，分别进行比较。</li><li>撰写不超过 300 字的报告：发现了什么、针对哪个样本、有哪些局限，以及不能得出什么结论。</li></ol>
        <p><strong>质量标准：</strong>明确区分局部和全局量，不比较不兼容的尺度，注明基准值／指标，并避免因果断言。</p>
        <h3>术语表</h3><dl><dt><strong>Local explanation（局部解释）</strong></dt><dd>针对单个样本或预测的模型行为解释。</dd><dt><strong>Global explanation（全局解释）</strong></dt><dd>描述模型在选定总体或输入区域中的行为。</dd><dt><strong>Subgroup analysis（子群体分析）</strong></dt><dd>分析某个样本群体，以识别异质性。</dd><dt><strong>Baseline（基准值）</strong></dt><dd>解释预测或贡献时使用的参考值。</dd><dt><strong>Permutation importance（置换重要性）</strong></dt><dd>打乱特征后指定指标的变化。</dd><dt><strong>PDP</strong></dt><dd>某个特征固定为指定值时的模型平均预测。</dd><dt><strong>ICE</strong></dt><dd>改变一个特征时，各样本的个体预测曲线。</dd><dt><strong>Heterogeneity（异质性）</strong></dt><dd>不同样本和群体之间模型行为或效应的差异。</dd></dl>
        <h3>参考文献与延伸阅读</h3><ol><li>Molnar, C. <em>Interpretable Machine Learning</em>，全局模型无关方法、部分依赖和置换特征重要性章节。<a href="https://christophm.github.io/interpretable-ml-book/" target="_blank" rel="noopener">开放教材</a>。</li><li>Friedman, J. H. (2001). Greedy Function Approximation: A Gradient Boosting Machine. <em>Annals of Statistics</em>, 29(5), 1189–1232. <a href="https://doi.org/10.1214/aos/1013203451" target="_blank" rel="noopener">DOI</a>。</li><li>Goldstein, A. 等 (2015). Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation. <em>Journal of Computational and Graphical Statistics</em>, 24(1), 44–65. <a href="https://doi.org/10.1080/10618600.2014.907095" target="_blank" rel="noopener">DOI</a>。</li><li>Apley, D. W. & Zhu, J. (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. <em>JRSS Series B</em>, 82(4), 1059–1086. <a href="https://doi.org/10.1111/rssb.12377" target="_blank" rel="noopener">DOI（ALE）</a>。</li><li>Lundberg, S. M. & Lee, S.-I. (2017). A Unified Approach to Interpreting Model Predictions. <em>NeurIPS</em>. <a href="https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html" target="_blank" rel="noopener">论文</a>。</li><li>Ribeiro, M. T., Singh, S. & Guestrin, C. (2016). “Why Should I Trust You?” Explaining the Predictions of Any Classifier. <em>KDD</em>. <a href="https://doi.org/10.1145/2939672.2939778" target="_blank" rel="noopener">DOI</a>。</li><li>scikit-learn 文档：<a href="https://scikit-learn.org/stable/modules/permutation_importance.html" target="_blank" rel="noopener">置换特征重要性</a>；<a href="https://scikit-learn.org/stable/modules/partial_dependence.html" target="_blank" rel="noopener">部分依赖与 ICE</a>。</li></ol>
        <p class="source-note">AI Research DCH School 原创教学材料。数值案例和实验数据均为合成数据，不构成金融建议，也不代表对真实借款人的评估。</p>
        <p><strong>下一课：</strong>7.1.3 — Intrinsic 与 Post-hoc 方法。</p>`
      }
    }
  ],
  quiz: {
    labels:{
      ru:{title:"Самопроверка: локальные и глобальные объяснения",submit:"Проверить ответы",correct:"Верно",incorrect:"Неверно",score:"Результат",required:"Ответьте на все вопросы.",saved:"Ответы проверены"},
      en:{title:"Self-check: local and global explanations",submit:"Check answers",correct:"Correct",incorrect:"Not quite",score:"Score",required:"Please answer every question.",saved:"Answers checked"},
      zh:{title:"自我检查：局部解释与全局解释",submit:"检查答案",correct:"正确",incorrect:"需要复习",score:"成绩",required:"请回答所有问题。",saved:"答案已检查"}
    },
    questions:[
      {
        options:{ru:["Объяснить один прогноз для выбранного объекта","Описать поведение модели на всей популяции","Сравнить архитектуры моделей"],en:["Explain one prediction for a selected instance","Describe model behaviour across a population","Compare model architectures"],zh:["解释选定样本的一次预测","描述模型在整个总体上的行为","比较模型架构"]},
        answer:0,
        why:{ru:"Локальный анализ имеет единицей один объект или один прогноз.",en:"A local analysis uses one instance or prediction as its unit.",zh:"局部分析以单个样本或单次预测为分析单位。"}
      },
      {
        options:{ru:["Одинаковое объяснение для каждого объекта","Зависимость от популяции и области входов","Доказательство причинности"],en:["The same explanation for every instance","Dependence on the population and input region","Proof of causality"],zh:["每个样本都得到相同解释","取决于总体和输入区域","因果关系的证明"]},
        answer:1,
        why:{ru:"Глобальное объяснение всегда относится к определённой выборке, периоду и области применимости.",en:"A global explanation is always relative to a defined sample, period and domain.",zh:"全局解释始终相对于明确的样本、时期和适用范围。"}
      },
      {
        options:{ru:["PDP","Локальная атрибуция SHAP для одного объекта","Контрфактический поиск"],en:["PDP","A local SHAP attribution for one instance","Counterfactual search"],zh:["PDP","单个样本的局部 SHAP 归因","反事实搜索"]},
        answer:0,
        why:{ru:"PDP усредняет прогнозы при фиксированных значениях признака по выбранным объектам.",en:"PDP averages predictions at fixed feature values over selected instances.",zh:"PDP 对选定样本在特征固定取值下的预测进行平均。"}
      },
      {
        options:{ru:["Насколько ухудшится выбранная метрика после перемешивания признака","Вклад признака в конкретный прогноз","Причинный эффект признака"],en:["How much a selected metric drops after shuffling a feature","The feature's contribution to one prediction","The feature's causal effect"],zh:["打乱特征后指定指标下降多少","特征对某次预测的贡献","特征的因果效应"]},
        answer:0,
        why:{ru:"Permutation importance — глобальная/групповая оценка зависимости качества от признака, а не локальная атрибуция.",en:"Permutation importance measures global or subgroup performance dependence, not a local attribution.",zh:"置换重要性衡量全局或子群体层面的性能依赖，而不是局部归因。"}
      },
      {
        options:{ru:["У всех объектов одинаковая реакция","Среднее скрывает различия и противоположные направления","Модель перестаёт обучаться"],en:["All instances respond identically","The average hides differences and opposite directions","The model stops training"],zh:["所有样本的响应都相同","平均值掩盖差异和相反方向","模型停止训练"]},
        answer:1,
        why:{ru:"Разные локальные реакции могут компенсироваться при усреднении; нужны распределения и анализ сегментов.",en:"Different local responses can cancel when averaged; inspect distributions and subgroups.",zh:"不同的局部响应在平均时可能相互抵消，因此应检查分布和子群体。"}
      },
      {
        options:{ru:["Это SHAP-значение","Это локальная чувствительность к выбранной замене, не причинный эффект","Это глобальная важность"],en:["It is a SHAP value","It is local sensitivity to a chosen replacement, not a causal effect","It is global importance"],zh:["这是 SHAP 值","这是对指定替换的局部敏感性，不是因果效应","这是全局重要性"]},
        answer:1,
        why:{ru:"Замена признака на медиану — простая контролируемая проверка чувствительности; она не распределяет вклад по аксиомам SHAP.",en:"Median replacement is a simple controlled sensitivity check; it does not allocate contributions under SHAP axioms.",zh:"用中位数替换特征是一种简单的受控敏感性检查，并未按照 SHAP 公理分配贡献。"}
      },
      {
        options:{ru:["Потому что ICE показывает индивидуальные кривые и неоднородность","Потому что ICE всегда доказывает причинность","Потому что PDP нельзя усреднять"],en:["Because ICE shows individual curves and heterogeneity","Because ICE always proves causality","Because PDP cannot be averaged"],zh:["因为 ICE 展示个体曲线和异质性","因为 ICE 总能证明因果关系","因为 PDP 不能求平均"]},
        answer:0,
        why:{ru:"ICE помогает увидеть разброс и взаимодействия, которые скрываются в средней PDP-кривой.",en:"ICE reveals spread and interactions that can be hidden by an average PDP curve.",zh:"ICE 有助于发现平均 PDP 曲线可能掩盖的离散性和交互作用。"}
      },
      {
        options:{ru:["Метод, выборку, метрику, baseline и границы применимости","Только самый высокий вклад","Только скриншот графика"],en:["Method, sample, metric, baseline and scope limitations","Only the largest contribution","Only a screenshot of the plot"],zh:["方法、样本、指标、基准值和适用范围限制","只有最大的贡献值","只有图表截图"]},
        answer:0,
        why:{ru:"Без контекста невозможно понять, к какой популяции и шкале относится объяснение и какие выводы допустимы.",en:"Without context, readers cannot know the population, scale or permissible conclusions.",zh:"缺少上下文，读者无法判断解释对应的总体、尺度以及允许得出的结论。"}
      }
    ]
  }
};
