/* Track A · 8.1.2 — ICE · RU / EN / ZH lesson data. */
(function(){
"use strict";
const content={
  "ru": {
    "title": "ICE — Individual Conditional Expectation",
    "lead": "Как отдельные объекты реагируют на изменение признака и почему средняя кривая PDP может скрывать важные различия.",
    "outcomes": [
      "Объяснять, на какой вопрос отвечает ICE и чем он отличается от PDP.",
      "Записывать формулу ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ) и интерпретировать её обозначения.",
      "Строить индивидуальную кривую, изменяя один признак и сохраняя остальные характеристики объекта.",
      "Выбирать опорные объекты, диапазон и сетку значений для ICE.",
      "Интерпретировать наклон, форму, параллельность, расхождение и пересечение ICE-кривых.",
      "Объяснять, как усреднение ICE-кривых образует PDP и что при этом теряется.",
      "Строить centered ICE и объяснять роль базового значения z₀.",
      "Оценивать визуальную перегрузку, вычислительную стоимость и риск нереалистичных сочетаний признаков.",
      "Строить ICE и PDP средствами scikit-learn и вычислять c-ICE вручную.",
      "Выбирать PDP, ICE, c-ICE или ALE в соответствии с исследовательским вопросом."
    ],
    "sections": [
      [
        "motivation",
        "1. Зачем смотреть на отдельные объекты",
        [
          "Представим модель прогноза стоимости недвижимости. Для двух квартир увеличение площади на 10 м² может по-разному менять прогноз: для одной модели дополнительная площадь особенно важна, для другой эффект слабее, а для третьей зависит от района или числа комнат. Средняя кривая PDP сводит эти реакции к одной линии.",
          "ICE раскрывает распределение реакций: вместо одной усреднённой линии мы строим отдельную кривую для каждого выбранного объекта. Это позволяет увидеть неоднородность поведения уже обученной модели. Речь идёт о прогнозах модели, а не об изменении фактической цены после реального ремонта."
        ],
        "single"
      ],
      [
        "definition",
        "2. Формальное определение ICE",
        [
          "Пусть f(x) — обученная предсказательная модель, xᵢ — i-е наблюдение, j — индекс исследуемого признака, xᵢ,₋ⱼ — все остальные признаки этого наблюдения, а z — значение, которое мы подставляем вместо исходного xᵢⱼ.",
          "Индивидуальное условное ожидание задаётся выражением ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ). Индекс i фиксирует объект, j — выбранный признак, z — точку сетки. Для каждого z меняется только j-й признак; остальные значения строки остаются прежними. Термин expectation здесь не означает усреднение по объектам: одна ICE-кривая относится к одному объекту."
        ],
        "formula"
      ],
      [
        "algorithm",
        "3. Как строится индивидуальная кривая",
        [
          "Сначала выберите обученную модель, набор опорных строк и один признак. Затем задайте сетку z₁,…,zG в содержательном диапазоне признака. Для каждого объекта i создайте G копий строки, подставьте очередное z в выбранный столбец и получите G прогнозов f(zg, xᵢ,₋ⱼ). Соедините точки по возрастанию z.",
          "Для n объектов получается n кривых и примерно n × G предсказаний. Чтобы график оставался читаемым, часто используют репрезентативное подмножество объектов, фиксированный seed и диапазон, например между 5-м и 95-м процентилями. Подмножество должно быть описано: оно влияет на то, какие индивидуальные реакции попадут на рисунок."
        ],
        "family"
      ],
      [
        "reading",
        "4. Как читать семейство ICE-кривых",
        [
          "Сначала проверьте оси: горизонтальная ось — значение выбранного признака, вертикальная — выход модели в исходных единицах регрессии или в выбранной шкале классификатора. Наклон показывает направление и локальную силу изменения прогноза при движении по z. Нелинейность и изгибы указывают на изменение чувствительности модели в разных диапазонах.",
          "Почти параллельные линии означают сходную форму отклика, даже если базовые прогнозы различаются. Расходящиеся линии указывают на неодинаковую чувствительность; пересечения — на изменение относительного порядка прогнозов объектов. Это признаки неоднородности функции модели, но не доказательство причинного взаимодействия в реальном мире."
        ],
        "family"
      ],
      [
        "pdp",
        "5. Связь ICE и PDP: что скрывает среднее",
        [
          "При одной и той же сетке и одной опорной выборке PDP является точечным средним индивидуальных кривых: PDⱼ(z) = (1/n) Σᵢ ICEᵢⱼ(z). Для каждого z мы усредняем прогнозы всех объектов. Поэтому PDP можно понимать как агрегат семейства ICE.",
          "Если часть объектов имеет растущую кривую, а другая часть — убывающую, среднее может оказаться почти горизонтальным. Такая PDP не означает, что модель нечувствительна к признаку для каждого объекта. Сравнивайте среднюю линию с разбросом индивидуальных кривых и не трактуйте её как типичную реакцию без проверки."
        ],
        "single"
      ],
      [
        "centered",
        "6. Centered ICE: сравнение изменений",
        [
          "Абсолютные ICE-кривые могут перекрываться из-за разных базовых уровней прогноза. Centered ICE вычитает из каждой кривой её значение в общей опорной точке z₀: cICEᵢⱼ(z) = ICEᵢⱼ(z) − ICEᵢⱼ(z₀). Все линии проходят через ноль в z₀, и легче сравнивать изменение прогноза относительно собственной базы объекта.",
          "Центрирование удаляет информацию об абсолютном уровне прогнозов. Выбирайте z₀ внутри хорошо представленного диапазона признака и указывайте его на графике. Нельзя сравнивать c-ICE с абсолютными прогнозами так, будто вертикальная шкала у них одна и та же."
        ],
        "centered"
      ],
      [
        "limits",
        "7. Ограничения и практические предосторожности",
        [
          "ICE может стать нечитаемым при сотнях или тысячах линий: используйте прозрачность, ограниченную выборку, квантильные диапазоны или отдельные подгруппы. Вычислительная стоимость при brute-force растёт примерно как O(nG); для дорогой модели сокращайте число объектов и точек сетки, не скрывая это в отчёте.",
          "При корреляции признаков замена только одного столбца может создать комбинации, которых почти нет в данных: например, площадь 35 м² при шести комнатах. Модель выдаст прогноз, но он может относиться к области слабой эмпирической поддержки. Проверяйте совместное распределение признаков и диапазон наблюдений. ICE, как и PDP, не является причинным методом."
        ],
        "limits"
      ],
      [
        "choice",
        "8. Как выбрать метод",
        [
          "PDP отвечает на вопрос о среднем отклике по опорной выборке; ICE — как меняется прогноз для отдельных объектов; centered ICE — насколько отличаются изменения относительно общей базовой точки; ALE — каков накопленный локальный эффект в областях, где есть наблюдения. Эти методы дополняют друг друга, а не образуют универсальный рейтинг.",
          "Практический маршрут: начните с PDP для краткого среднего резюме; добавьте ICE, если подозреваете неоднородность; используйте c-ICE, когда важны формы изменений, а не уровни; рассмотрите ALE при сильной зависимости признаков. В следующем уроке 8.1.3 разберём ALE подробнее."
        ],
        "single"
      ]
    ],
    "practice": {
      "title": "Лабораторная работа: ICE, PDP и centered ICE",
      "intro": "Обучите RandomForestRegressor на синтетических данных о недвижимости с нелинейным эффектом площади и взаимодействием с премиальным районом. Сравните среднюю и индивидуальные реакции.",
      "task": "Запустите скрипт, сравните ICE для признаков area_m2 и premium_zone, постройте centered ICE вручную для площади, измените число опорных объектов и объясните, как меняется читаемость. Проверьте корреляцию площади и числа комнат.",
      "expected": "ICE показывает разброс индивидуальных откликов; PDP совпадает с их точечным средним на одной выборке и сетке; centered ICE выравнивает базовые значения в z₀, но скрывает абсолютные прогнозы. Результат зависит от набора опорных объектов и диапазона сетки."
    },
    "sources": [
      [
        "Goldstein et al. (2015). Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation. JCGS, 24(1), 44–65. DOI: 10.1080/10618600.2014.907095.",
        "https://doi.org/10.1080/10618600.2014.907095"
      ],
      [
        "scikit-learn User Guide: Partial Dependence and Individual Conditional Expectation plots.",
        "https://scikit-learn.org/stable/modules/partial_dependence.html"
      ],
      [
        "scikit-learn API: PartialDependenceDisplay.from_estimator.",
        "https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html"
      ],
      [
        "Friedman (2001). Greedy Function Approximation: A Gradient Boosting Machine. Annals of Statistics, 29(5), 1189–1232. DOI: 10.1214/aos/1013203451.",
        "https://doi.org/10.1214/aos/1013203451"
      ],
      [
        "Apley & Zhu (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. JRSS B, 82(4), 1059–1086. DOI: 10.1111/rssb.12377.",
        "https://doi.org/10.1111/rssb.12377"
      ]
    ],
    "glossary": [
      [
        "Individual Conditional Expectation (ICE)",
        "Отдельная кривая предсказаний модели для одного объекта при изменении выбранного признака."
      ],
      [
        "Опорный объект",
        "Строка данных, остальные признаки которой фиксируются при построении ICE."
      ],
      [
        "Исследуемый признак",
        "Входной признак, значение которого варьируется по сетке."
      ],
      [
        "Остальные признаки",
        "Все входы объекта, кроме исследуемого признака."
      ],
      [
        "Сетка значений",
        "Набор значений z, в которых вычисляется модельный отклик."
      ],
      [
        "PDP",
        "Точечное среднее ICE-кривых по опорным объектам."
      ],
      [
        "Centered ICE (c-ICE)",
        "ICE-кривая после вычитания её значения в общей базовой точке."
      ],
      [
        "Базовая точка z₀",
        "Выбранное значение признака, относительно которого центрируются ICE-кривые."
      ],
      [
        "Гетерогенность отклика",
        "Различия формы или величины реакции модели между объектами."
      ],
      [
        "Взаимодействие признаков",
        "Ситуация, когда отклик на один признак зависит от значения другого признака в модели."
      ],
      [
        "Off-manifold комбинация",
        "Совместное сочетание входов, редко или никогда не встречающееся в наблюдаемых данных."
      ],
      [
        "ALE",
        "Метод накопления локальных изменений предсказаний в интервалах с наблюдаемыми данными."
      ]
    ],
    "quiz": [
      [
        "Какой объект представляет одна ICE-кривая?",
        [
          "Среднее по всей выборке",
          "Один объект при изменении одного признака",
          "Фактическую траекторию цены",
          "Причинный эффект"
        ],
        1,
        "ICE фиксирует остальные признаки одной строки и меняет только выбранный вход."
      ],
      [
        "Что означает xᵢ,₋ⱼ в формуле ICE?",
        [
          "Целевую переменную",
          "Все признаки объекта i, кроме j-го",
          "Средний прогноз",
          "Набор сеточных значений"
        ],
        1,
        "Это неизменяемые в данной кривой характеристики объекта."
      ],
      [
        "Что вычисляется для каждого значения z?",
        [
          "Новая модель",
          "Прогноз f(z, xᵢ,₋ⱼ)",
          "Среднее фактических y",
          "Корреляция"
        ],
        1,
        "Модель получает копию объекта с подставленным значением исследуемого признака."
      ],
      [
        "Как ICE связан с PDP?",
        [
          "PDP — точечное среднее ICE-кривых",
          "ICE — производная PDP",
          "Методы не связаны",
          "PDP — одна случайная ICE-кривая"
        ],
        0,
        "На одной сетке и одной опорной выборке PDP усредняет ICE в каждой точке."
      ],
      [
        "Что могут означать почти параллельные ICE-кривые?",
        [
          "Сходную форму отклика при разных базовых уровнях",
          "Отсутствие любых различий",
          "Доказанную причинность",
          "Ошибку модели"
        ],
        0,
        "Параллельность указывает на сходную чувствительность, а не равные прогнозы."
      ],
      [
        "Что может указывать на пересечение ICE-кривых?",
        [
          "Изменение относительного порядка прогнозов объектов",
          "Отсутствие взаимодействий",
          "Равенство фактических целей",
          "Нулевую ошибку"
        ],
        0,
        "Пересечение показывает, что модель меняет относительный порядок прогнозов вдоль z."
      ],
      [
        "Зачем применяют centered ICE?",
        [
          "Скрыть все различия",
          "Сравнить изменения относительно общей точки z₀",
          "Получить причинные эффекты",
          "Уменьшить число признаков"
        ],
        1,
        "Вычитание ICE(z₀) выравнивает линии в нуле."
      ],
      [
        "Что теряется при центрировании?",
        [
          "Форма кривой",
          "Абсолютный уровень прогноза",
          "Значения z",
          "Индекс объекта"
        ],
        1,
        "c-ICE сохраняет изменения, но удаляет базовый уровень каждой линии."
      ],
      [
        "Почему ICE-график может быть нечитаемым?",
        [
          "Слишком много перекрывающихся линий",
          "Потому что модель обучена",
          "Потому что z непрерывен",
          "Потому что есть целевая переменная"
        ],
        0,
        "Большое число кривых создаёт визуальную перегрузку."
      ],
      [
        "Что означает стоимость brute-force ICE примерно n × G?",
        [
          "Число классов",
          "Число объектов, умноженное на число точек сетки",
          "Размер модели в байтах",
          "Количество признаков"
        ],
        1,
        "Для каждого объекта вычисляется прогноз в каждой точке сетки."
      ],
      [
        "Почему корреляция признаков важна для ICE?",
        [
          "Подстановка может создать нереалистичные сочетания входов",
          "ICE автоматически удаляет корреляцию",
          "ICE обучает новую модель",
          "Она гарантирует причинность"
        ],
        0,
        "Фиксация остальных входов при изменении одного признака может увести от наблюдаемой области."
      ],
      [
        "Когда стоит рассмотреть ALE вместо PDP/ICE?",
        [
          "При сильной зависимости признаков и необходимости локальных эффектов",
          "Когда нужна одна кривая каждого объекта",
          "Чтобы доказать причинность",
          "Когда модель не умеет предсказывать"
        ],
        0,
        "ALE накапливает локальные изменения в интервалах с данными и снижает дальнюю экстраполяцию."
      ]
    ]
  },
  "en": {
    "title": "ICE — Individual Conditional Expectation",
    "lead": "How individual observations respond to a feature change—and why an average PDP curve can hide important differences.",
    "outcomes": [
      "Explain the question ICE answers and distinguish it from PDP.",
      "Write ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ) and interpret its notation.",
      "Build an individual curve by changing one feature while keeping the object's other features fixed.",
      "Choose reference observations, a feature range, and an evaluation grid.",
      "Interpret slope, shape, parallelism, divergence, and crossings of ICE curves.",
      "Explain how averaging ICE curves produces PDP and what the average conceals.",
      "Build centered ICE and explain the role of the baseline z₀.",
      "Assess visual clutter, computational cost, and unrealistic feature combinations.",
      "Build ICE and PDP with scikit-learn and compute c-ICE manually.",
      "Choose PDP, ICE, c-ICE, or ALE for a stated analytical question."
    ],
    "sections": [
      [
        "motivation",
        "1. Why inspect individual observations",
        [
          "Consider a model predicting house prices. Increasing floor area by 10 m² may change predictions differently across properties: the model may respond strongly for one property, weakly for another, or differently depending on neighbourhood and room count. A PDP compresses these responses into one average curve.",
          "ICE reveals the distribution of model responses by drawing a separate curve for each selected observation. It exposes heterogeneity in the fitted model. These are model predictions, not changes in actual sale prices after a real renovation."
        ],
        "single"
      ],
      [
        "definition",
        "2. Formal definition of ICE",
        [
          "Let f(x) be a fitted prediction model, xᵢ the i-th observation, j the feature of interest, xᵢ,₋ⱼ all other features of that observation, and z a replacement value for the original xᵢⱼ.",
          "Individual Conditional Expectation is ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ). Index i identifies the observation, j the selected feature, and z a grid value. Only feature j changes; the other row values stay fixed. Despite the word expectation, one ICE curve is not an average over observations: it belongs to one observation."
        ],
        "formula"
      ],
      [
        "algorithm",
        "3. How an individual curve is constructed",
        [
          "Choose a fitted model, reference rows, and one feature. Define a grid z₁,…,zG over a meaningful feature range. For each observation i, make G copies of its row, replace the selected column with each grid value, and compute f(zg, xᵢ,₋ⱼ). Connect the predictions in increasing grid order.",
          "With n observations and G grid points, the calculation requires roughly n × G predictions. To keep the plot readable, use a documented representative subset, a fixed random seed, and a supported range such as the 5th–95th percentiles. The subset matters because it determines which individual responses appear."
        ],
        "family"
      ],
      [
        "reading",
        "4. Reading a family of ICE curves",
        [
          "Check the axes first: the horizontal axis is the selected feature; the vertical axis is the model output, in target units for regression or the chosen output scale for classification. Slope indicates the direction and local strength of prediction change along z. Bends and nonlinear shapes indicate changing sensitivity across the range.",
          "Nearly parallel lines have similar response shapes even when their baseline predictions differ. Diverging lines suggest heterogeneous sensitivity; crossings show that the relative order of predictions changes. These patterns describe heterogeneity in the fitted function, not proof of causal interaction in the real world."
        ],
        "family"
      ],
      [
        "pdp",
        "5. ICE and PDP: what the average hides",
        [
          "With the same grid and reference sample, PDP is the pointwise mean of individual curves: PDⱼ(z) = (1/n) Σᵢ ICEᵢⱼ(z). At each z, predictions across observations are averaged. PDP is therefore an aggregate of the ICE family.",
          "If some observations have increasing curves while others decrease, the average can be nearly flat. That does not mean the model is insensitive for every observation. Compare the average with the spread of individual curves; do not assume the mean is a typical response without checking."
        ],
        "single"
      ],
      [
        "centered",
        "6. Centered ICE: comparing changes",
        [
          "Absolute ICE curves can overlap because observations have different baseline prediction levels. Centered ICE subtracts each curve's value at a shared reference point z₀: cICEᵢⱼ(z) = ICEᵢⱼ(z) − ICEᵢⱼ(z₀). All curves pass through zero at z₀, making relative changes easier to compare.",
          "Centering removes information about absolute prediction levels. Choose z₀ within a well-supported feature range and mark it on the plot. Do not compare c-ICE with absolute predictions as if they shared the same vertical scale."
        ],
        "centered"
      ],
      [
        "limits",
        "7. Limitations and practical precautions",
        [
          "ICE can become unreadable with hundreds or thousands of lines. Use transparency, a documented subset, quantile bands, or separate groups. Brute-force cost grows approximately as O(nG); for expensive models, reduce the number of observations and grid points while reporting those choices.",
          "With correlated features, replacing one column can create combinations rarely found in the data—for example, a 35 m² property with six rooms. The model still returns a prediction, but empirical support may be weak. Inspect joint feature distributions and observed ranges. Like PDP, ICE is not a causal method."
        ],
        "limits"
      ],
      [
        "choice",
        "8. Choosing a method",
        [
          "PDP answers a question about the average response over a reference sample; ICE shows how predictions change for individual observations; centered ICE compares changes relative to a shared baseline; ALE accumulates local effects where observations exist. These methods complement one another rather than forming a universal ranking.",
          "A practical route: start with PDP for a concise average summary; add ICE when heterogeneity is suspected; use c-ICE when change shapes matter more than levels; consider ALE under strong feature dependence. The next lesson, 8.1.3, examines ALE in detail."
        ],
        "single"
      ]
    ],
    "practice": {
      "title": "Lab: ICE, PDP, and centered ICE",
      "intro": "Fit a RandomForestRegressor to synthetic house data with a nonlinear area effect and an interaction with a premium-neighbourhood indicator. Compare average and individual responses.",
      "task": "Run the script, compare ICE for area_m2 and premium_zone, build centered ICE for area manually, vary the number of reference observations, and explain the effect on readability. Inspect the correlation between area and room count.",
      "expected": "ICE reveals heterogeneous responses; PDP equals their pointwise mean on the same sample and grid; centered ICE aligns baseline values at z₀ but hides absolute predictions. Results depend on reference observations and the grid range."
    },
    "sources": [
      [
        "Goldstein et al. (2015). Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation. JCGS, 24(1), 44–65. DOI: 10.1080/10618600.2014.907095.",
        "https://doi.org/10.1080/10618600.2014.907095"
      ],
      [
        "scikit-learn User Guide: Partial Dependence and Individual Conditional Expectation plots.",
        "https://scikit-learn.org/stable/modules/partial_dependence.html"
      ],
      [
        "scikit-learn API: PartialDependenceDisplay.from_estimator.",
        "https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html"
      ],
      [
        "Friedman (2001). Greedy Function Approximation: A Gradient Boosting Machine. Annals of Statistics, 29(5), 1189–1232. DOI: 10.1214/aos/1013203451.",
        "https://doi.org/10.1214/aos/1013203451"
      ],
      [
        "Apley & Zhu (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. JRSS B, 82(4), 1059–1086. DOI: 10.1111/rssb.12377.",
        "https://doi.org/10.1111/rssb.12377"
      ]
    ],
    "glossary": [
      [
        "Individual Conditional Expectation (ICE)",
        "A separate model-prediction curve for one observation as a selected feature varies."
      ],
      [
        "Reference observation",
        "A data row whose other features are held fixed for an ICE curve."
      ],
      [
        "Feature of interest",
        "The input feature varied along the evaluation grid."
      ],
      [
        "Complement features",
        "All features of an observation except the selected feature."
      ],
      [
        "Evaluation grid",
        "The set of z values at which model responses are computed."
      ],
      [
        "PDP",
        "The pointwise average of ICE curves over reference observations."
      ],
      [
        "Centered ICE (c-ICE)",
        "An ICE curve after subtracting its value at a shared baseline."
      ],
      [
        "Baseline z₀",
        "The selected feature value used to center ICE curves."
      ],
      [
        "Response heterogeneity",
        "Differences in the shape or magnitude of model responses across observations."
      ],
      [
        "Feature interaction",
        "A model response to one feature that depends on another feature's value."
      ],
      [
        "Off-manifold combination",
        "A joint input combination rarely or never present in observed data."
      ],
      [
        "ALE",
        "A method accumulating local prediction changes in intervals containing observations."
      ]
    ],
    "quiz": [
      [
        "What does one ICE curve represent?",
        [
          "The sample average",
          "One observation as one feature varies",
          "An observed price trajectory",
          "A causal effect"
        ],
        1,
        "ICE fixes the other features of one row and varies only the selected input."
      ],
      [
        "What does xᵢ,₋ⱼ denote?",
        [
          "The target",
          "All features of observation i except feature j",
          "The mean prediction",
          "The evaluation grid"
        ],
        1,
        "These are the unchanged features for that curve."
      ],
      [
        "What is computed at each z?",
        [
          "A new model",
          "The prediction f(z, xᵢ,₋ⱼ)",
          "The mean observed target",
          "A correlation"
        ],
        1,
        "The model predicts a copy of the observation with the selected feature replaced."
      ],
      [
        "How is ICE related to PDP?",
        [
          "PDP is the pointwise mean of ICE curves",
          "ICE is the derivative of PDP",
          "They are unrelated",
          "PDP is one random ICE curve"
        ],
        0,
        "On the same grid and reference sample, PDP averages ICE at each point."
      ],
      [
        "What can nearly parallel ICE curves indicate?",
        [
          "Similar response shapes with different baselines",
          "No differences at all",
          "Proven causality",
          "A model error"
        ],
        0,
        "Parallelism suggests similar sensitivity, not equal predictions."
      ],
      [
        "What can ICE curve crossings indicate?",
        [
          "A change in relative prediction order",
          "No interaction",
          "Equal observed targets",
          "Zero error"
        ],
        0,
        "Crossings show that the model changes the relative order along z."
      ],
      [
        "Why use centered ICE?",
        [
          "To hide all differences",
          "To compare changes relative to a shared z₀",
          "To obtain causal effects",
          "To reduce the number of features"
        ],
        1,
        "Subtracting ICE(z₀) aligns curves at zero."
      ],
      [
        "What is lost by centering?",
        [
          "Curve shape",
          "Absolute prediction level",
          "The z values",
          "Observation identity"
        ],
        1,
        "c-ICE retains changes but removes each curve's baseline level."
      ],
      [
        "Why can an ICE plot become unreadable?",
        [
          "Too many overlapping curves",
          "Because the model is fitted",
          "Because z is continuous",
          "Because there is a target"
        ],
        0,
        "A large number of lines creates visual clutter."
      ],
      [
        "What does brute-force cost O(nG) represent?",
        [
          "Number of classes",
          "Observations multiplied by grid points",
          "Model size in bytes",
          "Number of features"
        ],
        1,
        "Each observation is predicted at each grid value."
      ],
      [
        "Why does feature correlation matter for ICE?",
        [
          "Replacement may create unrealistic input combinations",
          "ICE automatically removes correlation",
          "ICE fits a new model",
          "It guarantees causality"
        ],
        0,
        "Holding other inputs fixed while changing one feature can leave observed data support."
      ],
      [
        "When might ALE be worth considering?",
        [
          "Strong feature dependence and a need for local effects",
          "When one curve per observation is required",
          "To prove causality",
          "When the model cannot predict"
        ],
        0,
        "ALE accumulates local changes in data-supported intervals and reduces distant extrapolation."
      ]
    ]
  },
  "zh": {
    "title": "ICE — 个体条件期望",
    "lead": "观察单个样本如何响应特征变化，以及为什么 PDP 平均曲线可能掩盖重要差异。",
    "outcomes": [
      "解释 ICE 所回答的问题，并区分 ICE 与 PDP。",
      "写出 ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ) 并解释符号。",
      "在保持对象其他特征不变时改变一个特征，构建个体曲线。",
      "选择参考样本、特征范围和评估网格。",
      "解读 ICE 曲线的斜率、形状、平行、发散和交叉。",
      "解释 ICE 曲线的平均如何形成 PDP，以及平均会掩盖什么。",
      "构建 centered ICE 并解释基准值 z₀ 的作用。",
      "评估视觉拥挤、计算成本和不现实特征组合的风险。",
      "使用 scikit-learn 构建 ICE 与 PDP，并手动计算 c-ICE。",
      "根据分析问题选择 PDP、ICE、c-ICE 或 ALE。"
    ],
    "sections": [
      [
        "motivation",
        "1. 为什么要观察单个样本",
        [
          "设想一个预测房价的模型。面积增加 10 m² 对不同房屋的预测影响可能不同：对某套房屋影响明显，对另一套影响较弱，也可能取决于地段和房间数量。PDP 将这些响应压缩为一条平均曲线。",
          "ICE 通过为每个选定样本绘制单独曲线，展示模型响应的分布并揭示已训练模型中的异质性。这些是模型预测，不是实际装修后成交价格的变化。"
        ],
        "single"
      ],
      [
        "definition",
        "2. ICE 的形式化定义",
        [
          "设 f(x) 为已训练的预测模型，xᵢ 为第 i 个观测，j 为关注特征的索引，xᵢ,₋ⱼ 为该观测的其他所有特征，z 为替换原始 xᵢⱼ 的新取值。",
          "个体条件期望定义为 ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ)。索引 i 标识样本，j 标识关注特征，z 是网格取值。每次只改变第 j 个特征，其余行值保持不变。这里的 expectation 并不表示对样本求平均：一条 ICE 曲线只对应一个样本。"
        ],
        "formula"
      ],
      [
        "algorithm",
        "3. 如何构建个体曲线",
        [
          "先选择已训练模型、参考数据行和一个特征。再在有意义的特征范围内定义网格 z₁,…,zG。对每个样本 i，复制 G 行，将关注列依次替换为各网格值，并计算 f(zg, xᵢ,₋ⱼ)。最后按 z 的顺序连接预测点。",
          "n 个样本和 G 个网格点大约需要 n × G 次预测。为保持图形可读，通常选择有代表性的样本子集、固定随机种子，并使用例如第 5 至第 95 百分位的范围。必须说明子集选择，因为它决定哪些个体响应会出现在图中。"
        ],
        "family"
      ],
      [
        "reading",
        "4. 如何阅读 ICE 曲线族",
        [
          "先检查坐标轴：横轴是关注特征，纵轴是模型输出；回归通常使用目标单位，分类则使用选定的输出尺度。斜率表示沿 z 变化时预测改变的方向和局部强度。弯曲和非线性形状表示模型敏感度随范围而变化。",
          "近似平行的曲线表示响应形状相似，即使基准预测不同。曲线发散提示敏感度存在差异；曲线交叉表示预测的相对顺序发生变化。这些模式描述已拟合函数的异质性，并不能证明现实世界中的因果交互。"
        ],
        "family"
      ],
      [
        "pdp",
        "5. ICE 与 PDP：平均值掩盖了什么",
        [
          "使用相同网格和参考样本时，PDP 是个体曲线的逐点平均：PDⱼ(z) = (1/n) Σᵢ ICEᵢⱼ(z)。在每个 z 上，对所有样本的预测求平均。因此，PDP 是 ICE 曲线族的聚合结果。",
          "如果部分样本的曲线上升，而其他样本的曲线下降，平均曲线可能接近水平。这并不意味着模型对每个样本都不敏感。应将平均线与个体曲线的离散程度一起检查，不要未经验证就把均值视为典型响应。"
        ],
        "single"
      ],
      [
        "centered",
        "6. Centered ICE：比较变化量",
        [
          "绝对 ICE 曲线可能因样本的基准预测水平不同而重叠。Centered ICE 从每条曲线中减去共同参考点 z₀ 处的值：cICEᵢⱼ(z) = ICEᵢⱼ(z) − ICEᵢⱼ(z₀)。所有曲线在 z₀ 处经过零点，因此更容易比较相对于各自基线的变化。",
          "中心化会丢失绝对预测水平的信息。应在特征数据支持良好的范围内选择 z₀，并在图中标记。不要把 c-ICE 与绝对预测当作具有相同纵轴含义的图进行比较。"
        ],
        "centered"
      ],
      [
        "limits",
        "7. 局限性与实践注意事项",
        [
          "当曲线达到数百或数千条时，ICE 可能难以阅读。可使用透明度、明确说明的样本子集、分位数带或分组图。brute-force 计算成本约为 O(nG)；对于昂贵模型，可减少样本数和网格点，但必须报告这些选择。",
          "特征相关时，只替换一列可能产生数据中罕见的组合，例如 35 m² 却有六个房间。模型仍会返回预测，但这种组合可能缺乏经验数据支持。检查特征联合分布和观测范围。与 PDP 一样，ICE 不是因果方法。"
        ],
        "limits"
      ],
      [
        "choice",
        "8. 如何选择方法",
        [
          "PDP 回答参考样本上的平均响应问题；ICE 展示个体预测如何变化；centered ICE 比较相对于共同基线的变化；ALE 则在存在观测的区域累积局部效应。这些方法相互补充，而不是通用的优劣排名。",
          "实践路径：先用 PDP 获得简洁的平均概览；怀疑存在异质性时加入 ICE；关注变化形状而非绝对水平时使用 c-ICE；特征依赖较强时考虑 ALE。下一课 8.1.3 将详细介绍 ALE。"
        ],
        "single"
      ]
    ],
    "practice": {
      "title": "实验：ICE、PDP 与 centered ICE",
      "intro": "在合成房屋数据上训练 RandomForestRegressor，其中面积具有非线性效应，并与高端社区指标存在交互。比较平均响应和个体响应。",
      "task": "运行脚本，比较 area_m2 和 premium_zone 的 ICE，手动构建面积的 centered ICE，改变参考样本数量并解释可读性的变化。检查面积与房间数之间的相关性。",
      "expected": "ICE 展示个体响应异质性；在相同样本和网格上，PDP 等于 ICE 的逐点平均；centered ICE 将 z₀ 处的基线对齐，但隐藏绝对预测值。结果取决于参考样本和网格范围。"
    },
    "sources": [
      [
        "Goldstein et al. (2015). Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation. JCGS, 24(1), 44–65. DOI: 10.1080/10618600.2014.907095.",
        "https://doi.org/10.1080/10618600.2014.907095"
      ],
      [
        "scikit-learn 用户指南：Partial Dependence and Individual Conditional Expectation plots。",
        "https://scikit-learn.org/stable/modules/partial_dependence.html"
      ],
      [
        "scikit-learn API：PartialDependenceDisplay.from_estimator。",
        "https://scikit-learn.org/stable/modules/generated/sklearn.inspection.PartialDependenceDisplay.html"
      ],
      [
        "Friedman (2001). Greedy Function Approximation: A Gradient Boosting Machine. Annals of Statistics, 29(5), 1189–1232. DOI: 10.1214/aos/1013203451.",
        "https://doi.org/10.1214/aos/1013203451"
      ],
      [
        "Apley & Zhu (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. JRSS B, 82(4), 1059–1086. DOI: 10.1111/rssb.12377.",
        "https://doi.org/10.1111/rssb.12377"
      ]
    ],
    "glossary": [
      [
        "个体条件期望（ICE）",
        "当关注特征变化时，针对单个样本绘制的模型预测曲线。"
      ],
      [
        "参考样本",
        "构建 ICE 曲线时其余特征保持不变的数据行。"
      ],
      [
        "关注特征",
        "沿评估网格改变取值的输入特征。"
      ],
      [
        "其余特征",
        "除关注特征以外的样本全部特征。"
      ],
      [
        "评估网格",
        "计算模型响应的一组 z 值。"
      ],
      [
        "PDP",
        "对参考样本的 ICE 曲线逐点求平均。"
      ],
      [
        "Centered ICE（c-ICE）",
        "减去共同基准点处取值后的 ICE 曲线。"
      ],
      [
        "基准点 z₀",
        "用于中心化 ICE 曲线的特征取值。"
      ],
      [
        "响应异质性",
        "不同样本之间模型响应形状或幅度的差异。"
      ],
      [
        "特征交互",
        "模型对一个特征的响应取决于另一个特征的取值。"
      ],
      [
        "分布外组合",
        "在观测数据中罕见或不存在的联合输入组合。"
      ],
      [
        "ALE",
        "在包含观测数据的区间内累积局部预测变化的方法。"
      ]
    ],
    "quiz": [
      [
        "一条 ICE 曲线代表什么？",
        [
          "整个样本的平均值",
          "一个样本在一个特征变化时的响应",
          "实际价格轨迹",
          "因果效应"
        ],
        1,
        "ICE 固定单行的其余特征，只改变关注输入。"
      ],
      [
        "公式中的 xᵢ,₋ⱼ 表示什么？",
        [
          "目标变量",
          "样本 i 中除特征 j 以外的所有特征",
          "平均预测",
          "评估网格"
        ],
        1,
        "这些特征在该曲线中保持不变。"
      ],
      [
        "每个 z 处计算什么？",
        [
          "重新训练模型",
          "预测 f(z, xᵢ,₋ⱼ)",
          "观测目标均值",
          "相关系数"
        ],
        1,
        "模型预测关注特征被替换后的样本副本。"
      ],
      [
        "ICE 与 PDP 有什么关系？",
        [
          "PDP 是 ICE 曲线的逐点平均",
          "ICE 是 PDP 的导数",
          "两者无关",
          "PDP 是一条随机 ICE 曲线"
        ],
        0,
        "在相同网格和参考样本上，PDP 在每个点对 ICE 求平均。"
      ],
      [
        "近似平行的 ICE 曲线可能表示什么？",
        [
          "响应形状相似但基准水平不同",
          "完全没有差异",
          "因果关系已被证明",
          "模型错误"
        ],
        0,
        "平行表示敏感度相似，不代表预测值相等。"
      ],
      [
        "ICE 曲线交叉可能表示什么？",
        [
          "预测相对顺序发生变化",
          "不存在交互",
          "观测目标相等",
          "误差为零"
        ],
        0,
        "交叉表示模型沿 z 改变了预测的相对顺序。"
      ],
      [
        "为什么使用 centered ICE？",
        [
          "隐藏所有差异",
          "比较相对于共同 z₀ 的变化",
          "获得因果效应",
          "减少特征数量"
        ],
        1,
        "减去 ICE(z₀) 后，曲线在零点对齐。"
      ],
      [
        "中心化会丢失什么？",
        [
          "曲线形状",
          "绝对预测水平",
          "z 值",
          "样本身份"
        ],
        1,
        "c-ICE 保留变化，但移除每条曲线的基准水平。"
      ],
      [
        "为什么 ICE 图可能难以阅读？",
        [
          "曲线过多且相互重叠",
          "因为模型已训练",
          "因为 z 是连续的",
          "因为存在目标变量"
        ],
        0,
        "大量曲线会造成视觉拥挤。"
      ],
      [
        "brute-force 成本 O(nG) 表示什么？",
        [
          "类别数量",
          "样本数乘以网格点数",
          "模型字节大小",
          "特征数量"
        ],
        1,
        "每个样本都需要在每个网格值处进行预测。"
      ],
      [
        "为什么特征相关性对 ICE 很重要？",
        [
          "替换可能产生不现实的输入组合",
          "ICE 自动消除相关性",
          "ICE 会重新训练模型",
          "它保证因果性"
        ],
        0,
        "改变一个特征并固定其余输入，可能离开观测数据支持区域。"
      ],
      [
        "何时可以考虑 ALE？",
        [
          "特征依赖较强且需要局部效应",
          "需要每个样本一条曲线",
          "为了证明因果性",
          "模型无法预测时"
        ],
        0,
        "ALE 在数据支持的区间累积局部变化，减少远距离外推。"
      ]
    ]
  }
};
const practiceCode="\"\"\"ICE / PDP / centered ICE lab for lesson 8.1.2.\nInstall: python -m pip install numpy pandas matplotlib scikit-learn\nRun: python lessons/practice/a-8-1-2-individual-conditional-expectation.py\n\"\"\"\nfrom __future__ import annotations\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.inspection import PartialDependenceDisplay\nfrom sklearn.model_selection import train_test_split\n\nSEED = 42\nrng = np.random.default_rng(SEED)\nn = 1400\narea = rng.uniform(35, 180, n)\nrooms = np.clip(np.round(area / 27 + rng.normal(0, .7, n)), 1, 7)\npremium = rng.binomial(1, 1 / (1 + np.exp(-(area - 105) / 22)), n)\nage = rng.uniform(0, 60, n)\nnoise = rng.normal(0, 12000, n)\nprice = (65000 + 2100 * area + 9500 * rooms - 700 * age\n         + 26000 * premium * np.tanh((area - 90) / 35)\n         + noise)\nX = pd.DataFrame({\"area_m2\": area, \"rooms\": rooms,\n                  \"premium_zone\": premium, \"building_age\": age})\ny = pd.Series(price, name=\"price\")\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=.25, random_state=SEED)\nmodel = RandomForestRegressor(\n    n_estimators=300, min_samples_leaf=5, random_state=SEED, n_jobs=-1\n).fit(X_train, y_train)\nprint(\"Test R2:\", round(model.score(X_test, y_test), 3))\nprint(\"corr(area, rooms):\", round(X_train.area_m2.corr(X_train.rooms), 3))\n\n# Built-in ICE and PDP using the same estimator and feature.\nfig, ax = plt.subplots(figsize=(9, 6))\nPartialDependenceDisplay.from_estimator(\n    model, X_train, features=[\"area_m2\"], kind=\"both\",\n    method=\"brute\", grid_resolution=35, percentiles=(.05, .95),\n    subsample=120, random_state=SEED, ax=ax\n)\nax.set_title(\"ICE curves and their average (PDP)\")\nax.set_ylabel(\"Predicted price\")\nfig.tight_layout()\nplt.show()\n\n# Explicit ICE calculation on a documented reference subset.\nreference = X_train.sample(n=80, random_state=SEED)\ngrid = np.linspace(X_train.area_m2.quantile(.05),\n                   X_train.area_m2.quantile(.95), 45)\nice = np.empty((len(reference), len(grid)))\nfor row_idx, (_, row) in enumerate(reference.iterrows()):\n    changed = pd.DataFrame([row.to_dict()] * len(grid))\n    changed[\"area_m2\"] = grid\n    ice[row_idx] = model.predict(changed)\n\npdp_manual = ice.mean(axis=0)\nbaseline_idx = int(np.argmin(np.abs(grid - np.median(grid))))\nz0 = grid[baseline_idx]\ncentered = ice - ice[:, [baseline_idx]]\nprint(\"Reference rows:\", len(reference), \"grid points:\", len(grid))\nprint(\"Max |manual PDP - mean ICE|:\", float(np.max(np.abs(pdp_manual - ice.mean(axis=0)))))\nprint(\"Centered ICE baseline max abs:\", float(np.max(np.abs(centered[:, baseline_idx]))))\n\nfig, axes = plt.subplots(1, 2, figsize=(13, 5))\nfor curve in ice:\n    axes[0].plot(grid, curve, alpha=.13, linewidth=1)\naxes[0].plot(grid, pdp_manual, linewidth=3, label=\"Mean ICE = PDP\")\naxes[0].set_title(\"Individual Conditional Expectation\")\naxes[0].set_xlabel(\"Area (m²)\")\naxes[0].set_ylabel(\"Predicted price\")\naxes[0].legend()\nfor curve in centered:\n    axes[1].plot(grid, curve, alpha=.16, linewidth=1)\naxes[1].axvline(z0, linestyle=\"--\", label=f\"z0 = {z0:.1f}\")\naxes[1].axhline(0, linewidth=1)\naxes[1].set_title(\"Centered ICE\")\naxes[1].set_xlabel(\"Area (m²)\")\naxes[1].set_ylabel(\"Change from baseline prediction\")\naxes[1].legend()\nfig.tight_layout()\nplt.show()\n\n# Inspect an interaction by comparing ICE across premium-zone groups.\nfig, ax = plt.subplots(figsize=(8, 5))\nfor group_value, label in [(0, \"Non-premium\"), (1, \"Premium\")]:\n    subset = X_train[X_train.premium_zone == group_value].sample(\n        n=min(45, int((X_train.premium_zone == group_value).sum())),\n        random_state=SEED\n    )\n    for _, row in subset.iterrows():\n        changed = pd.DataFrame([row.to_dict()] * len(grid))\n        changed[\"area_m2\"] = grid\n        ax.plot(grid, model.predict(changed), alpha=.12, linewidth=1,\n                label=label if _ == subset.index[0] else None)\nax.set_title(\"ICE by premium-zone subgroup\")\nax.set_xlabel(\"Area (m²)\")\nax.set_ylabel(\"Predicted price\")\nax.legend()\nfig.tight_layout()\nplt.show()\n# Interpretation: heterogeneity is model behaviour, not a causal effect.\n# Correlated area/rooms may create weakly supported replacement combinations.\n";
window.DCH_ICE_812={content,practiceCode};
})();
