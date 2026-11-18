/* DCH School — complete multilingual lesson 7.1.3. */
window.DCH_INTRINSIC_POSTHOC_LESSON = {
  "id": "xai-intrinsic-posthoc-713",
  "code": "7.1.3",
  "uid": "les-a-0170",
  "title": {
    "ru": "Intrinsic и Post-hoc методы",
    "en": "Intrinsic and Post-hoc Methods",
    "zh": "内在可解释方法与事后解释方法"
  },
  "lead": {
    "ru": "Сравним модели, чья структура сама по себе допускает содержательную интерпретацию, с методами, которые анализируют уже обученную модель извне. Научимся выбирать подход под задачу и проверять, насколько объяснение верно отражает поведение модели.",
    "en": "Compare models whose structure is directly interpretable with methods that explain an already-trained model from the outside. Learn to select an approach for a task and assess whether an explanation faithfully reflects model behaviour.",
    "zh": "比较结构本身可解释的模型与从外部分析已训练模型的方法。学习根据任务选择方法，并检验解释是否忠实反映模型行为。"
  },
  "outcomes": {
    "ru": [
      "Различать intrinsic interpretability и post-hoc explainability, не смешивая свойство модели и способ её анализа.",
      "Объяснять, почему линейные и логистические модели, небольшие деревья, GAM и списки правил могут быть интерпретируемыми при определённых условиях.",
      "Описывать общую схему post-hoc анализа: зафиксировать модель и данные, выбрать метод, проверить fidelity и ограничения.",
      "Различать model-specific и model-agnostic методы, локальные и глобальные объяснения.",
      "Сравнивать качество модели, понятность, fidelity, устойчивость и стоимость объяснения.",
      "Проводить воспроизводимое сравнение логистической регрессии и случайного леса с permutation importance и локальной чувствительностью в Python."
    ],
    "en": [
      "Distinguish intrinsic interpretability from post-hoc explainability: a model property versus an analysis method.",
      "Explain when linear and logistic models, small trees, GAMs and rule lists can be interpretable.",
      "Describe a post-hoc workflow: freeze the model and data, select a method, and assess fidelity and limitations.",
      "Distinguish model-specific from model-agnostic methods and local from global explanations.",
      "Compare predictive performance, comprehensibility, fidelity, stability and explanation cost.",
      "Reproduce a comparison of logistic regression and a random forest using permutation importance and local sensitivity in Python."
    ],
    "zh": [
      "区分内在可解释性与事后可解释性：前者是模型属性，后者是分析方法。",
      "说明线性与逻辑回归模型、小型决策树、广义加性模型和规则列表在何种条件下具有可解释性。",
      "描述事后分析流程：固定模型与数据、选择方法并评估忠实度和局限。",
      "区分模型特定方法与模型无关方法，以及局部解释与全局解释。",
      "比较预测性能、可理解性、忠实度、稳定性和解释成本。",
      "使用 Python 通过置换重要性和局部敏感性复现逻辑回归与随机森林的比较。"
    ]
  },
  "pages": [
    {
      "id": "distinction",
      "title": {
        "ru": "1. Два разных вопроса: как устроена модель и как её объяснить",
        "en": "1. Two questions: how a model is built and how to explain it",
        "zh": "1. 两个不同的问题：模型如何构建，以及如何解释模型"
      },
      "content": {
        "ru": "<p><strong>Intrinsic interpretability</strong> — свойство самой модели: её представление и вычисления допускают непосредственное содержательное прочтение. <strong>Post-hoc explanation</strong> — анализ поведения уже обученной модели дополнительным методом, не меняющим её исходную архитектуру и прогнозы.</p><p>Это не две взаимоисключающие «школы». Модель может быть прозрачной по конструкции, но всё равно нуждаться в проверке на данных. Сложную модель можно анализировать post-hoc, однако объяснение не превращает её внутреннее устройство в прозрачное.</p><figure class=\"xai-visual\"><figcaption>Два маршрута к пониманию модели</figcaption><svg class=\"xai-svg\" viewBox=\"0 0 720 220\" role=\"img\" aria-label=\"Intrinsic: interpretable model leads directly to reading its structure. Post-hoc: trained black-box model is analysed by an external explainer.\"><rect x=\"12\" y=\"25\" width=\"300\" height=\"170\" rx=\"16\" fill=\"var(--diagram-box)\" stroke=\"var(--diagram-box-stroke)\"/><rect x=\"408\" y=\"25\" width=\"300\" height=\"170\" rx=\"16\" fill=\"var(--diagram-box2)\" stroke=\"var(--diagram-box2-stroke)\"/><g fill=\"var(--diagram-title)\" font-size=\"19\" font-weight=\"700\" text-anchor=\"middle\"><text x=\"162\" y=\"58\">INTRINSIC</text><text x=\"558\" y=\"58\">POST-HOC</text></g><g fill=\"var(--diagram-muted)\" font-size=\"14\" text-anchor=\"middle\"><text x=\"162\" y=\"91\">Модель понятна по устройству</text><text x=\"162\" y=\"125\">Коэффициенты · правила · структура</text><text x=\"558\" y=\"91\">Модель уже обучена</text><text x=\"558\" y=\"125\">SHAP · LIME · permutation</text></g><path d=\"M162 145v24m-7-7 7 7 7-7M558 145v24m-7-7 7 7 7-7\" stroke=\"var(--diagram-title)\" stroke-width=\"2\" fill=\"none\"/></svg></figure><p>Ключевое различие: intrinsic объяснение читается из самой модели; post-hoc объяснение строится по наблюдаемому поведению модели на выбранных входах, возмущениях или выборке.</p>",
        "en": "<p><strong>Intrinsic interpretability</strong> is a property of the model itself: its representation and computations can be read in meaningful terms. A <strong>post-hoc explanation</strong> analyses an already-trained model with an additional method without changing its original architecture or predictions.</p><p>These are not mutually exclusive camps. A transparent model still needs empirical validation. A complex model can be analysed post-hoc, but an explanation does not make its internal mechanism transparent.</p><figure class=\"xai-visual\"><figcaption>Two routes to understanding a model</figcaption><svg class=\"xai-svg\" viewBox=\"0 0 720 220\" role=\"img\" aria-label=\"Intrinsic: interpretable model leads directly to reading its structure. Post-hoc: trained black-box model is analysed by an external explainer.\"><rect x=\"12\" y=\"25\" width=\"300\" height=\"170\" rx=\"16\" fill=\"var(--diagram-box)\" stroke=\"var(--diagram-box-stroke)\"/><rect x=\"408\" y=\"25\" width=\"300\" height=\"170\" rx=\"16\" fill=\"var(--diagram-box2)\" stroke=\"var(--diagram-box2-stroke)\"/><g fill=\"var(--diagram-title)\" font-size=\"19\" font-weight=\"700\" text-anchor=\"middle\"><text x=\"162\" y=\"58\">INTRINSIC</text><text x=\"558\" y=\"58\">POST-HOC</text></g><g fill=\"var(--diagram-muted)\" font-size=\"14\" text-anchor=\"middle\"><text x=\"162\" y=\"91\">Readable by construction</text><text x=\"162\" y=\"125\">Coefficients · rules · structure</text><text x=\"558\" y=\"91\">Model already trained</text><text x=\"558\" y=\"125\">SHAP · LIME · permutation</text></g><path d=\"M162 145v24m-7-7 7 7 7-7M558 145v24m-7-7 7 7 7-7\" stroke=\"var(--diagram-title)\" stroke-width=\"2\" fill=\"none\"/></svg></figure><p>The key distinction: intrinsic explanations are read from the model; post-hoc explanations are constructed from observed behaviour on selected inputs, perturbations or samples.</p>",
        "zh": "<p><strong>内在可解释性（Intrinsic interpretability）</strong>是模型本身的属性：其表示方式和计算过程可以直接用有意义的概念理解。<strong>事后解释（Post-hoc explanation）</strong>则是在模型训练完成后，使用额外方法分析其行为，而不改变原有架构或预测。</p><p>这并不是两个互斥阵营。结构透明的模型仍需通过数据验证。复杂模型可以接受事后分析，但解释方法不会因此让模型内部机制变得透明。</p><figure class=\"xai-visual\"><figcaption>理解模型的两条路径</figcaption><svg class=\"xai-svg\" viewBox=\"0 0 720 220\" role=\"img\" aria-label=\"内在方法：直接阅读可解释模型的结构。事后方法：使用外部解释器分析已训练的黑盒模型。\"><rect x=\"12\" y=\"25\" width=\"300\" height=\"170\" rx=\"16\" fill=\"var(--diagram-box)\" stroke=\"var(--diagram-box-stroke)\"/><rect x=\"408\" y=\"25\" width=\"300\" height=\"170\" rx=\"16\" fill=\"var(--diagram-box2)\" stroke=\"var(--diagram-box2-stroke)\"/><g fill=\"var(--diagram-title)\" font-size=\"19\" font-weight=\"700\" text-anchor=\"middle\"><text x=\"162\" y=\"58\">INTRINSIC</text><text x=\"558\" y=\"58\">POST-HOC</text></g><g fill=\"var(--diagram-muted)\" font-size=\"14\" text-anchor=\"middle\"><text x=\"162\" y=\"91\">结构本身可读</text><text x=\"162\" y=\"125\">系数 · 规则 · 结构</text><text x=\"558\" y=\"91\">模型已经训练完成</text><text x=\"558\" y=\"125\">SHAP · LIME · 置换</text></g><path d=\"M162 145v24m-7-7 7 7 7-7M558 145v24m-7-7 7 7 7-7\" stroke=\"var(--diagram-title)\" stroke-width=\"2\" fill=\"none\"/></svg></figure><p>核心区别：内在解释直接读取模型本身；事后解释则根据模型在选定输入、扰动或样本上的可观察行为构建。</p>"
      }
    },
    {
      "id": "intrinsic",
      "title": {
        "ru": "2. Какие модели могут быть интерпретируемыми по конструкции",
        "en": "2. Which models can be interpretable by design",
        "zh": "2. 哪些模型可以通过结构实现可解释"
      },
      "content": {
        "ru": "<p><strong>Линейная регрессия</strong> задаёт прогноз как взвешенную сумму признаков: \\(\\hat y=\\beta_0+\\sum_{j=1}^{p}\\beta_jx_j\\). При корректной предобработке, разумном масштабе признаков и отсутствии сильной коллинеарности коэффициенты можно интерпретировать как условную связь признака с прогнозом при фиксированных остальных признаках.</p><p><strong>Логистическая регрессия</strong> моделирует логарифм шансов: \\(\\log\\frac{p}{1-p}=\\beta_0+\\sum_j\\beta_jx_j\\). Коэффициент относится к log-odds, а \\(e^{\\beta_j}\\) — к отношению шансов, не к изменению вероятности на фиксированное число процентных пунктов.</p><p><strong>Небольшое дерево решений</strong> читается как последовательность условий. Глубокое дерево может стать громоздким, а локальная простота не гарантирует устойчивости к небольшим изменениям данных.</p><p><strong>GAM</strong> (generalized additive model) складывает отдельные функции признаков: \\(g(E[Y])=\\beta_0+\\sum_j f_j(x_j)\\). Графики \\(f_j\\) показывают форму связи; взаимодействия нужно включать отдельно.</p><p><strong>Списки правил</strong> дают последовательность условий «если — то». Их понятность зависит от длины, перекрытий, порядка правил и того, насколько полно они покрывают случаи.</p><p>Ни один класс не становится автоматически интерпретируемым во всех контекстах: важны число признаков, кодирование, взаимодействия, глубина, масштаб и аудитория.</p>",
        "en": "<p><strong>Linear regression</strong> predicts a weighted sum: \\(\\hat y=\\beta_0+\\sum_{j=1}^{p}\\beta_jx_j\\). With sound preprocessing, meaningful feature scales and manageable collinearity, coefficients describe conditional associations with the prediction, holding other features fixed.</p><p><strong>Logistic regression</strong> models log-odds: \\(\\log\\frac{p}{1-p}=\\beta_0+\\sum_j\\beta_jx_j\\). A coefficient is on the log-odds scale; \\(e^{\\beta_j}\\) is an odds ratio, not a fixed percentage-point change in probability.</p><p><strong>A small decision tree</strong> can be read as a sequence of conditions. A deep tree becomes cumbersome, and local simplicity does not guarantee stability under small data changes.</p><p>A <strong>generalized additive model (GAM)</strong> combines feature-specific functions: \\(g(E[Y])=\\beta_0+\\sum_j f_j(x_j)\\). The functions reveal shape; interactions must be modelled separately.</p><p><strong>Rule lists</strong> express ordered if–then conditions. Comprehensibility depends on list length, overlap, ordering and coverage.</p><p>No model family is automatically interpretable in every context. Feature count, encoding, interactions, depth, scale and audience all matter.</p>",
        "zh": "<p><strong>线性回归</strong>将预测表示为特征的加权和：\\(\\hat y=\\beta_0+\\sum_{j=1}^{p}\\beta_jx_j\\)。在预处理合理、特征尺度明确且共线性可控时，系数描述在其他特征固定条件下，特征与预测之间的条件关联。</p><p><strong>逻辑回归</strong>建模对数优势：\\(\\log\\frac{p}{1-p}=\\beta_0+\\sum_j\\beta_jx_j\\)。系数位于 log-odds 尺度；\\(e^{\\beta_j}\\) 是优势比，并非概率固定增加的百分点。</p><p><strong>小型决策树</strong>可以读作一系列条件判断。深树会变得难以理解，而且局部结构简单并不保证对数据微小变化保持稳定。</p><p><strong>广义加性模型（GAM）</strong>将各特征函数相加：\\(g(E[Y])=\\beta_0+\\sum_j f_j(x_j)\\)。函数曲线展示关系形状；交互作用需要单独建模。</p><p><strong>规则列表</strong>以有序的“如果—那么”条件表达决策。其可理解性取决于规则长度、重叠、顺序和覆盖范围。</p><p>没有任何模型类别在所有场景下都自动可解释。特征数量、编码、交互、深度、尺度和受众都很重要。</p>"
      }
    },
    {
      "id": "posthoc",
      "title": {
        "ru": "3. Post-hoc методы: что именно они объясняют",
        "en": "3. Post-hoc methods: what they actually explain",
        "zh": "3. 事后方法：它们究竟解释什么"
      },
      "content": {
        "ru": "<p>Post-hoc методы применяются после обучения и обычно делятся на несколько семейств.</p><ul><li><strong>Атрибуция признаков:</strong> SHAP, LIME и Integrated Gradients оценивают вклад входных компонентов в выбранный прогноз или поведение модели. Их предположения и область применимости различаются.</li><li><strong>Перестановочные методы:</strong> permutation feature importance измеряет изменение выбранной метрики после нарушения информации признака на заданной выборке.</li><li><strong>Зависимости и чувствительность:</strong> PDP, ICE и ALE исследуют, как прогноз меняется при варьировании признаков; они не доказывают причинный эффект.</li><li><strong>Суррогатные модели:</strong> простая модель приближает поведение сложной в выбранной области. Её объяснение полезно лишь вместе с оценкой fidelity.</li><li><strong>Контрфактические объяснения:</strong> ищут изменения входа, при которых прогноз достигает заданного результата; важны реализуемость и правдоподобие.</li></ul><p>Метод может быть <em>model-specific</em> (использует внутреннюю структуру/градиенты конкретного класса) или <em>model-agnostic</em> (обращается к модели через интерфейс прогнозирования). Model-agnostic не означает «без предположений».</p>",
        "en": "<p>Post-hoc methods are applied after training and fall into several families.</p><ul><li><strong>Feature attribution:</strong> SHAP, LIME and Integrated Gradients estimate contributions of input components to a selected prediction or model behaviour. Their assumptions and scopes differ.</li><li><strong>Permutation methods:</strong> permutation feature importance measures the change in a chosen metric after disrupting feature information on a specified dataset.</li><li><strong>Dependence and sensitivity:</strong> PDP, ICE and ALE examine how predictions vary as features change; they do not establish causal effects.</li><li><strong>Surrogate models:</strong> a simpler model approximates a complex model in a chosen region. Its explanation is useful only together with a fidelity assessment.</li><li><strong>Counterfactual explanations:</strong> search for input changes that lead to a desired prediction; feasibility and plausibility matter.</li></ul><p>A method may be <em>model-specific</em> (using internal structure or gradients) or <em>model-agnostic</em> (querying the model through its prediction interface). Model-agnostic does not mean assumption-free.</p>",
        "zh": "<p>事后方法在模型训练完成后应用，通常可分为几个类别。</p><ul><li><strong>特征归因：</strong>SHAP、LIME 和 Integrated Gradients 估计输入成分对某个预测或模型行为的贡献。它们的假设和适用范围各不相同。</li><li><strong>置换方法：</strong>置换特征重要性衡量在指定数据集上破坏特征信息后，选定指标发生的变化。</li><li><strong>依赖与敏感性：</strong>PDP、ICE 和 ALE 研究改变特征时预测如何变化；它们不能证明因果效应。</li><li><strong>代理模型：</strong>用简单模型在指定区域近似复杂模型。只有同时评估忠实度，这种解释才有意义。</li><li><strong>反事实解释：</strong>寻找能使预测达到目标结果的输入变化；可行性与合理性至关重要。</li></ul><p>方法可以是<strong>模型特定（model-specific）</strong>的（利用特定模型的内部结构或梯度），也可以是<strong>模型无关（model-agnostic）</strong>的（通过预测接口查询模型）。模型无关并不意味着没有假设。</p>"
      }
    },
    {
      "id": "fidelity",
      "title": {
        "ru": "4. Fidelity: насколько объяснение похоже на поведение модели",
        "en": "4. Fidelity: how well an explanation matches model behaviour",
        "zh": "4. 忠实度：解释与模型行为有多一致"
      },
      "content": {
        "ru": "<p>Post-hoc объяснение — отдельный объект оценки. Для локального суррогата можно измерять согласие с исходной моделью в окрестности объекта; для глобального суррогата — на отложенной репрезентативной выборке. Это и есть один из смыслов <strong>fidelity</strong>.</p><p>Высокая fidelity не гарантирует, что объяснение понятно человеку, справедливо, причинно корректно или устойчиво. Низкая fidelity означает, что простая история плохо аппроксимирует исходную модель — даже если выглядит убедительно.</p><p>Проверяйте: область, на которой измерялась fidelity; распределение и размер выборки; метрику согласия; чувствительность к seed и параметрам; поведение вне обучающей окрестности. Для feature attribution дополнительно полезны sanity checks и тесты удаления/перестановки признаков.</p><p><strong>Важно:</strong> объяснение модели не является объяснением реального мира. Если модель использует корреляцию, атрибуция отражает поведение модели, а не доказанную причинную связь.</p>",
        "en": "<p>A post-hoc explanation is an object to evaluate in its own right. For a local surrogate, measure agreement with the original model around the instance; for a global surrogate, use a representative held-out sample. This is one meaning of <strong>fidelity</strong>.</p><p>High fidelity does not guarantee human comprehensibility, fairness, causal validity or stability. Low fidelity means a simple account poorly approximates the original model—even if it looks persuasive.</p><p>Report the evaluation region, sample distribution and size, agreement metric, sensitivity to random seeds and parameters, and behaviour outside the sampled neighbourhood. Feature attributions also benefit from sanity checks and feature deletion/permutation tests.</p><p><strong>Important:</strong> explaining a model is not the same as explaining the world. If a model uses correlation, an attribution describes model behaviour, not an established causal relationship.</p>",
        "zh": "<p>事后解释本身也是需要评估的对象。对于局部代理模型，可以测量其在样本邻域内与原模型的一致程度；对于全局代理模型，则应使用具有代表性的留出样本。这是<strong>忠实度（fidelity）</strong>的一种含义。</p><p>高忠实度并不保证人类可理解性、公平性、因果有效性或稳定性。低忠实度意味着简单解释无法很好地近似原模型，即使它看起来很有说服力。</p><p>应报告评估区域、样本分布与规模、一致性指标、对随机种子和参数的敏感性，以及样本邻域之外的行为。特征归因还可以通过 sanity checks 和特征删除/置换测试进行检验。</p><p><strong>重要：</strong>解释模型不等于解释现实世界。如果模型利用的是相关性，归因描述的是模型行为，而不是已证实的因果关系。</p>"
      }
    },
    {
      "id": "tradeoffs",
      "title": {
        "ru": "5. Как выбирать: прозрачность, качество и цена ошибки",
        "en": "5. Choosing an approach: transparency, performance and the cost of error",
        "zh": "5. 如何选择：透明度、性能与错误代价"
      },
      "content": {
        "ru": "<p>Не существует универсального правила «простая модель всегда лучше» или «точная модель всегда важнее». Выбор зависит от последствий ошибки, требований регулирования, аудитории, доступных данных и способности валидировать объяснения.</p><div class=\"xai-table-wrap\"><table><thead><tr><th>Критерий</th><th>Intrinsic</th><th>Post-hoc</th></tr></thead><tbody><tr><td>Источник объяснения</td><td>Структура самой модели</td><td>Дополнительный анализ поведения</td></tr><tr><td>Область применимости</td><td>Конкретный класс/представление</td><td>Зависит от метода и области данных</td></tr><tr><td>Главный риск</td><td>Сложная для чтения структура или слабое качество</td><td>Низкая fidelity, нестабильность, ложная уверенность</td></tr><tr><td>Проверка</td><td>Качество, корректность предположений, понятность</td><td>Fidelity, устойчивость, sanity checks</td></tr></tbody></table></div><p>Практический процесс: (1) определить решение и аудиторию; (2) задать минимально приемлемое качество; (3) проверить, можно ли использовать прозрачную модель; (4) если нужна сложная модель — выбрать post-hoc метод под вопрос; (5) оценить fidelity и устойчивость; (6) документировать ограничения и остаточную неопределённость.</p>",
        "en": "<p>There is no universal rule that “a simple model is always better” or “accuracy always comes first”. The choice depends on the consequences of error, regulatory requirements, audience, available data and the ability to validate explanations.</p><div class=\"xai-table-wrap\"><table><thead><tr><th>Criterion</th><th>Intrinsic</th><th>Post-hoc</th></tr></thead><tbody><tr><td>Source of explanation</td><td>Model structure</td><td>Additional behaviour analysis</td></tr><tr><td>Scope</td><td>Specific model class/representation</td><td>Depends on method and data region</td></tr><tr><td>Main risk</td><td>Unreadable structure or weak performance</td><td>Low fidelity, instability, false confidence</td></tr><tr><td>Validation</td><td>Performance, assumptions, comprehensibility</td><td>Fidelity, stability, sanity checks</td></tr></tbody></table></div><p>A practical workflow: (1) define the decision and audience; (2) set a minimum acceptable performance; (3) test whether a transparent model is adequate; (4) if a complex model is needed, select a post-hoc method for the question; (5) evaluate fidelity and stability; (6) document limitations and residual uncertainty.</p>",
        "zh": "<p>不存在“简单模型总是更好”或“准确率永远优先”的通用规则。选择取决于错误后果、监管要求、受众、可用数据以及验证解释的能力。</p><div class=\"xai-table-wrap\"><table><thead><tr><th>标准</th><th>内在方法</th><th>事后方法</th></tr></thead><tbody><tr><td>解释来源</td><td>模型自身结构</td><td>额外的行为分析</td></tr><tr><td>适用范围</td><td>特定模型类别/表示</td><td>取决于方法和数据区域</td></tr><tr><td>主要风险</td><td>结构难以阅读或性能不足</td><td>忠实度低、不稳定、虚假信心</td></tr><tr><td>验证方式</td><td>性能、假设、可理解性</td><td>忠实度、稳定性、合理性检查</td></tr></tbody></table></div><p>实践流程：(1) 明确决策与受众；(2) 设定最低可接受性能；(3) 检验透明模型是否足够；(4) 若必须使用复杂模型，则根据问题选择事后方法；(5) 评估忠实度与稳定性；(6) 记录局限和剩余不确定性。</p>"
      }
    },
    {
      "id": "lab",
      "title": {
        "ru": "6. Практика: прозрачная модель против сложной модели",
        "en": "6. Lab: an interpretable model versus a complex model",
        "zh": "6. 实践：可解释模型与复杂模型的比较"
      },
      "content": {
        "ru": "<p>Лаборатория использует синтетическую задачу регрессии с фиксированным seed. Сравним линейную регрессию как прозрачную baseline-модель и случайный лес как более гибкую модель. Затем применим к лесу permutation importance и локальную проверку чувствительности. Код рассчитан на Python, NumPy, pandas и scikit-learn.</p><p><strong>Шаг 1. Данные и разбиение.</strong></p><pre><code class=\"language-python\">import numpy as np\nimport pandas as pd\nfrom sklearn.datasets import make_friedman1\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.metrics import mean_squared_error, r2_score\n\nX, y = make_friedman1(n_samples=1800, n_features=8, noise=1.5, random_state=42)\nfeature_names = [f\"x{i}\" for i in range(X.shape[1])]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.25, random_state=42\n)</code></pre><p><strong>Шаг 2. Обучение и сравнение качества.</strong></p><pre><code class=\"language-python\">linear = LinearRegression().fit(X_train, y_train)\nforest = RandomForestRegressor(\n    n_estimators=250, min_samples_leaf=3, random_state=42, n_jobs=-1\n).fit(X_train, y_train)\n\nfor name, model in [(\"Linear\", linear), (\"Random forest\", forest)]:\n    pred = model.predict(X_test)\n    print(name, \"RMSE:\", mean_squared_error(y_test, pred) ** 0.5,\n          \"R2:\", r2_score(y_test, pred))</code></pre><p><strong>Шаг 3. Прочитать intrinsic-модель.</strong> Коэффициенты линейной модели дают прямое описание её аддитивной структуры. Но Friedman-функция нелинейна и содержит взаимодействия: линейная модель может быть понятной, но недостаточно точной.</p><pre><code class=\"language-python\">coef = pd.Series(linear.coef_, index=feature_names)\nprint(\"Intercept:\", linear.intercept_)\nprint(coef.sort_values(key=np.abs, ascending=False))</code></pre><p><strong>Шаг 4. Post-hoc глобальный анализ леса.</strong> Важность оценивается на тестовой выборке относительно R². Это зависимость качества данной модели от признака в выбранной выборке, а не причинный эффект и не вклад в один прогноз.</p><pre><code class=\"language-python\">perm = permutation_importance(\n    forest, X_test, y_test, scoring=\"r2\", n_repeats=20,\n    random_state=42, n_jobs=-1\n)\nimportance = pd.Series(perm.importances_mean, index=feature_names)\nprint(importance.sort_values(ascending=False))</code></pre><p><strong>Шаг 5. Локальная чувствительность.</strong> Сравним прогноз выбранного объекта с прогнозом после замены одного признака его медианой. Это простая проверка чувствительности к конкретному вмешательству в вход, не SHAP, не LIME и не причинный эффект.</p><pre><code class=\"language-python\">i = 0\nx = X_test[i].copy()\nbase_prediction = forest.predict(x.reshape(1, -1))[0]\nfeature = 0\nx_changed = x.copy()\nx_changed[feature] = np.median(X_train[:, feature])\nchanged_prediction = forest.predict(x_changed.reshape(1, -1))[0]\nprint(\"base:\", base_prediction)\nprint(\"after replacement:\", changed_prediction)\nprint(\"delta:\", changed_prediction - base_prediction)</code></pre><p><strong>Шаг 6. Сформулировать вывод.</strong> Сопоставьте RMSE/R², коэффициенты, permutation importance и локальную чувствительность. Не сравнивайте числа, относящиеся к разным шкалам, как будто это один и тот же показатель. Повторите эксперимент с несколькими seed и зафиксируйте разброс.</p><p><strong>Контрольные вопросы к лаборатории:</strong> (a) какая модель лучше по тестовой метрике? (b) насколько читаемы её параметры? (c) что именно измеряет permutation importance? (d) почему локальная замена не является причинным выводом?</p>",
        "en": "<p>This lab uses a synthetic regression task with a fixed seed. Compare linear regression as an interpretable baseline with a random forest as a more flexible model. Then apply permutation importance and a local sensitivity check to the forest. The code uses Python, NumPy, pandas and scikit-learn.</p><p><strong>Step 1. Data and split.</strong></p><pre><code class=\"language-python\">import numpy as np\nimport pandas as pd\nfrom sklearn.datasets import make_friedman1\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.metrics import mean_squared_error, r2_score\n\nX, y = make_friedman1(n_samples=1800, n_features=8, noise=1.5, random_state=42)\nfeature_names = [f\"x{i}\" for i in range(X.shape[1])]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.25, random_state=42\n)</code></pre><p><strong>Step 2. Fit and compare predictive performance.</strong></p><pre><code class=\"language-python\">linear = LinearRegression().fit(X_train, y_train)\nforest = RandomForestRegressor(\n    n_estimators=250, min_samples_leaf=3, random_state=42, n_jobs=-1\n).fit(X_train, y_train)\n\nfor name, model in [(\"Linear\", linear), (\"Random forest\", forest)]:\n    pred = model.predict(X_test)\n    print(name, \"RMSE:\", mean_squared_error(y_test, pred) ** 0.5,\n          \"R2:\", r2_score(y_test, pred))</code></pre><p><strong>Step 3. Read the intrinsic model.</strong> Linear coefficients directly describe its additive structure. However, the Friedman target is nonlinear and includes interactions: the linear model may be readable but less accurate.</p><pre><code class=\"language-python\">coef = pd.Series(linear.coef_, index=feature_names)\nprint(\"Intercept:\", linear.intercept_)\nprint(coef.sort_values(key=np.abs, ascending=False))</code></pre><p><strong>Step 4. Global post-hoc analysis of the forest.</strong> Importance is evaluated on the test set using R². It measures this model's performance dependence on a feature in this sample—not a causal effect or a contribution to one prediction.</p><pre><code class=\"language-python\">perm = permutation_importance(\n    forest, X_test, y_test, scoring=\"r2\", n_repeats=20,\n    random_state=42, n_jobs=-1\n)\nimportance = pd.Series(perm.importances_mean, index=feature_names)\nprint(importance.sort_values(ascending=False))</code></pre><p><strong>Step 5. Local sensitivity.</strong> Compare a selected instance's prediction with the prediction after replacing one feature by its training median. This is a simple sensitivity check for a specified input change—not SHAP, not LIME and not a causal effect.</p><pre><code class=\"language-python\">i = 0\nx = X_test[i].copy()\nbase_prediction = forest.predict(x.reshape(1, -1))[0]\nfeature = 0\nx_changed = x.copy()\nx_changed[feature] = np.median(X_train[:, feature])\nchanged_prediction = forest.predict(x_changed.reshape(1, -1))[0]\nprint(\"base:\", base_prediction)\nprint(\"after replacement:\", changed_prediction)\nprint(\"delta:\", changed_prediction - base_prediction)</code></pre><p><strong>Step 6. Write a conclusion.</strong> Compare RMSE/R², coefficients, permutation importance and local sensitivity. Do not treat quantities on different scales as the same measure. Repeat with several seeds and report variability.</p><p><strong>Lab review:</strong> (a) which model performs better on the test metric? (b) how readable are its parameters? (c) what does permutation importance measure? (d) why is local replacement not a causal conclusion?</p>",
        "zh": "<p>本实验使用固定随机种子的合成回归任务。将线性回归作为可解释基线，与更灵活的随机森林进行比较；随后对随机森林应用置换重要性和局部敏感性检查。代码使用 Python、NumPy、pandas 和 scikit-learn。</p><p><strong>步骤 1：生成数据并划分。</strong></p><pre><code class=\"language-python\">import numpy as np\nimport pandas as pd\nfrom sklearn.datasets import make_friedman1\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.metrics import mean_squared_error, r2_score\n\nX, y = make_friedman1(n_samples=1800, n_features=8, noise=1.5, random_state=42)\nfeature_names = [f\"x{i}\" for i in range(X.shape[1])]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.25, random_state=42\n)</code></pre><p><strong>步骤 2：训练模型并比较预测性能。</strong></p><pre><code class=\"language-python\">linear = LinearRegression().fit(X_train, y_train)\nforest = RandomForestRegressor(\n    n_estimators=250, min_samples_leaf=3, random_state=42, n_jobs=-1\n).fit(X_train, y_train)\n\nfor name, model in [(\"Linear\", linear), (\"Random forest\", forest)]:\n    pred = model.predict(X_test)\n    print(name, \"RMSE:\", mean_squared_error(y_test, pred) ** 0.5,\n          \"R2:\", r2_score(y_test, pred))</code></pre><p><strong>步骤 3：读取内在可解释模型。</strong>线性模型系数直接描述其加性结构。但 Friedman 目标函数具有非线性和交互作用：线性模型可能容易理解，却不够准确。</p><pre><code class=\"language-python\">coef = pd.Series(linear.coef_, index=feature_names)\nprint(\"Intercept:\", linear.intercept_)\nprint(coef.sort_values(key=np.abs, ascending=False))</code></pre><p><strong>步骤 4：对随机森林进行全局事后分析。</strong>在测试集上使用 R² 评估重要性。它衡量该样本中模型性能对特征的依赖程度，而非因果效应，也不是单次预测的贡献。</p><pre><code class=\"language-python\">perm = permutation_importance(\n    forest, X_test, y_test, scoring=\"r2\", n_repeats=20,\n    random_state=42, n_jobs=-1\n)\nimportance = pd.Series(perm.importances_mean, index=feature_names)\nprint(importance.sort_values(ascending=False))</code></pre><p><strong>步骤 5：局部敏感性。</strong>比较某个样本的预测，以及将一个特征替换为训练集中位数后的预测。这只是针对特定输入变化的敏感性检查，不是 SHAP、不是 LIME，也不是因果效应。</p><pre><code class=\"language-python\">i = 0\nx = X_test[i].copy()\nbase_prediction = forest.predict(x.reshape(1, -1))[0]\nfeature = 0\nx_changed = x.copy()\nx_changed[feature] = np.median(X_train[:, feature])\nchanged_prediction = forest.predict(x_changed.reshape(1, -1))[0]\nprint(\"base:\", base_prediction)\nprint(\"after replacement:\", changed_prediction)\nprint(\"delta:\", changed_prediction - base_prediction)</code></pre><p><strong>步骤 6：撰写结论。</strong>比较 RMSE/R²、系数、置换重要性和局部敏感性。不要把不同尺度的数值当作同一种指标。使用多个随机种子重复实验并报告波动。</p><p><strong>实验复核：</strong>(a) 哪个模型的测试指标更好？(b) 模型参数有多容易理解？(c) 置换重要性衡量什么？(d) 为什么局部替换不是因果结论？</p>"
      }
    }
  ],
  "practice": {
    "ru": "<h2>Практическое задание</h2><p>Выполните лабораторию и подготовьте короткий отчёт:</p><ol><li>Зафиксируйте версии библиотек, seed и разбиение данных.</li><li>Сравните тестовые RMSE и R² обеих моделей.</li><li>Объясните три крупнейших по модулю коэффициента линейной модели с учётом того, что признаки синтетические и имеют заданную шкалу.</li><li>Покажите top-5 permutation importance и разброс по повторениям.</li><li>Для одного объекта опишите результат замены признака, не используя причинные формулировки.</li><li>Сделайте вывод, какой подход лучше подходит заданной задаче и что осталось неизвестным.</li></ol>",
    "en": "<h2>Practical assignment</h2><p>Complete the lab and prepare a short report:</p><ol><li>Record library versions, random seed and data split.</li><li>Compare test RMSE and R² for both models.</li><li>Explain the three largest linear coefficients in absolute value, noting that the features are synthetic and have a defined scale.</li><li>Show the top five permutation importances and their repeat-to-repeat spread.</li><li>Describe the feature-replacement result for one instance without causal language.</li><li>Conclude which approach suits the task and what remains unknown.</li></ol>",
    "zh": "<h2>实践任务</h2><p>完成实验并撰写简短报告：</p><ol><li>记录库版本、随机种子和数据划分。</li><li>比较两个模型在测试集上的 RMSE 和 R²。</li><li>解释线性模型中绝对值最大的三个系数，并说明特征为具有既定尺度的合成数据。</li><li>展示前五个置换重要性及重复实验中的波动。</li><li>描述一个样本的特征替换结果，避免使用因果措辞。</li><li>总结哪种方法更适合该任务，以及仍有哪些未知之处。</li></ol>"
  },
  "sources": {
    "ru": "<h2>Источники и дополнительное чтение</h2><ol><li>Rudin, C. (2019). <em>Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead.</em> Nature Machine Intelligence, 1, 206–215. <a href=\"https://doi.org/10.1038/s42256-019-0048-x\" target=\"_blank\" rel=\"noopener\">DOI</a>.</li><li>Lipton, Z. C. (2018). <em>The Mythos of Model Interpretability.</em> Queue, 16(3). <a href=\"https://doi.org/10.1145/3236386.3241340\" target=\"_blank\" rel=\"noopener\">DOI</a>.</li><li>Doshi-Velez, F. & Kim, B. (2017). <em>Towards A Rigorous Science of Interpretable Machine Learning.</em> <a href=\"https://arxiv.org/abs/1702.08608\" target=\"_blank\" rel=\"noopener\">arXiv</a>.</li><li>Ribeiro, M. T., Singh, S. & Guestrin, C. (2016). “Why Should I Trust You?” Explaining the Predictions of Any Classifier. KDD. <a href=\"https://doi.org/10.1145/2939672.2939778\" target=\"_blank\" rel=\"noopener\">DOI</a>.</li><li>Lundberg, S. M. & Lee, S.-I. (2017). A Unified Approach to Interpreting Model Predictions. NeurIPS. <a href=\"https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html\" target=\"_blank\" rel=\"noopener\">Proceedings</a>.</li><li>Molnar, C. <em>Interpretable Machine Learning.</em> <a href=\"https://christophm.github.io/interpretable-ml-book/\" target=\"_blank\" rel=\"noopener\">Open book</a>.</li><li>scikit-learn User Guide: <a href=\"https://scikit-learn.org/stable/modules/permutation_importance.html\" target=\"_blank\" rel=\"noopener\">Permutation feature importance</a>.</li></ol>",
    "en": "<h2>References and further reading</h2><ol><li>Rudin, C. (2019). <em>Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead.</em> Nature Machine Intelligence, 1, 206–215. <a href=\"https://doi.org/10.1038/s42256-019-0048-x\" target=\"_blank\" rel=\"noopener\">DOI</a>.</li><li>Lipton, Z. C. (2018). <em>The Mythos of Model Interpretability.</em> Queue, 16(3). <a href=\"https://doi.org/10.1145/3236386.3241340\" target=\"_blank\" rel=\"noopener\">DOI</a>.</li><li>Doshi-Velez, F. & Kim, B. (2017). <em>Towards A Rigorous Science of Interpretable Machine Learning.</em> <a href=\"https://arxiv.org/abs/1702.08608\" target=\"_blank\" rel=\"noopener\">arXiv</a>.</li><li>Ribeiro, M. T., Singh, S. & Guestrin, C. (2016). “Why Should I Trust You?” Explaining the Predictions of Any Classifier. KDD. <a href=\"https://doi.org/10.1145/2939672.2939778\" target=\"_blank\" rel=\"noopener\">DOI</a>.</li><li>Lundberg, S. M. & Lee, S.-I. (2017). A Unified Approach to Interpreting Model Predictions. NeurIPS. <a href=\"https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html\" target=\"_blank\" rel=\"noopener\">Proceedings</a>.</li><li>Molnar, C. <em>Interpretable Machine Learning.</em> <a href=\"https://christophm.github.io/interpretable-ml-book/\" target=\"_blank\" rel=\"noopener\">Open book</a>.</li><li>scikit-learn User Guide: <a href=\"https://scikit-learn.org/stable/modules/permutation_importance.html\" target=\"_blank\" rel=\"noopener\">Permutation feature importance</a>.</li></ol>",
    "zh": "<h2>参考文献与延伸阅读</h2><ol><li>Rudin, C. (2019). <em>Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead.</em> Nature Machine Intelligence, 1, 206–215. <a href=\"https://doi.org/10.1038/s42256-019-0048-x\" target=\"_blank\" rel=\"noopener\">DOI</a>。</li><li>Lipton, Z. C. (2018). <em>The Mythos of Model Interpretability.</em> Queue, 16(3). <a href=\"https://doi.org/10.1145/3236386.3241340\" target=\"_blank\" rel=\"noopener\">DOI</a>。</li><li>Doshi-Velez, F. & Kim, B. (2017). <em>Towards A Rigorous Science of Interpretable Machine Learning.</em> <a href=\"https://arxiv.org/abs/1702.08608\" target=\"_blank\" rel=\"noopener\">arXiv</a>。</li><li>Ribeiro, M. T., Singh, S. & Guestrin, C. (2016). “Why Should I Trust You?” Explaining the Predictions of Any Classifier. KDD. <a href=\"https://doi.org/10.1145/2939672.2939778\" target=\"_blank\" rel=\"noopener\">DOI</a>。</li><li>Lundberg, S. M. & Lee, S.-I. (2017). A Unified Approach to Interpreting Model Predictions. NeurIPS. <a href=\"https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html\" target=\"_blank\" rel=\"noopener\">论文</a>。</li><li>Molnar, C. <em>Interpretable Machine Learning.</em> <a href=\"https://christophm.github.io/interpretable-ml-book/\" target=\"_blank\" rel=\"noopener\">开放教材</a>。</li><li>scikit-learn 用户指南：<a href=\"https://scikit-learn.org/stable/modules/permutation_importance.html\" target=\"_blank\" rel=\"noopener\">置换特征重要性</a>。</li></ol>"
  },
  "glossary": {
    "ru": [
      [
        "Intrinsic interpretability",
        "Свойство модели, при котором её структура и вычисления непосредственно понятны."
      ],
      [
        "Post-hoc explanation",
        "Анализ поведения уже обученной модели дополнительным методом."
      ],
      [
        "Interpretable model",
        "Модель, чьё представление можно содержательно прочитать в заданном контексте."
      ],
      [
        "Model-specific method",
        "Метод объяснения, использующий устройство или градиенты определённого класса моделей."
      ],
      [
        "Model-agnostic method",
        "Метод, обращающийся к модели через общий интерфейс прогнозирования."
      ],
      [
        "Surrogate model",
        "Упрощённая модель, приближающая поведение исходной модели."
      ],
      [
        "Fidelity",
        "Степень согласия объяснения или суррогата с поведением исходной модели."
      ],
      [
        "Permutation importance",
        "Изменение выбранной метрики после перестановки значений признака."
      ],
      [
        "GAM",
        "Обобщённая аддитивная модель, складывающая функции отдельных признаков."
      ],
      [
        "Counterfactual explanation",
        "Описание минимального или допустимого изменения входа для достижения заданного результата."
      ]
    ],
    "en": [
      [
        "Intrinsic interpretability",
        "A model property: its structure and computations can be understood directly."
      ],
      [
        "Post-hoc explanation",
        "An additional analysis of an already-trained model's behaviour."
      ],
      [
        "Interpretable model",
        "A model whose representation can be meaningfully read in a defined context."
      ],
      [
        "Model-specific method",
        "An explanation method using the structure or gradients of a model class."
      ],
      [
        "Model-agnostic method",
        "A method querying a model through a general prediction interface."
      ],
      [
        "Surrogate model",
        "A simpler model approximating the behaviour of the original model."
      ],
      [
        "Fidelity",
        "The degree to which an explanation or surrogate agrees with the original model."
      ],
      [
        "Permutation importance",
        "Change in a selected metric after permuting a feature."
      ],
      [
        "GAM",
        "A generalized additive model combining feature-specific functions."
      ],
      [
        "Counterfactual explanation",
        "A description of an allowed input change that achieves a target outcome."
      ]
    ],
    "zh": [
      [
        "内在可解释性（Intrinsic interpretability）",
        "模型本身的属性：其结构和计算过程可以被直接理解。"
      ],
      [
        "事后解释（Post-hoc explanation）",
        "使用额外方法分析已经训练完成的模型行为。"
      ],
      [
        "可解释模型（Interpretable model）",
        "在特定语境下，其表示方式可以被有意义地理解的模型。"
      ],
      [
        "模型特定方法（Model-specific method）",
        "利用某类模型结构或梯度的解释方法。"
      ],
      [
        "模型无关方法（Model-agnostic method）",
        "通过通用预测接口查询模型的解释方法。"
      ],
      [
        "代理模型（Surrogate model）",
        "近似原模型行为的简化模型。"
      ],
      [
        "忠实度（Fidelity）",
        "解释或代理模型与原模型行为的一致程度。"
      ],
      [
        "置换重要性（Permutation importance）",
        "置换特征后选定指标发生的变化。"
      ],
      [
        "广义加性模型（GAM）",
        "将各特征函数组合起来的广义加性模型。"
      ],
      [
        "反事实解释（Counterfactual explanation）",
        "描述允许的输入变化如何实现目标结果。"
      ]
    ]
  },
  "quiz": {
    "labels": {
      "ru": {
        "title": "Самопроверка",
        "submit": "Проверить ответы",
        "correct": "Верно",
        "incorrect": "Неверно",
        "score": "Результат",
        "required": "Ответьте на все вопросы.",
        "saved": "Ответы проверены"
      },
      "en": {
        "title": "Self-check",
        "submit": "Check answers",
        "correct": "Correct",
        "incorrect": "Incorrect",
        "score": "Score",
        "required": "Please answer every question.",
        "saved": "Answers checked"
      },
      "zh": {
        "title": "自我检查",
        "submit": "检查答案",
        "correct": "正确",
        "incorrect": "错误",
        "score": "成绩",
        "required": "请回答所有问题。",
        "saved": "已检查答案"
      }
    },
    "questions": [
      {
        "q": {
          "ru": "Что лучше всего описывает intrinsic interpretability?",
          "en": "What best describes intrinsic interpretability?",
          "zh": "哪一项最能描述内在可解释性？"
        },
        "o": {
          "ru": [
            "Структура самой модели допускает прямое прочтение",
            "Любой SHAP-график",
            "Объяснение создаётся после обучения"
          ],
          "en": [
            "The model's own structure can be read directly",
            "Any SHAP plot",
            "An explanation created after training"
          ],
          "zh": [
            "模型自身结构可以被直接理解",
            "任意 SHAP 图",
            "训练后生成的解释"
          ]
        },
        "a": 0,
        "w": {
          "ru": "Это свойство представления и вычислений модели, а не внешний объяснитель.",
          "en": "It is a property of the model representation and computations, not an external explainer.",
          "zh": "这是模型表示和计算过程的属性，而不是外部解释器。"
        }
      },
      {
        "q": {
          "ru": "Что делает post-hoc метод?",
          "en": "What does a post-hoc method do?",
          "zh": "事后方法做什么？"
        },
        "o": {
          "ru": [
            "Меняет архитектуру модели",
            "Анализирует поведение уже обученной модели",
            "Гарантирует причинность"
          ],
          "en": [
            "Changes the model architecture",
            "Analyses an already-trained model",
            "Guarantees causality"
          ],
          "zh": [
            "改变模型架构",
            "分析已经训练完成的模型",
            "保证因果性"
          ]
        },
        "a": 1,
        "w": {
          "ru": "Post-hoc анализирует модель после обучения, обычно не меняя её.",
          "en": "Post-hoc analyses a model after training, usually without changing it.",
          "zh": "事后方法在训练后分析模型，通常不会改变模型。"
        }
      },
      {
        "q": {
          "ru": "Как интерпретировать коэффициент логистической регрессии?",
          "en": "How should a logistic-regression coefficient be interpreted?",
          "zh": "如何解释逻辑回归系数？"
        },
        "o": {
          "ru": [
            "Как изменение вероятности на столько же пунктов",
            "Как вклад в причинный эффект",
            "Как изменение log-odds при изменении признака на единицу"
          ],
          "en": [
            "As the same percentage-point change in probability",
            "As a causal effect",
            "As a change in log-odds for a one-unit feature change"
          ],
          "zh": [
            "概率增加相同的百分点",
            "因果效应",
            "特征增加一个单位时 log-odds 的变化"
          ]
        },
        "a": 2,
        "w": {
          "ru": "Коэффициенты логистической регрессии заданы в масштабе log-odds.",
          "en": "Logistic-regression coefficients are on the log-odds scale.",
          "zh": "逻辑回归系数位于 log-odds 尺度。"
        }
      },
      {
        "q": {
          "ru": "Почему глубокое дерево может быть трудно интерпретировать?",
          "en": "Why can a deep tree be difficult to interpret?",
          "zh": "为什么深层决策树可能难以解释？"
        },
        "o": {
          "ru": [
            "У него нет правил",
            "Слишком много последовательных условий и ветвей",
            "Оно всегда линейно"
          ],
          "en": [
            "It has no rules",
            "It has too many sequential conditions and branches",
            "It is always linear"
          ],
          "zh": [
            "它没有规则",
            "它包含过多连续条件和分支",
            "它始终是线性的"
          ]
        },
        "a": 1,
        "w": {
          "ru": "Структурная прозрачность снижается с ростом глубины и числа ветвей.",
          "en": "Structural transparency decreases as depth and branch count grow.",
          "zh": "随着深度和分支数量增加，结构透明度会下降。"
        }
      },
      {
        "q": {
          "ru": "Что показывает permutation importance?",
          "en": "What does permutation importance show?",
          "zh": "置换重要性展示什么？"
        },
        "o": {
          "ru": [
            "Изменение выбранной метрики после перемешивания признака",
            "Причинный эффект признака",
            "Вклад в один объект"
          ],
          "en": [
            "Change in a selected metric after shuffling a feature",
            "The feature's causal effect",
            "Contribution to one instance"
          ],
          "zh": [
            "打乱特征后选定指标的变化",
            "特征的因果效应",
            "对单个样本的贡献"
          ]
        },
        "a": 0,
        "w": {
          "ru": "Метод оценивает зависимость качества модели от информации признака на выбранной выборке.",
          "en": "It estimates model-performance dependence on feature information in a selected sample.",
          "zh": "该方法估计模型性能对选定样本中特征信息的依赖程度。"
        }
      },
      {
        "q": {
          "ru": "Зачем оценивать fidelity суррогатной модели?",
          "en": "Why assess surrogate fidelity?",
          "zh": "为什么要评估代理模型的忠实度？"
        },
        "o": {
          "ru": [
            "Чтобы узнать, насколько она согласуется с исходной моделью",
            "Чтобы доказать справедливость",
            "Чтобы измерить причинность"
          ],
          "en": [
            "To measure agreement with the original model",
            "To prove fairness",
            "To measure causality"
          ],
          "zh": [
            "衡量它与原模型的一致程度",
            "证明公平性",
            "衡量因果性"
          ]
        },
        "a": 0,
        "w": {
          "ru": "Суррогат полезен только если достаточно точно аппроксимирует исходное поведение в заявленной области.",
          "en": "A surrogate is useful only if it approximates original behaviour sufficiently well in the stated region.",
          "zh": "只有在所声明区域内足够准确地近似原模型行为，代理模型才有用。"
        }
      },
      {
        "q": {
          "ru": "Что НЕ гарантирует высокая fidelity?",
          "en": "What does high fidelity NOT guarantee?",
          "zh": "高忠实度不能保证什么？"
        },
        "o": {
          "ru": [
            "Согласие с исходной моделью в тестируемой области",
            "Понятность человеку и причинную корректность",
            "Сходство прогнозов в измеренной выборке"
          ],
          "en": [
            "Agreement with the original model in the tested region",
            "Human comprehensibility and causal validity",
            "Similar predictions on the evaluated sample"
          ],
          "zh": [
            "在测试区域内与原模型一致",
            "人类可理解性和因果有效性",
            "在评估样本上的预测相似"
          ]
        },
        "a": 1,
        "w": {
          "ru": "Fidelity — согласие с моделью, а не универсальная гарантия качества объяснения.",
          "en": "Fidelity is agreement with the model, not a universal guarantee of explanation quality.",
          "zh": "忠实度表示与模型的一致性，并非解释质量的普遍保证。"
        }
      },
      {
        "q": {
          "ru": "Что означает model-agnostic?",
          "en": "What does model-agnostic mean?",
          "zh": "model-agnostic（模型无关）是什么意思？"
        },
        "o": {
          "ru": [
            "Метод не имеет никаких предположений",
            "Метод использует только деревья",
            "Метод обращается к модели через общий интерфейс прогнозирования"
          ],
          "en": [
            "The method makes no assumptions",
            "The method only uses trees",
            "The method queries the model through a general prediction interface"
          ],
          "zh": [
            "该方法没有任何假设",
            "该方法只使用树模型",
            "该方法通过通用预测接口查询模型"
          ]
        },
        "a": 2,
        "w": {
          "ru": "Model-agnostic описывает способ взаимодействия с моделью, но не отсутствие предположений.",
          "en": "Model-agnostic describes how the method accesses a model, not an absence of assumptions.",
          "zh": "模型无关描述的是方法如何访问模型，并不意味着没有假设。"
        }
      },
      {
        "q": {
          "ru": "Почему замена признака медианой в лаборатории не является причинным выводом?",
          "en": "Why is median replacement in the lab not a causal conclusion?",
          "zh": "为什么实验中的中位数替换不是因果结论？"
        },
        "o": {
          "ru": [
            "Это искусственно заданное изменение входа без причинной модели",
            "Потому что медиана всегда равна нулю",
            "Потому что прогноз не меняется"
          ],
          "en": [
            "It is an imposed input change without a causal model",
            "Because the median is always zero",
            "Because the prediction never changes"
          ],
          "zh": [
            "这是没有因果模型支持的人为输入变化",
            "因为中位数总是零",
            "因为预测不会变化"
          ]
        },
        "a": 0,
        "w": {
          "ru": "Чувствительность прогноза к заданной замене не идентифицирует причинный эффект.",
          "en": "Prediction sensitivity to a chosen replacement does not identify a causal effect.",
          "zh": "预测对指定替换的敏感性并不能识别因果效应。"
        }
      },
      {
        "q": {
          "ru": "Какой корректный порядок выбора метода?",
          "en": "What is a sound order for selecting a method?",
          "zh": "选择方法的合理顺序是什么？"
        },
        "o": {
          "ru": [
            "Сначала график, затем вопрос",
            "Сначала задача и аудитория, затем модель/метод и проверка",
            "Всегда выбирать SHAP"
          ],
          "en": [
            "Plot first, question later",
            "Define task and audience, then model/method and validation",
            "Always choose SHAP"
          ],
          "zh": [
            "先画图，再提出问题",
            "先明确任务和受众，再选择模型/方法并验证",
            "始终选择 SHAP"
          ]
        },
        "a": 1,
        "w": {
          "ru": "Метод должен отвечать на вопрос и сопровождаться проверкой качества и ограничений.",
          "en": "A method should answer the question and be accompanied by validation of quality and limitations.",
          "zh": "方法应回答研究问题，并通过验证评估其质量和局限。"
        }
      }
    ]
  }
};
