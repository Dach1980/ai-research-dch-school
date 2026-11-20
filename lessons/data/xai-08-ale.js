/* Track A · 8.1.3 — ALE · RU / EN / ZH. */
(function(){
"use strict";
const content={
  "ru": {
    "title": "ALE — Accumulated Local Effects",
    "lead": "Как оценивать накопленное локальное влияние признака на прогноз модели, когда признаки зависимы и глобальные подстановки создают нереалистичные комбинации.",
    "outcomes": [
      "Объяснять, почему PDP и ICE могут выходить за область совместного распределения признаков.",
      "Определять локальные эффекты ALE через условное распределение остальных признаков.",
      "Вычислять конечные разности предсказаний внутри интервалов признака.",
      "Объяснять накопление локальных средних и центрирование ALE-кривой.",
      "Вручную рассчитывать ALE на небольшом численном примере.",
      "Интерпретировать оси, форму, направление и нулевой уровень ALE-графика.",
      "Оценивать влияние числа интервалов, квантилей и разреженных областей.",
      "Отличать ALE от PDP, ICE, коэффициентов и причинных эффектов.",
      "Реализовывать одномерный ALE на Python и проверять его свойства.",
      "Объяснять назначение и сложность двумерного ALE.",
      "Выявлять ограничения ALE при корреляциях, малой выборке и взаимодействиях.",
      "Выбирать PDP, ICE или ALE под конкретный аналитический вопрос."
    ],
    "sections": [
      [
        "motivation",
        "1. Почему локальный подход важен",
        [
          "Рассмотрим модель стоимости жилья. Площадь и число комнат связаны: большие квартиры обычно имеют больше комнат. PDP меняет площадь на общей сетке для каждой строки, оставляя число комнат неизменным. Так могут появиться сочетания вроде 35 м² и 6 комнат, почти отсутствующие в данных. Модель всё равно выдаст число, но оно может отражать поведение вне области надёжной эмпирической поддержки.",
          "ICE показывает те же подстановки для отдельных объектов и раскрывает неоднородность реакций, но не устраняет проблему фиксированных остальных признаков. ALE использует локальные изменения предсказаний для строк, реально попавших в узкий интервал исследуемого признака. Затем средние изменения накапливаются вдоль диапазона.",
          "Это объяснение поведения обученной функции f на наблюдаемом распределении X. Оно не оценивает эффект реального вмешательства, не отвечает на вопрос «что произойдёт, если изменить площадь дома» и само по себе не устанавливает причинность."
        ],
        "one"
      ],
      [
        "definition",
        "2. Определение одномерного ALE",
        [
          "Пусть f(x) — скалярный выход обученной модели, Xⱼ — исследуемый признак, X₋ⱼ — остальные признаки, а z — значение Xⱼ. Популяционная идея ALE состоит в интегрировании условного среднего локального изменения f при Xⱼ=t: ALEⱼ(z) = ∫[z₀,z] E[∂f(X)/∂Xⱼ | Xⱼ=t] dt − C.",
          "Условное ожидание важно: локальная производная усредняется по распределению остальных признаков среди объектов с Xⱼ около t, а не по всей выборке независимо от Xⱼ. C — константа центрирования; обычно накопленную функцию сдвигают так, чтобы её эмпирическое среднее по распределению Xⱼ было равно нулю.",
          "Производная — удобная математическая запись для гладких моделей. Практический ALE для чёрного ящика использует конечные разности и не требует аналитического градиента. Для разрывных или ступенчатых моделей именно конечные разности являются рабочим определением оценки."
        ],
        "formula"
      ],
      [
        "algorithm",
        "3. Алгоритм: интервалы, разности, накопление",
        [
          "Разбейте наблюдаемые значения Xⱼ границами z₀ < z₁ < … < zK. Часто применяют квантильные границы, чтобы в интервалах было примерно сопоставимое число строк. Интервал Iₖ содержит строки с Xᵢⱼ между соседними границами; договорённость о включении правой границы должна быть фиксированной и одинаковой во всём расчёте.",
          "Для каждой строки интервала вычислите f(zₖ, xᵢ,₋ⱼ) − f(zₖ₋₁, xᵢ,₋ⱼ): меняется только исследуемый признак, а остальные значения принадлежат реальному наблюдению. Усредните разности внутри интервала: Δ̂ⱼₖ = (1/nₖ) Σᵢ∈Iₖ [f(zₖ,xᵢ,₋ⱼ) − f(zₖ₋₁,xᵢ,₋ⱼ)].",
          "Накопленная оценка на границе zₖ — сумма Δ̂ⱼ₁ + … + Δ̂ⱼₖ. Затем вычтите эмпирическое среднее накопленной ступенчатой функции, взвешенное по наблюдаемым значениям Xⱼ. Пустые интервалы нельзя молча считать нулевыми: объедините границы или уменьшите число интервалов и сообщите об этом."
        ],
        "algorithm"
      ],
      [
        "worked",
        "4. Численный пример с ручным расчётом",
        [
          "Пусть признак X имеет границы 0, 1, 2, 3. В каждом интервале две строки. Для первой строки интервала локальные разности предсказания равны 2 и 4; для второго — 1 и 3; для третьего — −2 и 0. Средние локальные эффекты: Δ̂₁=3, Δ̂₂=2, Δ̂₃=−1.",
          "Накопленные значения на верхних границах: при 1 — 3; при 2 — 5; при 3 — 4. Для прозрачного центрирования предположим, что эмпирическая масса трёх интервалов одинакова и представим ступенчатую оценку значениями 0, 3, 5 на интервалах 1, 2, 3 соответственно. Среднее C=(0+3+5)/3=8/3.",
          "Центрированные значения: −8/3, 1/3, 7/3. Их среднее равно нулю. В реальном расчёте веса определяются числом наблюдений в соответствующих интервалах, а соглашение о значении функции внутри/на границах интервалов должно быть указано. Пример показывает модельные локальные изменения, а не причинный эффект."
        ],
        "worked"
      ],
      [
        "reading",
        "5. Как читать ALE-график",
        [
          "Ось X показывает значения признака или границы интервалов. Ось Y — центрированный накопленный эффект в единицах выбранного выхода модели. Для регрессии это могут быть денежные единицы; для классификации — вероятность, логит или decision score. Всегда указывайте, какой именно выход анализируется.",
          "Восходящий участок означает, что локальные изменения предсказания в этой области в среднем положительны; нисходящий — отрицательны. Горизонтальный участок говорит о небольшом среднем локальном изменении. Изгибы и смена наклона отражают изменение локальной чувствительности модели по диапазону признака.",
          "Ноль — уровень отсчёта после центрирования, а не отсутствие эффекта и не нулевое предсказание. Вертикальная разница между двумя точками — относительное накопленное изменение модельного выхода, а не сравнение исходных предсказаний конкретных объектов."
        ],
        "reading"
      ],
      [
        "dependence",
        "6. Почему ALE помогает при зависимых признаках — и чего не исправляет",
        [
          "В PDP каждая строка сочетается со всеми значениями глобальной сетки Xⱼ. В ALE локальная разность рассчитывается только для строк, попавших в соответствующий интервал, и сохраняет наблюдавшиеся значения X₋ⱼ. Поэтому метод обычно меньше опирается на удалённые от данных комбинации.",
          "Однако на границах интервала значение Xⱼ всё равно подставляется. Если интервал широк, зависимость X₋ⱼ от Xⱼ быстро меняется или наблюдений мало, даже локальная подстановка может быть слабо поддержана. Сильная корреляция также затрудняет разделение вкладов взаимосвязанных признаков.",
          "ALE не устраняет смешение, не превращает ассоциацию в причинность и не гарантирует устойчивую оценку. Проверяйте плотность данных, размеры интервалов, чувствительность к числу бинов и стабильность кривой на повторных выборках."
        ],
        "dependence"
      ],
      [
        "choices",
        "7. Настройки, взаимодействия и двумерный ALE",
        [
          "Число интервалов задаёт компромисс: мало интервалов сглаживает локальную структуру, много — повышает шум и риск пустых/малых бинов. Квантильные границы часто выравнивают количество строк, но не гарантируют одинаковую ширину интервалов. Всегда показывайте распределение признака и число наблюдений по бинам.",
          "Одномерный ALE усредняет локальный отклик по условному распределению остальных признаков. Если есть взаимодействия, усреднение может скрывать различия между группами. Двумерный ALE оценивает локальные смешанные изменения на ячейках двумерного разбиения, но требует достаточного числа наблюдений в каждой ячейке и сложнее читается.",
          "Сопоставляйте альтернативные настройки и при необходимости анализируйте группы или двумерную поверхность. Не делайте выводы на краях диапазона, где мало данных, и не трактуйте форму кривой как свойство самого признака вне конкретной модели и выборки."
        ],
        "two"
      ],
      [
        "comparison",
        "8. PDP, ICE и ALE: выбор метода",
        [
          "PDP отвечает на вопрос о среднем отклике при глобальной подстановке значений признака. ICE показывает индивидуальные кривые и неоднородность, но использует те же фиксированные остальные признаки. ALE суммирует локальные изменения внутри областей с наблюдениями и обычно предпочтительнее при сильной зависимости признаков.",
          "Начните с формулировки вопроса: нужен ли средний глобальный профиль (PDP), разброс индивидуальных реакций (ICE) или локально накопленная зависимость в поддерживаемой данными области (ALE)? При важных взаимодействиях используйте ICE-группы или двумерные методы и проверяйте плотность данных.",
          "Ни один график не заменяет диагностику модели, проверку качества и анализ распределения. Сравнение методов полезно именно потому, что различия между ними выявляют чувствительность вывода к способу усреднения и к поддержке данных."
        ],
        "comparison"
      ]
    ],
    "practice": {
      "title": "Лабораторная работа: реализуем ALE и сравним с PDP/ICE",
      "intro": "Обучите случайный лес на синтетических данных о жилье, где площадь и число комнат коррелируют. Реализуйте одномерный ALE через квантильные интервалы и конечные разности.",
      "task": "Запустите скрипт. Сравните ALE с PDP, постройте ICE для подвыборки, измените число интервалов (10, 20, 30), изучите число строк в каждом бине и объясните, почему кривые различаются. Повторите анализ на нескольких seed.",
      "expected": "Скрипт печатает метрики модели, корреляцию площади и комнат, количество наблюдений в бинах и центрированную ALE-оценку. ALE обычно меньше опирается на глобальные комбинации, но зависит от разбиения и размера выборки."
    },
    "sources": [
      [
        "Apley & Zhu (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. Journal of the Royal Statistical Society: Series B, 82(4), 1059–1086. DOI: 10.1111/rssb.12377.",
        "https://doi.org/10.1111/rssb.12377"
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
        "Molnar, C. Interpretable Machine Learning — Accumulated Local Effects (ALE) chapter.",
        "https://christophm.github.io/interpretable-ml-book/ale.html"
      ],
      [
        "Greenwell, B. M. (2017). pdp: An R Package for Constructing Partial Dependence Plots. The R Journal, 9(1), 421–436. DOI: 10.32614/RJ-2017-016.",
        "https://doi.org/10.32614/RJ-2017-016"
      ]
    ],
    "glossary": [
      [
        "Accumulated Local Effects (ALE)",
        "Метод накопления локальных изменений предсказаний внутри интервалов наблюдаемого признака."
      ],
      [
        "Локальный эффект",
        "Разность выходов модели при подстановке соседних границ интервала для одной строки."
      ],
      [
        "Условное распределение",
        "Распределение остальных признаков при заданном значении исследуемого признака."
      ],
      [
        "Интервал (бин)",
        "Часть диапазона признака между двумя соседними границами разбиения."
      ],
      [
        "Квантильные границы",
        "Границы интервалов, выбранные по квантилям эмпирического распределения."
      ],
      [
        "Конечная разность",
        "Разность двух значений функции, вычисленных в соседних точках."
      ],
      [
        "Накопление",
        "Последовательное суммирование средних локальных эффектов по интервалам."
      ],
      [
        "Центрирование",
        "Сдвиг ALE-кривой на константу, обычно до нулевого эмпирического среднего."
      ],
      [
        "Поддержка данных",
        "Область значений и сочетаний признаков, представленных наблюдениями."
      ],
      [
        "Разреженный интервал",
        "Интервал с малым числом наблюдений и потенциально нестабильной оценкой."
      ],
      [
        "Двумерный ALE",
        "Расширение ALE для локальных совместных эффектов двух признаков."
      ],
      [
        "Причинный эффект",
        "Изменение результата вследствие вмешательства; обычный ALE его не идентифицирует."
      ]
    ],
    "quiz": [
      [
        "Что усредняется внутри каждого интервала ALE?",
        [
          "Глобальные предсказания на всей сетке",
          "Локальные разности предсказаний строк, попавших в интервал",
          "Фактические значения целевой переменной",
          "Градиенты по всем признакам"
        ],
        1,
        "ALE усредняет конечные разности для наблюдений внутри конкретного интервала."
      ],
      [
        "Почему PDP может быть проблематичен при коррелирующих признаках?",
        [
          "Он не использует модель",
          "Он создаёт глобальные сочетания признаков, которых может не быть в данных",
          "Он всегда использует производные",
          "Он не усредняет прогнозы"
        ],
        1,
        "Глобальная подстановка может вывести комбинации за область эмпирической поддержки."
      ],
      [
        "Что фиксируется при вычислении локальной разности ALE для строки?",
        [
          "Все признаки",
          "Только целевая переменная",
          "Все признаки, кроме исследуемого Xⱼ",
          "Ни один признак"
        ],
        2,
        "Меняется Xⱼ между границами интервала, остальные значения строки сохраняются."
      ],
      [
        "Для чего нужно накопление?",
        [
          "Чтобы суммировать локальные изменения вдоль диапазона признака",
          "Чтобы обучить модель заново",
          "Чтобы заменить пропуски",
          "Чтобы получить причинный эффект"
        ],
        0,
        "Накопленная сумма превращает локальные разности в профиль по диапазону."
      ],
      [
        "Что означает центрирование ALE?",
        [
          "Деление на стандартное отклонение",
          "Сдвиг кривой на константу, обычно к нулевому среднему",
          "Удаление отрицательных значений",
          "Нормализацию входного признака"
        ],
        1,
        "Центрирование задаёт относительный нулевой уровень, не меняя форму кривой."
      ],
      [
        "Что означает ноль на центрированном ALE-графике?",
        [
          "Модель не использует признак",
          "Предсказание равно нулю",
          "Уровень отсчёта после центрирования",
          "Причинный эффект отсутствует"
        ],
        2,
        "Ноль — выбранный относительный базовый уровень функции ALE."
      ],
      [
        "Как интерпретировать возрастающий участок ALE?",
        [
          "Локальные изменения предсказания в среднем положительны",
          "Все индивидуальные прогнозы растут",
          "Признак причинно повышает результат",
          "Ошибка модели уменьшается"
        ],
        0,
        "Наклон отражает средний знак локальных изменений модельного выхода."
      ],
      [
        "Какой риск возникает при слишком большом числе интервалов?",
        [
          "Слишком сильное сглаживание",
          "Малые или пустые интервалы и шумная оценка",
          "Исчезновение корреляции",
          "Невозможность получить прогноз"
        ],
        1,
        "В бинах может оказаться мало наблюдений, что делает локальное среднее нестабильным."
      ],
      [
        "Что ALE обычно делает лучше PDP при зависимых признаках?",
        [
          "Полностью устраняет все смещения",
          "Избегает любой подстановки значений",
          "Ограничивает расчёт локальными строками в соответствующих интервалах",
          "Доказывает причинность"
        ],
        2,
        "Локальные строки уменьшают необходимость в глобальных комбинациях, но не устраняют все ограничения."
      ],
      [
        "Требует ли практический ALE аналитической производной модели?",
        [
          "Да, всегда",
          "Нет, можно использовать конечные разности",
          "Только для деревьев",
          "Только для линейных моделей"
        ],
        1,
        "Чёрноящичная оценка использует разность предсказаний на границах интервала."
      ],
      [
        "Что верно о причинной интерпретации ALE?",
        [
          "ALE автоматически оценивает причинный эффект",
          "ALE является описанием модельной зависимости, не причинным эффектом",
          "ALE устраняет смешение",
          "Причинность следует из центрирования"
        ],
        1,
        "ALE объясняет функцию модели на данных и не идентифицирует вмешательства."
      ],
      [
        "Когда полезен двумерный ALE?",
        [
          "Когда нужно исследовать локальную совместную структуру двух признаков и достаточно данных",
          "Когда данных в ячейках нет",
          "Чтобы гарантировать причинность",
          "Чтобы заменить оценку качества модели"
        ],
        0,
        "Двумерная оценка помогает изучать взаимодействия, но требует поддержки в двумерных ячейках."
      ]
    ]
  },
  "en": {
    "title": "ALE — Accumulated Local Effects",
    "lead": "How to estimate the accumulated local influence of a feature on model predictions when predictors are dependent and global substitutions create unrealistic combinations.",
    "outcomes": [
      "Explain why PDP and ICE may leave the joint data distribution.",
      "Define ALE local effects using the conditional distribution of other features.",
      "Compute prediction finite differences within feature intervals.",
      "Explain accumulation of local averages and ALE centering.",
      "Calculate ALE by hand on a small numerical example.",
      "Interpret axes, shape, direction and zero level of an ALE plot.",
      "Assess the effects of bin count, quantiles and sparse regions.",
      "Distinguish ALE from PDP, ICE, coefficients and causal effects.",
      "Implement one-dimensional ALE in Python and verify its properties.",
      "Explain the purpose and complexity of two-dimensional ALE.",
      "Identify limitations under correlation, small samples and interactions.",
      "Choose PDP, ICE or ALE for a specific analytical question."
    ],
    "sections": [
      [
        "motivation",
        "1. Why a local approach matters",
        [
          "Consider a house-price model. Floor area and room count are related: larger homes usually have more rooms. PDP replaces area with each value on a global grid while keeping room count fixed. This can create combinations such as 35 m² with six rooms that are nearly absent from the data. The model still returns a number, but it may describe behaviour outside reliable empirical support.",
          "ICE reveals heterogeneous responses for individual rows, but it uses the same fixed-other-feature substitutions and therefore does not solve this problem. ALE computes local prediction changes for rows actually observed inside a narrow interval of the feature, then accumulates the average changes along the range.",
          "This explains the behaviour of a fitted function f on the observed distribution X. It does not estimate the effect of a real intervention, answer what would happen after physically changing a house, or establish causality."
        ],
        "one"
      ],
      [
        "definition",
        "2. Defining one-dimensional ALE",
        [
          "Let f(x) be a scalar model output, Xⱼ the feature of interest, X₋ⱼ all remaining features, and z a value of Xⱼ. The population idea of ALE integrates the conditional mean local change: ALEⱼ(z) = ∫[z₀,z] E[∂f(X)/∂Xⱼ | Xⱼ=t] dt − C.",
          "The conditional expectation matters: the local derivative is averaged over the distribution of other features among observations with Xⱼ near t, not over the full sample independently of Xⱼ. C is a centering constant; typically the accumulated function is shifted to have empirical mean zero under the distribution of Xⱼ.",
          "The derivative is convenient for smooth models. Practical black-box ALE uses finite differences and does not require an analytic gradient. For discontinuous or stepwise models, finite differences provide the operational estimate."
        ],
        "formula"
      ],
      [
        "algorithm",
        "3. Algorithm: bins, differences and accumulation",
        [
          "Partition observed Xⱼ values using boundaries z₀ < z₁ < … < zK. Quantile boundaries are common because they aim for a similar number of rows per interval. Fix one consistent convention for assigning observations on right boundaries.",
          "For each row in interval k, compute f(zₖ, xᵢ,₋ⱼ) − f(zₖ₋₁, xᵢ,₋ⱼ): only the feature of interest changes; all other values come from an observed row. Average the differences: Δ̂ⱼₖ = (1/nₖ) Σᵢ∈Iₖ [f(zₖ,xᵢ,₋ⱼ) − f(zₖ₋₁,xᵢ,₋ⱼ)].",
          "The accumulated estimate at zₖ is Δ̂ⱼ₁ + … + Δ̂ⱼₖ. Then subtract the empirical mean of the accumulated step function, weighted by observed Xⱼ values. Do not silently treat empty bins as zero: merge boundaries or reduce the bin count and report the change."
        ],
        "algorithm"
      ],
      [
        "worked",
        "4. Worked numerical example",
        [
          "Let X have boundaries 0, 1, 2, 3, with two rows in each interval. The local prediction differences in the first interval are 2 and 4; in the second, 1 and 3; in the third, −2 and 0. The mean local effects are Δ̂₁=3, Δ̂₂=2 and Δ̂₃=−1.",
          "The accumulated values at the upper boundaries are 3 at 1, 5 at 2 and 4 at 3. For transparent centering, suppose the three intervals have equal empirical mass and represent the step estimate by values 0, 3 and 5 on intervals 1, 2 and 3. The mean is C=(0+3+5)/3=8/3.",
          "The centered values are −8/3, 1/3 and 7/3, whose mean is zero. In a real calculation, weights are determined by the number of observations in each interval, and the convention for values inside/on interval boundaries must be stated. This example illustrates model changes, not causal effects."
        ],
        "worked"
      ],
      [
        "reading",
        "5. Reading an ALE plot",
        [
          "The X axis shows feature values or interval boundaries. The Y axis shows the centered accumulated effect in the units of the selected model output. For regression this may be currency; for classification it may be probability, logit or decision score. Always state which output is analysed.",
          "An increasing segment means local prediction changes are positive on average in that region; a decreasing segment means they are negative. A flat segment indicates little average local change. Bends and slope changes indicate changing local sensitivity across the feature range.",
          "Zero is the reference level after centering, not absence of effect and not a zero prediction. The vertical difference between two points is a relative accumulated change in model output, not a comparison of raw predictions for particular individuals."
        ],
        "reading"
      ],
      [
        "dependence",
        "6. Why ALE helps with dependent features—and what it cannot fix",
        [
          "PDP combines every row with every value on a global Xⱼ grid. ALE computes a local difference only for rows in the corresponding interval and preserves their observed X₋ⱼ values. It therefore usually relies less on combinations far from the data.",
          "However, Xⱼ is still replaced by interval boundaries. Wide bins, rapidly changing conditional relationships or few observations can make even local substitutions weakly supported. Strong correlation can also make separate feature contributions difficult to identify.",
          "ALE does not remove confounding, turn association into causation, or guarantee a stable estimate. Inspect data density, bin counts, sensitivity to the number of bins and stability across resamples."
        ],
        "dependence"
      ],
      [
        "choices",
        "7. Settings, interactions and two-dimensional ALE",
        [
          "The number of bins is a trade-off: too few can smooth away local structure; too many increase noise and the risk of empty or tiny bins. Quantile boundaries often balance row counts but do not guarantee equal interval widths. Show the feature distribution and counts per bin.",
          "One-dimensional ALE averages local response over the conditional distribution of the other features. With interactions, this average can hide subgroup differences. Two-dimensional ALE estimates local mixed changes over cells in a two-feature partition, but needs enough observations in each cell and is harder to interpret.",
          "Compare alternative settings and, where useful, analyse groups or a two-dimensional surface. Avoid strong conclusions at sparsely populated range extremes, and remember the curve describes a particular model and sample."
        ],
        "two"
      ],
      [
        "comparison",
        "8. PDP, ICE and ALE: choosing a method",
        [
          "PDP describes average response under global feature substitution. ICE shows individual curves and heterogeneity but uses the same fixed-other-feature substitutions. ALE accumulates local changes within regions containing observations and is often preferable when predictors are strongly dependent.",
          "Choose based on the question: global average profile (PDP), individual response variation (ICE), or locally accumulated dependence in data-supported regions (ALE). For important interactions, use grouped ICE or two-dimensional methods and inspect data density.",
          "No plot replaces model diagnostics, predictive validation or distribution analysis. Comparing methods is useful because differences reveal how conclusions depend on averaging and empirical support."
        ],
        "comparison"
      ]
    ],
    "practice": {
      "title": "Lab: implement ALE and compare it with PDP/ICE",
      "intro": "Train a random forest on synthetic housing data where floor area and room count are correlated. Implement one-dimensional ALE with quantile bins and finite differences.",
      "task": "Run the script. Compare ALE with PDP, plot ICE for a subset, change the bin count (10, 20, 30), inspect observations per bin and explain the differences. Repeat with several seeds.",
      "expected": "The script prints model metrics, area/rooms correlation, bin counts and centered ALE values. ALE generally relies less on global combinations but remains sensitive to partitioning and sample size."
    },
    "sources": [
      [
        "Apley & Zhu (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. JRSS B, 82(4), 1059–1086. DOI: 10.1111/rssb.12377.",
        "https://doi.org/10.1111/rssb.12377"
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
        "Molnar, C. Interpretable Machine Learning — Accumulated Local Effects.",
        "https://christophm.github.io/interpretable-ml-book/ale.html"
      ],
      [
        "Greenwell (2017). pdp: An R Package for Constructing Partial Dependence Plots. The R Journal, 9(1), 421–436. DOI: 10.32614/RJ-2017-016.",
        "https://doi.org/10.32614/RJ-2017-016"
      ]
    ],
    "glossary": [
      [
        "Accumulated Local Effects (ALE)",
        "A method that accumulates local prediction changes within intervals of observed feature values."
      ],
      [
        "Local effect",
        "A difference between model outputs at neighbouring interval boundaries for one row."
      ],
      [
        "Conditional distribution",
        "The distribution of other features given a value of the feature of interest."
      ],
      [
        "Bin",
        "A range between two adjacent partition boundaries."
      ],
      [
        "Quantile boundaries",
        "Bin boundaries selected from empirical quantiles."
      ],
      [
        "Finite difference",
        "The difference between function values evaluated at two nearby points."
      ],
      [
        "Accumulation",
        "Sequential summation of mean local effects across bins."
      ],
      [
        "Centering",
        "Shifting the ALE curve by a constant, usually to empirical mean zero."
      ],
      [
        "Data support",
        "The region of feature values and combinations represented by observations."
      ],
      [
        "Sparse bin",
        "An interval with few observations and potentially unstable estimates."
      ],
      [
        "Two-dimensional ALE",
        "An ALE extension for local joint effects of two features."
      ],
      [
        "Causal effect",
        "A change due to an intervention; ordinary ALE does not identify it."
      ]
    ],
    "quiz": [
      [
        "What is averaged within each ALE bin?",
        [
          "Global predictions over the whole grid",
          "Local prediction differences for rows in that bin",
          "Observed target values",
          "Gradients for all features"
        ],
        1,
        "ALE averages finite differences for observations inside the specific interval."
      ],
      [
        "Why can PDP be problematic with correlated features?",
        [
          "It does not use a model",
          "It creates global feature combinations that may be absent from the data",
          "It always uses derivatives",
          "It never averages predictions"
        ],
        1,
        "Global substitution can move inputs outside empirical support."
      ],
      [
        "What stays fixed when computing a row's ALE difference?",
        [
          "All features",
          "Only the target",
          "All features except Xⱼ",
          "No features"
        ],
        2,
        "Xⱼ changes between bin boundaries while the row's other values stay fixed."
      ],
      [
        "Why accumulate local effects?",
        [
          "To sum local changes along the feature range",
          "To retrain the model",
          "To impute missing values",
          "To obtain a causal effect"
        ],
        0,
        "Accumulation turns local differences into a profile across the range."
      ],
      [
        "What does ALE centering do?",
        [
          "Divide by standard deviation",
          "Shift the curve by a constant, usually to zero mean",
          "Remove negative values",
          "Normalize the input feature"
        ],
        1,
        "Centering defines a relative zero level without changing curve shape."
      ],
      [
        "What does zero mean on a centered ALE plot?",
        [
          "The model ignores the feature",
          "Prediction equals zero",
          "Reference level after centering",
          "No causal effect exists"
        ],
        2,
        "Zero is the relative reference level of the ALE function."
      ],
      [
        "How should an increasing ALE segment be read?",
        [
          "Average local prediction changes are positive",
          "Every individual prediction increases",
          "The feature causally improves the outcome",
          "Model error decreases"
        ],
        0,
        "The slope reflects the average sign of local changes in model output."
      ],
      [
        "What is a risk of too many bins?",
        [
          "Excessive smoothing",
          "Tiny or empty bins and noisy estimates",
          "Correlation disappears",
          "Predictions become impossible"
        ],
        1,
        "Few observations per bin make local averages unstable."
      ],
      [
        "What does ALE usually improve over PDP with dependent features?",
        [
          "It removes all bias",
          "It avoids every substitution",
          "It uses local rows in the corresponding intervals rather than global combinations",
          "It proves causality"
        ],
        2,
        "Local rows reduce reliance on global combinations but do not remove all limitations."
      ],
      [
        "Does practical ALE require an analytic model derivative?",
        [
          "Always",
          "No, finite differences can be used",
          "Only for trees",
          "Only for linear models"
        ],
        1,
        "Black-box estimation uses prediction differences at interval boundaries."
      ],
      [
        "Which statement about causal interpretation is correct?",
        [
          "ALE automatically estimates causal effects",
          "ALE describes model dependence, not a causal effect",
          "ALE removes confounding",
          "Centering establishes causality"
        ],
        1,
        "ALE explains a model function on data and does not identify interventions."
      ],
      [
        "When is two-dimensional ALE useful?",
        [
          "To study local joint structure of two features with sufficient data",
          "When cells contain no observations",
          "To guarantee causality",
          "To replace model validation"
        ],
        0,
        "Two-dimensional estimation can reveal interactions but needs support in the cells."
      ]
    ]
  },
  "zh": {
    "title": "ALE — 累积局部效应",
    "lead": "当特征彼此相关、全局替换会产生不现实的组合时，如何估计特征对模型预测的累积局部影响。",
    "outcomes": [
      "解释为什么 PDP 和 ICE 可能离开特征联合分布的支持区域。",
      "使用其他特征的条件分布定义 ALE 局部效应。",
      "计算特征区间内预测值的有限差分。",
      "解释局部均值的累积过程与 ALE 曲线中心化。",
      "通过小型数值示例手工计算 ALE。",
      "解读 ALE 图的坐标轴、形状、方向和零水平。",
      "评估分箱数量、分位数和稀疏区域的影响。",
      "区分 ALE、PDP、ICE、模型系数和因果效应。",
      "在 Python 中实现一维 ALE 并验证其性质。",
      "解释二维 ALE 的用途与复杂性。",
      "识别相关性、小样本和交互作用下的局限。",
      "针对具体分析问题选择 PDP、ICE 或 ALE。"
    ],
    "sections": [
      [
        "motivation",
        "1. 为什么需要局部方法",
        [
          "考虑一个房价预测模型。建筑面积与房间数量相关：面积较大的住宅通常房间更多。PDP 在保持房间数不变的同时，把面积替换为全局网格中的每个值。这可能产生数据中几乎不存在的组合，例如 35 平方米却有 6 个房间。模型仍会输出数值，但该结果可能处于缺乏可靠数据支持的区域。",
          "ICE 展示单个样本的不同响应，但仍采用固定其他特征的替换方式，因此没有解决这一问题。ALE 只对实际落入某个狭窄特征区间的样本计算局部预测变化，再沿特征范围累积这些平均变化。",
          "这解释的是拟合函数 f 在观测分布 X 上的行为。它不是现实干预的效应，不回答实际改变房屋面积会发生什么，也不能单独证明因果关系。"
        ],
        "one"
      ],
      [
        "definition",
        "2. 一维 ALE 的定义",
        [
          "设 f(x) 为模型的标量输出，Xⱼ 为关注特征，X₋ⱼ 为其余特征，z 为 Xⱼ 的取值。ALE 的总体思想是对条件平均局部变化积分：ALEⱼ(z) = ∫[z₀,z] E[∂f(X)/∂Xⱼ | Xⱼ=t] dt − C。",
          "条件期望非常重要：局部导数是在 Xⱼ 接近 t 的样本所对应的其他特征分布上求平均，而不是忽略 Xⱼ 与其他特征的关系、直接对全体样本平均。C 是中心化常数，通常使累积函数在 Xⱼ 的经验分布下均值为零。",
          "导数表达适用于平滑模型的数学描述。实际黑箱 ALE 可以使用有限差分，不需要解析梯度。对于不连续或阶梯型模型，有限差分是实际可用的估计方式。"
        ],
        "formula"
      ],
      [
        "algorithm",
        "3. 算法：分箱、差分与累积",
        [
          "用边界 z₀ < z₁ < … < zK 划分观测到的 Xⱼ。常用分位数边界，使每个区间中的样本数量大致相近。必须统一规定恰好位于右边界的样本归属。",
          "对第 k 个区间中的每一行，计算 f(zₖ, xᵢ,₋ⱼ) − f(zₖ₋₁, xᵢ,₋ⱼ)：只改变关注特征，其他值保留自真实观测行。然后求平均：Δ̂ⱼₖ = (1/nₖ) Σᵢ∈Iₖ [f(zₖ,xᵢ,₋ⱼ) − f(zₖ₋₁,xᵢ,₋ⱼ)]。",
          "边界 zₖ 处的累积估计为 Δ̂ⱼ₁ + … + Δ̂ⱼₖ。随后减去按观测 Xⱼ 分布加权的累积阶梯函数经验均值。不能默默把空区间当作零；应合并边界或减少分箱数，并报告调整。"
        ],
        "algorithm"
      ],
      [
        "worked",
        "4. 手工数值示例",
        [
          "设 X 的边界为 0、1、2、3，每个区间有两行样本。第一个区间的局部预测差为 2 和 4；第二个区间为 1 和 3；第三个区间为 −2 和 0。三个区间的平均局部效应分别为 Δ̂₁=3、Δ̂₂=2、Δ̂₃=−1。",
          "上边界处的累积值分别为：X=1 时 3，X=2 时 5，X=3 时 4。为清楚展示中心化，假设三个区间的经验质量相同，并用 0、3、5 表示区间 1、2、3 上的阶梯估计。均值 C=(0+3+5)/3=8/3。",
          "中心化结果为 −8/3、1/3、7/3，平均值为零。实际计算中的权重由各区间的样本数决定，并且必须说明区间内部和边界处函数值的约定。此例说明模型变化，而非因果效应。"
        ],
        "worked"
      ],
      [
        "reading",
        "5. 如何阅读 ALE 图",
        [
          "X 轴表示特征取值或区间边界。Y 轴表示所选模型输出尺度上的中心化累积效应。回归任务中可能是货币单位；分类任务中可能是概率、logit 或决策分数。必须注明所分析的输出。",
          "ALE 曲线在某一区域上升，表示该区域的局部预测变化平均为正；下降表示平均为负；近似水平表示平均局部变化较小。弯曲和斜率变化反映模型局部敏感度随特征范围改变。",
          "零值是中心化后的参考水平，不表示没有效应，也不表示预测为零。两点之间的纵向差异表示模型输出的相对累积变化，而不是特定个体原始预测值的比较。"
        ],
        "reading"
      ],
      [
        "dependence",
        "6. ALE 为什么有助于处理相关特征，以及它不能解决什么",
        [
          "PDP 将每一行与 Xⱼ 全局网格中的所有取值组合。ALE 只对相应区间内的样本计算局部差分，并保留其观测到的 X₋ⱼ。因此，它通常较少依赖远离数据区域的组合。",
          "不过，ALE 仍会把 Xⱼ 替换为区间边界。区间过宽、条件关系变化很快或样本过少时，局部替换仍可能缺乏支持。强相关也会使单个特征贡献难以区分。",
          "ALE 不会消除混杂，不会把相关关系转化为因果关系，也不保证估计稳定。应检查数据密度、每箱样本数、分箱数量敏感性以及重采样后的曲线稳定性。"
        ],
        "dependence"
      ],
      [
        "choices",
        "7. 参数、交互作用与二维 ALE",
        [
          "分箱数量需要权衡：过少会平滑掉局部结构，过多会增加噪声以及空箱或小样本箱的风险。分位数边界通常能平衡样本数量，但不能保证区间宽度相等。应展示特征分布和每箱样本数。",
          "一维 ALE 按其他特征的条件分布对局部响应求平均。存在交互作用时，这种平均可能掩盖子群体差异。二维 ALE 在两个特征的网格单元上估计局部混合变化，但每个单元需要足够样本，解释也更困难。",
          "比较不同参数设置，必要时分析分组或二维曲面。不要对数据稀疏的范围端点作强结论，并记住曲线描述的是特定模型和样本的行为。"
        ],
        "two"
      ],
      [
        "comparison",
        "8. PDP、ICE 与 ALE：如何选择",
        [
          "PDP 描述全局替换特征值时的平均响应。ICE 展示个体曲线和异质性，但同样固定其他特征进行替换。ALE 在包含观测的区域内累积局部变化，因此在特征高度相关时通常更合适。",
          "根据问题选择方法：需要全局平均轮廓时用 PDP；需要个体响应差异时用 ICE；需要数据支持区域内的局部累积依赖时用 ALE。若交互作用重要，可使用分组 ICE 或二维方法，并检查数据密度。",
          "任何图都不能替代模型诊断、预测验证和分布分析。比较这些方法的价值在于揭示结论对平均方式和数据支持程度的敏感性。"
        ],
        "comparison"
      ]
    ],
    "practice": {
      "title": "实验：实现 ALE 并与 PDP/ICE 比较",
      "intro": "在面积与房间数相关的合成住房数据上训练随机森林。使用分位数分箱和有限差分实现一维 ALE。",
      "task": "运行脚本，将 ALE 与 PDP 比较，并为子样本绘制 ICE。将分箱数改为 10、20、30，检查每箱样本数并解释曲线差异。使用多个随机种子重复分析。",
      "expected": "脚本输出模型指标、面积与房间数的相关性、每箱样本数和中心化 ALE 值。ALE 通常较少依赖全局组合，但仍受分箱方式和样本量影响。"
    },
    "sources": [
      [
        "Apley & Zhu (2020). Visualizing the Effects of Predictor Variables in Black Box Supervised Learning Models. JRSS B, 82(4), 1059–1086. DOI: 10.1111/rssb.12377.",
        "https://doi.org/10.1111/rssb.12377"
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
        "Molnar, C. Interpretable Machine Learning — Accumulated Local Effects.",
        "https://christophm.github.io/interpretable-ml-book/ale.html"
      ],
      [
        "Greenwell (2017). pdp: An R Package for Constructing Partial Dependence Plots. The R Journal, 9(1), 421–436. DOI: 10.32614/RJ-2017-016.",
        "https://doi.org/10.32614/RJ-2017-016"
      ]
    ],
    "glossary": [
      [
        "Accumulated Local Effects (ALE)",
        "在观测到的特征区间内累积局部预测变化的方法。"
      ],
      [
        "局部效应",
        "对同一行样本在相邻区间边界处的模型输出求差。"
      ],
      [
        "条件分布",
        "给定关注特征取值时其他特征的分布。"
      ],
      [
        "分箱",
        "由相邻划分边界构成的特征区间。"
      ],
      [
        "分位数边界",
        "依据经验分位数选择的区间边界。"
      ],
      [
        "有限差分",
        "函数在两个相近点的取值之差。"
      ],
      [
        "累积",
        "沿区间顺序求和平均局部效应。"
      ],
      [
        "中心化",
        "通过减去常数将 ALE 曲线平移，通常使经验均值为零。"
      ],
      [
        "数据支持区域",
        "观测样本实际覆盖的特征值及其组合范围。"
      ],
      [
        "稀疏分箱",
        "样本数量很少、估计可能不稳定的区间。"
      ],
      [
        "二维 ALE",
        "用于研究两个特征局部联合效应的 ALE 扩展。"
      ],
      [
        "因果效应",
        "由干预导致的结果变化；普通 ALE 不识别因果效应。"
      ]
    ],
    "quiz": [
      [
        "ALE 在每个区间内平均什么？",
        [
          "整个网格上的全局预测",
          "落入该区间样本的局部预测差",
          "真实目标值",
          "所有特征的梯度"
        ],
        1,
        "ALE 对特定区间内观测样本的有限差分求平均。"
      ],
      [
        "为什么相关特征下 PDP 可能有问题？",
        [
          "它不使用模型",
          "它会生成数据中可能不存在的全局特征组合",
          "它总是使用导数",
          "它不会平均预测"
        ],
        1,
        "全局替换可能使输入离开经验数据支持区域。"
      ],
      [
        "计算一行样本的 ALE 差分时，什么保持不变？",
        [
          "所有特征",
          "只有目标变量",
          "除 Xⱼ 外的所有特征",
          "没有特征"
        ],
        2,
        "Xⱼ 在区间边界之间变化，其余行值保持不变。"
      ],
      [
        "为什么要累积局部效应？",
        [
          "沿特征范围汇总局部变化",
          "重新训练模型",
          "填补缺失值",
          "得到因果效应"
        ],
        0,
        "累积把局部差分转换为整个特征范围上的轮廓。"
      ],
      [
        "ALE 中心化做什么？",
        [
          "除以标准差",
          "减去常数平移曲线，通常使均值为零",
          "删除负值",
          "归一化输入特征"
        ],
        1,
        "中心化定义相对零水平，但不改变曲线形状。"
      ],
      [
        "中心化 ALE 图中的零表示什么？",
        [
          "模型忽略该特征",
          "预测等于零",
          "中心化后的参考水平",
          "不存在因果效应"
        ],
        2,
        "零是 ALE 函数的相对参考水平。"
      ],
      [
        "ALE 上升区段应如何理解？",
        [
          "平均局部预测变化为正",
          "每个个体预测都上升",
          "该特征因果性地改善结果",
          "模型误差下降"
        ],
        0,
        "斜率反映模型输出局部变化的平均符号。"
      ],
      [
        "分箱过多有什么风险？",
        [
          "过度平滑",
          "空箱或小样本箱导致估计噪声较大",
          "相关性消失",
          "无法进行预测"
        ],
        1,
        "每箱样本太少会使局部均值不稳定。"
      ],
      [
        "相关特征下 ALE 通常比 PDP 改进什么？",
        [
          "消除所有偏差",
          "避免任何替换",
          "使用相应区间的局部样本，而非全局组合",
          "证明因果关系"
        ],
        2,
        "局部样本减少对全局组合的依赖，但不能消除所有局限。"
      ],
      [
        "实际 ALE 是否需要模型的解析导数？",
        [
          "总是需要",
          "不需要，可以使用有限差分",
          "仅树模型需要",
          "仅线性模型需要"
        ],
        1,
        "黑箱估计可在区间边界计算预测差。"
      ],
      [
        "关于 ALE 的因果解释，哪项正确？",
        [
          "ALE 自动估计因果效应",
          "ALE 描述模型依赖关系，不是因果效应",
          "ALE 消除混杂",
          "中心化建立因果关系"
        ],
        1,
        "ALE 解释模型在数据上的函数，不识别干预效应。"
      ],
      [
        "何时适合使用二维 ALE？",
        [
          "有足够数据时研究两个特征的局部联合结构",
          "单元格没有样本时",
          "为了保证因果性",
          "替代模型验证"
        ],
        0,
        "二维估计有助于研究交互，但每个网格单元都需要数据支持。"
      ]
    ]
  }
};
const practiceCode="\"\"\"One-dimensional Accumulated Local Effects lab for lesson 8.1.3.\nInstall: python -m pip install numpy pandas matplotlib scikit-learn\nRun: python lessons/practice/a-8-1-3-accumulated-local-effects.py\n\"\"\"\nfrom __future__ import annotations\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.inspection import PartialDependenceDisplay\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import r2_score, mean_absolute_error\n\nSEED = 42\nrng = np.random.default_rng(SEED)\nn = 1800\narea = rng.uniform(35, 180, n)\nrooms = np.clip(np.round(area / 27 + rng.normal(0, .7, n)), 1, 7)\npremium = rng.binomial(1, 1 / (1 + np.exp(-(area - 105) / 22)), n)\nage = rng.uniform(0, 60, n)\nnoise = rng.normal(0, 12000, n)\nprice = (65000 + 2100 * area + 9500 * rooms - 700 * age\n         + 26000 * premium * np.tanh((area - 90) / 35) + noise)\nX = pd.DataFrame({\"area_m2\": area, \"rooms\": rooms,\n                  \"premium_zone\": premium, \"building_age\": age})\ny = pd.Series(price, name=\"price\")\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=.25, random_state=SEED)\nmodel = RandomForestRegressor(n_estimators=300, min_samples_leaf=5,\n                              random_state=SEED, n_jobs=-1).fit(X_train, y_train)\nprint(\"Test R2:\", round(r2_score(y_test, model.predict(X_test)), 3))\nprint(\"Test MAE:\", round(mean_absolute_error(y_test, model.predict(X_test)), 1))\nprint(\"corr(area, rooms):\", round(X_train.area_m2.corr(X_train.rooms), 3))\n\ndef accumulated_local_effects(model, frame, feature, bins=20):\n    \"\"\"Return bin boundaries, counts, centered ALE values and raw increments.\n\n    Quantile boundaries are deduplicated. Each row is evaluated twice with\n    only the selected feature replaced by the lower/upper bin boundary.\n    Centering uses the empirical row-weighted mean of the step function.\n    \"\"\"\n    values = frame[feature].to_numpy()\n    edges = np.unique(np.quantile(values, np.linspace(0, 1, bins + 1)))\n    if len(edges) < 3:\n        raise ValueError(\"Feature has too few unique values for ALE bins\")\n    bin_id = np.searchsorted(edges[1:-1], values, side=\"right\")\n    counts = np.bincount(bin_id, minlength=len(edges) - 1)\n    increments = np.full(len(edges) - 1, np.nan)\n    for k in range(len(edges) - 1):\n        mask = bin_id == k\n        if not mask.any():\n            continue\n        lower = frame.loc[mask].copy()\n        upper = lower.copy()\n        lower[feature] = edges[k]\n        upper[feature] = edges[k + 1]\n        increments[k] = np.mean(model.predict(upper) - model.predict(lower))\n    if np.isnan(increments).any():\n        raise ValueError(\"Empty bin encountered; reduce bins or merge boundaries\")\n    accumulated = np.r_[0.0, np.cumsum(increments)]\n    # Step-function value for each observed row is the accumulated value\n    # at the lower boundary of its bin; center with empirical row weights.\n    raw_per_row = accumulated[bin_id]\n    center = float(raw_per_row.mean())\n    centered = accumulated - center\n    return edges, counts, centered, increments\n\nfor bins in (10, 20, 30):\n    edges, counts, ale, increments = accumulated_local_effects(\n        model, X_train, \"area_m2\", bins=bins)\n    print(f\"\\\\nALE with {bins} bins\")\n    print(\"Bin counts:\", counts.tolist())\n    print(\"Centered ALE at boundaries:\", np.round(ale, 1).tolist())\n    plt.step(edges, ale, where=\"post\", label=f\"ALE ({bins} bins)\")\nplt.axhline(0, color=\"black\", linewidth=1)\nplt.xlabel(\"Floor area (m²)\")\nplt.ylabel(\"Centered accumulated local effect (price units)\")\nplt.title(\"One-dimensional ALE sensitivity to bin count\")\nplt.legend()\nplt.tight_layout()\nplt.show()\n\n# Compare with PDP and ICE on the same fitted model.\nfig, ax = plt.subplots(figsize=(9, 5))\nPartialDependenceDisplay.from_estimator(\n    model, X_train, features=[\"area_m2\"], kind=\"both\", method=\"brute\",\n    grid_resolution=35, percentiles=(.05, .95), subsample=100,\n    random_state=SEED, ax=ax)\nax.set_title(\"PDP and ICE: global substitutions\")\nax.set_ylabel(\"Predicted price\")\nfig.tight_layout()\nplt.show()\n\n# Validation: ALE increments are finite and the centered empirical step\n# function has mean approximately zero by construction.\nedges, counts, ale, increments = accumulated_local_effects(\n    model, X_train, \"area_m2\", bins=20)\ncheck = np.repeat(ale[:-1], counts).mean()\nprint(\"Centered empirical ALE mean:\", round(float(check), 8))\nprint(\"All increments finite:\", bool(np.isfinite(increments).all()))\n";
window.DCH_ALE_813={content,practiceCode};
})();