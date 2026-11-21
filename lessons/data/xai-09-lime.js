/* Track A · 9.1.1 — Local explanation idea · RU / EN / ZH. */
(function(){
"use strict";
window.DCH_LIME_911={
  "content": {
    "ru": {
      "title": "Идея локального объяснения",
      "lead": "Как исследовать поведение сложной модели около одного объекта и почему локальное объяснение нельзя считать описанием модели в целом.",
      "outcomes": [
        "Объяснять, почему глобальных метрик недостаточно для анализа отдельного предсказания.",
        "Различать глобальный и локальный исследовательские вопросы.",
        "Определять x₀, f(x₀) и локальную окрестность N(x₀).",
        "Объяснять зависимость понятия близости от типа данных и представления признаков.",
        "Описывать идею локального приближения сложной модели.",
        "Различать исходную модель f и объяснение gₓ₀.",
        "Ограничивать выводы выбранной локальной областью.",
        "Сопоставлять локальные объяснения с Feature Importance, PDP, ICE и ALE.",
        "Объяснять, почему локальное объяснение не доказывает причинность или справедливость.",
        "Сравнивать качество локального приближения внутри и вне выбранной области."
      ],
      "sections": [
        {
          "id": "motivation",
          "title": "1. Почему глобального описания недостаточно",
          "paragraphs": [
            "Классификатор отзывов присваивает конкретному отзыву вероятность положительного класса 0,82. Глобальная метрика показывает качество на тестовой выборке, а глобальная важность признаков — общие закономерности. Но эти сведения не отвечают напрямую, почему именно этот отзыв получил такой прогноз.",
            "Глобальный вопрос: как модель ведёт себя на множестве объектов? Локальный вопрос: как она ведёт себя около выбранного объекта и какие свойства этого поведения можно компактно описать? Локальный анализ полезен для проверки необычных прогнозов, ошибок и отдельных случаев, но не заменяет оценку модели на репрезентативной выборке."
          ],
          "diagram": "global"
        },
        {
          "id": "instance",
          "title": "2. Объект объяснения и его окрестность",
          "paragraphs": [
            "Обозначим выбранный вход через x₀, исходную модель — f, а её выход для этого входа — f(x₀). Окрестность N(x₀) — набор входов, которые считаются достаточно близкими к x₀ для конкретного исследования.",
            "Близость не универсальна. Для таблицы она зависит от типов и масштабов признаков; для текста — от того, какие изменения сохраняют смысл; для изображения — от того, какие изменения областей оставляют важные элементы сцены неизменными. Евклидово расстояние в исходном векторе не всегда отражает предметную или семантическую близость.",
            "Представление признаков, метрика и допустимые изменения определяют состав окрестности. Если соседние точки нереалистичны, объяснение может описывать поведение модели на искусственных входах."
          ],
          "diagram": "neighborhood"
        },
        {
          "id": "local-behavior",
          "title": "3. Что исследуется локально",
          "paragraphs": [
            "Локальный анализ исследует наблюдаемое поведение функции f на входах из выбранной области, а не раскрывает автоматически внутреннее устройство модели. Можно подать близкие варианты объекта в исходную модель и наблюдать, как меняются прогнозы.",
            "Для текста это могут быть варианты отзыва с изменённым выражением; для таблицы — небольшие допустимые изменения характеристик. Какие изменения осмысленны, зависит от предметной задачи.",
            "Выходы модели показывают реакцию предсказательной функции. Они не доказывают, что соответствующие признаки вызывают событие в реальном мире."
          ]
        },
        {
          "id": "approximation",
          "title": "4. Идея локального приближения",
          "paragraphs": [
            "Сложная модель может быть ансамблем деревьев или нейросетью. Идея локального объяснения — описать её поведение около x₀ более простым представлением gₓ₀, которое человек способен прочитать и проверить.",
            "f(x) ≈ gₓ₀(x), x ∈ N(x₀). Слева находится выход исходной модели, справа — выход объясняющего представления. Знак приближения важен: совпадение не гарантировано и качество соответствия нужно измерять.",
            "gₓ₀ может быть коротким линейным правилом, небольшим деревом или набором условий. Оно создаётся для анализа выбранного случая и не заменяет исходную модель. Подробная конструкция локальных суррогатных моделей будет в уроке 9.1.2.",
            "Запись относится только к N(x₀). За пределами этой области gₓ₀ может существенно расходиться с f."
          ],
          "formula": "f(x) ≈ gₓ₀(x),  x ∈ N(x₀)",
          "diagram": "approximation"
        },
        {
          "id": "example",
          "title": "5. Пример: один отзыв и локальный вопрос",
          "paragraphs": [
            "Все числа в таблице условны и предназначены только для обучения. Первые четыре варианта близки к исходному отзыву; последний заметно дальше. Предположим, исходная модель выдаёт для исходного отзыва вероятность положительного класса 0,82.",
            "Простое локальное представление приблизительно повторяет изменения выходов рядом с выбранным объектом, но на далёком варианте может расходиться с исходной моделью. Допустимый вывод: в показанной области объяснение помогает описать локальное поведение классификатора. Недопустимый вывод: быстрая доставка или исправный товар доказанно вызывают положительный отзыв.",
            "Значения f — выходы исходной модели; gₓ₀ — приближённое объяснение. Причинная роль признаков требует отдельного предметного исследования."
          ],
          "table": {
            "headers": [
              "Вариант входа",
              "Исходная модель f",
              "Локальное приближение gₓ₀"
            ],
            "rows": [
              [
                "Быстрая доставка, аккуратная упаковка, товар работает",
                "0,82",
                "0,82"
              ],
              [
                "Доставка быстрая, товар не работает",
                "0,67",
                "0,62"
              ],
              [
                "Упаковка повреждена, товар работает",
                "0,74",
                "0,67"
              ],
              [
                "Доставка задержалась, товар работает",
                "0,71",
                "0,62"
              ],
              [
                "Все положительные признаки отсутствуют",
                "0,19",
                "0,27"
              ]
            ]
          }
        },
        {
          "id": "scope",
          "title": "6. Границы локального объяснения",
          "paragraphs": [
            "Слишком узкая окрестность может содержать мало разнообразных точек и давать нестабильную картину. Слишком широкая может смешать разные режимы модели и перестать отражать поведение около x₀.",
            "Возникает компромисс простоты и точности: простое представление легче понять, но оно может плохо приближать исходную функцию; сложное может точнее повторять прогнозы, но хуже поддаваться интерпретации.",
            "На объяснение влияют масштабирование признаков, метрика, генерация соседних примеров, случайность выборки и класс объясняющей модели. Local fidelity — соответствие выходам модели в заданной области — не равна истинности о реальном мире и не гарантирует справедливость или безопасность модели."
          ]
        },
        {
          "id": "methods",
          "title": "7. Место локального объяснения среди методов XAI",
          "paragraphs": [
            "Глобальная Feature Importance суммирует роль признаков на выборке, но может скрывать различия между объектами. PDP показывает усреднённый отклик при изменении признака, ICE — индивидуальные кривые, ALE — накопленные локальные изменения в областях с наблюдаемыми данными.",
            "LIME — конкретный модельно-независимый подход, использующий локальное интерпретируемое приближение. «Локальное объяснение» — более широкая идея: разные методы могут отвечать на локальные вопросы по-разному. Их результаты не взаимозаменяемы."
          ]
        },
        {
          "id": "summary",
          "title": "8. Итог и переход к следующему уроку",
          "paragraphs": [
            "Локальное объяснение начинается с объекта x₀, исходной модели f и осмысленной окрестности N(x₀). Поведение f в этой области описывается более простым представлением gₓ₀, а область применимости вывода должна быть явно ограничена.",
            "Локальное объяснение описывает поведение предсказательной функции, а не доказывает причинные механизмы реального мира. В уроке 9.1.2 мы разберём локальные суррогатные модели и компромисс между интерпретируемостью и локальной верностью; в 9.1.3 — шаги алгоритма LIME."
          ]
        }
      ],
      "practice": {
        "title": "Исследуем локальное приближение на синтетической модели",
        "intro": "Обучите нелинейный классификатор на make_moons. Для одного тестового объекта создайте близкие варианты и используйте неглубокое дерево как учебное объясняющее представление. Это не реализация LIME.",
        "task": "Запустите скрипт и сравните ошибку локального приближения на близких точках с ошибкой на широкой сетке. Объясните, почему локальное сходство не означает глобального.",
        "expected": "Скрипт выводит координаты объекта, вероятность класса 1, локальную MSE и MSE на широкой сетке. Числа вычисляются при запуске и не фиксируются заранее."
      },
      "sources": [
        [
          "Ribeiro, Singh, Guestrin (2016). “Why Should I Trust You?” KDD 2016. DOI: 10.1145/2939672.2939778",
          "https://doi.org/10.1145/2939672.2939778"
        ],
        [
          "Официальный репозиторий и реализация LIME",
          "https://github.com/marcotcr/lime"
        ],
        [
          "Molnar. Interpretable Machine Learning — LIME",
          "https://christophm.github.io/interpretable-ml-book/lime.html"
        ],
        [
          "Yeh et al. (2019). On the (In)fidelity and Sensitivity of Explanations. NeurIPS",
          "https://proceedings.neurips.cc/paper/2019/hash/a7471fdc77b3435276507cc8f2dc2569-Abstract.html"
        ],
        [
          "Rudin (2019). Stop explaining black box machine learning models for high stakes decisions. Nature Machine Intelligence",
          "https://doi.org/10.1038/s42256-019-0048-x"
        ]
      ],
      "glossary": [
        [
          "XAI",
          "Методы и принципы, делающие поведение систем ИИ понятнее человеку."
        ],
        [
          "Black-box model",
          "Модель, внутреннюю логику которой нельзя непосредственно интерпретировать."
        ],
        [
          "Local explanation",
          "Объяснение поведения модели около выбранного объекта."
        ],
        [
          "Global explanation",
          "Описание закономерностей модели на широкой совокупности объектов."
        ],
        [
          "Explained instance",
          "Вход x₀, предсказание которого исследуется."
        ],
        [
          "Neighborhood",
          "Набор входов, признанных близкими к x₀ по выбранному правилу."
        ],
        [
          "Locality",
          "Ограничение анализа областью около конкретного объекта."
        ],
        [
          "Local behavior",
          "Поведение исходной функции в выбранной окрестности."
        ],
        [
          "Local approximation",
          "Приближённое описание модели в ограниченной области."
        ],
        [
          "Interpretable model",
          "Модель, структуру или правила которой человек способен понять."
        ],
        [
          "Local surrogate model",
          "Интерпретируемая модель, приближающая выход исходной около x₀."
        ],
        [
          "Local fidelity",
          "Соответствие объяснения выходам исходной модели в заданной окрестности."
        ],
        [
          "Perturbation",
          "Изменение входа для исследования реакции модели."
        ],
        [
          "Feature representation",
          "Способ представить объект через признаки."
        ],
        [
          "Stability",
          "Сохранение сходства объяснения при небольших изменениях входа или процедуры."
        ]
      ],
      "quiz": [
        [
          "Какой вопрос является локальным?",
          [
            "Average test accuracy?",
            "Behaviour around one x₀?",
            "Most frequent training features?",
            "Overall architecture?"
          ],
          1,
          "Локальный вопрос касается поведения около выбранного объекта."
        ],
        [
          "Что обозначает x₀?",
          [
            "The model",
            "The neighbourhood",
            "The explained input",
            "A global metric"
          ],
          2,
          "x₀ — вход, предсказание которого исследуется."
        ],
        [
          "Что такое N(x₀)?",
          [
            "All possible inputs",
            "The selected neighbourhood",
            "Model weights",
            "The test set"
          ],
          1,
          "N(x₀) — точки, считающиеся близкими по выбранному правилу."
        ],
        [
          "Почему близость зависит от задачи?",
          [
            "Models cannot use numbers",
            "Representation, metric, and data type differ",
            "Features are always independent",
            "Only labels define distance"
          ],
          1,
          "Представление, метрика и тип данных влияют на осмысленность соседства."
        ],
        [
          "Что означает f(x) ≈ gₓ₀(x) в N(x₀)?",
          [
            "Global identity",
            "Replace f in production",
            "Local approximation",
            "Retrain f each time"
          ],
          2,
          "Это локальное приближение, а не глобальное равенство."
        ],
        [
          "Как читать числа в примере?",
          [
            "Causal effects",
            "Real measurements",
            "Hypothetical teaching outputs",
            "Test metrics"
          ],
          2,
          "Числа условны и служат учебной иллюстрацией."
        ],
        [
          "Какой вывод допустим?",
          [
            "A feature causes the event",
            "Rule applies everywhere",
            "Approximation describes model behaviour in the selected region",
            "Model is fair"
          ],
          2,
          "Вывод должен относиться только к выбранной области."
        ],
        [
          "Что может произойти при слишком широкой окрестности?",
          [
            "Make explanation universal",
            "Mix different model regimes",
            "Stop predictions",
            "Remove need for metrics"
          ],
          1,
          "Широкая область может смешать разные режимы модели."
        ],
        [
          "Как связаны LIME и локальное объяснение?",
          [
            "One concrete method vs broader idea",
            "Always a global metric",
            "Only way to explain locally",
            "A causal proof"
          ],
          0,
          "LIME — конкретный метод, локальное объяснение — более широкая идея."
        ],
        [
          "Что измеряет local fidelity?",
          [
            "Truth about reality",
            "Agreement with model outputs in a region",
            "Global test accuracy",
            "Architecture clarity"
          ],
          1,
          "Local fidelity измеряет согласие с моделью в области, а не истину о мире."
        ]
      ]
    },
    "en": {
      "title": "The Idea of Local Explanation",
      "lead": "How to inspect a complex model around one instance—and why a local explanation is not a description of the model as a whole.",
      "outcomes": [
        "Explain why global metrics are insufficient for analysing an individual prediction.",
        "Distinguish global and local research questions.",
        "Define x₀, f(x₀), and a local neighbourhood N(x₀).",
        "Explain how proximity depends on data type and feature representation.",
        "Describe the idea of locally approximating a complex model.",
        "Distinguish the original model f from an explanation gₓ₀.",
        "Restrict conclusions to the selected local region.",
        "Compare local explanations with feature importance, PDP, ICE, and ALE.",
        "Explain why a local explanation proves neither causality nor fairness.",
        "Compare approximation quality inside and outside the selected region."
      ],
      "sections": [
        {
          "id": "motivation",
          "title": "1. Why a global description is not enough",
          "paragraphs": [
            "A review classifier assigns a positive-class probability of 0.82 to one review. A global metric describes performance on a test set, while global feature importance summarizes broad patterns. Neither directly answers why this particular review received that prediction.",
            "A global question asks how the model behaves across many instances. A local question asks how it behaves around one selected instance and which aspects of that behaviour can be described compactly. Local analysis helps inspect unusual predictions, errors, and individual cases, but it does not replace evaluation on a representative dataset."
          ],
          "diagram": "global"
        },
        {
          "id": "instance",
          "title": "2. The explained instance and its neighbourhood",
          "paragraphs": [
            "Let x₀ be the selected input, f the original model, and f(x₀) its output. A neighbourhood N(x₀) is a set of inputs considered sufficiently close to x₀ for a particular investigation.",
            "Proximity is not universal. For tables it depends on feature types and scales; for text, on which changes preserve meaning; for images, on which region changes leave important scene elements intact. Euclidean distance in the raw vector does not always represent semantic or domain proximity.",
            "Feature representation, metric, and valid changes determine the neighbourhood. If nearby points are implausible, the explanation may describe model behaviour on artificial inputs."
          ],
          "diagram": "neighborhood"
        },
        {
          "id": "local-behavior",
          "title": "3. What is examined locally",
          "paragraphs": [
            "Local analysis examines the observable behaviour of f on inputs from a selected region; it does not automatically reveal the model's internal structure. We can submit nearby variants to the original model and observe how predictions change.",
            "For text, variants might change a phrase in a review; for tabular data, they might make small, valid changes to attributes. Which changes are meaningful depends on the application.",
            "Model outputs show how the predictive function responds. They do not prove that the corresponding features cause an event in the real world."
          ]
        },
        {
          "id": "approximation",
          "title": "4. The idea of local approximation",
          "paragraphs": [
            "A complex model may be a tree ensemble or a neural network. A local explanation aims to describe its behaviour around x₀ with a simpler representation, gₓ₀, that a person can inspect.",
            "f(x) ≈ gₓ₀(x), x ∈ N(x₀). The left side is the original model output; the right side is the explanatory representation. Approximate equality matters: agreement is not guaranteed and must be evaluated.",
            "gₓ₀ may be a short linear rule, a small tree, or a set of conditions. It is created to inspect the selected case and does not replace the original model. The next lesson covers local surrogate models in detail.",
            "The expression applies only to N(x₀). Outside this region, gₓ₀ may differ substantially from f."
          ],
          "formula": "f(x) ≈ gₓ₀(x),  x ∈ N(x₀)",
          "diagram": "approximation"
        },
        {
          "id": "example",
          "title": "5. Example: one review, one local question",
          "paragraphs": [
            "All values in the table are hypothetical and intended for teaching only. The first four variants are near the original review; the last is much farther away. Suppose the original model returns a positive-class probability of 0.82 for the original review.",
            "A simple local representation approximately follows changes in the model outputs near the selected instance, but may diverge on a distant variant. A defensible conclusion is that the explanation helps describe local classifier behaviour in the displayed region. An indefensible conclusion is that fast delivery or a working product is proven to cause a positive review.",
            "The f values are outputs of the original model; gₓ₀ is an approximate explanation. Causal roles of features require a separate domain investigation."
          ],
          "table": {
            "headers": [
              "Input variant",
              "Original model f",
              "Local gₓ₀"
            ],
            "rows": [
              [
                "Fast delivery, neat packaging, product works",
                "0.82",
                "0.82"
              ],
              [
                "Fast delivery, product does not work",
                "0.67",
                "0.62"
              ],
              [
                "Damaged packaging, product works",
                "0.74",
                "0.67"
              ],
              [
                "Late delivery, product works",
                "0.71",
                "0.62"
              ],
              [
                "All positive cues are absent",
                "0.19",
                "0.27"
              ]
            ]
          }
        },
        {
          "id": "scope",
          "title": "6. Boundaries of a local explanation",
          "paragraphs": [
            "A neighbourhood that is too narrow may contain too few varied points and produce an unstable picture. A neighbourhood that is too wide may mix different model regimes and stop reflecting behaviour around x₀.",
            "There is a trade-off between simplicity and accuracy: a simple representation is easier to understand but may poorly approximate the original function; a complex one may match predictions more closely but be harder to interpret.",
            "Feature scaling, the distance metric, generation of nearby examples, sampling randomness, and the explanatory model class all matter. Local fidelity—agreement with model outputs in a specified region—is not truth about the real world and does not guarantee fairness or safety."
          ]
        },
        {
          "id": "methods",
          "title": "7. Local explanations among XAI methods",
          "paragraphs": [
            "Global feature importance summarizes feature roles over a dataset but may hide differences between instances. PDP shows an average response as a feature changes, ICE shows individual curves, and ALE accumulates local changes in regions supported by observed data.",
            "LIME is a specific model-agnostic approach using a locally interpretable approximation. “Local explanation” is a broader idea: different methods answer local questions in different ways. Their results are not interchangeable."
          ]
        },
        {
          "id": "summary",
          "title": "8. Summary and transition",
          "paragraphs": [
            "A local explanation starts with x₀, the original model f, and a meaningful neighbourhood N(x₀). The behaviour of f in that region is described with a simpler representation gₓ₀, and the scope of the conclusion must be explicit.",
            "A local explanation describes a predictive function; it does not prove causal mechanisms in the real world. Lesson 9.1.2 examines local surrogate models and the trade-off between interpretability and local fidelity; lesson 9.1.3 covers the LIME procedure."
          ]
        }
      ],
      "practice": {
        "title": "Inspecting a local approximation on a synthetic model",
        "intro": "Train a nonlinear classifier on make_moons. Generate nearby variants for one test instance and use a shallow tree as a teaching explanation. This is not an implementation of LIME.",
        "task": "Run the script and compare approximation error on nearby points with error over a broad grid. Explain why local agreement does not imply global agreement.",
        "expected": "The script prints the instance coordinates, class-1 probability, local MSE, and broad-grid MSE. Values are computed at runtime, not fabricated in advance."
      },
      "sources": [
        [
          "Ribeiro, Singh, Guestrin (2016). “Why Should I Trust You?” KDD 2016. DOI: 10.1145/2939672.2939778",
          "https://doi.org/10.1145/2939672.2939778"
        ],
        [
          "Official LIME repository and implementation",
          "https://github.com/marcotcr/lime"
        ],
        [
          "Molnar. Interpretable Machine Learning — LIME chapter",
          "https://christophm.github.io/interpretable-ml-book/lime.html"
        ],
        [
          "Yeh et al. (2019). On the (In)fidelity and Sensitivity of Explanations. NeurIPS",
          "https://proceedings.neurips.cc/paper/2019/hash/a7471fdc77b3435276507cc8f2dc2569-Abstract.html"
        ],
        [
          "Rudin (2019). Stop explaining black box machine learning models for high stakes decisions. Nature Machine Intelligence",
          "https://doi.org/10.1038/s42256-019-0048-x"
        ]
      ],
      "glossary": [
        [
          "XAI",
          "Methods and principles intended to make AI behaviour understandable to people."
        ],
        [
          "Black-box model",
          "A model whose internal logic cannot be directly interpreted."
        ],
        [
          "Local explanation",
          "An explanation of model behaviour around a selected instance."
        ],
        [
          "Global explanation",
          "A description of model patterns across a broad set of instances."
        ],
        [
          "Explained instance",
          "The input x₀ whose prediction is being examined."
        ],
        [
          "Neighborhood",
          "Inputs considered close to x₀ under a chosen rule."
        ],
        [
          "Locality",
          "Restricting analysis to a region around one instance."
        ],
        [
          "Local behavior",
          "The original function's behaviour within the selected neighbourhood."
        ],
        [
          "Local approximation",
          "An approximate description of a model in a limited region."
        ],
        [
          "Interpretable model",
          "A model whose structure or rules a person can understand."
        ],
        [
          "Local surrogate model",
          "An interpretable model approximating the original output near x₀."
        ],
        [
          "Local fidelity",
          "Agreement with original model outputs in a specified neighbourhood."
        ],
        [
          "Perturbation",
          "An input change used to probe model responses."
        ],
        [
          "Feature representation",
          "The way an instance is represented through features."
        ],
        [
          "Stability",
          "Similarity of an explanation under small input or procedure changes."
        ]
      ],
      "quiz": [
        [
          "Which question is local?",
          [
            "Average test accuracy?",
            "Behaviour around one x₀?",
            "Most frequent training features?",
            "Overall architecture?"
          ],
          1,
          "A local question concerns behaviour near one selected instance."
        ],
        [
          "What is x₀?",
          [
            "The model",
            "The neighbourhood",
            "The explained input",
            "A global metric"
          ],
          2,
          "x₀ is the input whose prediction is examined."
        ],
        [
          "What is N(x₀)?",
          [
            "All possible inputs",
            "The selected neighbourhood",
            "Model weights",
            "The test set"
          ],
          1,
          "It is the set of points considered close under a chosen rule."
        ],
        [
          "Why is proximity task-dependent?",
          [
            "Models cannot use numbers",
            "Representation, metric, and data type differ",
            "Features are always independent",
            "Only labels define distance"
          ],
          1,
          "Different data types require meaningful, task-specific neighbourhoods."
        ],
        [
          "What does f(x) ≈ gₓ₀(x) in N(x₀) mean?",
          [
            "Global identity",
            "Replace f in production",
            "Local approximation",
            "Retrain f each time"
          ],
          2,
          "The explanatory representation approximates the model only in the selected region."
        ],
        [
          "How should the example values be read?",
          [
            "Causal effects",
            "Real measurements",
            "Hypothetical teaching outputs",
            "Test metrics"
          ],
          2,
          "They are illustrative values, not empirical findings."
        ],
        [
          "Which conclusion is defensible?",
          [
            "A feature causes the event",
            "Rule applies everywhere",
            "Approximation describes model behaviour in the selected region",
            "Model is fair"
          ],
          2,
          "Local conclusions must remain bounded to the defined region."
        ],
        [
          "What can an overly wide neighbourhood do?",
          [
            "Make explanation universal",
            "Mix different model regimes",
            "Stop predictions",
            "Remove need for metrics"
          ],
          1,
          "A wide region can blur the local pattern."
        ],
        [
          "How does LIME relate to local explanation?",
          [
            "One concrete method vs broader idea",
            "Always a global metric",
            "Only way to explain locally",
            "A causal proof"
          ],
          0,
          "LIME is one specific approach to local interpretable approximation."
        ],
        [
          "What does local fidelity measure?",
          [
            "Truth about reality",
            "Agreement with model outputs in a region",
            "Global test accuracy",
            "Architecture clarity"
          ],
          1,
          "It evaluates local agreement with the original model, not real-world truth."
        ]
      ]
    },
    "zh": {
      "title": "局部解释的基本思想",
      "lead": "如何研究复杂模型在一个样本附近的行为，以及为什么局部解释不能代表整个模型。",
      "outcomes": [
        "说明为什么全局指标不足以分析单个预测。",
        "区分全局研究问题与局部研究问题。",
        "定义 x₀、f(x₀) 和局部邻域 N(x₀)。",
        "说明邻近程度如何取决于数据类型和特征表示。",
        "描述用局部近似表示复杂模型的思想。",
        "区分原始模型 f 与解释表示 gₓ₀。",
        "将结论限制在选定的局部区域内。",
        "比较局部解释与特征重要性、PDP、ICE 和 ALE。",
        "说明局部解释既不能证明因果关系，也不能证明公平性。",
        "比较局部区域内外的近似质量。"
      ],
      "sections": [
        {
          "id": "motivation",
          "title": "1. 为什么全局描述还不够",
          "paragraphs": [
            "评论分类器对一条评论给出正面类别概率 0.82。全局指标描述模型在测试集上的表现，全局特征重要性总结整体规律，但它们都不能直接回答：为什么这条具体评论得到这样的预测？",
            "全局问题关注模型在大量样本上的行为；局部问题关注模型在一个选定样本附近如何表现，以及如何简洁地描述这种行为。局部分析有助于检查异常预测、错误和个别案例，但不能替代基于代表性数据集的评估。"
          ],
          "diagram": "global"
        },
        {
          "id": "instance",
          "title": "2. 待解释样本与邻域",
          "paragraphs": [
            "用 x₀ 表示选定输入，用 f 表示原始模型，用 f(x₀) 表示模型输出。邻域 N(x₀) 是按照具体研究规则被认为足够接近 x₀ 的输入集合。",
            "邻近程度没有通用定义。表格数据取决于特征类型和尺度；文本取决于哪些变化仍能保持语义；图像取决于哪些区域变化不会破坏场景中的关键元素。原始向量中的欧氏距离不一定代表语义或领域上的接近程度。",
            "特征表示、距离度量和允许的变化共同决定邻域。如果邻近点不合理，解释可能描述模型在人工输入上的行为。"
          ],
          "diagram": "neighborhood"
        },
        {
          "id": "local-behavior",
          "title": "3. 局部分析研究什么",
          "paragraphs": [
            "局部分析研究函数 f 在选定区域输入上的可观察行为，并不会自动揭示模型内部结构。我们可以把相近变体输入原始模型，观察预测如何变化。",
            "文本变体可以改变评论中的短语；表格变体可以对属性进行小幅且合理的修改。哪些变化有意义取决于具体应用。",
            "模型输出显示预测函数如何响应输入变化，但不能证明相应特征在现实世界中导致了某个事件。"
          ]
        },
        {
          "id": "approximation",
          "title": "4. 局部近似的思想",
          "paragraphs": [
            "复杂模型可能是树集成或神经网络。局部解释试图用更简单、便于人理解的表示 gₓ₀ 来描述模型在 x₀ 附近的行为。",
            "f(x) ≈ gₓ₀(x)，x ∈ N(x₀)。左侧是原始模型输出，右侧是解释表示。近似符号意味着二者不保证完全一致，必须评估其吻合程度。",
            "gₓ₀ 可以是简短线性规则、小型决策树或一组条件。它用于检查当前样本，并不会取代原始模型。下一课将详细介绍局部替代模型。",
            "该表达式只适用于 N(x₀)。在此区域之外，gₓ₀ 可能与 f 明显不同。"
          ],
          "formula": "f(x) ≈ gₓ₀(x),  x ∈ N(x₀)",
          "diagram": "approximation"
        },
        {
          "id": "example",
          "title": "5. 示例：一条评论，一个局部问题",
          "paragraphs": [
            "表格中的数值均为假设值，仅用于教学。前四个变体接近原始评论，最后一个距离较远。假设原始模型对原始评论给出的正面类别概率为 0.82。",
            "简单的局部表示可以近似跟随选定样本附近的模型输出变化，但在较远的变体上可能出现偏差。合理的结论是：该解释有助于描述展示区域内分类器的局部行为。不合理的结论是：快速配送或商品完好已被证明会导致正面评论。",
            "f 的数值是原始模型输出；gₓ₀ 是近似解释。特征的因果作用需要单独的领域研究。"
          ],
          "table": {
            "headers": [
              "输入变体",
              "原始模型 f",
              "局部 gₓ₀"
            ],
            "rows": [
              [
                "配送快、包装整洁、商品可用",
                "0.82",
                "0.82"
              ],
              [
                "配送快、商品无法使用",
                "0.67",
                "0.62"
              ],
              [
                "包装破损、商品可用",
                "0.74",
                "0.67"
              ],
              [
                "配送延迟、商品可用",
                "0.71",
                "0.62"
              ],
              [
                "所有正面线索均不存在",
                "0.19",
                "0.27"
              ]
            ]
          }
        },
        {
          "id": "scope",
          "title": "6. 局部解释的边界",
          "paragraphs": [
            "邻域过窄可能缺少足够多样的样本，导致结果不稳定；邻域过宽则可能混合不同的模型行为模式，不再反映 x₀ 附近的行为。",
            "简单性与准确性之间存在权衡：简单表示容易理解，却可能无法很好地近似原始函数；复杂表示可能更贴近预测，却更难解释。",
            "特征尺度、距离度量、邻近样本的生成方式、抽样随机性以及解释模型类别都会影响结果。局部忠实度表示解释与指定区域内模型输出的一致程度，并不代表现实真相，也不能保证公平或安全。"
          ]
        },
        {
          "id": "methods",
          "title": "7. 局部解释在 XAI 方法中的位置",
          "paragraphs": [
            "全局特征重要性总结特征在数据集上的作用，但可能掩盖样本差异。PDP 展示特征变化时的平均响应，ICE 展示个体曲线，ALE 在观测数据支持的区域内累积局部变化。",
            "LIME 是一种使用局部可解释近似的具体模型无关方法。“局部解释”是更广泛的思想：不同方法以不同方式回答局部问题，结果不能互换。"
          ]
        },
        {
          "id": "summary",
          "title": "8. 总结与下一课",
          "paragraphs": [
            "局部解释从 x₀、原始模型 f 和有意义的邻域 N(x₀) 开始。通过更简单的表示 gₓ₀ 描述 f 在该区域内的行为，并明确结论的适用范围。",
            "局部解释描述的是预测函数的行为，而不是证明现实世界中的因果机制。9.1.2 将介绍局部替代模型及可解释性与局部忠实度之间的权衡；9.1.3 将介绍 LIME 的具体步骤。"
          ]
        }
      ],
      "practice": {
        "title": "在合成模型上观察局部近似",
        "intro": "使用 make_moons 训练非线性分类器。针对一个测试样本生成邻近变体，并用浅层决策树作为教学解释表示。这不是 LIME 的实现。",
        "task": "运行脚本，比较邻近点上的近似误差与较大网格上的误差，并解释为什么局部一致不代表全局一致。",
        "expected": "脚本输出样本坐标、类别 1 的概率、局部 MSE 和大范围网格 MSE。数值在运行时计算，不预先编造。"
      },
      "sources": [
        [
          "Ribeiro、Singh、Guestrin（2016）：“Why Should I Trust You?” KDD 2016。DOI：10.1145/2939672.2939778",
          "https://doi.org/10.1145/2939672.2939778"
        ],
        [
          "LIME 官方代码库与实现",
          "https://github.com/marcotcr/lime"
        ],
        [
          "Molnar：《Interpretable Machine Learning》LIME 章节",
          "https://christophm.github.io/interpretable-ml-book/lime.html"
        ],
        [
          "Yeh 等（2019）：On the (In)fidelity and Sensitivity of Explanations，NeurIPS",
          "https://proceedings.neurips.cc/paper/2019/hash/a7471fdc77b3435276507cc8f2dc2569-Abstract.html"
        ],
        [
          "Rudin（2019）：Stop explaining black box machine learning models for high stakes decisions，Nature Machine Intelligence",
          "https://doi.org/10.1038/s42256-019-0048-x"
        ]
      ],
      "glossary": [
        [
          "XAI",
          "旨在让人更容易理解人工智能系统行为的方法与原则。"
        ],
        [
          "黑箱模型",
          "内部逻辑无法由人直接解释的模型。"
        ],
        [
          "局部解释",
          "针对模型在选定样本附近行为的解释。"
        ],
        [
          "全局解释",
          "描述模型在广泛样本集合上规律的解释。"
        ],
        [
          "待解释样本",
          "正在检查其预测的输入 x₀。"
        ],
        [
          "邻域",
          "按照选定规则被认为接近 x₀ 的输入集合。"
        ],
        [
          "局部性",
          "将分析限制在某个样本周围区域的性质。"
        ],
        [
          "局部行为",
          "原始函数在选定邻域内的行为。"
        ],
        [
          "局部近似",
          "在有限区域内对模型行为进行的近似描述。"
        ],
        [
          "可解释模型",
          "其结构或规则能够被人理解的模型。"
        ],
        [
          "局部替代模型",
          "在 x₀ 附近近似原始模型输出的可解释模型。"
        ],
        [
          "局部忠实度",
          "解释在指定邻域内与原始模型输出的一致程度。"
        ],
        [
          "扰动",
          "为探测模型响应而对输入进行的变化。"
        ],
        [
          "特征表示",
          "通过特征表示样本的方式。"
        ],
        [
          "稳定性",
          "输入或分析流程小幅变化时解释保持相似的程度。"
        ]
      ],
      "quiz": [
        [
          "哪个问题属于局部问题？",
          [
            "Average test accuracy?",
            "Behaviour around one x₀?",
            "Most frequent training features?",
            "Overall architecture?"
          ],
          1,
          "局部问题关注选定样本附近的行为。"
        ],
        [
          "x₀ 表示什么？",
          [
            "The model",
            "The neighbourhood",
            "The explained input",
            "A global metric"
          ],
          2,
          "x₀ 是正在检查预测的输入。"
        ],
        [
          "N(x₀) 是什么？",
          [
            "All possible inputs",
            "The selected neighbourhood",
            "Model weights",
            "The test set"
          ],
          1,
          "N(x₀) 是按照所选规则被认为接近的点集合。"
        ],
        [
          "为什么邻近程度取决于任务？",
          [
            "Models cannot use numbers",
            "Representation, metric, and data type differ",
            "Features are always independent",
            "Only labels define distance"
          ],
          1,
          "特征表示、度量方式和数据类型决定邻域是否合理。"
        ],
        [
          "f(x) ≈ gₓ₀(x) 且 x 属于 N(x₀) 表示什么？",
          [
            "Global identity",
            "Replace f in production",
            "Local approximation",
            "Retrain f each time"
          ],
          2,
          "这是局部近似，不是全局恒等。"
        ],
        [
          "如何理解示例中的数值？",
          [
            "Causal effects",
            "Real measurements",
            "Hypothetical teaching outputs",
            "Test metrics"
          ],
          2,
          "数值是假设性的教学示例。"
        ],
        [
          "哪项结论是合理的？",
          [
            "A feature causes the event",
            "Rule applies everywhere",
            "Approximation describes model behaviour in the selected region",
            "Model is fair"
          ],
          2,
          "结论必须限制在选定区域内。"
        ],
        [
          "邻域过宽可能导致什么？",
          [
            "Make explanation universal",
            "Mix different model regimes",
            "Stop predictions",
            "Remove need for metrics"
          ],
          1,
          "宽邻域可能混合不同模型行为模式。"
        ],
        [
          "LIME 与局部解释有什么关系？",
          [
            "One concrete method vs broader idea",
            "Always a global metric",
            "Only way to explain locally",
            "A causal proof"
          ],
          0,
          "LIME 是具体方法，局部解释是更广泛的思想。"
        ],
        [
          "局部忠实度衡量什么？",
          [
            "Truth about reality",
            "Agreement with model outputs in a region",
            "Global test accuracy",
            "Architecture clarity"
          ],
          1,
          "局部忠实度衡量解释与模型在区域内输出的一致程度。"
        ]
      ]
    }
  },
  "practiceCode": "\"\"\"Teaching demo of local approximation; this is NOT an implementation of LIME.\nInstall: python -m pip install numpy matplotlib scikit-learn\nRun: python lessons/practice/a-9-1-1-local-explanation.py\n\"\"\"\nimport numpy as np\nimport matplotlib.pyplot as plt\nfrom matplotlib.patches import Circle\nfrom sklearn.datasets import make_moons\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeRegressor\nfrom sklearn.metrics import mean_squared_error\n\nSEED = 42\nrng = np.random.default_rng(SEED)\nX, y = make_moons(n_samples=1800, noise=0.24, random_state=SEED)\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.25, stratify=y, random_state=SEED\n)\nblack_box = RandomForestClassifier(\n    n_estimators=240, min_samples_leaf=4, random_state=SEED, n_jobs=-1\n).fit(X_train, y_train)\nx0 = X_test[0].copy()\nprediction = float(black_box.predict_proba(x0.reshape(1, -1))[0, 1])\n\n# Nearby variations are sampled only to illustrate a local region.\nlocal_train = x0 + rng.normal(0, 0.20, size=(1400, 2))\nlocal_valid = x0 + rng.normal(0, 0.20, size=(500, 2))\ntarget_train = black_box.predict_proba(local_train)[:, 1]\ntarget_valid = black_box.predict_proba(local_valid)[:, 1]\nsurrogate = DecisionTreeRegressor(\n    max_depth=2, min_samples_leaf=24, random_state=SEED\n).fit(local_train, target_train)\nlocal_mse = mean_squared_error(target_valid, surrogate.predict(local_valid))\n\nxx, yy = np.meshgrid(np.linspace(-1.6, 2.6, 180),\n                     np.linspace(-1.2, 1.7, 150))\ngrid = np.column_stack([xx.ravel(), yy.ravel()])\noriginal_surface = black_box.predict_proba(grid)[:, 1]\nlocal_surface = surrogate.predict(grid)\nglobal_mse = mean_squared_error(original_surface, local_surface)\n\nassert X_train.shape[1] == 2\nassert local_train.shape == (1400, 2) and local_valid.shape == (500, 2)\nassert 0.0 <= prediction <= 1.0\nassert np.isfinite(local_mse) and np.isfinite(global_mse)\nassert np.isfinite(local_surface).all()\n\nprint(\"Explained instance:\", np.round(x0, 3).tolist())\nprint(\"Original model probability for class 1:\", round(prediction, 3))\nprint(\"Local approximation MSE:\", round(float(local_mse), 4))\nprint(\"Broad-grid approximation MSE:\", round(float(global_mse), 4))\nprint(\"These are regional agreement checks, not proof of a global explanation.\")\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5), constrained_layout=True)\nfor ax, surface, title in (\n    (axes[0], original_surface, \"Original model\"),\n    (axes[1], local_surface, \"Local approximation\"),\n):\n    contour = ax.contourf(xx, yy, surface.reshape(xx.shape),\n                          levels=np.linspace(0, 1, 11),\n                          cmap=\"coolwarm\", alpha=0.82)\n    ax.scatter(X_test[:, 0], X_test[:, 1], c=y_test, cmap=\"coolwarm\",\n               s=10, alpha=0.25, edgecolors=\"none\")\n    ax.scatter([x0[0]], [x0[1]], marker=\"*\", s=220, c=\"gold\",\n               edgecolors=\"black\", label=\"Explained instance\")\n    ax.add_patch(Circle(x0, 0.48, fill=False, linewidth=2,\n                        linestyle=\"--\", edgecolor=\"black\"))\n    ax.set_title(title)\n    ax.set_xlabel(\"Feature 1\")\n    ax.set_ylabel(\"Feature 2\")\n    ax.legend()\nfig.colorbar(contour, ax=axes, label=\"Predicted probability for class 1\")\nplt.show()\n"
};
})();
