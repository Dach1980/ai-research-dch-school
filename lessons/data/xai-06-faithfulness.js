/* Track A · 7.2.3 — Faithfulness and explanation limits, RU / EN / ZH. */
(function () {
"use strict";
const code = "\"\"\"Faithfulness evaluation lab for lesson 7.2.3.\n\nInstall: pip install numpy pandas matplotlib scikit-learn\nRun: python lessons/practice/a-7-2-3-faithfulness.py\n\nThe experiment compares perturbation-based feature deletion and insertion.\nThese are model-behaviour diagnostics, not causal interventions.\n\"\"\"\nfrom __future__ import annotations\n\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nfrom sklearn.datasets import make_classification\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import roc_auc_score\nfrom sklearn.model_selection import train_test_split\n\nRANDOM_STATE = 42\nrng = np.random.default_rng(RANDOM_STATE)\n\n# One informative signal and a correlated proxy make attribution ambiguous.\nX_array, y = make_classification(\n    n_samples=1600,\n    n_features=6,\n    n_informative=3,\n    n_redundant=1,\n    n_clusters_per_class=1,\n    flip_y=0.02,\n    class_sep=1.0,\n    random_state=RANDOM_STATE,\n)\nX_array[:, 5] = 0.95 * X_array[:, 0] + rng.normal(0, 0.15, len(X_array))\nfeature_names = [f\"feature_{i}\" for i in range(X_array.shape[1])]\nX = pd.DataFrame(X_array, columns=feature_names)\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X,\n    y,\n    test_size=0.25,\n    stratify=y,\n    random_state=RANDOM_STATE,\n)\n\nmodel = LogisticRegression(max_iter=2000, random_state=RANDOM_STATE)\nmodel.fit(X_train, y_train)\nbaseline_probability = model.predict_proba(X_test)[:, 1]\nbaseline_auc = roc_auc_score(y_test, baseline_probability)\nprint(f\"Baseline test ROC AUC: {baseline_auc:.3f}\")\n\n# Step 1. Rank features by the metric decrease after individual permutation.\npfi = permutation_importance(\n    model,\n    X_test,\n    y_test,\n    scoring=\"roc_auc\",\n    n_repeats=30,\n    random_state=17,\n    n_jobs=-1,\n)\nimportance = pd.Series(pfi.importances_mean, index=feature_names).sort_values(\n    ascending=False\n)\norder = list(importance.index)\nprint(\"\\nPermutation importance (mean decrease in ROC AUC):\")\nprint(importance.round(4))\n\n# Step 2. Feature deletion: replace the most important features with\n# training medians, one by one, and observe the model's held-out ROC AUC.\nmedians = X_train.median()\ndeletion_auc = []\nfor count in range(len(order) + 1):\n    changed = X_test.copy()\n    for name in order[:count]:\n        changed[name] = medians[name]\n    probability = model.predict_proba(changed)[:, 1]\n    deletion_auc.append(roc_auc_score(y_test, probability))\n\n# Step 3. Feature insertion: start from a median reference row and restore\n# features in explanation order. Intermediate rows may be off-distribution.\ninsertion_auc = []\nfor count in range(len(order) + 1):\n    changed = pd.DataFrame(\n        np.tile(medians.to_numpy(), (len(X_test), 1)),\n        columns=feature_names,\n        index=X_test.index,\n    )\n    for name in order[:count]:\n        changed[name] = X_test[name]\n    probability = model.predict_proba(changed)[:, 1]\n    insertion_auc.append(roc_auc_score(y_test, probability))\n\ncurve = pd.DataFrame(\n    {\n        \"features_changed_or_restored\": range(len(order) + 1),\n        \"deletion_auc\": deletion_auc,\n        \"insertion_auc\": insertion_auc,\n    }\n)\nprint(\"\\nDeletion / insertion evaluation:\")\nprint(curve.round(3).to_string(index=False))\n\n# Step 4. A simple model-randomization sanity check.\n# If the explanation barely changes after labels are randomized, investigate.\nrandom_model = LogisticRegression(max_iter=2000, random_state=RANDOM_STATE)\nrandom_model.fit(X_train, rng.permutation(y_train))\nrandom_pfi = permutation_importance(\n    random_model,\n    X_test,\n    y_test,\n    scoring=\"roc_auc\",\n    n_repeats=10,\n    random_state=19,\n    n_jobs=-1,\n)\nrandom_ranking = pd.Series(\n    random_pfi.importances_mean, index=feature_names\n).sort_values(ascending=False)\nprint(\"\\nTop features for randomized-label model (sanity check only):\")\nprint(random_ranking.head(3).round(4))\n\n# A second model makes the correlation issue visible: the proxy may share\n# importance with the original signal, so individual scores can be small.\nprint(\n    \"\\nCorrelation between feature_0 and feature_5: \"\n    f\"{X_test['feature_0'].corr(X_test['feature_5']):.3f}\"\n)\n\nfig, ax = plt.subplots(figsize=(9, 5))\nsteps = range(len(order) + 1)\nax.plot(steps, deletion_auc, marker=\"o\", label=\"Feature deletion\")\nax.plot(steps, insertion_auc, marker=\"s\", label=\"Feature insertion\")\nax.axhline(baseline_auc, linestyle=\"--\", label=\"Original model\")\nax.set_xlabel(\"Number of features changed / restored\")\nax.set_ylabel(\"ROC AUC on the held-out sample\")\nax.set_title(\"Faithfulness diagnostics: deletion and insertion\")\nax.set_ylim(0.0, 1.02)\nax.grid(alpha=0.25)\nax.legend()\nfig.tight_layout()\nplt.show()\n\n# Interpretation:\n# - A steep deletion drop suggests the ranking captures model reliance.\n# - A rising insertion curve suggests informative features are restored early.\n# - Neither curve proves causality; median replacement can create\n#   unrealistic combinations, especially with correlated features.\n";
const L = {
ru: {
 title:"Faithfulness и ограничения объяснений",
 lead:"Как проверить, действительно ли объяснение отражает поведение модели, и почему понятная история ещё не является доказательством.",
 outcomes:[
 "Различать faithfulness, plausibility, interpretability и общее качество объяснения.",
 "Объяснять назначение perturbation-based evaluation, deletion, insertion и sanity checks.",
 "Выявлять влияние корреляций, метрик, фоновых данных и сдвига распределения.",
 "Проводить воспроизводимый Feature Deletion / Insertion Test и критически читать его результаты.",
 "Формулировать вывод о качестве объяснения с указанием условий, ограничений и неопределённости."
 ],
 sections:[
 {id:"plausibility",title:"1. Почему понятное объяснение не обязательно правильное",paragraphs:[
 "Представим модель кредитного риска. Она отказывает заявителю, а объяснение сообщает: «решающим фактором стал высокий долговой коэффициент». Для специалиста это звучит разумно. Но если модель фактически использовала артефакт анкеты — например, технический код филиала, связанный с исторической политикой выдачи кредитов, — объяснение может быть убедительным и одновременно неполным или неверным.",
 "Человек оценивает связность рассказа, соответствие здравому смыслу и знакомым причинным схемам. Модель же вычисляет предсказание по выученной функции. Между человеческим рассказом и реальной зависимостью модели может возникнуть разрыв. Поэтому красивое объяснение нельзя принимать за свидетельство того, что модель опиралась именно на названные признаки.",
 "В XAI важно разделять три вопроса: понятно ли объяснение человеку; соответствует ли оно поведению конкретной модели; полезно ли оно для поставленной задачи. Один ответ не гарантирует остальные."
 ],diagram:"plausibility"},
 {id:"definitions",title:"2. Faithfulness и связанные понятия",paragraphs:[
 "<strong>Faithfulness (достоверность / верность объяснения)</strong> — степень, в которой объяснение корректно отражает поведение объясняемой модели в явно заданных условиях: для выбранного объекта, области входов, метрики и процедуры проверки. Это не абсолютное свойство текста вне контекста.",
 "<strong>Plausibility (правдоподобие)</strong> — насколько объяснение выглядит разумным и убедительным для человека. Правдоподобие оценивается восприятием; оно не доказывает соответствие модели.",
 "<strong>Interpretability (интерпретируемость)</strong> — насколько человек способен понять модель или её поведение. <strong>Explanation Quality</strong> — более широкая оценка, которая может включать faithfulness, понятность, устойчивость, полезность, полноту и соответствие аудитории.",
 "Например, объяснение «модель учла доход и долговую нагрузку» может быть понятным и правдоподобным. Если после контролируемого изменения этих признаков предсказание почти не меняется, а изменение скрытого proxy-признака существенно меняет результат, исходное объяснение имеет низкую faithfulness относительно проверенной области."
 ],formula:"Δf = f(x) − f(x′)",formulaNote:"f(x) — предсказание фиксированной модели для объекта x. Если x′ получен контролируемым изменением входа, Δf показывает изменение выхода в этом эксперименте. Значение зависит от способа изменения x и само по себе не является причинным эффектом."},
 {id:"tests",title:"3. Как проверяют Faithfulness",paragraphs:[
 "<strong>Perturbation-based evaluation</strong> меняет вход или часть входа по заранее заданному правилу и проверяет, как меняется выход модели. Важно описать правило perturbation: замена нулём, медианой, baseline, маскирование или выбор реалистичного условного значения отвечают на разные вопросы.",
 "<strong>Feature Removal / Deletion</strong> последовательно удаляет признаки в порядке, заданном объяснением. Если действительно важные для модели признаки удаляются первыми, выбранная метрика обычно должна ухудшаться быстрее, чем при случайном порядке. Но замена признака может создать нереалистичный объект.",
 "<strong>Feature Insertion</strong> начинает с reference-входа и постепенно возвращает признаки в порядке важности. Если ранжирование информативно, качество или уверенность модели часто восстанавливаются быстрее, чем при случайном порядке. Результат зависит от baseline и распределения промежуточных входов.",
 "<strong>Occlusion</strong> маскирует фрагменты входа — например, участки изображения или токены текста — и измеряет изменение предсказания. Метод полезен для локального анализа, но маска может создавать неестественный вход.",
 "<strong>Sensitivity Analysis</strong> изучает, насколько объяснение или предсказание меняется при малых допустимых изменениях входа. Чрезмерная чувствительность может указывать на нестабильность; полная нечувствительность тоже не всегда желательна.",
 "<strong>Model Randomization Sanity Checks</strong> сравнивают объяснения исходной модели с объяснениями модели после рандомизации параметров или меток. Если объяснение почти не реагирует на разрушение выученной структуры, оно может отражать prior данных или процедуру визуализации, а не знания модели.",
 "Ни deletion, ни insertion, ни sanity check не дают универсального сертификата. Надёжнее сочетать несколько тестов, обосновывать perturbation и проверять результаты на целевой области данных."
 ],formula:"D(k) = S(f, X, y) − S(f, T_k(X), y). Здесь S — метрика, где большее значение лучше; T_k заменяет первые k признаков в порядке объяснения. Положительное D(k) означает ухудшение выбранной метрики после удаления этих признаков.",diagram:"deletion"},
 {id:"pfi",title:"4. Связь с Feature Importance и Permutation Feature Importance",paragraphs:[
 "Feature Importance и Permutation Feature Importance (PFI) оценивают разные аспекты поведения модели. PFI измеряет изменение выбранной метрики после перестановки столбца у фиксированной модели. Это оценка зависимости качества от доступности информации признака на конкретной выборке, а не причинный вклад.",
 "При коррелирующих признаках модель может использовать взаимозаменяемые сигналы. Перестановка одного столбца оставляет proxy-признак на месте, поэтому индивидуальная PFI может быть небольшой. Одновременно независимая перестановка способна создать комбинации, отсутствующие в реальных данных.",
 "Метрика меняет смысл рейтинга: accuracy, ROC AUC, F1 и log loss отвечают на разные вопросы. Глобальная важность усредняет поведение по выборке и не гарантирует верного объяснения отдельного объекта. Различия между PFI, коэффициентами, SHAP и локальными perturbation-тестами не обязательно означают ошибку — методы измеряют разные величины.",
 "Поэтому результат 7.2.1 и 7.2.2 следует трактовать как гипотезу о зависимости модели. Следующий шаг — проверить гипотезу на конкретном объекте и на релевантном распределении."
 ]},
 {id:"limits",title:"5. Ограничения и источники ошибок",paragraphs:[
 "<strong>Correlated Features / Feature Dependence:</strong> взаимозаменяемые признаки делят рейтинг, а независимая перестановка разрушает совместную структуру. Сравнивайте индивидуальную и групповую перестановку; условные методы требуют корректной модели условного распределения.",
 "<strong>Distribution Shift:</strong> оценка на выборке, отличающейся от реального применения, может не отражать эксплуатационное поведение. Проверяйте объяснения на репрезентативных временных и пользовательских срезах.",
 "<strong>Out-of-Distribution Perturbations:</strong> замена признака нулём или медианой может создать невозможное сочетание значений. Предпочитайте предметно обоснованные baseline, маски или условную генерацию и явно описывайте ограничения.",
 "<strong>Model Complexity и Instability:</strong> сложная модель может иметь локально резкие границы; объяснение может меняться при небольших изменениях входа, обучающей выборки или seed. Повторяйте эксперимент и оценивайте разброс.",
 "<strong>Sensitivity to Background Data:</strong> SHAP-подобные и baseline-зависимые объяснения меняются при выборе фоновой выборки. Фон должен отражать релевантную популяцию и быть задокументирован.",
 "<strong>Metric Dependence:</strong> признак может быть важен для ROC AUC, но почти не влиять на accuracy при выбранном пороге. Выбирайте метрику до анализа и связывайте её с решением.",
 "<strong>Sampling Variance:</strong> конечная выборка и случайные перестановки дают шум. Используйте повторы, интервалы или bootstrap; стандартное отклонение перестановок не охватывает всю неопределённость.",
 "<strong>Human Bias:</strong> эксперты могут предпочитать знакомые и причинно звучащие объяснения. Разделяйте пользовательскую оценку понятности и экспериментальную оценку соответствия модели."
 ]},
 {id:"protocol",title:"6. Практический протокол оценки объяснения",paragraphs:[
 "1. <strong>Определите объект оценки:</strong> глобальная зависимость модели, локальное предсказание или конкретный сценарий использования. 2. <strong>Зафиксируйте модель и данные:</strong> версия модели, выборка, целевая метрика и временной срез.",
 "3. <strong>Выберите метод объяснения</strong> и сформулируйте проверяемое утверждение: например, «признак A входит в число главных факторов локального предсказания». 4. <strong>Выберите независимый тест:</strong> deletion, insertion, occlusion, sensitivity или randomization sanity check.",
 "5. <strong>Определите perturbation:</strong> что именно заменяется, чем, в каком порядке и остаются ли промежуточные объекты реалистичными. 6. <strong>Сравните с baseline и контролем:</strong> случайный порядок, альтернативный baseline или другая разумная процедура.",
 "7. <strong>Оцените устойчивость:</strong> повторы, несколько объектов, подгруппы, seed и разумные альтернативы. 8. <strong>Зафиксируйте ограничения:</strong> корреляции, сдвиг распределения, метрика, размер выборки и возможные артефакты.",
 "9. <strong>Сформулируйте ограниченный вывод:</strong> укажите, какое утверждение поддержано, на каких данных и с какой неопределённостью. Не превращайте локальный тест в универсальное доказательство."
 ],diagram:"pipeline"},
 {id:"summary",title:"7. Итог: объяснение — проверяемая гипотеза",paragraphs:[
 "Faithfulness — не синоним понятности или убедительности. Объяснение может нравиться человеку, но не отражать механизм предсказания. Проверка должна быть привязана к модели, объекту, метрике, данным и процедуре perturbation.",
 "Deletion, insertion, occlusion, sensitivity analysis и randomization sanity checks дают взаимодополняющие свидетельства. Каждый тест имеет собственные допущения; особенно опасно игнорировать корреляции и искусственные входы вне распределения.",
 "Практическое правило: публикуйте не только рейтинг или визуализацию, но и паспорт проверки — модель, выборку, метрику, baseline, perturbation, повторы, ограничения и область применимости. Тогда объяснение становится проверяемым исследовательским результатом, а не убедительной историей."
 ]}
 ],
 practice:{
 title:"Лабораторная работа: проверяем объяснение через Deletion и Insertion",
 intro:"Обучим бинарный классификатор, вычислим Permutation Feature Importance, затем последовательно заменим наиболее важные признаки медианами (deletion) и вернём признаки из baseline (insertion). Дополнительно выполним sanity check на модели, обученной с перемешанными метками.",
 explain:"ROC AUC выбран как метрика ранжирования. random_state фиксирует генерацию данных и разбиение; n_repeats оценивает вариативность перестановок. Deletion измеряет изменение поведения модели на тестовых объектах. Insertion зависит от reference-входа: промежуточные комбинации могут быть вне распределения, особенно при корреляции признаков.",
 task:"Измените baseline с медианы на ноль и сравните кривые. Повторите PFI с 5, 30 и 100 перестановками. Сравните individual PFI коррелирующих feature_0 и feature_5 с результатом их совместного изменения. Объясните, какие выводы устойчивы, а какие зависят от выбранного вмешательства."
 },
 sources:[
 ["Adebayo et al. (2018), Sanity Checks for Saliency Maps","https://proceedings.neurips.cc/paper/2018/hash/294a8ed24b1ad22ec2e7efea049b8737-Abstract.html"],
 ["Covert, Lundberg & Lee (2021), Explaining by Removing: A Unified Framework for Model Explanation","https://jmlr.org/papers/v22/20-1316.html"],
 ["Hooker et al. (2019), A Benchmark for Interpretability Methods in Deep Neural Networks","https://proceedings.neurips.cc/paper/2019/hash/fe4b8556000d0f0cae99daa5c5c5a410-Abstract.html"],
 ["Molnar, Interpretable Machine Learning — Pitfalls of Permutation Feature Importance","https://christophm.github.io/interpretable-ml-book/feature-importance.html"],
 ["scikit-learn — Permutation feature importance","https://scikit-learn.org/stable/modules/permutation_importance.html"]
 ],
 glossary:[
 ["Faithfulness — достоверность объяснения","Степень соответствия объяснения наблюдаемому поведению конкретной модели в заданных условиях. Проверяется экспериментами, а не только экспертным впечатлением."],
 ["Plausibility — правдоподобие","Насколько объяснение выглядит разумным для человека; не доказывает, что модель действительно использовала названные факторы."],
 ["Interpretability — интерпретируемость","Возможность человека понять модель или её поведение; зависит от модели, аудитории и задачи."],
 ["Explanation Quality — качество объяснения","Совокупность свойств объяснения: faithfulness, понятность, устойчивость, полезность и соответствие цели."],
 ["Feature Attribution — атрибуция признаков","Распределение вклада или значимости между входными признаками по правилам выбранного метода."],
 ["Feature Deletion — удаление признаков","Проверка поведения модели при последовательном удалении или замене признаков."],
 ["Feature Insertion — добавление признаков","Проверка восстановления предсказания при последовательном возвращении признаков из reference-входа."],
 ["Perturbation — возмущение входа","Контролируемое изменение входных данных: маскирование, замена, перестановка или добавление шума."],
 ["Sensitivity Analysis — анализ чувствительности","Изучение изменения предсказаний или объяснений при допустимых малых изменениях входа."],
 ["Sanity Checks — проверки адекватности","Контрольные эксперименты, проверяющие, реагирует ли объяснение на разрушение выученной моделью информации."],
 ["Distribution Shift — сдвиг распределения","Изменение распределения данных между обучением, оценкой и реальным применением."],
 ["Out-of-Distribution Data — данные вне распределения","Входы, нехарактерные для данных, на которых модель обучалась или валидировалась."]
 ],
 quiz:[
 {q:"Какое утверждение лучше всего описывает faithfulness?",o:["Объяснение выглядит убедительно для эксперта","Объяснение соответствует поведению проверяемой модели в заданных условиях","Объяснение содержит много признаков","Объяснение совпадает с ожиданиями пользователя"],a:1,e:"Faithfulness проверяет соответствие объяснения фактическому поведению модели, а не эстетическую или человеческую убедительность.",why:["Это описание plausibility, а не faithfulness.","Верно: речь о соответствии модели в заданных условиях.","Количество признаков не гарантирует достоверности.","Ожидания пользователя могут быть ошибочными."]},
 {q:"Что показывает Feature Deletion Test?",o:["Причинный эффект признака в реальном мире","Изменение выбранной метрики или предсказания при удалении признаков","Точность перевода объяснения","Сложность архитектуры модели"],a:1,e:"Deletion оценивает реакцию фиксированной модели на контролируемое удаление или замену входных признаков.",why:["Удаление из таблицы не является реальным причинным экспериментом.","Верно: измеряется реакция модели на заданное вмешательство.","Тест не оценивает перевод или язык.","Архитектура напрямую не измеряется."]},
 {q:"Почему deletion может дать вводящий в заблуждение результат?",o:["Потому что модель всегда переобучается","Потому что замена признака может создать объект вне распределения","Потому что метрики нельзя пересчитывать","Потому что тест применим только к деревьям"],a:1,e:"Медиана, ноль или маска могут создавать нереалистичные комбинации признаков, поэтому измеряется в том числе реакция на искусственный вход.",why:["Переобучение не возникает автоматически от теста.","Верно: perturbation может выйти за область реалистичных данных.","Метрики можно и нужно пересчитывать.","Deletion применим к разным моделям при доступе к предсказаниям."]},
 {q:"Что проверяет Feature Insertion?",o:["Восстанавливается ли поведение модели при возвращении признаков в заданном порядке","Можно ли удалить обучающую выборку","Есть ли причинная связь между признаками","Равны ли коэффициенты модели"],a:0,e:"Insertion начинает с reference-входа и постепенно возвращает признаки, оценивая восстановление предсказания или метрики.",why:["Верно: это проверка порядка восстановления информации.","Удаление обучающей выборки не является insertion.","Метод сам по себе не устанавливает причинность.","Коэффициенты могут вообще отсутствовать."]},
 {q:"Что означает высокая plausibility при низкой faithfulness?",o:["Объяснение понятно человеку, но плохо отражает модель","Модель обязательно корректна","Объяснение доказало причинность","Метод не зависит от данных"],a:0,e:"Человеческая убедительность и соответствие модели — разные свойства.",why:["Верно: объяснение может быть понятным, но неверным относительно поведения модели.","Правильность модели не следует из оценки объяснения.","Plausibility не доказывает причинность.","Методы объяснения зависят от данных и процедуры."]},
 {q:"Почему индивидуальная PFI коррелирующего признака может быть низкой?",o:["Потому что модель не использует ни один признак","Потому что связанный proxy-признак сохраняет похожую информацию","Потому что PFI измеряет причинность","Потому что корреляция всегда равна нулю"],a:1,e:"После перестановки одного столбца модель может опираться на другой коррелирующий столбец.",why:["Низкая индивидуальная PFI не доказывает отсутствие использования.","Верно: информация может быть взаимозаменяемой.","PFI не измеряет причинность.","Корреляция по определению не обязана быть нулевой."]},
 {q:"Для чего применяют Model Randomization Sanity Checks?",o:["Чтобы проверить, меняется ли объяснение при разрушении выученной структуры модели","Чтобы повысить ROC AUC","Чтобы заменить тестовую выборку обучающей","Чтобы доказать причинный эффект"],a:0,e:"Если объяснение остаётся почти неизменным после рандомизации модели или меток, стоит проверить, не определяется ли оно prior или артефактами метода.",why:["Верно: проверяется чувствительность объяснения к рандомизации.","Sanity check не является способом улучшения модели.","Подмена выборок не относится к тесту.","Рандомизация не доказывает причинность."]},
 {q:"Почему выбор метрики влияет на Feature Importance?",o:["Метрика определяет, какой аспект качества считается важным","Метрика меняет архитектуру модели","Все метрики дают одинаковый рейтинг","Метрика устраняет корреляцию"],a:0,e:"PFI вычисляется как изменение конкретной метрики; разные метрики оценивают разные аспекты поведения.",why:["Верно: определение важности зависит от выбранной метрики.","Оценка метрики не перестраивает модель.","Разные метрики могут дать разные рейтинги.","Метрика не устраняет зависимость признаков."]},
 {q:"Что следует сделать при сильном Distribution Shift?",o:["Считать объяснение прежним без проверки","Проверить объяснение на данных, представляющих целевой сценарий","Удалить все признаки","Использовать только обучающую выборку"],a:1,e:"Объяснение и тест faithfulness должны относиться к распределению, где модель реально используется.",why:["Без проверки перенос выводов необоснован.","Верно: нужна репрезентативная целевая выборка.","Удаление признаков не решает проблему сдвига.","Обучающая выборка может не представлять эксплуатацию."]},
 {q:"Как правильно трактовать Δf = f(x) − f(x′)?",o:["Как универсальный причинный эффект","Как изменение выхода модели между исходным и изменённым входом","Как оценку качества перевода","Как доказательство отсутствия смещения"],a:1,e:"Δf описывает разницу выходов фиксированной модели для двух входов; смысл зависит от способа построения x′.",why:["Изменение входа не эквивалентно причинному вмешательству в реальном мире.","Верно: это разность выходов модели.","Формула не относится к переводу.","Смещение модели этой разностью не исключается."]},
 {q:"Что обязательно документировать в протоколе faithfulness?",o:["Только итоговый рейтинг","Модель, выборку, метрику, baseline, perturbation и ограничения","Только название библиотеки","Лишь скриншот объяснения"],a:1,e:"Без условий эксперимента результат нельзя воспроизвести или корректно интерпретировать.",why:["Рейтинг без контекста недостаточен.","Верно: фиксируются все ключевые условия и ограничения.","Библиотека не заменяет методологию.","Скриншот не раскрывает эксперимент."]},
 {q:"Какой вывод наиболее корректен после успешного deletion-теста?",o:["Доказана причинность признака","Объяснение получило поддержку для выбранной модели, данных и perturbation","Объяснение верно для всех пользователей и периодов","Другие методы проверки больше не нужны"],a:1,e:"Успешный тест даёт ограниченное свидетельство в заданной области, а не универсальное доказательство.",why:["Deletion не доказывает причинность.","Верно: вывод ограничен конкретными условиями проверки.","Перенос на другие группы и периоды требует отдельной проверки.","Независимые тесты остаются полезны."]}
 ]
},
en: {
 title:"Faithfulness and Limitations of Explanations",
 lead:"How to test whether an explanation reflects model behaviour—and why a convincing story is not evidence by itself.",
 outcomes:[
 "Distinguish faithfulness, plausibility, interpretability, and broader explanation quality.",
 "Explain perturbation-based evaluation, deletion, insertion, and sanity checks.",
 "Identify how correlations, metrics, background data, and distribution shift affect evaluation.",
 "Run a reproducible Feature Deletion / Insertion Test and interpret its limitations.",
 "Report explanation quality with explicit conditions, limitations, and uncertainty."
 ],
 sections:[
 {id:"plausibility",title:"1. A clear explanation is not necessarily a correct one",paragraphs:[
 "Consider a credit-risk model that rejects an applicant and reports: “high debt ratio was decisive.” This sounds reasonable. Yet the model may actually rely on an application artefact—such as a branch code correlated with a historical lending policy. The explanation can be persuasive while being incomplete or unfaithful.",
 "People judge coherence, common sense, and familiar causal stories. A model computes a prediction using a learned function. The human narrative can therefore diverge from the model's actual dependencies. A polished explanation is not evidence that the model relied on the features it names.",
 "XAI must separate three questions: can a person understand the explanation; does it correspond to the behaviour of this model; and is it useful for the intended task? One answer does not guarantee the others."
 ],diagram:"plausibility"},
 {id:"definitions",title:"2. Faithfulness and related concepts",paragraphs:[
 "<strong>Faithfulness</strong> is the degree to which an explanation accurately reflects the behaviour of the model being explained under explicitly stated conditions: the selected instance, input region, metric, and evaluation procedure. It is not an absolute property of a text outside its context.",
 "<strong>Plausibility</strong> describes how reasonable and convincing an explanation appears to a person. It is a human judgement, not proof of model correspondence. <strong>Interpretability</strong> is the extent to which a person can understand a model or its behaviour.",
 "<strong>Explanation Quality</strong> is broader and may include faithfulness, comprehensibility, stability, usefulness, completeness, and audience fit. For example, “the model considered income and debt” may be clear and plausible. If controlled changes to those features barely affect predictions while a hidden proxy changes them substantially, the explanation has low faithfulness in the tested region."
 ],formula:"Δf = f(x) − f(x′)",formulaNote:"f(x) is the output of a fixed model for input x. If x′ is obtained by a controlled input change, Δf measures the output change in that experiment. Its meaning depends on how x′ was constructed; it is not, by itself, a causal effect."},
 {id:"tests",title:"3. How faithfulness is evaluated",paragraphs:[
 "<strong>Perturbation-based evaluation</strong> changes an input or part of it according to a specified rule and measures the model response. The rule matters: replacing a value with zero, a median, a baseline, a mask, or a realistic conditional value answers different questions.",
 "<strong>Feature Removal / Deletion</strong> removes or replaces features in the order proposed by an explanation. If the first features are genuinely important to the model, the chosen metric should usually deteriorate faster than under a random order. However, replacement can create unrealistic inputs.",
 "<strong>Feature Insertion</strong> starts from a reference input and restores features progressively. A useful ranking often restores model performance or confidence faster than a random order. Results depend on the baseline and on the distribution of intermediate inputs.",
 "<strong>Occlusion</strong> masks input regions—such as image patches or text tokens—and measures prediction changes. It is useful for local analysis, but a mask can produce an unnatural input.",
 "<strong>Sensitivity Analysis</strong> studies how predictions or explanations change under small, valid input changes. Excessive sensitivity may indicate instability; complete insensitivity is not always desirable either.",
 "<strong>Model Randomization Sanity Checks</strong> compare explanations for an original model with explanations after model parameters or labels are randomized. If explanations barely react to destroying learned structure, they may reflect data priors or visualization procedures rather than model knowledge.",
 "No deletion, insertion, or sanity check is a universal certificate. Stronger evidence combines tests, justifies perturbations, and evaluates results on the target data region."
 ],formula:"D(k) = S(f, X, y) − S(f, T_k(X), y). Here S is a higher-is-better metric, and T_k replaces the first k features in the explanation order. Positive D(k) means the selected score decreased after deletion.",diagram:"deletion"},
 {id:"pfi",title:"4. Connection to Feature Importance and Permutation Feature Importance",paragraphs:[
 "Feature Importance and Permutation Feature Importance (PFI) measure different aspects of model behaviour. PFI measures the change in a selected metric after permuting one column for a fixed model. It estimates performance dependence on feature information in a particular sample—not a causal contribution.",
 "With correlated features, a model may use interchangeable signals. Permuting one column leaves its proxy intact, so individual PFI can be small. At the same time, independent permutation may create combinations absent from real data.",
 "The metric changes the meaning of a ranking: accuracy, ROC AUC, F1, and log loss answer different questions. Global importance averages over a sample and does not guarantee a faithful explanation for one instance. Differences between PFI, coefficients, SHAP, and local perturbation tests do not necessarily indicate an error; the methods measure different quantities.",
 "Treat the results from lessons 7.2.1 and 7.2.2 as hypotheses about model dependence. The next step is to test those hypotheses for specific instances and on a relevant data distribution."
 ]},
 {id:"limits",title:"5. Limitations and sources of error",paragraphs:[
 "<strong>Correlated Features / Feature Dependence:</strong> interchangeable features share rankings, while independent permutation breaks their joint structure. Compare individual and grouped permutation; conditional methods require a credible conditional-distribution model.",
 "<strong>Distribution Shift:</strong> an evaluation sample that differs from deployment data may not represent operational behaviour. Test explanations on representative temporal and user subgroups.",
 "<strong>Out-of-Distribution Perturbations:</strong> replacing a feature with zero or a median may create impossible combinations. Prefer domain-justified baselines, masks, or conditional generation, and document the limitations.",
 "<strong>Model Complexity and Instability:</strong> complex models may have sharp local boundaries; explanations can change with small input, sample, or seed changes. Repeat experiments and report variability.",
 "<strong>Sensitivity to Background Data:</strong> SHAP-like and baseline-dependent explanations can change with the background sample. The background should represent the relevant population and be documented.",
 "<strong>Metric Dependence:</strong> a feature may matter for ROC AUC but barely affect accuracy at a particular threshold. Choose the metric before analysis and connect it to the decision.",
 "<strong>Sampling Variance:</strong> finite samples and random permutations introduce noise. Use repeats, intervals, or bootstrap; permutation standard deviation does not capture all sources of uncertainty.",
 "<strong>Human Bias:</strong> experts may prefer familiar, causal-sounding explanations. Keep human assessments of clarity separate from experimental assessments of model correspondence."
 ]},
 {id:"protocol",title:"6. A practical protocol for explanation evaluation",paragraphs:[
 "1. <strong>Define the target:</strong> global model dependence, a local prediction, or a deployment scenario. 2. <strong>Fix the model and data:</strong> model version, sample, target metric, and time window.",
 "3. <strong>Choose an explanation method</strong> and state a testable claim, such as “feature A is among the main factors for this local prediction.” 4. <strong>Select an independent test:</strong> deletion, insertion, occlusion, sensitivity, or a randomization sanity check.",
 "5. <strong>Specify the perturbation:</strong> what changes, what replaces it, in what order, and whether intermediate inputs remain realistic. 6. <strong>Compare with baselines and controls:</strong> random order, an alternative baseline, or another reasonable procedure.",
 "7. <strong>Assess stability:</strong> repeats, multiple instances, subgroups, seeds, and reasonable alternatives. 8. <strong>Record limitations:</strong> correlations, distribution shift, metric, sample size, and possible artefacts.",
 "9. <strong>Make a bounded claim:</strong> state what is supported, on which data, and with what uncertainty. Do not turn a local test into universal proof."
 ],diagram:"pipeline"},
 {id:"summary",title:"7. Takeaway: an explanation is a testable hypothesis",paragraphs:[
 "Faithfulness is not a synonym for clarity or persuasiveness. An explanation may appeal to a person while failing to reflect the prediction mechanism. Evaluation must be tied to a model, instance, metric, data sample, and perturbation procedure.",
 "Deletion, insertion, occlusion, sensitivity analysis, and randomization sanity checks provide complementary evidence. Each has assumptions; correlations and artificial out-of-distribution inputs are especially easy to overlook.",
 "Practical rule: report not only a ranking or visualization, but also an evaluation passport—model, sample, metric, baseline, perturbation, repeats, limitations, and scope. This turns an explanation into a testable research result rather than a convincing story."
 ]}
 ],
 practice:{
 title:"Lab: testing explanations with Deletion and Insertion",
 intro:"Train a binary classifier, calculate Permutation Feature Importance, then replace the highest-ranked features with medians (deletion) and restore them from a reference input (insertion). Finally, run a sanity check with a model trained on shuffled labels.",
 explain:"ROC AUC is used as a ranking metric. random_state fixes data generation and splitting; n_repeats estimates permutation variability. Deletion measures model behaviour on held-out instances. Insertion depends on the reference input: intermediate combinations may be out of distribution, especially when features are correlated.",
 task:"Change the baseline from the median to zero and compare the curves. Repeat PFI with 5, 30, and 100 permutations. Compare individual PFI for correlated feature_0 and feature_5 with their joint perturbation. Explain which conclusions are stable and which depend on the intervention."
 },
 sources:[
 ["Adebayo et al. (2018), Sanity Checks for Saliency Maps","https://proceedings.neurips.cc/paper/2018/hash/294a8ed24b1ad22ec2e7efea049b8737-Abstract.html"],
 ["Covert, Lundberg & Lee (2021), Explaining by Removing: A Unified Framework for Model Explanation","https://jmlr.org/papers/v22/20-1316.html"],
 ["Hooker et al. (2019), A Benchmark for Interpretability Methods in Deep Neural Networks","https://proceedings.neurips.cc/paper/2019/hash/fe4b8556000d0f0cae99daa5c5c5a410-Abstract.html"],
 ["Molnar, Interpretable Machine Learning — Pitfalls of Permutation Feature Importance","https://christophm.github.io/interpretable-ml-book/feature-importance.html"],
 ["scikit-learn — Permutation feature importance","https://scikit-learn.org/stable/modules/permutation_importance.html"]
 ],
 glossary:[
 ["Faithfulness","How accurately an explanation reflects the behaviour of the model under stated evaluation conditions."],
 ["Plausibility","How reasonable an explanation appears to a person; it does not prove model correspondence."],
 ["Interpretability","The extent to which a person can understand a model or its behaviour."],
 ["Explanation Quality","A broader set of properties such as faithfulness, clarity, stability, usefulness, and audience fit."],
 ["Feature Attribution","A method-specific allocation of contribution or importance across input features."],
 ["Feature Deletion","Testing model behaviour while progressively removing or replacing input features."],
 ["Feature Insertion","Testing prediction recovery while progressively restoring features from a reference input."],
 ["Perturbation","A controlled input change, such as masking, replacement, permutation, or added noise."],
 ["Sensitivity Analysis","Studying how predictions or explanations respond to small valid input changes."],
 ["Sanity Checks","Control experiments that test whether explanations react to destruction of learned model information."],
 ["Distribution Shift","A change in data distribution between training, evaluation, and deployment."],
 ["Out-of-Distribution Data","Inputs that are atypical of the data on which a model was trained or validated."]
 ],
 quiz:[
 {q:"Which statement best describes faithfulness?",o:["The explanation looks convincing to an expert","The explanation corresponds to the tested model's behaviour under stated conditions","The explanation lists many features","The explanation matches the user's expectations"],a:1,e:"Faithfulness concerns correspondence with actual model behaviour, not aesthetic or human persuasiveness.",why:["This describes plausibility, not faithfulness.","Correct: it is correspondence with the model under stated conditions.","The number of features does not guarantee accuracy.","User expectations can be wrong."]},
 {q:"What does a Feature Deletion Test measure?",o:["The real-world causal effect of a feature","The change in a selected metric or prediction when features are removed","The translation quality of an explanation","The complexity of the model architecture"],a:1,e:"Deletion evaluates how a fixed model responds to controlled removal or replacement of input features.",why:["Removing a column is not a real-world causal experiment.","Correct: it measures the model response to a defined intervention.","It does not evaluate translation.","It does not directly measure architecture."]},
 {q:"Why can deletion produce a misleading result?",o:["The model always overfits","Feature replacement may create an out-of-distribution input","Metrics cannot be recalculated","The test only works for trees"],a:1,e:"A median, zero, or mask can create unrealistic feature combinations, so the test may measure reaction to artificial inputs.",why:["Overfitting does not automatically occur because of the test.","Correct: perturbations can leave the realistic data region.","Metrics can and should be recalculated.","Deletion can be used with many models that expose predictions."]},
 {q:"What does Feature Insertion evaluate?",o:["Whether model behaviour is recovered as features are restored in a chosen order","Whether the training set can be deleted","Whether two features are causally related","Whether model coefficients are equal"],a:0,e:"Insertion starts from a reference input and progressively restores features, measuring prediction or metric recovery.",why:["Correct: it evaluates the order in which information is restored.","Deleting the training set is unrelated.","The method does not establish causality.","Some models have no coefficients."]},
 {q:"What does high plausibility but low faithfulness mean?",o:["The explanation is understandable but poorly reflects the model","The model is necessarily correct","The explanation proves causality","The method is independent of data"],a:0,e:"Human persuasiveness and correspondence with a model are different properties.",why:["Correct: an explanation can be clear and still be wrong about model behaviour.","Model correctness does not follow from explanation quality.","Plausibility does not prove causality.","Explanation methods depend on data and procedure."]},
 {q:"Why can individual PFI be low for a correlated feature?",o:["The model uses neither feature","A correlated proxy may preserve similar information","PFI measures causality","Correlation is always zero"],a:1,e:"After one column is permuted, the model may still use another correlated column.",why:["Low individual PFI does not prove that neither feature is used.","Correct: information may be interchangeable.","PFI is not a causal measure.","Correlation need not be zero."]},
 {q:"What is the purpose of Model Randomization Sanity Checks?",o:["To test whether explanations change when learned model structure is destroyed","To improve ROC AUC","To replace test data with training data","To prove a causal effect"],a:0,e:"If an explanation remains almost unchanged after model or label randomization, it may reflect priors or method artefacts.",why:["Correct: the test checks explanation sensitivity to randomization.","A sanity check is not a model-improvement method.","Replacing datasets is unrelated.","Randomization does not prove causality."]},
 {q:"Why does the metric affect Feature Importance?",o:["The metric defines which aspect of performance is considered important","The metric changes the model architecture","All metrics produce the same ranking","The metric removes correlation"],a:0,e:"PFI is computed as a change in a particular metric; metrics capture different aspects of behaviour.",why:["Correct: importance depends on the selected metric.","Scoring does not rebuild the model.","Different metrics can yield different rankings.","A metric does not remove feature dependence."]},
 {q:"What should be done under strong Distribution Shift?",o:["Reuse the explanation without testing","Evaluate explanations on data representing the target scenario","Delete all features","Use only the training sample"],a:1,e:"Explanation evaluation should represent the distribution in which the model is actually used.",why:["Transfer without testing is unjustified.","Correct: use a representative target sample.","Feature deletion does not solve shift.","Training data may not represent deployment."]},
 {q:"How should Δf = f(x) − f(x′) be interpreted?",o:["As a universal causal effect","As the model-output difference between the original and changed input","As a translation-quality score","As proof that bias is absent"],a:1,e:"Δf is the difference in outputs of a fixed model for two inputs; its meaning depends on how x′ was constructed.",why:["An input change is not automatically a real-world causal intervention.","Correct: it is a model-output difference.","The formula is unrelated to translation.","It does not rule out model bias."]},
 {q:"What must be documented in a faithfulness protocol?",o:["Only the final ranking","Model, sample, metric, baseline, perturbation, and limitations","Only the library name","Only a screenshot of the explanation"],a:1,e:"Without experimental conditions, a result cannot be reproduced or interpreted correctly.",why:["A ranking without context is insufficient.","Correct: all key conditions and limitations must be recorded.","A library name does not replace methodology.","A screenshot does not describe the experiment."]},
 {q:"What is the most defensible conclusion after a successful deletion test?",o:["The feature's causality has been proven","The explanation is supported for the tested model, data, and perturbation","The explanation is valid for all users and periods","No further evaluation is needed"],a:1,e:"A successful test provides bounded evidence under specified conditions, not universal proof.",why:["Deletion does not prove causality.","Correct: the conclusion is limited to the tested conditions.","Other populations and periods require separate checks.","Independent tests remain useful."]}
 ]
},
zh: {
 title:"解释忠实性与解释的局限性",
 lead:"如何检验解释是否真实反映模型行为，以及为什么一个令人信服的故事本身并不是证据。",
 outcomes:[
 "区分忠实性、合理性、可解释性和更广义的解释质量。",
 "说明基于扰动的评估、特征删除、特征插入和合理性检查的作用。",
 "识别相关性、评价指标、背景数据和分布偏移对评估的影响。",
 "执行可复现的特征删除 / 插入测试，并解释其局限性。",
 "在报告解释质量时明确实验条件、限制和不确定性。"
 ],
 sections:[
 {id:"plausibility",title:"1. 容易理解的解释不一定正确",paragraphs:[
 "设想一个信用风险模型拒绝了申请人，并给出解释：“高负债率是决定性因素。”这听起来很合理。但模型实际上可能依赖申请表中的某个技术性字段，例如与历史信贷政策相关的网点代码。解释可能很有说服力，却并不完整，也未必忠实反映模型。",
 "人们会根据叙述连贯性、常识和熟悉的因果故事来判断解释。模型则通过学习到的函数计算预测。因此，人的叙述可能与模型实际依赖的因素存在差异。一个精致的解释并不能证明模型确实使用了其中提到的特征。",
 "XAI 需要区分三个问题：人是否能理解解释；解释是否符合该模型的行为；解释是否有助于预定任务。一个问题的肯定答案并不能保证另外两个问题。"
 ],diagram:"plausibility"},
 {id:"definitions",title:"2. 忠实性及相关概念",paragraphs:[
 "<strong>Faithfulness（解释忠实性）</strong>是指解释在明确条件下准确反映被解释模型行为的程度。这些条件包括选定样本、输入区域、评价指标和评估流程。脱离上下文，忠实性并不是解释文本的绝对属性。",
 "<strong>Plausibility（合理性）</strong>描述解释在人看来是否合理、可信。它属于人的判断，并不能证明解释与模型一致。<strong>Interpretability（可解释性）</strong>是人理解模型或其行为的程度。",
 "<strong>Explanation Quality（解释质量）</strong>是更广泛的概念，可能包括忠实性、可理解性、稳定性、实用性、完整性和受众适配。例如，“模型考虑了收入和负债”可能清晰且合理。如果对这些特征进行受控修改几乎不改变预测，而修改某个隐藏代理特征却显著改变预测，那么在被测试区域内，该解释的忠实性就较低。"
 ],formula:"Δf = f(x) − f(x′)",formulaNote:"f(x) 表示固定模型对输入 x 的输出。如果 x′ 是通过受控修改输入得到的，Δf 表示该实验中的模型输出变化。其含义取决于 x′ 的构造方式；它本身并不是因果效应。"},
 {id:"tests",title:"3. 如何评估解释忠实性",paragraphs:[
 "<strong>基于扰动的评估</strong>按照预先定义的规则修改输入或其中一部分，并测量模型响应。规则很重要：替换为零、中位数、基线值、掩码或合理的条件值，回答的是不同问题。",
 "<strong>特征删除</strong>按照解释给出的顺序逐步删除或替换特征。如果最先删除的特征确实对模型重要，那么所选指标通常应比随机顺序下降得更快。但替换操作可能产生不真实的输入。",
 "<strong>特征插入</strong>从参考输入开始，逐步恢复特征。有效的排序通常会比随机顺序更快地恢复模型性能或置信度。结果取决于基线以及中间输入的分布。",
 "<strong>遮挡（Occlusion）</strong>会屏蔽输入区域，例如图像块或文本 token，并测量预测变化。它适合局部分析，但掩码可能产生不自然的输入。",
 "<strong>敏感性分析</strong>研究预测或解释在输入发生小幅、有效变化时如何改变。过高的敏感性可能意味着不稳定；完全不敏感也不一定理想。",
 "<strong>模型随机化合理性检查</strong>比较原始模型与参数或标签被随机化后的模型所产生的解释。如果破坏已学习结构后解释几乎不变，那么解释可能反映了数据先验或可视化流程，而不是模型知识。",
 "删除、插入或合理性检查都不是通用证书。更可靠的证据来自多种测试的组合、对扰动方式的合理说明，以及在目标数据区域上的评估。"
 ],formula:"D(k) = S(f, X, y) − S(f, T_k(X), y)。其中 S 是数值越高越好的指标；T_k 按解释给出的顺序替换前 k 个特征。D(k) 为正表示删除这些特征后所选指标下降。",diagram:"deletion"},
 {id:"pfi",title:"4. 与特征重要性和置换特征重要性的联系",paragraphs:[
 "Feature Importance 和 Permutation Feature Importance（PFI）衡量模型行为的不同方面。PFI 测量固定模型在某一列被置换后，指定评价指标的变化。它估计的是特定样本中模型对特征信息的性能依赖，而不是因果贡献。",
 "当特征相关时，模型可能使用可互换的信号。置换一列后，代理特征仍然保留，因此单个特征的 PFI 可能很小。同时，独立置换也可能产生真实数据中不存在的组合。",
 "评价指标会改变排名的含义：accuracy、ROC AUC、F1 和 log loss 回答不同问题。全局重要性对样本进行平均，并不能保证某个具体样本的局部解释是忠实的。PFI、模型系数、SHAP 和局部扰动测试之间的差异不一定是错误，因为它们衡量的是不同量。",
 "因此，应将 7.2.1 和 7.2.2 中的结果视为关于模型依赖关系的假设。下一步是在具体样本和相关数据分布上检验这些假设。"
 ]},
 {id:"limits",title:"5. 局限性与误差来源",paragraphs:[
 "<strong>相关特征 / 特征依赖：</strong>可互换的特征会分担重要性排名，而独立置换会破坏它们的联合结构。应比较单独置换和分组置换；条件方法需要可信的条件分布模型。",
 "<strong>分布偏移：</strong>与实际部署数据不同的评估样本可能无法代表运行时行为。应在具有代表性的时间段和用户子群上测试解释。",
 "<strong>分布外扰动：</strong>将特征替换为零或中位数可能产生不可能的组合。优先采用领域知识支持的基线、掩码或条件生成，并记录局限性。",
 "<strong>模型复杂性与不稳定性：</strong>复杂模型可能具有局部突变边界；输入、样本或随机种子的微小变化可能改变解释。应重复实验并报告波动。",
 "<strong>对背景数据的敏感性：</strong>类似 SHAP 的方法以及依赖基线的解释会随着背景样本改变。背景数据应代表相关人群，并且需要记录。",
 "<strong>指标依赖性：</strong>某个特征可能影响 ROC AUC，却几乎不影响特定阈值下的 accuracy。应在分析前选择指标，并说明它与决策的关系。",
 "<strong>抽样方差：</strong>有限样本和随机置换会引入噪声。应使用重复、区间或 bootstrap；置换标准差并不能覆盖所有不确定性来源。",
 "<strong>人的偏差：</strong>专家可能更偏好熟悉且听起来具有因果性的解释。应将人的可理解性评价与模型对应关系的实验评价分开。"
 ]},
 {id:"protocol",title:"6. 解释质量评估的实践流程",paragraphs:[
 "1. <strong>定义评估目标：</strong>全局模型依赖、局部预测，还是部署场景。2. <strong>固定模型和数据：</strong>模型版本、样本、目标指标和时间窗口。",
 "3. <strong>选择解释方法</strong>并提出可检验的主张，例如“特征 A 是该局部预测的主要因素之一”。4. <strong>选择独立测试：</strong>删除、插入、遮挡、敏感性或随机化合理性检查。",
 "5. <strong>明确扰动方式：</strong>修改什么、用什么替换、按什么顺序，以及中间输入是否真实。6. <strong>与基线和控制组比较：</strong>随机顺序、另一种基线或其他合理流程。",
 "7. <strong>评估稳定性：</strong>重复实验、多个样本、子群、随机种子和合理替代方案。8. <strong>记录局限性：</strong>相关性、分布偏移、指标、样本量和潜在伪影。",
 "9. <strong>提出有限结论：</strong>说明哪些主张得到支持、基于哪些数据以及存在多大不确定性。不要把局部测试变成普遍证明。"
 ],diagram:"pipeline"},
 {id:"summary",title:"7. 总结：解释是一项可检验的假设",paragraphs:[
 "忠实性不是清晰或有说服力的同义词。一个解释可能让人信服，却不能反映预测机制。评估必须与模型、样本、指标、数据和扰动流程绑定。",
 "删除、插入、遮挡、敏感性分析和随机化合理性检查提供互补证据。每种测试都有自己的假设；相关性和人为构造的分布外输入尤其容易被忽略。",
 "实践建议：除了排名或可视化，还应报告评估说明——模型、样本、指标、基线、扰动、重复次数、局限性和适用范围。这样，解释才能成为可检验的研究结果，而不是一个动听的故事。"
 ]}
 ],
 practice:{
 title:"实验：使用删除和插入测试解释",
 intro:"训练一个二分类器，计算置换特征重要性，然后依次用中位数替换排名靠前的特征（删除），再从参考输入中逐步恢复特征（插入）。最后使用随机打乱标签训练的模型执行合理性检查。",
 explain:"使用 ROC AUC 作为排序指标。random_state 固定数据生成和划分；n_repeats 用于估计置换波动。删除测试测量模型在留出样本上的行为。插入测试依赖参考输入：尤其在特征相关时，中间组合可能不符合真实数据分布。",
 task:"将基线从中位数改为零并比较曲线。分别使用 5、30 和 100 次置换重新计算 PFI。比较相关的 feature_0 与 feature_5 的单独 PFI 和联合扰动结果。说明哪些结论稳定，哪些取决于干预方式。"
 },
 sources:[
 ["Adebayo 等（2018），Sanity Checks for Saliency Maps","https://proceedings.neurips.cc/paper/2018/hash/294a8ed24b1ad22ec2e7efea049b8737-Abstract.html"],
 ["Covert、Lundberg 与 Lee（2021），Explaining by Removing: A Unified Framework for Model Explanation","https://jmlr.org/papers/v22/20-1316.html"],
 ["Hooker 等（2019），A Benchmark for Interpretability Methods in Deep Neural Networks","https://proceedings.neurips.cc/paper/2019/hash/fe4b8556000d0f0cae99daa5c5c5a410-Abstract.html"],
 ["Molnar，《Interpretable Machine Learning》：置换特征重要性的陷阱","https://christophm.github.io/interpretable-ml-book/feature-importance.html"],
 ["scikit-learn：置换特征重要性","https://scikit-learn.org/stable/modules/permutation_importance.html"]
 ],
 glossary:[
 ["Faithfulness — 忠实性","解释在明确评估条件下反映模型行为的准确程度。"],
 ["Plausibility — 合理性","解释在人看来是否合理；它不能证明解释与模型一致。"],
 ["Interpretability — 可解释性","人理解模型或其行为的程度。"],
 ["Explanation Quality — 解释质量","包括忠实性、清晰度、稳定性、实用性和受众适配等属性。"],
 ["Feature Attribution — 特征归因","根据特定方法将贡献或重要性分配给输入特征。"],
 ["Feature Deletion — 特征删除","逐步删除或替换输入特征，并测试模型行为。"],
 ["Feature Insertion — 特征插入","从参考输入逐步恢复特征，并测试预测如何恢复。"],
 ["Perturbation — 扰动","对输入进行受控修改，例如遮挡、替换、置换或添加噪声。"],
 ["Sensitivity Analysis — 敏感性分析","研究预测或解释对小幅有效输入变化的响应。"],
 ["Sanity Checks — 合理性检查","检验解释是否会对模型已学习信息的破坏作出响应的控制实验。"],
 ["Distribution Shift — 分布偏移","训练、评估和部署之间的数据分布发生变化。"],
 ["Out-of-Distribution Data — 分布外数据","不符合模型训练或验证数据典型分布的输入。"]
 ],
 quiz:[
 {q:"哪项最准确地描述了解释忠实性？",o:["解释对专家看起来很有说服力","解释在明确条件下符合被测试模型的行为","解释列出了很多特征","解释符合用户预期"],a:1,e:"忠实性关注解释与模型实际行为的对应关系，而不是外观或人的说服力。",why:["这是合理性，而不是忠实性。","正确：关注明确条件下与模型行为的一致性。","特征数量不能保证准确性。","用户预期也可能是错误的。"]},
 {q:"特征删除测试测量什么？",o:["特征在现实世界中的因果效应","删除特征时指定指标或预测的变化","解释的翻译质量","模型架构的复杂程度"],a:1,e:"删除测试评估固定模型对受控删除或替换输入特征的响应。",why:["删除数据列不等于现实世界的因果实验。","正确：测量模型对指定干预的响应。","它不评估翻译。","它不直接测量架构。"]},
 {q:"为什么删除测试可能产生误导性结果？",o:["模型总会过拟合","特征替换可能产生分布外输入","指标无法重新计算","该测试只适用于树模型"],a:1,e:"中位数、零值或掩码可能产生不真实的特征组合，因此测试也可能测量模型对人工输入的反应。",why:["测试不会自动导致过拟合。","正确：扰动可能离开真实数据区域。","指标可以并且应该重新计算。","只要模型可以预测，许多模型都能进行删除测试。"]},
 {q:"特征插入测试评估什么？",o:["按指定顺序恢复特征时模型行为是否恢复","能否删除训练集","两个特征是否存在因果关系","模型系数是否相等"],a:0,e:"插入从参考输入开始，逐步恢复特征，并测量预测或指标的恢复。",why:["正确：评估信息恢复的顺序。","删除训练集与插入无关。","该方法不能建立因果关系。","有些模型没有系数。"]},
 {q:"合理性高而忠实性低意味着什么？",o:["解释容易理解，但不能很好地反映模型","模型必然正确","解释证明了因果关系","方法不依赖数据"],a:0,e:"人的说服感与解释和模型行为之间的对应关系是不同属性。",why:["正确：解释可能清晰，但对模型行为的描述仍然错误。","不能据此判断模型正确性。","合理性不能证明因果关系。","解释方法依赖数据和流程。"]},
 {q:"为什么相关特征的单独 PFI 可能较低？",o:["模型没有使用任何一个特征","相关代理特征可能保留相似信息","PFI 衡量因果关系","相关性总是为零"],a:1,e:"置换一个列之后，模型可能仍然使用另一个相关列。",why:["单独 PFI 低并不能证明模型没有使用它们。","正确：信息可能具有可替代性。","PFI 不是因果指标。","相关性不必为零。"]},
 {q:"模型随机化合理性检查的目的是什么？",o:["检验破坏模型已学习结构后解释是否改变","提高 ROC AUC","用训练数据替换测试数据","证明因果效应"],a:0,e:"如果模型或标签随机化后解释几乎不变，应检查解释是否由先验或方法伪影决定。",why:["正确：检查解释对随机化是否敏感。","合理性检查不是改进模型的方法。","替换数据集与此无关。","随机化不能证明因果关系。"]},
 {q:"为什么评价指标会影响特征重要性？",o:["指标定义了被认为重要的性能方面","指标会改变模型架构","所有指标都会产生相同排名","指标会消除相关性"],a:0,e:"PFI 计算的是某个特定指标的变化；不同指标衡量不同的行为方面。",why:["正确：重要性取决于所选指标。","评分不会重建模型。","不同指标可能产生不同排名。","指标不会消除特征依赖。"]},
 {q:"出现明显分布偏移时应该怎么做？",o:["不经测试直接沿用原解释","在代表目标场景的数据上评估解释","删除所有特征","只使用训练样本"],a:1,e:"解释评估应代表模型实际使用时的数据分布。",why:["未经测试直接迁移结论缺乏依据。","正确：需要具有代表性的目标样本。","删除特征不能解决分布偏移。","训练数据可能不代表部署场景。"]},
 {q:"应如何理解 Δf = f(x) − f(x′)？",o:["普遍适用的因果效应","原始输入与修改输入之间的模型输出差","翻译质量分数","不存在偏差的证明"],a:1,e:"Δf 是固定模型对两个输入的输出差异；其含义取决于 x′ 的构造方式。",why:["输入变化不自动等于现实世界因果干预。","正确：这是模型输出差异。","该公式与翻译无关。","它不能排除模型偏差。"]},
 {q:"忠实性评估流程中必须记录什么？",o:["只有最终排名","模型、样本、指标、基线、扰动和局限性","只有库名称","只有解释截图"],a:1,e:"没有实验条件，结果就无法复现或正确解释。",why:["没有上下文的排名是不充分的。","正确：必须记录关键条件和局限性。","库名称不能替代方法学说明。","截图无法描述实验。"]},
 {q:"成功完成删除测试后，哪种结论最合理？",o:["特征的因果性已被证明","该解释在被测试的模型、数据和扰动条件下获得支持","该解释适用于所有用户和时期","不再需要其他评估"],a:1,e:"成功测试只提供特定条件下的有限证据，而不是普遍证明。",why:["删除测试不能证明因果关系。","正确：结论受测试条件限制。","其他人群和时期需要单独检查。","独立测试仍然有价值。"]}
 ]
},
};
const diagrams = {
ru:{
 plausibility:{title:"Правдоподобие и faithfulness",description:"Различие между человеческой убедительностью и проверенным соответствием поведения модели.",caption:"Правдоподобие оценивает человек; faithfulness требует проверки поведения модели.",scrollLabel:"Схема сравнения правдоподобия и достоверности",nodes:[
 {id:"input",title:"Вход и модель",detail:"Модель использует фактические зависимости"},
 {id:"story",title:"Убедительный рассказ",detail:"Человек оценивает понятность и здравый смысл",tone:"accent"},
 {id:"test",title:"Контролируемый тест",detail:"Меняем названные признаки и измеряем выход"},
 {id:"result",title:"Проверка faithfulness",detail:"Сопоставляем объяснение с реакцией модели",tone:"good"}
 ]},
 deletion:{title:"Deletion и insertion",description:"Два направления проверки порядка признаков на фиксированной модели.",caption:"Обе кривые зависят от baseline, метрики и реалистичности промежуточных входов.",scrollLabel:"Схема удаления и добавления признаков",nodes:[
 {id:"rank",title:"Рейтинг признаков",detail:"Порядок задаёт объясняющий метод"},
 {id:"delete",title:"Deletion",detail:"Удаляем признаки по одному",tone:"bad"},
 {id:"insert",title:"Insertion",detail:"Восстанавливаем признаки из baseline",tone:"accent"},
 {id:"metric",title:"Метрика модели",detail:"Сравниваем с random order и baseline"}
 ]},
 pipeline:{title:"Протокол оценки объяснения",description:"Последовательность воспроизводимой проверки faithfulness.",caption:"Вывод относится только к зафиксированной модели, выборке, метрике и perturbation.",scrollLabel:"Этапы протокола оценки",nodes:[
 {id:"scope",title:"1. Цель и область",detail:"Локальное или глобальное утверждение"},
 {id:"method",title:"2. Метод и baseline",detail:"Объяснение и правило perturbation"},
 {id:"test",title:"3. Контрольный тест",detail:"Deletion, insertion, sensitivity, sanity"},
 {id:"stability",title:"4. Устойчивость",detail:"Повторы, группы, альтернативы"},
 {id:"limits",title:"5. Ограничения",detail:"Корреляции и сдвиг распределения"},
 {id:"report",title:"6. Вывод",detail:"Поддержанное утверждение и неопределённость",tone:"good"}
 ]}
},
en:{
 plausibility:{title:"Plausibility and faithfulness",description:"Human persuasiveness compared with tested correspondence to model behaviour.",caption:"Plausibility is judged by people; faithfulness requires testing model behaviour.",scrollLabel:"Plausibility and faithfulness comparison",nodes:[
 {id:"input",title:"Input and model",detail:"The model uses learned dependencies"},
 {id:"story",title:"Convincing story",detail:"A person judges clarity and common sense",tone:"accent"},
 {id:"test",title:"Controlled test",detail:"Change named features and measure output"},
 {id:"result",title:"Faithfulness check",detail:"Compare the explanation with model response",tone:"good"}
 ]},
 deletion:{title:"Deletion and insertion",description:"Two directions for testing feature order on a fixed model.",caption:"Both curves depend on the baseline, metric, and realism of intermediate inputs.",scrollLabel:"Feature deletion and insertion diagram",nodes:[
 {id:"rank",title:"Feature ranking",detail:"The explanation method proposes an order"},
 {id:"delete",title:"Deletion",detail:"Remove features one by one",tone:"bad"},
 {id:"insert",title:"Insertion",detail:"Restore features from a baseline",tone:"accent"},
 {id:"metric",title:"Model metric",detail:"Compare with random order and baseline"}
 ]},
 pipeline:{title:"Explanation evaluation protocol",description:"A reproducible sequence for evaluating faithfulness.",caption:"Conclusions apply only to the specified model, sample, metric, and perturbation.",scrollLabel:"Evaluation protocol stages",nodes:[
 {id:"scope",title:"1. Scope",detail:"Local or global claim"},
 {id:"method",title:"2. Method and baseline",detail:"Explanation and perturbation rule"},
 {id:"test",title:"3. Control test",detail:"Deletion, insertion, sensitivity, sanity"},
 {id:"stability",title:"4. Stability",detail:"Repeats, groups, alternatives"},
 {id:"limits",title:"5. Limitations",detail:"Correlations and distribution shift"},
 {id:"report",title:"6. Report",detail:"Supported claim and uncertainty",tone:"good"}
 ]}
},
zh:{
 plausibility:{title:"合理性与忠实性",description:"人的说服感与经过测试的模型行为一致性之间的区别。",caption:"合理性由人判断；忠实性需要检验模型行为。",scrollLabel:"合理性与忠实性比较图",nodes:[
 {id:"input",title:"输入与模型",detail:"模型使用学习到的依赖关系"},
 {id:"story",title:"令人信服的叙述",detail:"人判断清晰度与常识性",tone:"accent"},
 {id:"test",title:"受控测试",detail:"修改所述特征并测量输出"},
 {id:"result",title:"忠实性检查",detail:"将解释与模型响应进行比较",tone:"good"}
 ]},
 deletion:{title:"删除与插入",description:"在固定模型上检验特征排序的两个方向。",caption:"两条曲线都取决于基线、指标以及中间输入的真实性。",scrollLabel:"特征删除与插入示意图",nodes:[
 {id:"rank",title:"特征排名",detail:"解释方法给出排序"},
 {id:"delete",title:"删除",detail:"逐个移除特征",tone:"bad"},
 {id:"insert",title:"插入",detail:"从基线逐步恢复特征",tone:"accent"},
 {id:"metric",title:"模型指标",detail:"与随机顺序和基线比较"}
 ]},
 pipeline:{title:"解释评估流程",description:"评估解释忠实性的可复现步骤。",caption:"结论仅适用于指定的模型、样本、指标和扰动方式。",scrollLabel:"评估流程阶段",nodes:[
 {id:"scope",title:"1. 目标范围",detail:"局部或全局主张"},
 {id:"method",title:"2. 方法与基线",detail:"解释方法和扰动规则"},
 {id:"test",title:"3. 对照测试",detail:"删除、插入、敏感性、合理性"},
 {id:"stability",title:"4. 稳定性",detail:"重复、分组与替代方案"},
 {id:"limits",title:"5. 局限性",detail:"相关性与分布偏移"},
 {id:"report",title:"6. 报告结论",detail:"得到支持的主张与不确定性",tone:"good"}
 ]}
}
};
window.DCH_FAITHFULNESS_LESSON={code:"7.2.3",locales:["ru","en","zh"],content:L,diagrams:diagrams,practiceCode:code};
})();