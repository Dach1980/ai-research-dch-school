(function(){
"use strict";
window.DCH_SHAP_1012={
  "content": {
    "ru": {
      "title": "Как работает SHAP",
      "lead": "От математического определения к вычислению: зададим игру для модели, сравним KernelSHAP и TreeSHAP, проверим вклады на одном фоновом наборе.",
      "outcomes": [
        "Определять скалярный выход модели, объект, коалицию и функцию ценности.",
        "Объяснять роль background data, baseline и правил маскирования.",
        "Различать условное и маргинальное усреднение и их последствия.",
        "Вычислять число коалиций и перестановок и оценивать бюджет.",
        "Объяснять маски, регрессию, ядро и ограничения KernelSHAP.",
        "Объяснять TreeSHAP и различать режимы обработки зависимостей.",
        "Выбирать объяснитель с учётом структуры модели и вычислительных затрат.",
        "Сверять baseline и аддитивность с одним выходом модели.",
        "Оценивать точность относительно фиксированной игры и чувствительность к бюджету."
      ],
      "sections": [
        [
          "pipeline",
          "1. От Shapley Value к вычислительной задаче",
          [
            "В 10.1.1 мы распределяли прирост v(N) − v(∅) между игроками. Для модели игроками становятся признаки, объект x задаёт их наблюдаемые значения, а f(x) — один выбранный скалярный выход. Например, у регрессора это прогноз цены; у классификатора необходимо заранее выбрать класс и шкалу выхода.",
            "Формула Shapley Value говорит, как усреднять предельные вклады, но не определяет сама, что делать с неизвестными значениями. Прежде чем считать вклад, задаём игру vₓ(S). Лишь затем выбираем алгоритм для её вычисления.",
            "Результат работы — базовое значение φ₀ и вектор φ₁,…,φₘ, а не новая обученная модель. При точном вычислении для согласованной постановки выполняется f(x) = φ₀ + Σᵢ φᵢ, где φ₀ = vₓ(∅). Приближённые методы могут обеспечивать это равенство ограничением, даже когда отдельные вклады неточны."
          ],
          "pipeline"
        ],
        [
          "game",
          "2. Как задать игру для модели",
          [
            "Пусть N — набор M признаков, S ⊆ N — признаки, значения которых известны, а ¬S — дополнение. xₛ означает наблюдаемые компоненты объекта. Обозначим случайный фоновый объект X; его распределение определяет, относительно какой совокупности сравнивается прогноз.",
            "Например, при маргинальном правиле vₓ(S) = E[f(xₛ, X¬ₛ)]. Для конечного фонового набора из B строк это среднее B предсказаний, полученных заменой неизвестных компонентов строками фона. Для пустой коалиции это среднее f(X), а для полной — f(x).",
            "Фоновая выборка — не обязательно все обучающие данные. Выбор целевой популяции важен: фон из одного сегмента и фон из всей популяции могут дать разные baseline и атрибуции. При сравнении вычислителей используем одну модель, объект, шкалу и тот же фон; при сравнении постановок меняем правило явно.",
            "Маскирование — правило вычисления условного или маргинального ожидания, а не удаление столбца из уже обученной модели. Подстановка нулей допустима лишь как осознанная отдельная постановка."
          ],
          null
        ],
        [
          "dependence",
          "3. Условное и маргинальное усреднение",
          [
            "Условная игра задаётся vₓ(S) = E[f(X) | Xₛ = xₛ]. Неизвестные признаки распределены условно на известных. Для непрерывных величин условное распределение приходится оценивать или задавать моделью; точное совпадение строк обычно не подходит.",
            "Рассмотрим учебный фон из двух равновероятных квартир: (площадь, комнаты) = (40, 1) и (80, 3). Объясняем x = (80, 3), а условная модель f(a,r)=a/10 использует только площадь. Единицы выхода условные. Сохраним число комнат 3: маргинальное заполнение площади создаёт (40,3) и (80,3), давая (4+8)/2=6; условное заполнение по этому дискретному фону оставляет (80,3), давая 8.",
            "Маргинальное заполнение берёт неизвестные компоненты совместно из строки фона, но разрывает зависимость между известным S и неизвестным ¬S. Условная постановка сохраняет статистическую зависимость и может присвоить вклад признаку-прокси, даже когда модель не использует его напрямую. Это разные вопросы, а не просто разные скорости вычисления.",
            "Термин interventional в API TreeExplainer обозначает конкретный режим интегрирования по фону. Не отождествляем произвольное маргинальное маскирование с доказанной причинной интервенцией: для причинных выводов нужна обоснованная причинная модель."
          ],
          "masking"
        ],
        [
          "cost",
          "4. Почему точный перебор дорог",
          [
            "При M признаках существует 2ᴹ различных коалиций, включая пустую и полную. Число порядков включения признаков равно M!. Это разные объекты: можно вычислить все значения коалиций один раз и повторно использовать их, не перечисляя все перестановки.",
            "При B фоновых строках наивная маргинальная оценка всех коалиций требует до B·2ᴹ предсказаний отдельных строк. Пакетный вызов predict может обработать много строк сразу, поэтому число строк и число вызовов функции различаются. Кэширование, размер батча и стоимость самого f влияют на память и время.",
            "При M=6 и B=32 это 64·32=2048 строк при прямом алгоритме, даже если некоторые совпадают. При M=20 и том же B — 33 554 432 строки. Это оценка конкретной схемы перебора, а не нижняя граница для всех SHAP-алгоритмов: деревья допускают специализированное динамическое программирование."
          ],
          "growth"
        ],
        [
          "kernel",
          "5. KernelSHAP: взвешенная регрессия",
          [
            "Представим коалицию бинарной маской z∈{0,1}ᴹ: 1 означает сохранить наблюдаемый признак, 0 — заполнить неизвестный по заданному правилу. Каждая маска превращается в строки исходного пространства; выходы f усредняются, получая vₓ(S). Маска не является входной строкой модели.",
            "KernelSHAP подбирает аддитивную модель g(z)=φ₀+Σᵢ φᵢzᵢ, минимизируя взвешенные квадраты ошибок между g(z) и vₓ(S). Для внутренней коалиции размера k (1≤k≤M−1) специальный вес равен π(z)=(M−1)/[C(M,k)·k·(M−k)], где C(M,k) — биномиальный коэффициент. Это не произвольные веса локальной регрессии.",
            "При M=6, k=1 вес 1/6, при k=3 — 1/36. Пустую и полную маски не подставляют в эту дробь: они задают ограничения g(0)=vₓ(∅) и g(1)=f(x). При полном наборе коалиций, точных значениях и подходящем решении без отбора признаков получаем Shapley Values данной игры.",
            "Практический KernelExplainer использует бюджет nsamples и параметр l1_reg для отбора признаков. При ограниченной выборке возможны нестабильность и неполный ранг. В лаборатории мы явно зададим l1_reg=0, сравним меньший бюджет с 62 внутренними коалициями и независимым точным расчётом. Аддитивность сама по себе не гарантирует точность каждого коэффициента."
          ],
          null
        ],
        [
          "tree",
          "6. TreeSHAP: структура деревьев",
          [
            "В дереве предсказание определяется путём от корня к листу. У разных коалиций часть условий пути совпадает. TreeSHAP аккумулирует веса включённых и неизвестных признаков вдоль путей, повторно используя общие вычисления, вместо независимого перебора всех масок.",
            "Специализированные алгоритмы для поддерживаемых деревьев эффективнее прямого перебора; стоимость зависит от числа деревьев, глубины, числа листьев и режима. В interventional варианте время также зависит от размера background data. Точность относится к конкретной игре и поддерживаемому выходу модели, а не к универсальному причинному объяснению.",
            "TreeExplainer с feature_perturbation='interventional' получает явный фон и интегрирует неизвестные признаки по нему. tree_path_dependent использует сохранённые в модели количества обучающих примеров на путях/листьях; это не произвольная оценка истинного условного распределения. auto выбирает режим в зависимости от наличия фона. В экспериментах фиксируйте режим явно.",
            "Поддерживаются многие модели scikit-learn, XGBoost, LightGBM и CatBoost; конкретная комбинация модели, версии и model_output должна быть проверена. Для нашего регрессора raw совпадает с predict. Для классификатора raw, probability и log_loss — разные величины, поэтому нельзя смешивать вклады между ними."
          ],
          "comparison"
        ],
        [
          "strategies",
          "7. Другие стратегии и общий API",
          [
            "Permutation-based оценивание случайно выбирает порядки признаков и усредняет предельные вклады. В паре прямой и обратной перестановок каждый путь телескопически суммируется до разности концов. Чем выше бюджет, тем больше информации о вариативности, но конкретная оценка не обязана монотонно улучшаться.",
            "PermutationExplainer работает с функцией модели и masker, max_evals ограничивает вычисления; фактическое число оценённых строк зависит от фона и повторного использования. Для ограниченного бюджета сравните несколько независимых запусков. DeepExplainer и GradientExplainer ориентированы на поддерживаемые дифференцируемые модели и используют собственные приближения.",
            "shap.Explainer(model, masker, algorithm=...) предоставляет общий интерфейс, а объект Explanation содержит values, base_values и данные. Выбор auto не отменяет проверку выбранного вычислителя и семантики masker. KernelExplainer.shap_values — другой совместимый, но не идентичный API; для нескольких выходов проверяйте форму массива."
          ],
          null
        ],
        [
          "example",
          "8. Контрольная игра и проверка точности",
          [
            "Вернёмся к двум квартирам и f(a,r)=a/10. Обозначим A — площадь, R — комнаты. Для маргинального фона получаем v(∅)=6, v(A)=8, v(R)=6, v(A,R)=8. У двух игроков каждый из двух предельных вкладов имеет вес 1/2: φA=[(8−6)+(8−6)]/2=2; φR=[(6−6)+(8−8)]/2=0.",
            "Условная игра даёт v(∅)=6, v(A)=8, v(R)=8, v(A,R)=8. Теперь φA=φR=1: информация о комнатах указывает на площадь, хотя функция f не использует R. В обоих случаях 6+Σφ=8. Разные атрибуции не противоречат математике; изменилось определение игры.",
            "Эти числа получены вручную из явно заданной учебной игры, а не из библиотеки. В практике независимо переберём коалиции для обученного дерева и фиксированного эмпирического фона. Сверим каждый вклад с эталоном, остаток аддитивности и baseline. Только при общей игре допустима интерпретация расхождения как ошибки вычислителя."
          ],
          null
        ],
        [
          "choice",
          "9. Выбор вычислителя и протокол проверки",
          [
            "Сначала определите вопрос: какую величину и относительно какой популяции объясняете? Для табличных данных выберите допустимое правило неизвестных признаков и проверьте корреляции. Наличие фоновых строк ещё не означает, что они репрезентативны.",
            "Если модель — поддерживаемое дерево и требуемый режим доступен, начните с TreeExplainer. Для произвольной функции предсказания используйте KernelExplainer или PermutationExplainer с подходящим masker/фоном. При малом M посчитайте эталон полным перебором; при большом M задайте бюджет, повторите расчёт и оцените разброс.",
            "Запишите версию библиотек, выход, режим, фон, seed, параметры, время и измеряемую единицу затрат. Проверьте baseline, аддитивность, отсутствие NaN и согласованность формы массива. Для приблизительного метода сравните повторные запуски и разные бюджеты. Если предположения меняются — не выдавайте изменение игры за ошибку алгоритма.",
            "В следующем уроке 10.1.3 перейдём от вычисления к чтению локального объяснения. Пока не делаем вывод о причинном эффекте и не ранжируем глобальную важность по одному объекту."
          ],
          "choice"
        ]
      ],
      "diagrams": {
        "pipeline": {
          "layout": "shap-compute-pipeline",
          "title": "От игры к атрибуциям",
          "description": "Стрелки показывают порядок операций. Первые четыре шага задают значения игры; последние два вычисляют атрибуции.",
          "caption": "Стрелки показывают порядок операций. Первые четыре шага задают значения игры; последние два вычисляют атрибуции.",
          "nodes": [
            {
              "id": "n1",
              "title": "Модель и объект",
              "detail": "Выбрать x и один f(x)."
            },
            {
              "id": "n2",
              "title": "Коалиция S",
              "detail": "Выбрать известные признаки; сформировать маску."
            },
            {
              "id": "n3",
              "title": "Фон и правило",
              "detail": "Задать распределение неизвестных признаков."
            },
            {
              "id": "n4",
              "title": "Оценка vₓ(S)",
              "detail": "Усреднить нужные выходы f; получить baseline для ∅."
            },
            {
              "id": "n5",
              "title": "Вычислитель",
              "detail": "Перебор, регрессия, деревья или перестановки."
            },
            {
              "id": "n6",
              "title": "Атрибуции",
              "detail": "Вернуть φ₀ и φᵢ; проверить сумму."
            }
          ]
        },
        "masking": {
          "layout": "shap-compute-table",
          "title": "Два правила заполнения",
          "description": "Учебный пример: фон (40,1), (80,3); x=(80,3); f(a,r)=a/10. Фиксируем R=3.",
          "caption": "Учебный пример: фон (40,1), (80,3); x=(80,3); f(a,r)=a/10. Фиксируем R=3.",
          "columns": [
            "Правило",
            "Строки (a,r)",
            "Среднее f"
          ],
          "rows": [
            [
              "Исходный фон",
              "(40,1); (80,3)",
              "6"
            ],
            [
              "Маргинальное",
              "(40,3); (80,3)",
              "(4+8)/2 = 6"
            ],
            [
              "Условное",
              "(80,3)",
              "8"
            ]
          ]
        },
        "growth": {
          "layout": "shap-compute-table",
          "title": "Размер пространства перебора",
          "description": "Числа точные: M — признаки, 2ᴹ — подмножества, M! — порядки. Не число вызовов API.",
          "caption": "Числа точные: M — признаки, 2ᴹ — подмножества, M! — порядки. Не число вызовов API.",
          "columns": [
            "M",
            "Коалиции 2ᴹ",
            "Перестановки M!"
          ],
          "rows": [
            [
              "2",
              "4",
              "2"
            ],
            [
              "6",
              "64",
              "720"
            ],
            [
              "10",
              "1024",
              "3628800"
            ],
            [
              "20",
              "1048576",
              "2432902008176640000"
            ]
          ]
        },
        "comparison": {
          "layout": "shap-compute-table",
          "title": "KernelSHAP и TreeSHAP",
          "description": "Сравнение алгоритмов при фиксированной игре; разные режимы могут менять саму игру.",
          "caption": "Сравнение алгоритмов при фиксированной игре; разные режимы могут менять саму игру.",
          "columns": [
            "Критерий",
            "KernelSHAP",
            "TreeSHAP"
          ],
          "rows": [
            [
              "Вход",
              "predict + фон",
              "Дерево; фон по режиму"
            ],
            [
              "Механизм",
              "Взвешенная регрессия по маскам",
              "Динамические вычисления по путям"
            ],
            [
              "Модели",
              "Любая подходящая функция f",
              "Поддерживаемые деревья"
            ],
            [
              "Затраты",
              "Бюджет масок × размер фона",
              "Деревья, листья, глубина, режим"
            ],
            [
              "Ограничения",
              "Семплирование и отбор признаков",
              "Режим, выход и поддержка модели"
            ]
          ]
        },
        "choice": {
          "layout": "shap-compute-choice",
          "title": "Выбрать алгоритм и проверить",
          "description": "Две ветви сходятся к одному протоколу контроля. Без подходящего правила маскирования расчёт откладывается.",
          "caption": "Две ветви сходятся к одному протоколу контроля. Без подходящего правила маскирования расчёт откладывается.",
          "nodes": [
            {
              "id": "n1",
              "title": "Поддерживаемое дерево?",
              "detail": "Сначала выбрать выход и допустимый фон."
            },
            {
              "id": "n2",
              "title": "Да: TreeExplainer",
              "detail": "interventional с фоном или обоснованный tree_path_dependent."
            },
            {
              "id": "n3",
              "title": "Нет: функция f",
              "detail": "Kernel/Permutation; выбрать masker и бюджет. При малом M — полный перебор."
            },
            {
              "id": "n4",
              "title": "Контроль",
              "detail": "Baseline + Σφ, точный эталон при малом M, повторы, версии и режим."
            }
          ]
        }
      },
      "sources": [
        [
          "Lundberg & Lee (2017). A Unified Approach to Interpreting Model Predictions.",
          "https://proceedings.neurips.cc/paper_files/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ],
        [
          "Lundberg et al. (2020). From local explanations to global understanding with explainable AI for trees. Nature Machine Intelligence 2, 56–67.",
          "https://doi.org/10.1038/s42256-019-0138-9"
        ],
        [
          "Aas, Jullum & Løland (2021). Explaining individual predictions when features are dependent. Artificial Intelligence 298, 103502.",
          "https://doi.org/10.1016/j.artint.2021.103502"
        ],
        [
          "SHAP — KernelExplainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.KernelExplainer.html"
        ],
        [
          "SHAP — TreeExplainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.TreeExplainer.html"
        ],
        [
          "SHAP — Explainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.Explainer.html"
        ],
        [
          "SHAP — Independent masker",
          "https://shap.readthedocs.io/en/stable/generated/shap.maskers.Independent.html"
        ],
        [
          "SHAP — PermutationExplainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.PermutationExplainer.html"
        ],
        [
          "scikit-learn — RandomForestRegressor API",
          "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html"
        ],
        [
          "SHAP — release notes",
          "https://shap.readthedocs.io/en/stable/release_notes.html"
        ]
      ],
      "glossary": [
        [
          "Коалиция",
          "Подмножество признаков, известных в данной оценке."
        ],
        [
          "Функция ценности",
          "Правило получения скалярного значения для коалиции."
        ],
        [
          "Фоновые данные",
          "Набор для определения референсного распределения неизвестных признаков."
        ],
        [
          "Базовое значение (baseline)",
          "Значение пустой коалиции в выбранной игре."
        ],
        [
          "Маска",
          "Бинарное представление известных и неизвестных признаков."
        ],
        [
          "Masker",
          "Компонент, определяющий, как скрывать или заменять признаки."
        ],
        [
          "Условное ожидание",
          "Среднее при условии наблюдаемых значений."
        ],
        [
          "Маргинальное ожидание",
          "Усреднение неизвестных компонентов по их фоновому распределению."
        ],
        [
          "KernelSHAP",
          "Взвешенное регрессионное оценивание Shapley Values по маскам."
        ],
        [
          "Ядро SHAP",
          "Специальные веса внутренних коалиций для регрессии."
        ],
        [
          "TreeSHAP",
          "Алгоритмы вычисления вкладов, использующие структуру деревьев."
        ],
        [
          "Tree-path-dependent",
          "Режим, использующий сохранённые количества примеров на путях дерева."
        ],
        [
          "Вычислительный бюджет",
          "Ограничение числа масок, оценок или доступного времени; единицу надо указывать."
        ],
        [
          "Аддитивность",
          "Согласованность baseline и суммы вкладов с выбранным выходом."
        ],
        [
          "Вариативность оценки",
          "Разброс вкладов между повторными запусками при фиксированной игре."
        ]
      ],
      "quiz": [
        [
          "Что задаётся раньше вычислителя?",
          [
            "Игра и скалярный выход",
            "Цвет графика",
            "Количество деревьев всегда равно M"
          ],
          0,
          "Функция ценности задаёт смысл вклада."
        ],
        [
          "Что означает φ₀ в фиксированной игре?",
          [
            "Прогноз любой строки",
            "vₓ(∅)",
            "Средний коэффициент модели"
          ],
          1,
          "Это значение пустой коалиции, а не произвольная константа."
        ],
        [
          "Что сохраняет условное распределение?",
          [
            "Только число колонок",
            "Всегда причинный эффект",
            "Статистическую зависимость от известных значений"
          ],
          2,
          "Условие меняет распределение неизвестных компонентов."
        ],
        [
          "Сколько коалиций при M=6?",
          [
            "64",
            "720",
            "12"
          ],
          0,
          "2⁶=64; 6!=720 — число порядков."
        ],
        [
          "Для M=6 и k=3 чему равен вес ядра?",
          [
            "1/6",
            "1/36",
            "1/20"
          ],
          1,
          "5/(20·3·3)=1/36."
        ],
        [
          "Как обрабатываются крайние маски в KernelSHAP?",
          [
            "Игнорируются",
            "Получают нулевой вес",
            "Задают ограничения на baseline и полный прогноз"
          ],
          2,
          "Формула внутренних весов неприменима при k=0 и k=M."
        ],
        [
          "Почему TreeSHAP может быть быстрее?",
          [
            "Переиспользует структуру путей деревьев",
            "Всегда удаляет половину признаков",
            "Работает без модели"
          ],
          0,
          "Специализация позволяет избежать независимого перебора всех коалиций."
        ],
        [
          "Что означает tree_path_dependent?",
          [
            "Всегда истинное условное распределение",
            "Фон на основе сохранённых счётчиков путей",
            "Любая причинная интервенция"
          ],
          1,
          "Счётчики дерева не заменяют общую модель распределения."
        ],
        [
          "Если baseline + сумма = f(x), что доказано?",
          [
            "Все вклады точны",
            "Причинный эффект найден",
            "Проверена аддитивность выбранного выхода"
          ],
          2,
          "Отдельные вклады могут отличаться от точных даже при совпадении суммы."
        ],
        [
          "Что фиксируем при сравнении вычислителей?",
          [
            "Модель, выход, объект, фон и правило игры",
            "Только цвет темы",
            "Разные функции ценности без пояснения"
          ],
          0,
          "Иначе отличие может объясняться сменой постановки, а не алгоритмом."
        ]
      ],
      "practice": {
        "title": "TreeSHAP и KernelSHAP в одной игре",
        "intro": "Используем Python 3.12, синтетические 600 строк и шесть признаков. Второй признак коррелирует с первым; целевая величина равна 3x₀+2x₂x₃−x₄+шум. Обучаем только на train, фон — 32 строки train, объект — первая строка test. RandomForestRegressor с 20 деревьями глубины не более 4; raw — обычный прогноз регрессии.",
        "task": "Запустите расчёт, сохраните фактические строки отчёта. Сопоставьте два малых бюджета и полный перебор, отдельно сравните время. Не сравнивайте неизвестное внутреннее число оценок TreeSHAP с числом строк KernelExplainer как равные метрики.",
        "steps": [
          "Создайте фон без утечки: train_test_split отделяет test, default_rng и random_state фиксируют генерацию и обучение; choice(..., replace=False) выбирает разные строки.",
          "exact_game перебирает combinations всех размеров; masked[:, list(subset)] заменяет известные колонки на x, mean усредняет предсказания. Словарь frozenset позволяет кэшировать коалиции; факториальный вес распределяет предельный прирост.",
          "TreeExplainer получает тот же фон, явный interventional и raw; result.values[0] — атрибуции одной строки. В KernelExplainer функция counted_predict считает вызовы и строки, identity сохраняет шкалу, l1_reg=0 отключает отбор признаков.",
          "Сравните nsamples=24 с двумя seed и nsamples=62; проверка assert_allclose останавливает скрипт при расхождении точного эталона, TreeSHAP и полного KernelSHAP сверх допуска. Остаток аддитивности, MAE и время печатаются, но ускорение не утверждается заранее.",
          "Эксперимент: измените B с 32 на 16 и снова сравните все методы в новой общей игре. Если нет пакета, проверьте Python и установку; при расхождении сначала проверьте шкалу, фон и параметры, а не увеличивайте допуск без причины."
        ],
        "install": "python -m pip install shap==0.54.1 scikit-learn==1.9.1",
        "run": "python lessons/practice/a-10-1-2-shap-computation.py"
      }
    },
    "en": {
      "title": "How SHAP Works",
      "lead": "From the mathematical definition to computation: define the model game, compare KernelSHAP and TreeSHAP, and check attributions using one background set.",
      "outcomes": [
        "Define the scalar model output, instance, coalition and value function.",
        "Explain background data, the baseline and masking rules.",
        "Distinguish conditional and marginal averaging and their implications.",
        "Calculate coalition and permutation counts and reason about budgets.",
        "Explain KernelSHAP masks, regression, kernel and constraints.",
        "Explain TreeSHAP and distinguish its feature-dependence modes.",
        "Choose an explainer according to model structure and computational cost.",
        "Check the baseline and additivity against a single model output.",
        "Assess accuracy against a fixed game and sensitivity to budget."
      ],
      "sections": [
        [
          "pipeline",
          "1. From Shapley values to a computational problem",
          [
            "In 10.1.1 we allocated v(N) − v(∅) among players. For a model, features are the players, x fixes their observed values, and f(x) is one selected scalar output. A regressor may predict price; for a classifier choose a class and output scale in advance.",
            "The Shapley formula specifies how to average marginal contributions, but not what to do with unknown features. Define the game vₓ(S) before choosing its computational algorithm.",
            "The output is a base value φ₀ and vector φ₁,…,φₘ, not a newly trained model. For exact computation in a consistent game, f(x) = φ₀ + Σᵢ φᵢ, with φ₀ = vₓ(∅). Approximate algorithms can enforce that equality even if individual attributions are inaccurate."
          ],
          "pipeline"
        ],
        [
          "game",
          "2. Defining the model game",
          [
            "Let N be the M features, S ⊆ N the known features, and ¬S its complement. xₛ denotes the observed components. Let X denote a random background instance; its distribution defines the reference population.",
            "For example, a marginal game uses vₓ(S) = E[f(xₛ, X¬ₛ)]. With B background rows this is the average of B predictions obtained by filling hidden components from background rows. The empty coalition gives mean f(X); the full coalition gives f(x).",
            "Background data need not be the entire training set. A segment-specific background and a population-wide background may yield different base values and attributions. Compare algorithms using the same model, instance, scale and background; change the game explicitly when studying semantics.",
            "Masking is a rule for evaluating a conditional or marginal expectation, not deleting a column from a trained model. Zero filling is valid only as an intentionally defined separate game."
          ],
          null
        ],
        [
          "dependence",
          "3. Conditional and marginal averaging",
          [
            "A conditional game uses vₓ(S) = E[f(X) | Xₛ = xₛ]. Hidden features follow their distribution conditional on observed ones. For continuous variables, estimate or model that conditional distribution; exact row matching generally does not work.",
            "Consider an illustrative background of two equally likely apartments: (area, rooms) = (40, 1) and (80, 3). Explain x = (80, 3) with toy model f(a,r)=a/10, which uses area only. Output units are arbitrary. Keeping three rooms, marginal filling creates (40,3) and (80,3), giving (4+8)/2=6; conditional filling on this discrete background retains (80,3), giving 8.",
            "Marginal filling draws the missing components jointly from a background row but breaks dependence between the observed S and hidden ¬S. The conditional game preserves statistical dependence and may attribute value to a proxy that the model does not directly use. These are different questions, not merely different speeds.",
            "The API term interventional names a specific background-integration mode in TreeExplainer. Arbitrary marginal masking is not proof of a causal intervention; causal conclusions require justified causal assumptions."
          ],
          "masking"
        ],
        [
          "cost",
          "4. Why exact enumeration is expensive",
          [
            "For M features there are 2ᴹ distinct coalitions including empty and full, but M! orders of feature entry. They are different objects: coalition values can be computed once and reused without enumerating all permutations.",
            "With B background rows, naive evaluation of all marginal coalitions uses up to B·2ᴹ row predictions. Batched predict calls can evaluate many rows, so row count and function-call count are distinct. Caching, batch size and the cost of f affect memory and runtime.",
            "At M=6 and B=32, direct enumeration evaluates 64·32=2048 rows, even if some are duplicates. At M=20 with the same B, it evaluates 33,554,432 rows. This describes a particular enumeration scheme, not a lower bound for all SHAP algorithms: trees admit specialized dynamic programming."
          ],
          "growth"
        ],
        [
          "kernel",
          "5. KernelSHAP: weighted regression",
          [
            "Represent a coalition by binary mask z∈{0,1}ᴹ: 1 keeps the observed feature, 0 fills it by the chosen rule. Each mask maps to rows in the original space; predictions are averaged to estimate vₓ(S). The mask itself is not the model input.",
            "KernelSHAP fits additive g(z)=φ₀+Σᵢ φᵢzᵢ by minimizing weighted squared errors between g(z) and vₓ(S). For an interior coalition of size k (1≤k≤M−1), its special weight is π(z)=(M−1)/[C(M,k)·k·(M−k)], where C(M,k) is a binomial coefficient. These are not arbitrary regression weights.",
            "For M=6, k=1 has weight 1/6 and k=3 has weight 1/36. Do not substitute empty/full masks into the fraction: they impose g(0)=vₓ(∅) and g(1)=f(x). Complete coalitions, accurate game values and an appropriate unregularized solution recover that game's Shapley values.",
            "KernelExplainer uses nsamples and l1_reg for feature selection. Limited samples may produce instability or rank deficiency. The lab explicitly sets l1_reg=0, compares a smaller budget with all 62 interior coalitions and an independent exact calculation. Additivity alone does not establish each coefficient's accuracy."
          ],
          null
        ],
        [
          "tree",
          "6. TreeSHAP: exploiting tree structure",
          [
            "A tree predicts via a path from root to leaf. Different coalitions share some path conditions. TreeSHAP accumulates weights for observed and unknown features along paths and reuses computations instead of independently evaluating every mask.",
            "Specialized algorithms for supported trees are more efficient than naive enumeration; cost depends on tree count, depth, leaves and mode. Interventional runtime also depends on the background size. Exactness concerns a particular game and supported model output, not universal causal explanation.",
            "TreeExplainer with feature_perturbation='interventional' uses an explicit background. tree_path_dependent uses training sample counts recorded along paths/leaves; this is not a general estimator of the true conditional distribution. auto selects a mode based on whether background is supplied. Specify the mode explicitly in experiments.",
            "Many scikit-learn, XGBoost, LightGBM and CatBoost tree models are supported; verify the specific model, version and model_output. For our regressor raw corresponds to predict. For classifiers raw, probability and log_loss are distinct targets, so do not mix attributions across them."
          ],
          "comparison"
        ],
        [
          "strategies",
          "7. Other strategies and the common API",
          [
            "Permutation-based estimation samples feature orders and averages marginal contributions. Forward and reverse orders telescope to the endpoint difference. More budget provides more information about variability, but an individual estimate need not improve monotonically.",
            "PermutationExplainer works with a model function and masker; max_evals limits computation, while evaluated rows depend on background and reuse. Compare independent runs under limited budgets. DeepExplainer and GradientExplainer target supported differentiable models and use their own approximations.",
            "shap.Explainer(model, masker, algorithm=...) provides a common interface, and Explanation contains values, base_values and data. auto does not remove the need to inspect the selected explainer and masker semantics. KernelExplainer.shap_values is a related but distinct API; check array shapes for multiple outputs."
          ],
          null
        ],
        [
          "example",
          "8. A control game and accuracy checks",
          [
            "Return to the two apartments and f(a,r)=a/10. Let A be area and R rooms. Marginal background yields v(∅)=6, v(A)=8, v(R)=6, v(A,R)=8. With two players, each of the two marginal contributions has weight 1/2: φA=[(8−6)+(8−6)]/2=2; φR=[(6−6)+(8−8)]/2=0.",
            "The conditional game yields v(∅)=6, v(A)=8, v(R)=8, v(A,R)=8. Now φA=φR=1: room information identifies area even though f does not use R. Both satisfy 6+Σφ=8. Different attributions do not contradict the mathematics; the game definition changed.",
            "These numbers come from an explicit toy game, not library output. In the lab, independently enumerate coalitions for a trained tree ensemble and fixed empirical background. Compare each attribution with the reference, the additivity residual and the baseline. Only under a common game can discrepancies be interpreted as computational error."
          ],
          null
        ],
        [
          "choice",
          "9. Choosing an explainer and a verification protocol",
          [
            "First define the question: what output is explained relative to which population? For tabular data choose a defensible hidden-feature rule and inspect dependencies. Having background rows does not guarantee representativeness.",
            "If the model is a supported tree and the required mode is available, start with TreeExplainer. For an arbitrary prediction function use KernelExplainer or PermutationExplainer with an appropriate masker/background. For small M compute an enumeration reference; for large M set a budget, repeat and assess variability.",
            "Record library versions, output, mode, background, seed, settings, time and the measured unit of cost. Check the baseline, additivity, finite values and array shape. Compare repetitions and budgets for approximation. If assumptions change, do not present a changed game as an algorithm error.",
            "In 10.1.3 we move from computation to reading a local explanation. For now, do not infer causal effects or rank global importance from one instance."
          ],
          "choice"
        ]
      ],
      "diagrams": {
        "pipeline": {
          "layout": "shap-compute-pipeline",
          "title": "From game to attributions",
          "description": "Arrows show execution order. The first four steps define/evaluate the game; the last two compute attributions.",
          "caption": "Arrows show execution order. The first four steps define/evaluate the game; the last two compute attributions.",
          "nodes": [
            {
              "id": "n1",
              "title": "Model and instance",
              "detail": "Select x and one f(x)."
            },
            {
              "id": "n2",
              "title": "Coalition S",
              "detail": "Select observed features; form the mask."
            },
            {
              "id": "n3",
              "title": "Background and rule",
              "detail": "Define the missing-feature distribution."
            },
            {
              "id": "n4",
              "title": "Evaluate vₓ(S)",
              "detail": "Average relevant outputs of f; get the baseline for ∅."
            },
            {
              "id": "n5",
              "title": "Explainer",
              "detail": "Enumeration, regression, trees or permutations."
            },
            {
              "id": "n6",
              "title": "Attributions",
              "detail": "Return φ₀ and φᵢ; check the sum."
            }
          ]
        },
        "masking": {
          "layout": "shap-compute-table",
          "title": "Two masking rules",
          "description": "Toy example: background (40,1), (80,3); x=(80,3); f(a,r)=a/10. Keep R=3.",
          "caption": "Toy example: background (40,1), (80,3); x=(80,3); f(a,r)=a/10. Keep R=3.",
          "columns": [
            "Rule",
            "Rows (a,r)",
            "Mean f"
          ],
          "rows": [
            [
              "Original background",
              "(40,1); (80,3)",
              "6"
            ],
            [
              "Marginal",
              "(40,3); (80,3)",
              "(4+8)/2 = 6"
            ],
            [
              "Conditional",
              "(80,3)",
              "8"
            ]
          ]
        },
        "growth": {
          "layout": "shap-compute-table",
          "title": "Enumeration space",
          "description": "Exact counts: M features, 2ᴹ subsets, M! orders. Not API call counts.",
          "caption": "Exact counts: M features, 2ᴹ subsets, M! orders. Not API call counts.",
          "columns": [
            "M",
            "Coalitions 2ᴹ",
            "Orders M!"
          ],
          "rows": [
            [
              "2",
              "4",
              "2"
            ],
            [
              "6",
              "64",
              "720"
            ],
            [
              "10",
              "1024",
              "3628800"
            ],
            [
              "20",
              "1048576",
              "2432902008176640000"
            ]
          ]
        },
        "comparison": {
          "layout": "shap-compute-table",
          "title": "KernelSHAP and TreeSHAP",
          "description": "Comparison of algorithms under a fixed game; different modes may change the game.",
          "caption": "Comparison of algorithms under a fixed game; different modes may change the game.",
          "columns": [
            "Criterion",
            "KernelSHAP",
            "TreeSHAP"
          ],
          "rows": [
            [
              "Input",
              "predict + background",
              "Tree; mode-specific background"
            ],
            [
              "Mechanism",
              "Weighted mask regression",
              "Dynamic path computation"
            ],
            [
              "Models",
              "Any suitable callable f",
              "Supported tree models"
            ],
            [
              "Cost",
              "Mask budget × background size",
              "Trees, leaves, depth, mode"
            ],
            [
              "Limits",
              "Sampling and feature selection",
              "Mode, output and model support"
            ]
          ]
        },
        "choice": {
          "layout": "shap-compute-choice",
          "title": "Choose and verify",
          "description": "Both branches join a common verification protocol. Stop if no defensible masking rule is available.",
          "caption": "Both branches join a common verification protocol. Stop if no defensible masking rule is available.",
          "nodes": [
            {
              "id": "n1",
              "title": "Supported tree model?",
              "detail": "First choose output and defensible background."
            },
            {
              "id": "n2",
              "title": "Yes: TreeExplainer",
              "detail": "interventional with background or justified tree_path_dependent."
            },
            {
              "id": "n3",
              "title": "No: callable f",
              "detail": "Kernel/Permutation; choose masker and budget. Small M: enumerate."
            },
            {
              "id": "n4",
              "title": "Verification",
              "detail": "Baseline + Σφ, exact reference for small M, repetitions, versions and mode."
            }
          ]
        }
      },
      "sources": [
        [
          "Lundberg & Lee (2017). A Unified Approach to Interpreting Model Predictions.",
          "https://proceedings.neurips.cc/paper_files/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ],
        [
          "Lundberg et al. (2020). From local explanations to global understanding with explainable AI for trees. Nature Machine Intelligence 2, 56–67.",
          "https://doi.org/10.1038/s42256-019-0138-9"
        ],
        [
          "Aas, Jullum & Løland (2021). Explaining individual predictions when features are dependent. Artificial Intelligence 298, 103502.",
          "https://doi.org/10.1016/j.artint.2021.103502"
        ],
        [
          "SHAP — KernelExplainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.KernelExplainer.html"
        ],
        [
          "SHAP — TreeExplainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.TreeExplainer.html"
        ],
        [
          "SHAP — Explainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.Explainer.html"
        ],
        [
          "SHAP — Independent masker",
          "https://shap.readthedocs.io/en/stable/generated/shap.maskers.Independent.html"
        ],
        [
          "SHAP — PermutationExplainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.PermutationExplainer.html"
        ],
        [
          "scikit-learn — RandomForestRegressor API",
          "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html"
        ],
        [
          "SHAP — release notes",
          "https://shap.readthedocs.io/en/stable/release_notes.html"
        ]
      ],
      "glossary": [
        [
          "Coalition",
          "Subset of features treated as observed in a particular evaluation."
        ],
        [
          "Value function",
          "Rule assigning a scalar value to each coalition."
        ],
        [
          "Background data",
          "Data defining a reference distribution for hidden features."
        ],
        [
          "Baseline",
          "Empty-coalition value in the chosen game."
        ],
        [
          "Mask",
          "Binary representation of observed and hidden features."
        ],
        [
          "Masker",
          "Component defining how features are hidden or replaced."
        ],
        [
          "Conditional expectation",
          "Average conditional on observed values."
        ],
        [
          "Marginal expectation",
          "Average over the background distribution of missing components."
        ],
        [
          "KernelSHAP",
          "Weighted regression estimation of Shapley values from masks."
        ],
        [
          "SHAP kernel",
          "Special weights for interior coalitions in regression."
        ],
        [
          "TreeSHAP",
          "Attribution algorithms that exploit tree structure."
        ],
        [
          "Tree-path-dependent",
          "Mode using recorded training sample counts along tree paths."
        ],
        [
          "Computational budget",
          "Limit on masks, evaluations or time; specify the unit."
        ],
        [
          "Additivity",
          "Agreement of the baseline plus attribution sum with the selected output."
        ],
        [
          "Estimation variability",
          "Variation in attributions across repetitions under a fixed game."
        ]
      ],
      "quiz": [
        [
          "What is defined before the explainer?",
          [
            "Game and scalar output",
            "Plot color",
            "Tree count always equals M"
          ],
          0,
          "The value function defines attribution semantics."
        ],
        [
          "What is φ₀ in a fixed game?",
          [
            "Prediction of any row",
            "vₓ(∅)",
            "Mean model coefficient"
          ],
          1,
          "It is the empty-coalition value, not an arbitrary constant."
        ],
        [
          "What does conditional sampling preserve?",
          [
            "Only column count",
            "Always causal effect",
            "Statistical dependence on observed values"
          ],
          2,
          "Conditioning changes the distribution of hidden components."
        ],
        [
          "How many coalitions for M=6?",
          [
            "64",
            "720",
            "12"
          ],
          0,
          "2⁶=64; 6!=720 is the number of orders."
        ],
        [
          "What is the kernel weight for M=6 and k=3?",
          [
            "1/6",
            "1/36",
            "1/20"
          ],
          1,
          "5/(20·3·3)=1/36."
        ],
        [
          "How are endpoint masks handled in KernelSHAP?",
          [
            "Ignored",
            "Assigned zero weight",
            "Constrain baseline and full prediction"
          ],
          2,
          "The interior-weight formula does not apply at k=0 or k=M."
        ],
        [
          "Why can TreeSHAP be faster?",
          [
            "Reuses tree-path structure",
            "Always drops half the features",
            "Works without a model"
          ],
          0,
          "Specialization avoids independent enumeration of all coalitions."
        ],
        [
          "What does tree_path_dependent mean?",
          [
            "Always the true conditional distribution",
            "Background based on recorded path counts",
            "Any causal intervention"
          ],
          1,
          "Tree counts are not a general distribution model."
        ],
        [
          "If baseline + sum = f(x), what is established?",
          [
            "All attributions are exact",
            "A causal effect was found",
            "Additivity for the selected output was checked"
          ],
          2,
          "Individual attributions can differ from exact values even when sums agree."
        ],
        [
          "What must be fixed when comparing algorithms?",
          [
            "Model, output, instance, background and game rule",
            "Only theme color",
            "Different value functions without explanation"
          ],
          0,
          "Otherwise a difference may reflect a changed game rather than computation."
        ]
      ],
      "practice": {
        "title": "TreeSHAP and KernelSHAP in the same game",
        "intro": "Use Python 3.12, 600 synthetic rows and six features. The second feature correlates with the first; target = 3x₀+2x₂x₃−x₄+noise. Train only on train, background = 32 training rows, instance = first test row. RandomForestRegressor has 20 trees of maximum depth 4; raw is the regression prediction.",
        "task": "Run the calculation and save actual report lines. Compare the two low-budget repetitions and full enumeration; compare timing separately. Do not equate unknown internal TreeSHAP evaluations with KernelExplainer row counts.",
        "steps": [
          "Create a leakage-free background: train_test_split separates test, default_rng and random_state control generation and training; choice(..., replace=False) selects distinct rows.",
          "exact_game enumerates combinations of all sizes; masked[:, list(subset)] fixes observed columns to x, mean averages predictions. frozenset dictionary keys cache coalitions; factorial weights allocate marginal gains.",
          "TreeExplainer gets the same background, explicit interventional and raw; result.values[0] holds one row's attributions. KernelExplainer uses counted_predict to count calls and rows, identity preserves scale, l1_reg=0 disables feature selection.",
          "Compare nsamples=24 with two seeds and nsamples=62; assert_allclose stops the script if the exact reference, TreeSHAP or full KernelSHAP disagree beyond tolerance. Additivity residual, MAE and timing are printed, not predetermined.",
          "Experiment: change B from 32 to 16 and compare all methods again in the new common game. If imports fail, check Python and installation; on discrepancies, inspect scale, background and settings before changing tolerances."
        ],
        "install": "python -m pip install shap==0.54.1 scikit-learn==1.9.1",
        "run": "python lessons/practice/a-10-1-2-shap-computation.py"
      }
    },
    "zh": {
      "title": "SHAP 的工作原理",
      "lead": "从数学定义走向计算：为模型定义博弈，比较 KernelSHAP 与 TreeSHAP，并在同一背景数据集上检验归因。",
      "outcomes": [
        "定义模型标量输出、待解释样本、联盟和价值函数。",
        "解释背景数据、基线和掩码规则的作用。",
        "区分条件平均与边际平均及其影响。",
        "计算联盟数与排列数并评估计算预算。",
        "解释 KernelSHAP 的掩码、回归、核函数与约束。",
        "解释 TreeSHAP 并区分特征依赖处理模式。",
        "根据模型结构与计算成本选择解释器。",
        "根据同一模型输出核对基线与可加性。",
        "在固定博弈下评估准确性及预算敏感性。"
      ],
      "sections": [
        [
          "pipeline",
          "1. 从 Shapley 值到计算问题",
          [
            "在 10.1.1 中，我们将 v(N) − v(∅) 分配给各参与者。对模型而言，特征是参与者，x 给出其观测值，f(x) 是选定的标量输出。例如回归器可预测价格；分类器则须预先指定类别和输出尺度。",
            "Shapley 公式规定如何平均边际贡献，却不决定如何处理未知特征。必须先定义博弈 vₓ(S)，再选择计算算法。",
            "输出是基线 φ₀ 和向量 φ₁,…,φₘ，而非重新训练的模型。在一致博弈中精确计算满足 f(x) = φ₀ + Σᵢ φᵢ，其中 φ₀ = vₓ(∅)。近似算法可以通过约束保证等式成立，即使单个归因仍不准确。"
          ],
          "pipeline"
        ],
        [
          "game",
          "2. 如何定义模型博弈",
          [
            "令 N 为 M 个特征的集合，S ⊆ N 为已知特征，¬S 为补集。xₛ 表示样本的观测分量。令 X 为随机背景样本，其分布决定预测所参照的总体。",
            "例如，边际博弈定义 vₓ(S) = E[f(xₛ, X¬ₛ)]。当背景集含 B 行时，它是用背景行填补未知分量后 B 次预测的平均值。空联盟给出 f(X) 的均值，完整联盟给出 f(x)。",
            "背景数据不必包含整个训练集。某个群体的背景与全体总体背景可能产生不同基线和归因。比较计算器时固定模型、样本、尺度和背景；研究语义时明确改变博弈定义。",
            "掩码表示计算条件或边际期望的规则，并非从已训练模型删除一列。填零只能作为有意定义的另一种博弈。"
          ],
          null
        ],
        [
          "dependence",
          "3. 条件平均与边际平均",
          [
            "条件博弈定义 vₓ(S) = E[f(X) | Xₛ = xₛ]。隐藏特征服从以观测特征为条件的分布。对连续变量通常需要估计或建模该分布，而不能简单精确匹配数据行。",
            "考虑两个等概率教学背景样本：(面积, 房间数) = (40, 1) 和 (80, 3)。解释 x = (80, 3)，玩具模型 f(a,r)=a/10 仅使用面积，输出为任意单位。固定房间数为 3：边际填补得到 (40,3) 与 (80,3)，均值 (4+8)/2=6；在该离散背景下条件填补仅保留 (80,3)，结果为 8。",
            "边际填补从同一背景行联合抽取未知分量，却打破已知 S 与未知 ¬S 之间的依赖。条件博弈保留统计依赖，因此可能给模型未直接使用的代理特征分配贡献。这是不同的问题，而非仅有速度差异。",
            "TreeExplainer API 中 interventional 指特定的背景积分模式。任意边际掩码并不证明因果干预；因果推论需要有依据的因果假设。"
          ],
          "masking"
        ],
        [
          "cost",
          "4. 为什么精确枚举成本高",
          [
            "M 个特征共有 2ᴹ 个不同联盟（含空集和全集），而加入顺序有 M! 种。两者不同：可只计算一次各联盟价值并复用，无需枚举所有排列。",
            "若有 B 行背景，朴素枚举边际联盟最多需要 B·2ᴹ 次行级预测。批量 predict 调用可处理多行，因此预测行数与函数调用次数不同。缓存、批大小及 f 的计算成本影响内存和耗时。",
            "当 M=6、B=32 时，直接枚举评估 64·32=2048 行，即使其中有重复。当 M=20 且 B 不变时需 33,554,432 行。这是特定枚举方案的成本，而非所有 SHAP 算法的下界：树模型可利用专门的动态规划。"
          ],
          "growth"
        ],
        [
          "kernel",
          "5. KernelSHAP：加权回归",
          [
            "用二进制掩码 z∈{0,1}ᴹ 表示联盟：1 保留观测特征，0 按规则填补未知特征。每个掩码映射到原始特征空间中的若干行；平均预测得到 vₓ(S)。掩码本身不是模型输入。",
            "KernelSHAP 通过最小化 g(z) 与 vₓ(S) 的加权平方误差拟合加性模型 g(z)=φ₀+Σᵢ φᵢzᵢ。对大小为 k（1≤k≤M−1）的内部联盟，专用权重 π(z)=(M−1)/[C(M,k)·k·(M−k)]，其中 C(M,k) 为二项式系数。它不是任意回归权重。",
            "当 M=6 时，k=1 权重为 1/6，k=3 权重为 1/36。空和完整掩码不能代入分式，而是施加 g(0)=vₓ(∅) 与 g(1)=f(x) 约束。使用全部联盟、准确价值与适当无特征筛选的求解时，可恢复该博弈的 Shapley 值。",
            "实际 KernelExplainer 使用 nsamples 和 l1_reg 控制预算及特征筛选。有限样本可能导致不稳定或秩不足。实验明确设置 l1_reg=0，将较小预算与全部 62 个内部联盟及独立精确计算比较。可加性本身不能保证每个系数准确。"
          ],
          null
        ],
        [
          "tree",
          "6. TreeSHAP：利用树结构",
          [
            "树模型通过从根节点到叶节点的路径预测。不同联盟共享部分路径条件。TreeSHAP 沿路径累积已知与未知特征的权重，复用计算，而不独立枚举所有掩码。",
            "针对受支持树模型的专用算法比朴素枚举更有效；成本取决于树数量、深度、叶节点及模式。interventional 模式的耗时还取决于背景大小。精确性针对特定博弈和受支持模型输出，而非普遍因果解释。",
            "TreeExplainer 的 feature_perturbation='interventional' 使用显式背景；tree_path_dependent 使用模型中保存的路径或叶节点训练样本计数，而非任意真实条件分布估计。auto 根据是否提供背景选择模式。实验中应明确指定模式。",
            "许多 scikit-learn、XGBoost、LightGBM 和 CatBoost 树模型受支持；须核实具体模型、版本和 model_output。对于本实验回归器，raw 对应 predict。分类器的 raw、probability 和 log_loss 是不同目标，不能混合归因。"
          ],
          "comparison"
        ],
        [
          "strategies",
          "7. 其他策略与统一 API",
          [
            "基于排列的估计抽取特征顺序并平均边际贡献。正向和反向顺序的贡献都望远镜求和为端点差值。增加预算有助于了解变异性，但单次估计不一定单调改善。",
            "PermutationExplainer 使用模型函数和 masker；max_evals 限制计算量，实际预测行数取决于背景及复用。预算有限时比较独立重复运行。DeepExplainer 与 GradientExplainer 面向受支持的可微模型，采用各自近似方法。",
            "shap.Explainer(model, masker, algorithm=...) 提供统一接口，Explanation 包含 values、base_values 与数据。auto 并不免除核查实际解释器和 masker 语义。KernelExplainer.shap_values 是相关但不同的 API；多输出时须检查数组形状。"
          ],
          null
        ],
        [
          "example",
          "8. 对照博弈与准确性检查",
          [
            "回到两个公寓与 f(a,r)=a/10。A 表示面积，R 表示房间数。边际背景下 v(∅)=6、v(A)=8、v(R)=6、v(A,R)=8。两个参与者的两个边际贡献均权重 1/2：φA=[(8−6)+(8−6)]/2=2；φR=[(6−6)+(8−8)]/2=0。",
            "条件博弈下 v(∅)=6、v(A)=8、v(R)=8、v(A,R)=8。此时 φA=φR=1：房间信息指向面积，即使 f 不使用 R。两者均满足 6+Σφ=8。不同归因并不违背数学，因为博弈定义发生了变化。",
            "这些数字来自显式教学博弈的手算，而非库输出。实验中将独立枚举训练好的树集成模型及固定经验背景的联盟，比较每个归因与基准、可加性残差及基线。仅在相同博弈下才能将差异解释为计算误差。"
          ],
          null
        ],
        [
          "choice",
          "9. 选择计算器与验证流程",
          [
            "首先明确问题：相对于哪个总体解释哪个输出？对于表格数据，选择合理的未知特征规则并检查依赖关系。有背景行不代表它们有代表性。",
            "若模型为受支持树且所需模式可用，优先尝试 TreeExplainer。对于任意预测函数，使用具有合适 masker/背景的 KernelExplainer 或 PermutationExplainer。M 较小时枚举计算基准；M 较大时设定预算、重复计算并评估变异性。",
            "记录库版本、输出、模式、背景、seed、参数、耗时与成本计量单位。检查基线、可加性、有限值及数组形状。近似方法应比较多次运行与不同预算。若假设变化，不要把博弈变化当成算法错误。",
            "在 10.1.3 中将从计算转向阅读局部解释。当前不要推断因果效应，也不要用单个样本排列全局重要性。"
          ],
          "choice"
        ]
      ],
      "diagrams": {
        "pipeline": {
          "layout": "shap-compute-pipeline",
          "title": "从博弈到归因",
          "description": "箭头表示操作顺序。前四步定义并计算博弈价值，后两步计算归因。",
          "caption": "箭头表示操作顺序。前四步定义并计算博弈价值，后两步计算归因。",
          "nodes": [
            {
              "id": "n1",
              "title": "模型与样本",
              "detail": "选择 x 与一个 f(x)。"
            },
            {
              "id": "n2",
              "title": "联盟 S",
              "detail": "选择已知特征，生成掩码。"
            },
            {
              "id": "n3",
              "title": "背景与规则",
              "detail": "定义未知特征分布。"
            },
            {
              "id": "n4",
              "title": "计算 vₓ(S)",
              "detail": "平均相关 f 输出，得到空联盟基线。"
            },
            {
              "id": "n5",
              "title": "计算器",
              "detail": "枚举、回归、树或排列。"
            },
            {
              "id": "n6",
              "title": "归因",
              "detail": "返回 φ₀ 与 φᵢ，检查总和。"
            }
          ]
        },
        "masking": {
          "layout": "shap-compute-table",
          "title": "两种填补规则",
          "description": "教学示例：背景 (40,1)、(80,3)；x=(80,3)；f(a,r)=a/10。固定 R=3。",
          "caption": "教学示例：背景 (40,1)、(80,3)；x=(80,3)；f(a,r)=a/10。固定 R=3。",
          "columns": [
            "规则",
            "行 (a,r)",
            "f 均值"
          ],
          "rows": [
            [
              "原始背景",
              "(40,1); (80,3)",
              "6"
            ],
            [
              "边际",
              "(40,3); (80,3)",
              "(4+8)/2 = 6"
            ],
            [
              "条件",
              "(80,3)",
              "8"
            ]
          ]
        },
        "growth": {
          "layout": "shap-compute-table",
          "title": "枚举空间",
          "description": "精确计数：M 为特征数，2ᴹ 为子集数，M! 为顺序数。并非 API 调用数。",
          "caption": "精确计数：M 为特征数，2ᴹ 为子集数，M! 为顺序数。并非 API 调用数。",
          "columns": [
            "M",
            "联盟 2ᴹ",
            "排列 M!"
          ],
          "rows": [
            [
              "2",
              "4",
              "2"
            ],
            [
              "6",
              "64",
              "720"
            ],
            [
              "10",
              "1024",
              "3628800"
            ],
            [
              "20",
              "1048576",
              "2432902008176640000"
            ]
          ]
        },
        "comparison": {
          "layout": "shap-compute-table",
          "title": "KernelSHAP 与 TreeSHAP",
          "description": "在固定博弈下比较算法；不同模式可能改变博弈本身。",
          "caption": "在固定博弈下比较算法；不同模式可能改变博弈本身。",
          "columns": [
            "标准",
            "KernelSHAP",
            "TreeSHAP"
          ],
          "rows": [
            [
              "输入",
              "predict + 背景",
              "树；按模式使用背景"
            ],
            [
              "机制",
              "掩码加权回归",
              "路径动态计算"
            ],
            [
              "模型",
              "任意合适可调用 f",
              "受支持的树模型"
            ],
            [
              "成本",
              "掩码预算 × 背景大小",
              "树、叶、深度、模式"
            ],
            [
              "限制",
              "抽样和特征筛选",
              "模式、输出与模型支持"
            ]
          ]
        },
        "choice": {
          "layout": "shap-compute-choice",
          "title": "选择算法并验证",
          "description": "两条分支汇入同一验证流程。若无合理掩码规则，应暂缓计算。",
          "caption": "两条分支汇入同一验证流程。若无合理掩码规则，应暂缓计算。",
          "nodes": [
            {
              "id": "n1",
              "title": "受支持的树模型？",
              "detail": "先选输出和合理背景。"
            },
            {
              "id": "n2",
              "title": "是：TreeExplainer",
              "detail": "有背景用 interventional，或合理使用 tree_path_dependent。"
            },
            {
              "id": "n3",
              "title": "否：函数 f",
              "detail": "Kernel/Permutation；选择掩码器和预算。M 小时枚举。"
            },
            {
              "id": "n4",
              "title": "验证",
              "detail": "基线 + Σφ；M 小时精确基准；重复、版本与模式。"
            }
          ]
        }
      },
      "sources": [
        [
          "Lundberg & Lee (2017). A Unified Approach to Interpreting Model Predictions.",
          "https://proceedings.neurips.cc/paper_files/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ],
        [
          "Lundberg et al. (2020). From local explanations to global understanding with explainable AI for trees. Nature Machine Intelligence 2, 56–67.",
          "https://doi.org/10.1038/s42256-019-0138-9"
        ],
        [
          "Aas, Jullum & Løland (2021). Explaining individual predictions when features are dependent. Artificial Intelligence 298, 103502.",
          "https://doi.org/10.1016/j.artint.2021.103502"
        ],
        [
          "SHAP — KernelExplainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.KernelExplainer.html"
        ],
        [
          "SHAP — TreeExplainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.TreeExplainer.html"
        ],
        [
          "SHAP — Explainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.Explainer.html"
        ],
        [
          "SHAP — Independent masker",
          "https://shap.readthedocs.io/en/stable/generated/shap.maskers.Independent.html"
        ],
        [
          "SHAP — PermutationExplainer API",
          "https://shap.readthedocs.io/en/stable/generated/shap.PermutationExplainer.html"
        ],
        [
          "scikit-learn — RandomForestRegressor API",
          "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html"
        ],
        [
          "SHAP — release notes",
          "https://shap.readthedocs.io/en/stable/release_notes.html"
        ]
      ],
      "glossary": [
        [
          "联盟",
          "在某次评估中视为已观测的特征子集。"
        ],
        [
          "价值函数",
          "为每个联盟分配标量值的规则。"
        ],
        [
          "背景数据",
          "定义未知特征参考分布的数据。"
        ],
        [
          "基线",
          "所选博弈中空联盟的价值。"
        ],
        [
          "掩码",
          "已知与未知特征的二进制表示。"
        ],
        [
          "掩码器",
          "定义如何隐藏或替换特征的组件。"
        ],
        [
          "条件期望",
          "以已观测值为条件的平均。"
        ],
        [
          "边际期望",
          "对未知分量的背景分布进行平均。"
        ],
        [
          "KernelSHAP",
          "根据掩码用加权回归估计 Shapley 值。"
        ],
        [
          "SHAP 核函数",
          "回归中内部联盟的专用权重。"
        ],
        [
          "TreeSHAP",
          "利用树结构的归因算法。"
        ],
        [
          "树路径依赖模式",
          "使用树路径中记录的训练样本计数的模式。"
        ],
        [
          "计算预算",
          "对掩码、评估或时间的限制；须明确计量单位。"
        ],
        [
          "可加性",
          "基线与归因之和同选定输出的一致性。"
        ],
        [
          "估计变异性",
          "固定博弈下重复运行的归因波动。"
        ]
      ],
      "quiz": [
        [
          "选择解释器之前先定义什么？",
          [
            "博弈与标量输出",
            "图表颜色",
            "树数量恒等于 M"
          ],
          0,
          "价值函数决定归因语义。"
        ],
        [
          "固定博弈中的 φ₀ 是什么？",
          [
            "任意行预测",
            "vₓ(∅)",
            "模型平均系数"
          ],
          1,
          "它是空联盟价值，而非任意常数。"
        ],
        [
          "条件抽样保留什么？",
          [
            "仅列数",
            "始终是因果效应",
            "对已知值的统计依赖"
          ],
          2,
          "条件改变未知分量的分布。"
        ],
        [
          "M=6 时有多少联盟？",
          [
            "64",
            "720",
            "12"
          ],
          0,
          "2⁶=64；6!=720 是排列数。"
        ],
        [
          "M=6、k=3 时核权重是多少？",
          [
            "1/6",
            "1/36",
            "1/20"
          ],
          1,
          "5/(20·3·3)=1/36。"
        ],
        [
          "KernelSHAP 如何处理端点掩码？",
          [
            "忽略",
            "权重为零",
            "约束基线和完整预测"
          ],
          2,
          "内部权重公式不适用于 k=0 或 k=M。"
        ],
        [
          "为什么 TreeSHAP 可能更快？",
          [
            "复用树路径结构",
            "总是删除一半特征",
            "无需模型"
          ],
          0,
          "专用算法避免独立枚举所有联盟。"
        ],
        [
          "tree_path_dependent 表示什么？",
          [
            "始终为真实条件分布",
            "基于记录的路径计数的背景",
            "任意因果干预"
          ],
          1,
          "树计数不能替代一般分布模型。"
        ],
        [
          "若基线加总和等于 f(x)，证明了什么？",
          [
            "所有归因精确",
            "已找到因果效应",
            "验证了选定输出的可加性"
          ],
          2,
          "即使总和一致，单个归因仍可能偏离精确值。"
        ],
        [
          "比较计算算法时必须固定什么？",
          [
            "模型、输出、样本、背景和博弈规则",
            "仅主题颜色",
            "无说明地使用不同价值函数"
          ],
          0,
          "否则差异可能来自博弈变化，而非计算算法。"
        ]
      ],
      "practice": {
        "title": "同一博弈中的 TreeSHAP 与 KernelSHAP",
        "intro": "使用 Python 3.12、600 行合成数据及六个特征。第二个特征与第一个相关；目标 = 3x₀+2x₂x₃−x₄+噪声。仅用 train 训练，背景为 32 个训练样本，解释 test 第一行。RandomForestRegressor 含 20 棵最大深度 4 的树；raw 为回归预测。",
        "task": "运行计算并保存实际报告行。比较两次低预算运行与完整枚举，另行比较耗时。不要把未知的 TreeSHAP 内部评估数与 KernelExplainer 行数视为相同指标。",
        "steps": [
          "构建无泄漏背景：train_test_split 隔离 test，default_rng 与 random_state 固定生成和训练；choice(..., replace=False) 选不同数据行。",
          "exact_game 枚举各大小的 combinations；masked[:, list(subset)] 把已知列设为 x，mean 平均预测。frozenset 字典键缓存联盟；阶乘权重分配边际增量。",
          "TreeExplainer 使用相同背景及显式 interventional、raw；result.values[0] 为一行归因。KernelExplainer 中 counted_predict 统计调用和行数，identity 保留尺度，l1_reg=0 关闭特征筛选。",
          "比较两个 seed 下的 nsamples=24 和 nsamples=62；若精确基准、TreeSHAP 或完整 KernelSHAP 超出容差，assert_allclose 终止脚本。输出可加性残差、MAE 和耗时，不预设加速。",
          "实验：将 B 从 32 改为 16，在新的共同博弈下重新比较所有方法。若导入失败，检查 Python 和安装；若结果不一致，先检查尺度、背景与参数，不要无故放宽容差。"
        ],
        "install": "python -m pip install shap==0.54.1 scikit-learn==1.9.1",
        "run": "python lessons/practice/a-10-1-2-shap-computation.py"
      }
    }
  },
  "practiceCode": "\"\"\"Lesson 10.1.2: fixed empirical marginal game, exact reference and SHAP.\"\"\"\n# Python 3.12. pip install shap==0.54.1 scikit-learn==1.9.1\nfrom itertools import combinations\nfrom math import factorial\nfrom time import perf_counter\nimport numpy as np\nimport shap\nimport sklearn\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.model_selection import train_test_split\n\ndef exact_game(model, x, background):\n    \"\"\"Cache one value per coalition and independently allocate marginal gains.\"\"\"\n    m = x.size\n    values = {}\n    for k in range(m + 1):\n        for subset in combinations(range(m), k):\n            masked = background.copy()\n            masked[:, list(subset)] = x[list(subset)]\n            values[frozenset(subset)] = float(model.predict(masked).mean())\n    phi = np.zeros(m)\n    for i in range(m):\n        for s, v in values.items():\n            if i not in s:\n                k = len(s)\n                w = factorial(k) * factorial(m - k - 1) / factorial(m)\n                phi[i] += w * (values[s | {i}] - v)\n    return values[frozenset()], phi, len(values)\n\ndef main():\n    rng = np.random.default_rng(42)\n    x_all = rng.normal(size=(600, 6))\n    x_all[:, 1] = 0.8 * x_all[:, 0] + 0.6 * x_all[:, 1]\n    y = (3*x_all[:, 0] + 2*x_all[:, 2]*x_all[:, 3]\n         - x_all[:, 4] + 0.2*rng.normal(size=len(x_all)))\n    train, test, y_train, _ = train_test_split(\n        x_all, y, test_size=0.25, random_state=42\n    )\n    model = RandomForestRegressor(n_estimators=20, max_depth=4,\n                                  random_state=42, n_jobs=1)\n    model.fit(train, y_train)\n    background = train[rng.choice(len(train), 32, replace=False)]\n    x = test[0]\n    m = x.size\n    target = float(model.predict(x[None, :])[0])\n    baseline = float(model.predict(background).mean())\n    print(\"versions:\", \"numpy\", np.__version__, \"shap\", shap.__version__,\n          \"sklearn\", sklearn.__version__)\n    print(\"M =\", m, \"B =\", len(background), \"prediction =\", target)\n    print(\"game = marginal empirical background; output = regression raw\")\n\n    start = perf_counter()\n    exact_base, exact, masks = exact_game(model, x, background)\n    print(\"exact\", \"seconds =\", perf_counter()-start,\n          \"masks =\", masks, \"rows =\", masks*len(background), \"phi =\", exact)\n    assert masks == 2**m\n    np.testing.assert_allclose(exact_base, baseline, atol=1e-8)\n    np.testing.assert_allclose(exact_base + exact.sum(), target, atol=1e-8)\n\n    def report(name, base, phi, seconds, calls=None, rows=None):\n        phi = np.asarray(phi, dtype=float).reshape(-1)\n        assert phi.shape == (m,) and np.isfinite(phi).all()\n        np.testing.assert_allclose(base, baseline, atol=1e-6)\n        residual = float(base + phi.sum() - target)\n        assert abs(residual) < 1e-5, residual\n        print(name, \"seconds =\", round(seconds, 6),\n              \"calls =\", calls, \"rows =\", rows, \"phi =\", phi,\n              \"residual =\", residual, \"MAE vs exact =\", np.abs(phi-exact).mean())\n        return phi\n\n    start = perf_counter()\n    tree = shap.TreeExplainer(model, data=background,\n                              feature_perturbation=\"interventional\",\n                              model_output=\"raw\")\n    result = tree(x[None, :], check_additivity=True)\n    tree_phi = report(\"TreeSHAP\", float(np.asarray(result.base_values).item()),\n                      result.values[0], perf_counter()-start)\n    # Tree traversal is internal, so calls/rows are deliberately not fabricated.\n    np.testing.assert_allclose(tree_phi, exact, atol=1e-5, rtol=1e-5)\n\n    def kernel(budget, seed):\n        np.random.seed(seed)\n        stats = {\"calls\": 0, \"rows\": 0}\n        def counted_predict(rows):\n            stats[\"calls\"] += 1\n            stats[\"rows\"] += len(rows)\n            return model.predict(rows)\n        start = perf_counter()\n        explainer = shap.KernelExplainer(counted_predict, background,\n                                         link=\"identity\")\n        values = explainer.shap_values(x[None, :], nsamples=budget,\n                                       l1_reg=0, silent=True)\n        return report(f\"KernelSHAP nsamples={budget} seed={seed}\",\n                      float(np.asarray(explainer.expected_value).item()),\n                      values[0], perf_counter()-start,\n                      stats[\"calls\"], stats[\"rows\"])\n\n    low_a = kernel(24, 42)\n    low_b = kernel(24, 43)\n    full = kernel(2**m-2, 42)\n    np.testing.assert_allclose(full, exact, atol=1e-5, rtol=1e-5)\n    print(\"low-budget repeat MAE =\", np.abs(low_a-low_b).mean())\n    print(\"PASS: fixed-game reference, baselines, additivity and full budgets\")\n    # No timing or monotonic-improvement assertion: hardware and sampling vary.\n\nif __name__ == \"__main__\":\n    main()\n"
};
})();
