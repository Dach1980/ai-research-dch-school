/* Track A · 8.1.1 — PDP · multilingual lesson data. */
(function () {
"use strict";
const practiceCode = "\"\"\"Reproducible PDP lab for lesson 8.1.1.\nInstall: python -m pip install numpy pandas matplotlib scikit-learn\nRun: python lessons/practice/a-8-1-1-partial-dependence.py\nSynthetic data illustrate model behaviour, not causality.\n\"\"\"\nfrom __future__ import annotations\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.inspection import PartialDependenceDisplay\nfrom sklearn.metrics import mean_absolute_error, r2_score\nfrom sklearn.model_selection import train_test_split\n\nRANDOM_STATE = 42\nrng = np.random.default_rng(RANDOM_STATE)\nn = 1800\narea = rng.uniform(35, 180, n)\nrooms = np.clip(np.round(area / 27 + rng.normal(0, .65, n)), 1, 7)\nage = rng.uniform(0, 60, n)\ndistance = rng.gamma(2.0, 3.0, n)\nnoise = rng.normal(0, 9000, n)\nprice = (75_000 + 2_350*area + 13_000*rooms - 850*age\n         - 5_500*distance + 18_000*np.sin(area/38) + noise)\nX = pd.DataFrame({\"area_m2\":area, \"rooms\":rooms,\n                  \"building_age_years\":age, \"distance_to_center_km\":distance})\ny = pd.Series(price, name=\"price\")\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=.25, random_state=RANDOM_STATE)\nmodel = RandomForestRegressor(n_estimators=350, min_samples_leaf=5,\n    max_features=1.0, random_state=RANDOM_STATE, n_jobs=-1)\nmodel.fit(X_train, y_train)\npred = model.predict(X_test)\nprint(f\"Test R²: {r2_score(y_test, pred):.3f}\")\nprint(f\"Test MAE: {mean_absolute_error(y_test, pred):,.0f}\")\nprint(f\"Observed corr(area, rooms): {X_train.area_m2.corr(X_train.rooms):.3f}\")\n\n# One-way PDP: vertical values are average model predictions in target units.\nfig, ax = plt.subplots(figsize=(8, 5))\nPartialDependenceDisplay.from_estimator(model, X_train, features=[\"area_m2\"],\n    kind=\"average\", method=\"brute\", grid_resolution=35,\n    percentiles=(.05, .95), ax=ax)\nax.set_title(\"Partial dependence of predicted price on floor area\")\nfig.tight_layout()\nplt.show()\n\n# Two-way PDP: colour contours represent average predicted price.\nfig, ax = plt.subplots(figsize=(8, 6))\nPartialDependenceDisplay.from_estimator(model, X_train,\n    features=[(\"area_m2\", \"rooms\")], kind=\"average\", method=\"brute\",\n    grid_resolution=25, percentiles=(.05, .95), ax=ax)\nax.set_title(\"Two-way partial dependence: area and rooms\")\nfig.tight_layout()\nplt.show()\n\n# PDP varies area while retaining each reference row's other feature values.\nreference = X_train.sample(n=min(250, len(X_train)), random_state=RANDOM_STATE)\ngrid = np.linspace(X_train.area_m2.quantile(.05),\n                   X_train.area_m2.quantile(.95), 7)\nsynthetic = []\nfor value in grid:\n    changed = reference.copy()\n    changed[\"area_m2\"] = value\n    synthetic.append(changed)\nsynthetic = pd.concat(synthetic, ignore_index=True)\nprint(\"Reference rows:\", len(reference), \"PDP-style rows:\", len(synthetic))\nprint(\"Correlation after replacement:\",\n      f\"{synthetic.area_m2.corr(synthetic.rooms):.3f}\")\n\nfig, ax = plt.subplots(figsize=(8, 5))\nax.scatter(X_train.area_m2, X_train.rooms, alpha=.18, s=14,\n           label=\"Observed training rows\")\nax.scatter(synthetic.area_m2, synthetic.rooms, alpha=.12, s=10,\n           label=\"PDP evaluation combinations\")\nax.set_xlabel(\"Floor area (m²)\")\nax.set_ylabel(\"Number of rooms\")\nax.set_title(\"PDP may evaluate combinations outside observed support\")\nax.legend()\nax.grid(alpha=.2)\nfig.tight_layout()\nplt.show()\n\n# Discuss: nonlinear shape; sparse ranges; implausible area/room pairs;\n# average trend versus individual responses; why PDP is not causal.\n";
const sharedQuiz = {
ru:[
["Что показывает одномерный PDP?",["Среднее наблюдаемое y","Среднее предсказание модели при фиксированном значении признака","Прогноз одной строки","Причинный эффект"],1,"PDP усредняет выходы модели по остальным признакам опорных строк."],
["Что означает X₋ⱼ?",["Целевую переменную","Все признаки, кроме выбранного j-го","Только коррелирующие признаки","Предсказания"],1,"Это вектор всех остальных входных признаков."],
["Как вычисляется эмпирический PDP?",["Заменить признак в строках, предсказать и усреднить","Обучить новую модель для каждого z","Усреднить наблюдаемые y","Перемешать цель"],0,"Для каждого z модель прогнозирует копии опорных строк с заменённым признаком."],
["Зачем нужна опорная выборка?",["Меняет веса модели","Определяет распределение, по которому усредняют прогнозы","Гарантирует причинность","Удаляет корреляции"],1,"Опорные данные задают популяцию усреднения."],
["Что может означать плоская PDP-кривая?",["Модель не использует признаки","Средний отклик мало меняется по сетке","Все индивидуальные кривые плоские","Нет причинного эффекта"],1,"Среднее может быть плоским даже при разных индивидуальных откликах."],
["Как читать PDP регрессии цены?",["Как изменение реальной цены после ремонта","Как среднее предсказание в единицах целевой переменной","Как вероятность покупки","Как коэффициент линейной модели"],1,"Вертикальная ось обычно выражена в единицах прогнозируемой цели."],
["Что делает двумерный PDP?",["Показывает два отдельных графика","Фиксирует два признака и усредняет по остальным","Строит причинную поверхность","Измеряет корреляцию"],1,"Двумерный PDP задаёт пару значений и усредняет остальные входы."],
["Почему корреляция искажает PDP?",["Модель не выдаёт прогноз","Возникают редкие или отсутствующие сочетания признаков","Кривая всегда равна нулю","Признаки удаляются"],1,"Независимая замена одного столбца может нарушить наблюдаемую зависимость."],
["Что такое off-manifold комбинация?",["Строка без y","Комбинация вне области, поддержанной данными","Любой выброс","Тестовая строка"],1,"Это редко или никогда не встречающееся совместное сочетание входов."],
["Какой метод показывает индивидуальную неоднородность?",["ICE","PDP","Корреляционная матрица","MAE"],0,"ICE рисует отдельную условную кривую для каждого наблюдения."],
["Почему ALE часто полезнее при зависимости признаков?",["Обучает причинную модель","Накапливает локальные изменения в интервалах с наблюдениями","Всегда точнее","Не зависит от бинов"],1,"ALE уменьшает необходимость дальней экстраполяции, используя локальные интервалы."],
["Какое утверждение о PDP верно?",["Доказывает причинность","Описывает поведение модели относительно опорной выборки","Описывает каждого человека","Всегда надёжен при корреляции"],1,"PDP — описательная характеристика модели и выбранного распределения."]
],
en:[
["What does a one-way PDP show?",["Mean observed target","Average model prediction at a fixed selected-feature value","One row's prediction","Causal effect"],1,"PDP averages model outputs over the remaining features in reference rows."],
["What does X₋ⱼ denote?",["The target","All features except selected feature j","Only correlated features","Predictions"],1,"It is the vector of all remaining input features."],
["How is an empirical PDP computed?",["Replace the feature in reference rows, predict, and average","Fit a new model for each z","Average observed targets","Shuffle y"],0,"For each z, predict copied reference rows with the selected feature replaced."],
["Why does the reference sample matter?",["It changes model weights","It defines the distribution over which predictions are averaged","It guarantees causality","It removes correlation"],1,"The reference data define the averaging population."],
["What can a flat PDP indicate?",["The model uses no features","The average response changes little over the grid","All ICE curves are flat","There is no causal effect"],1,"A flat average can coexist with heterogeneous individual responses."],
["How should a regression PDP for price be read?",["As a real price change after renovation","As average predictions in target units","As purchase probability","As a linear coefficient"],1,"The vertical axis is normally in units of the predicted target."],
["What does a two-way PDP do?",["Draws two unrelated plots","Fixes two features and averages over the others","Builds a causal surface","Measures correlation"],1,"It evaluates a pair of feature values while averaging remaining inputs."],
["Why can correlation distort PDP?",["The model stops predicting","Replacement creates rare or unseen feature combinations","The curve is always zero","Features are removed"],1,"Changing one column independently can break observed feature dependence."],
["What is an off-manifold combination?",["A row without y","A combination outside the region supported by data","Any outlier","A test row"],1,"It is a joint input combination rarely or never observed."],
["Which method reveals individual heterogeneity?",["ICE","PDP","Correlation matrix","MAE"],0,"ICE displays a separate conditional curve for each observation."],
["Why can ALE help under feature dependence?",["It fits a causal model","It accumulates local changes in intervals containing observations","It is always more accurate","It ignores binning"],1,"ALE reduces distant extrapolation by using local intervals with data support."],
["Which statement about PDP is correct?",["It proves causality","It describes model behaviour relative to a reference sample","It describes every person","It is always reliable under correlation"],1,"PDP is descriptive, not causal evidence."]
],
zh:[
["一维 PDP 展示什么？",["观测目标的平均值","固定关注特征时模型预测的平均值","单行预测","因果效应"],1,"PDP 对参考样本中其余特征条件下的模型输出求平均。"],
["X₋ⱼ 表示什么？",["目标变量","除关注特征 j 以外的所有特征","只有相关特征","预测结果"],1,"它表示其余所有输入特征。"],
["如何计算经验 PDP？",["替换参考行中的特征，预测并求平均","每个 z 都重新训练模型","平均观测目标","打乱 y"],0,"对每个 z，模型预测替换了关注特征的参考样本副本。"],
["为什么参考样本重要？",["改变模型权重","定义预测求平均所依据的数据分布","保证因果性","消除相关性"],1,"参考数据定义了平均响应所针对的样本群体。"],
["平坦的 PDP 可能表示什么？",["模型不使用任何特征","网格上的平均响应变化很小","所有 ICE 曲线都平坦","不存在因果效应"],1,"平均曲线平坦时，个体响应仍可能不同。"],
["如何解读房价回归 PDP？",["装修后真实价格变化","以目标单位表示的平均模型预测","购房概率","线性系数"],1,"纵轴通常使用预测目标的单位。"],
["二维 PDP 做什么？",["绘制两个无关图","固定两个特征并对其余特征求平均","建立因果曲面","测量相关性"],1,"它固定一对特征值，并对其余输入求平均。"],
["为什么相关性会扭曲 PDP？",["模型停止预测","替换可能产生罕见或未观测的特征组合","曲线总是为零","特征被删除"],1,"独立改变一列可能破坏数据中观察到的特征依赖关系。"],
["什么是分布外组合？",["缺少 y 的行","位于数据支持区域之外的特征组合","任何离群值","测试行"],1,"这是在联合数据分布中很少或从未出现的输入组合。"],
["哪种方法揭示个体差异？",["ICE","PDP","相关矩阵","MAE"],0,"ICE 为每个观测绘制单独的条件响应曲线。"],
["为什么特征依赖时 ALE 可能更有帮助？",["拟合因果模型","在有观测的区间累积局部变化","总是更准确","不受分箱影响"],1,"ALE 使用有数据支持的局部区间，减少远距离外推。"],
["关于 PDP，哪项正确？",["证明因果性","描述模型相对于参考样本的行为","描述每个人","相关时总是可靠"],1,"PDP 是描述性结果，不是因果证据。"]
]};
const sections = {
ru:[
["question","1. Какой вопрос задаёт PDP",["Модель может точно предсказывать стоимость жилья, но её внутренние зависимости трудно читать. PDP отвечает на вопрос: как меняется предсказание в среднем, если варьировать площадь, сохраняя остальные характеристики каждой опорной строки?","Для каждого значения площади алгоритм заменяет этот признак в копиях опорных наблюдений, получает прогнозы и усредняет их. Это средняя реакция уже обученной модели, а не график наблюдаемых цен и не прогноз одной квартиры."],"workflow"],
["definition","2. Математическое определение и оценка",["Пусть f(x) — обученная модель, Xⱼ — исследуемый признак, X₋ⱼ — остальные входы. Частичная зависимость PDⱼ(z) = E[f(z, X₋ⱼ)] — математическое ожидание предсказания при фиксированном значении z и усреднении по распределению остальных признаков.","На конечной выборке: PD̂ⱼ(z) = (1/n) Σᵢ₌₁ⁿ f(z, xᵢ,₋ⱼ). Для каждого z копируют n опорных строк, заменяют j-й столбец, вычисляют n прогнозов и берут среднее. Это вычислительная подстановка, а не причинное вмешательство."],"formula"],
["grid","3. Сетка, опорная выборка и стоимость",["Сетка задаёт значения, в которых вычисляется PDP. Равномерная сетка удобна для непрерывных признаков, но края диапазона могут быть представлены малым числом наблюдений. Часто используют процентильный диапазон, например 5–95%, и проверяют распределение признака.","При brute-force для каждой точки сетки прогнозируются все n строк; стоимость растёт примерно как O(G·n). Опорная выборка определяет популяцию усреднения. Для воспроизводимости фиксируйте данные, метод, число точек, процентили и версию библиотеки."]],
["two-way","4. Двумерный PDP и взаимодействия",["Для двух признаков PDⱼ,ₖ(zⱼ,zₖ) = E[f(zⱼ,zₖ,X₋(ⱼ,ₖ))]. Пара признаков фиксируется, а прогноз усредняется по остальным входам. Результат изображают поверхностью, контурной диаграммой или тепловой картой.","Изменение наклона поверхности может указывать на взаимодействие в предсказательной функции модели, но не доказывает физическую или причинную связь. Обычно ограничиваются одним-двумя признаками: вычисления и интерпретация быстро усложняются."],"formula"],
["interpret","5. Как читать кривую",["Растущая линия означает увеличение среднего отклика модели, убывающая — снижение, горизонтальная — малое среднее изменение. Изгибы указывают на нелинейность, резкий переход — на пороговое поведение. Сначала прочитайте оси и единицы целевой переменной.","PDP усредняет индивидуальные кривые: противоположные отклики разных групп могут взаимно компенсироваться. Гладкая линия в разреженной области не является сильным свидетельством. Сопоставляйте кривую с распределением признака и ICE. Не делайте вывод, что каждый объект реагирует как среднее."],"reading"],
["correlation","6. Корреляция и комбинации вне области данных",["Если площадь и число комнат связаны, PDP может подставить маленькую площадь в строку с шестью комнатами или большую площадь в строку с одной комнатой. Такие комбинации редко встречаются в реальности. Модель всё равно выдаёт прогноз, хотя он может быть экстраполяцией за пределы данных.","Это не делает PDP всегда непригодным: риск зависит от силы зависимости, сетки и модели. Проверяйте совместные scatter plot и плотность данных, ограничивайте диапазон, сравнивайте подгруппы. При выраженной зависимости рассмотрите ALE; ICE поможет увидеть неоднородность."],"correlation"],
["compare","7. PDP, ICE и ALE",["PDP даёт глобальное среднее и удобен для краткого резюме, но скрывает неоднородность и может создавать нереалистичные сочетания. ICE показывает отдельные кривые и раскрывает разные реакции, однако множество линий перегружает график и сохраняет риск выхода за область данных.","ALE накапливает локальные изменения предсказания в интервалах, где есть наблюдения, обычно уменьшая далёкую экстраполяцию при зависимых признаках. Он требует разумного выбора интервалов. Далее уроки 8.1.2 и 8.1.3 подробно разберут ICE и ALE." ]]
],
en:[
["question","1. The question a PDP answers",["A model may predict house prices accurately while its internal relationships remain hard to inspect. A PDP asks: how does the prediction change on average if floor area varies while the other features in each reference row are retained?","For each area value, the algorithm replaces that feature in copies of the reference observations, predicts, and averages. This is the average response of a fitted model—not a plot of observed prices and not the prediction for one home."],"workflow"],
["definition","2. Mathematical definition and estimator",["Let f(x) be a fitted model, Xⱼ the feature of interest, and X₋ⱼ the remaining inputs. Partial dependence PDⱼ(z) = E[f(z, X₋ⱼ)] is the expected prediction at fixed z, averaged over the distribution of the other features.","For a finite sample: PD̂ⱼ(z) = (1/n) Σᵢ₌₁ⁿ f(z, xᵢ,₋ⱼ). At each z, copy the n reference rows, replace column j, obtain n predictions, and average them. This computational replacement is not a causal intervention."],"formula"],
["grid","3. Grid, reference sample, and cost",["The grid defines the feature values at which PDP is evaluated. An evenly spaced grid is convenient for continuous features, but few observations may support its extremes. Percentile ranges such as 5–95% are common; inspect the feature distribution as well.","With brute force, all n rows are predicted at every grid point, so cost grows roughly as O(G·n). The reference sample defines the averaging population. For reproducibility, record the data, method, grid resolution, percentiles, and library version."]],
["two-way","4. Two-way PDP and interactions",["For two features, PDⱼ,ₖ(zⱼ,zₖ) = E[f(zⱼ,zₖ,X₋(ⱼ,ₖ))]. The pair is fixed while predictions are averaged over the remaining inputs. The result can be shown as a surface, contour plot, or heatmap.","A changing surface slope may indicate an interaction in the model's prediction function; it does not prove a physical or causal relationship. Usually one or two features are selected because computation and interpretation become difficult as dimensionality grows."],"formula"],
["interpret","5. Reading the curve",["An increasing line indicates a higher average model response; a decreasing line indicates a lower response; a flat line indicates little average change. Bends suggest nonlinearity and sharp transitions may reflect threshold-like model behaviour. Read axes and target units first.","PDP averages individual curves: opposite responses across groups can cancel. A smooth line in a sparse region is not strong evidence. Compare the curve with the feature distribution and ICE. Do not assume every observation responds like the average."],"reading"],
["correlation","6. Correlation and off-support combinations",["If floor area and room count are related, PDP may insert a small area into a row with six rooms or a large area into a row with one room. Such combinations may be absent in reality. The model still predicts them, even though those predictions may extrapolate beyond the data.","PDP is not always unusable under dependence: risk depends on dependence strength, grid, and model. Inspect joint scatter plots and density, restrict the range, and compare subgroups. Under strong dependence consider ALE; ICE helps reveal heterogeneity."],"correlation"],
["compare","7. PDP, ICE, and ALE",["PDP gives a global average and a compact summary, but hides heterogeneity and may create unrealistic combinations. ICE shows individual curves and reveals different responses, but many lines clutter the plot and it retains the off-support concern.","ALE accumulates local prediction changes in intervals containing observations, usually reducing distant extrapolation under feature dependence. It still requires sensible binning. Lessons 8.1.2 and 8.1.3 will examine ICE and ALE in depth." ]]
],
zh:[
["question","1. PDP 回答什么问题",["模型可能准确预测房价，但内部关系难以直接检查。PDP 提出的问题是：当改变房屋面积，同时保留参考行中的其他特征时，模型预测的平均值如何变化？","对于每个面积值，算法在参考样本副本中替换该特征，进行预测并求平均。这是已训练模型的平均响应，不是观测房价图，也不是某一套房屋的预测。"],"workflow"],
["definition","2. 数学定义与经验估计",["设 f(x) 为训练模型，Xⱼ 为关注特征，X₋ⱼ 为其余输入。部分依赖 PDⱼ(z) = E[f(z, X₋ⱼ)] 表示固定 z 时，模型预测关于其他特征分布的数学期望。","有限样本估计为 PD̂ⱼ(z) = (1/n) Σᵢ₌₁ⁿ f(z, xᵢ,₋ⱼ)。对每个 z 复制 n 行参考数据，替换第 j 列，获得 n 个预测并求平均。这种计算替换不是因果干预。"],"formula"],
["grid","3. 网格、参考样本与计算成本",["网格定义计算 PDP 的特征值。连续特征常使用等距网格，但极端值可能只有少量观测支持。常见做法是使用 5%–95% 等百分位范围，并检查特征分布。","brute-force 方法会在每个网格点预测全部 n 行，成本大致随 O(G·n) 增长。参考样本决定平均所针对的数据群体。为了复现，应记录数据、方法、网格分辨率、百分位和库版本。"]],
["two-way","4. 二维 PDP 与交互",["对于两个特征，PDⱼ,ₖ(zⱼ,zₖ) = E[f(zⱼ,zₖ,X₋(ⱼ,ₖ))]。固定这两个特征的值，并对其余输入的预测求平均。结果可显示为曲面、等高线图或热力图。","曲面斜率变化可能表示模型预测函数中存在交互，但不能证明物理或因果关系。通常只选择一到两个特征，因为维度增加会迅速提高计算和解释难度。"],"formula"],
["interpret","5. 如何读取曲线",["上升曲线表示模型平均响应增加；下降曲线表示平均响应降低；平坦曲线表示平均变化较小。弯曲可能表示非线性，突然变化可能体现阈值行为。首先阅读坐标轴和目标变量单位。","PDP 对个体曲线求平均：不同群体的相反响应可能相互抵消。稀疏区域中的平滑曲线并不是强有力的证据。应结合特征分布和 ICE 阅读，不要假设每个样本都像平均值一样响应。"],"reading"],
["correlation","6. 相关性与数据支持之外的组合",["如果面积与房间数相关，PDP 可能把小面积替换到六个房间的样本中，或把大面积替换到一个房间的样本中。这些组合可能在现实中不存在。模型仍会返回预测，但这些预测可能是超出数据范围的外推。","特征依赖并不意味着 PDP 一定不可用：风险取决于依赖强度、网格和模型。检查联合散点图与密度，限制范围并比较子群体。依赖较强时可考虑 ALE；ICE 有助于揭示个体差异。"],"correlation"],
["compare","7. PDP、ICE 与 ALE",["PDP 给出全局平均摘要，但会隐藏个体差异，并可能产生不现实的组合。ICE 显示个体曲线，揭示不同响应；但曲线太多会造成视觉拥挤，而且仍可能超出数据支持范围。","ALE 在有观测的区间中累积局部预测变化，通常能减少特征依赖条件下的远距离外推，但仍需合理分箱。8.1.2 和 8.1.3 将深入讲解 ICE 与 ALE。"]]
]}
};
const glossary = {
ru:[
["График частичной зависимости","Глобальная визуализация среднего отклика модели при варьировании выбранных признаков."],
["Частичная зависимость","Математическое ожидание предсказания по распределению остальных признаков."],
["Исследуемый признак","Признак, значения которого задаются на сетке PDP."],
["Остальные признаки","Все входные признаки, кроме выбранных для анализа."],
["Опорная выборка","Строки данных, по которым усредняются прогнозы."],
["Эмпирическая оценка","Конечная выборочная аппроксимация математического ожидания."],
["Разрешение сетки","Число точек признака, в которых вычисляется PDP."],
["Индивидуальное условное ожидание (ICE)","Отдельная кривая модельного отклика для каждого наблюдения."],
["Накопленные локальные эффекты (ALE)","Метод накопления локальных изменений предсказания в наблюдаемых интервалах."],
["Зависимость признаков","Статистическая связь между входными признаками."],
["Комбинация вне области данных","Редкое или отсутствующее совместное сочетание входных признаков."],
["Отклик модели","Выход модели, например прогноз цены или вероятность класса."]],
en:[
["Partial Dependence Plot","A global visualization of the model's average response as selected features vary."],
["Partial dependence","The expected prediction over the distribution of the remaining features."],
["Feature of interest","The feature whose values are set along the PDP evaluation grid."],
["Complement features","All input features except those selected for the analysis."],
["Reference dataset","Rows over which model predictions are averaged."],
["Empirical estimator","A finite-sample approximation of a mathematical expectation."],
["Grid resolution","The number of feature values evaluated by the PDP."],
["Individual Conditional Expectation (ICE)","A separate model-response curve for each observation."],
["Accumulated Local Effects (ALE)","A method that accumulates local prediction changes in observed intervals."],
["Feature dependence","A statistical relationship between input features."],
["Off-manifold combination","A rare or absent joint combination of input features."],
["Model response","A model output such as a price prediction or class probability."]],
zh:[
["部分依赖图","展示所选特征变化时模型平均响应的全局图形。"],
["部分依赖","关于其余特征分布的期望预测。"],
["关注特征","在 PDP 评估网格上设置取值的特征。"],
["其余特征","除分析所选特征之外的所有输入特征。"],
["参考数据集","用于对模型预测求平均的数据行集合。"],
["经验估计量","对数学期望的有限样本近似。"],
["网格分辨率","计算 PDP 时评估的特征值数量。"],
["个体条件期望（ICE）","针对每个观测样本绘制的模型响应曲线。"],
["累积局部效应（ALE）","在有观测支持的区间中累积局部预测变化的方法。"],
["特征依赖","输入特征之间的统计关系。"],
["分布外组合","在观测数据中罕见或不存在的联合特征组合。"],
["模型响应","模型输出的量，例如价格预测或类别概率。"]]
};
const commonSources=[
["Friedman, J. H. (2001). Greedy Function Approximation: A Gradient Boosting Machine. Annals of Statistics, 29(5), 1189–1232. DOI: 10.1214/aos/1013203451.","https://doi.org/10.1214/aos/1013203451"],
["scikit-learn User Guide: Partial Dependence and Individual Conditional Expectation plots.","https://scikit-learn.org/stable/modules/partial_dependence.html"],
["scikit-learn API: PartialDependenceDisplay.from_estimator.","https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html"],
["Goldstein et al. (2015). Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation. JCGS, 24(1), 44–65. DOI: 10.1080/10618600.2014.907095.","https://doi.org/10.1080/10618600.2014.907095"],
["Apley & Zhu (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. JRSS B, 82(4), 1059–1086. DOI: 10.1111/rssb.12377.","https://doi.org/10.1111/rssb.12377"]
];
const titles={
ru:["PDP — Partial Dependence Plot","Как увидеть среднюю зависимость предсказаний модели от одного или двух признаков и распознать вводящие в заблуждение сочетания."],
en:["PDP — Partial Dependence Plot","Inspect the average relationship between model predictions and one or two features—and recognize misleading combinations."],
zh:["PDP — 部分依赖图","了解模型预测与一个或两个特征之间的平均关系，并识别可能产生误导的特征组合。"]
};
const practice={
ru:{title:"Лабораторная работа: PDP для модели стоимости жилья",intro:"Постройте модель регрессии на синтетических данных, изучите одномерную и двумерную частичную зависимость и проверьте сочетания площади и числа комнат.",explain:"Используются NumPy, pandas, matplotlib и scikit-learn. Площадь и число комнат намеренно коррелируют; цена зависит также от возраста здания, расстояния до центра и нелинейного слагаемого.",task:"Определите, где кривая перестаёт расти линейно. Какие пары площади и комнат неправдоподобны? Почему двумерная поверхность не является причинным анализом? Сравните PDP с распределением наблюдений.",expected:"Ожидаемое наблюдение: средний прогноз в целом растёт с площадью, но нелинейный член может создавать изгибы; площадь и комнаты образуют заметную зависимость, поэтому крайние искусственные пары будут слабо поддержаны данными."},
en:{title:"Lab: PDP for a house-price model",intro:"Fit a regression model on synthetic data, inspect one-way and two-way partial dependence, and examine area / room-count combinations.",explain:"The lab uses NumPy, pandas, matplotlib, and scikit-learn. Area and room count are intentionally correlated; price also depends on building age, distance, and a nonlinear term.",task:"Identify where the curve stops rising linearly. Which area / room pairs are implausible? Why is a two-way surface not causal analysis? Compare PDP with the observed data distribution.",expected:"Expected qualitative result: average predictions generally rise with area, while the nonlinear term can create bends. Area and room count are dependent, so extreme synthetic pairs have weak support in the observed data."},
zh:{title:"实验：房价模型的 PDP 分析",intro:"使用合成数据训练回归模型，检查一维和二维部分依赖，并观察面积与房间数的组合。",explain:"实验使用 NumPy、pandas、matplotlib 和 scikit-learn。面积与房间数被设计为相关特征，价格还取决于建筑年龄、距离和非线性项。",task:"找出曲线何处不再线性上升。哪些面积与房间数组合不合理？为什么二维曲面不是因果分析？将 PDP 与观测数据分布进行比较。",expected:"预期观察：平均预测总体上随面积增加，但非线性项可能造成曲线弯曲。面积与房间数存在依赖，因此极端合成组合在观测数据中缺乏支持。"}
};
const sources={
ru:[["Friedman (2001): исходная работа по gradient boosting и частичной зависимости.","https://doi.org/10.1214/aos/1013203451"],["Документация scikit-learn: PDP и ICE.","https://scikit-learn.org/stable/modules/partial_dependence.html"],["API PartialDependenceDisplay.from_estimator.","https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html"],["Goldstein et al. (2015): метод ICE.","https://doi.org/10.1080/10618600.2014.907095"],["Apley & Zhu (2020): метод ALE и ограничения PDP.","https://doi.org/10.1111/rssb.12377"]],
en:[["Friedman (2001): foundational work on gradient boosting and partial dependence.","https://doi.org/10.1214/aos/1013203451"],["scikit-learn User Guide: PDP and ICE.","https://scikit-learn.org/stable/modules/partial_dependence.html"],["PartialDependenceDisplay.from_estimator API.","https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html"],["Goldstein et al. (2015): ICE method.","https://doi.org/10.1080/10618600.2014.907095"],["Apley & Zhu (2020): ALE method and PDP limitations.","https://doi.org/10.1111/rssb.12377"]],
zh:[["Friedman (2001)：梯度提升与部分依赖的基础研究。","https://doi.org/10.1214/aos/1013203451"],["scikit-learn 用户指南：PDP 与 ICE。","https://scikit-learn.org/stable/modules/partial_dependence.html"],["PartialDependenceDisplay.from_estimator API。","https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html"],["Goldstein 等 (2015)：ICE 方法。","https://doi.org/10.1080/10618600.2014.907095"],["Apley 与 Zhu (2020)：ALE 方法及 PDP 局限性。","https://doi.org/10.1111/rssb.12377"]]
};
const outcomes={
ru:[
"Объяснять, какой вопрос о поведении обученной модели помогает исследовать PDP.",
"Отличать среднее предсказание PDP от фактических значений цели и индивидуальных прогнозов.",
"Записывать математическое определение одномерной частичной зависимости и объяснять каждый символ.",
"Воспроизводить эмпирический алгоритм вычисления PDP на конечной опорной выборке.",
"Объяснять, как выбор опорной выборки, сетки и процентильного диапазона влияет на результат.",
"Интерпретировать возрастающие, убывающие, плоские и нелинейные участки кривой с учётом единиц отклика.",
"Объяснять двумерное определение PDP и читать поверхность, контуры или тепловую карту.",
"Выявлять риск нереалистичных комбинаций при зависимости признаков и объяснять проблему off-manifold.",
"Сравнивать PDP, ICE и ALE по вопросу, преимуществам и ограничениям каждого метода.",
"Строить PDP в scikit-learn и формулировать выводы без причинных или индивидуальных переобобщений."
],
en:[
"Explain the model-behaviour question that a PDP is designed to investigate.",
"Distinguish the PDP average prediction from observed targets and individual predictions.",
"Write the one-way partial dependence definition and explain each symbol.",
"Reproduce the empirical PDP algorithm on a finite reference sample.",
"Explain how the reference sample, evaluation grid, and percentile range affect the result.",
"Interpret increasing, decreasing, flat, and nonlinear curve regions in the units of the response.",
"Explain the two-way PDP definition and read a surface, contour plot, or heatmap.",
"Identify the risk of unrealistic combinations under feature dependence and explain off-manifold evaluation.",
"Compare PDP, ICE, and ALE by their questions, strengths, and limitations.",
"Build PDPs with scikit-learn and state conclusions without causal or individual overclaims."
],
zh:[
"解释 PDP 用于研究已训练模型的哪类行为问题。",
"区分 PDP 的平均预测、观测目标值和个体预测。",
"写出一维部分依赖定义并解释其中的每个符号。",
"在有限参考样本上复现 PDP 的经验计算流程。",
"解释参考样本、评估网格和百分位范围如何影响结果。",
"结合响应变量单位解读上升、下降、平坦和非线性曲线区域。",
"解释二维 PDP 定义，并读取曲面、等高线图或热力图。",
"识别特征依赖条件下不现实组合的风险，并解释分布外评估。",
"根据研究问题、优势和局限比较 PDP、ICE 与 ALE。",
"使用 scikit-learn 构建 PDP，并避免因果性或个体层面的过度推断。"
]
};
const content={};
for(const lang of ["ru","en","zh"]){
 content[lang]={
  title:titles[lang][0],lead:titles[lang][1],outcomes:outcomes[lang],
  sections:sections[lang].map(([id,title,paragraphs,diagram])=>({id,title,paragraphs,diagram})),
  practice:practice[lang],sources:sources[lang],glossary:glossary[lang],
  quiz:sharedQuiz[lang].map(([q,o,a,e])=>({q,o,a,e,why:o.map((_,i)=>i===a?"": "Этот вариант не описывает вычисление или назначение PDP.")}))
 };
}
window.DCH_PDP_811={content,practiceCode};
})();