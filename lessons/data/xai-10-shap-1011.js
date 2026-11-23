(function(){
"use strict";
window.DCH_SHAP_1011={
  "illustration_schema_version": 2,
  "content": {
    "ru": {
      "title": "Теория игр и Shapley Values",
      "lead": "Разберём, как кооперативная теория игр распределяет общий прирост ценности между участниками и как это правило переносится на вклад признаков модели.",
      "outcomes": [
        "Определять игроков, коалиции и функцию ценности кооперативной игры.",
        "Объяснять предельный вклад участника в заданную коалицию.",
        "Обосновывать усреднение вклада по всем порядкам присоединения.",
        "Вычислять Shapley Value по коалициям и перестановкам.",
        "Интерпретировать комбинаторные веса и четыре аксиомы.",
        "Сопоставлять элементы игры с признаками модели и объяснять роль функции ценности.",
        "Различать Shapley Value, SHAP и причинное влияние."
      ],
      "sections": [
        [
          "motivation",
          "1. Зачем распределять общий результат?",
          [
            "Представьте совместный проект трёх специалистов A, B и C. Результат команды зависит не только от каждого участника по отдельности, но и от сочетания навыков. Если первым присоединился A, его вклад измеряется относительно пустой команды; если A присоединяется после B и C, контекст уже другой.",
            "Поэтому нельзя автоматически считать вкладом участника его индивидуальный результат или делить общий прирост поровну. Значение Шепли задаёт строгое правило: оценить предельный вклад участника во всех возможных контекстах и усреднить его."
          ],
          null
        ],
        [
          "game",
          "2. Кооперативная игра: игроки, коалиции и ценность",
          [
            "Кооперативная игра задаётся множеством игроков N и функцией ценности v(S), которая назначает результат каждой коалиции S ⊆ N. Обозначим n = |N|. Пустая коалиция ∅ тоже имеет значение v(∅): оно не обязано быть нулём, если так не задана модель задачи.",
            "В нашем учебном примере v(∅)=10, а v({A,B,C})=20. Распределять нужно прирост 20−10=10, а не весь уровень 20. Таблица показывает ценность каждой из восьми коалиций; все числа условные и относятся только к этому примеру."
          ],
          "coalitions"
        ],
        [
          "marginal",
          "3. Предельный вклад зависит от контекста",
          [
            "Для игрока i и коалиции S, в которую i ещё не входит, предельный вклад равен Δᵢ(S)=v(S∪{i})−v(S). Это изменение ценности при добавлении участника именно к S, а не постоянная характеристика игрока.",
            "Для A: без участников его добавление даёт 14−10=4; к коалиции {B} — 18−13=5; к {C} — 16−11=5; к {B,C} — 20−15=5. Один и тот же A имеет разные предельные вклады в зависимости от уже собранной команды."
          ],
          "marginal"
        ],
        [
          "permutations",
          "4. Усреднение по всем порядкам присоединения",
          [
            "Для трёх игроков существует 3!=6 порядков. В каждом порядке участник получает прирост ценности в момент своего присоединения. В таблице столбцы A, B и C показывают вклад каждого игрока независимо от позиции в порядке; сумма в каждой строке равна общему приросту 10.",
            "Средние по шести порядкам: φA=28/6=14/3≈4,667; φB=22/6=11/3≈3,667; φC=10/6=5/3≈1,667. Это математический способ учесть все контексты, а не утверждение, что признаки в реальности добавляются по очереди."
          ],
          "permutations"
        ],
        [
          "formula",
          "5. Формула Shapley Value и комбинаторные веса",
          [
            "Значение Шепли игрока i — взвешенная сумма его предельных вкладов по всем коалициям, не содержащим i: φᵢ(v)=Σ₍S⊆N\\{i}₎ [|S|!(n−|S|−1)!/n!]·[v(S∪{i})−v(S)]. Первый множитель — вес коалиции S, второй — предельный вклад в ней.",
            "При n=3 вес коалиции размера 0 равен 0!·2!/3!=1/3; для каждой коалиции размера 1 — 1!·1!/3!=1/6; для коалиции размера 2 — 2!·0!/3!=1/3. Для конкретного S это доля перестановок, в которых ровно участники S стоят перед i, а остальные — после него. Сумма весов для одного игрока равна 1."
          ],
          "weights"
        ],
        [
          "axioms",
          "6. Четыре аксиомы правила",
          [
            "Эффективность: сумма значений Шепли равна v(N)−v(∅). Симметрия: игроки с одинаковыми предельными вкладами во всех коалициях получают равные значения. Фиктивный игрок: если его добавление никогда не меняет ценность, его значение равно нулю.",
            "Аддитивность: для суммы двух игр значение игрока равно сумме его значений в каждой игре. Эти аксиомы характеризуют правило Shapley Value в заданном классе кооперативных игр. Они не доказывают причинность, отсутствие смещения или универсальную справедливость выбранной постановки."
          ],
          "axioms"
        ],
        [
          "ml",
          "7. Перенос на признаки модели",
          [
            "При объяснении модели игроками становятся признаки, а коалицией — подмножество признаков. Но чтобы определить v(S), нужно решить, что означает отсутствие остальных признаков и как получить выход модели при неполном наборе входов. Возможны разные определения через условные или маргинальные ожидания и разные фоновые распределения.",
            "При зависимых признаках независимое исключение может создать нереалистичные комбинации. Поэтому выбор фоновых данных, способа заполнения отсутствующих признаков, выхода модели и шкалы меняет саму игру и значения Шепли. Полученное распределение относится к выбранной функции ценности и не является доказательством причинного эффекта признака."
          ],
          "mapping"
        ],
        [
          "shap",
          "8. Shapley Value и SHAP — разные понятия",
          [
            "Shapley Value — математическое правило распределения прироста ценности в кооперативной игре. SHAP — семейство подходов к объяснению предсказаний модели, использующих значения Шепли и конкретные способы задания или оценки функции ценности.",
            "Не следует считать Shapley Value библиотекой или одним алгоритмом. И нельзя предполагать, что любая реализация SHAP всегда вычисляет точные значения для любой модели и любого числа признаков. Способы вычисления и их компромиссы — тема следующего урока 10.1.2."
          ],
          "distinction"
        ],
        [
          "summary",
          "9. Итог: от игры к объяснению модели",
          [
            "Логика урока: кооперативная игра задаёт игроков и функцию ценности; коалиция задаёт контекст; предельный вклад измеряет изменение при добавлении игрока; усреднение по всем порядкам приводит к Shapley Value; в ML результат зависит от определения функции ценности для подмножеств признаков.",
            "Перед интерпретацией всегда называйте объект объяснения, выход модели, фоновые данные и способ трактовки отсутствующих признаков. Далее разберём, как семейство SHAP строит и оценивает такие объяснения на практике."
          ],
          null
        ]
      ],
      "diagrams": {
        "game": {
          "title": "Состав кооперативной игры",
          "description": "Игроки образуют коалицию; функция ценности назначает каждой коалиции число.",
          "caption": "Функция v задаёт ценность каждой коалиции, включая пустую.",
          "layout": "causal-flow",
          "headers": [
            "Игроки",
            "Коалиция S",
            "Ценность v(S)"
          ],
          "rows": [
            [
              "A, B, C",
              "{A, C}",
              "16"
            ],
            [
              "A, B, C",
              "{B}",
              "13"
            ],
            [
              "A, B, C",
              "{A, B, C}",
              "20"
            ]
          ]
        },
        "coalitions": {
          "title": "Все восемь коалиций",
          "description": "Каждая строка связывает одну коалицию с её значением функции ценности.",
          "caption": "Пустая коалиция задаёт базовый уровень 10; полная коалиция даёт 20.",
          "layout": "shapley-coalition-table",
          "columns": [
            "Коалиция S",
            "Состав",
            "Ценность v(S)"
          ],
          "rows": [
            [
              "∅",
              "никого",
              "10"
            ],
            [
              "{A}",
              "A",
              "14"
            ],
            [
              "{B}",
              "B",
              "13"
            ],
            [
              "{C}",
              "C",
              "11"
            ],
            [
              "{A,B}",
              "A и B",
              "18"
            ],
            [
              "{A,C}",
              "A и C",
              "16"
            ],
            [
              "{B,C}",
              "B и C",
              "15"
            ],
            [
              "{A,B,C}=N",
              "A, B и C",
              "20"
            ]
          ],
          "note": "Распределяемый прирост: v(N) − v(∅) = 20 − 10 = 10."
        },
        "marginal": {
          "title": "Как меняется вклад A",
          "description": "Сравнение значения коалиции до и после присоединения A.",
          "caption": "Один участник может иметь разные предельные вклады в разных коалициях.",
          "layout": "shapley-marginal-table",
          "columns": [
            "Коалиция до",
            "v(S)",
            "Коалиция после A",
            "v(S∪{A})",
            "ΔA(S)"
          ],
          "rows": [
            [
              "∅",
              "10",
              "{A}",
              "14",
              "4"
            ],
            [
              "{B}",
              "13",
              "{A,B}",
              "18",
              "5"
            ],
            [
              "{C}",
              "11",
              "{A,C}",
              "16",
              "5"
            ],
            [
              "{B,C}",
              "15",
              "{A,B,C}",
              "20",
              "5"
            ]
          ],
          "note": "ΔA(S) = v(S ∪ {A}) − v(S). В трёх из четырёх контекстов вклад A равен 5."
        },
        "permutations": {
          "title": "Шесть порядков — шесть расчётов",
          "description": "В каждой строке показан порядок присоединения и предельный вклад каждого игрока.",
          "caption": "Каждая последовательность распределяет один и тот же прирост 10; Shapley Value — среднее по шести строкам.",
          "layout": "shapley-permutations",
          "columns": [
            "Порядок",
            "Вклад A",
            "Вклад B",
            "Вклад C",
            "Сумма"
          ],
          "rows": [
            [
              "A → B → C",
              "4",
              "4",
              "2",
              "10"
            ],
            [
              "A → C → B",
              "4",
              "4",
              "2",
              "10"
            ],
            [
              "B → A → C",
              "5",
              "3",
              "2",
              "10"
            ],
            [
              "B → C → A",
              "5",
              "3",
              "2",
              "10"
            ],
            [
              "C → A → B",
              "5",
              "4",
              "1",
              "10"
            ],
            [
              "C → B → A",
              "5",
              "4",
              "1",
              "10"
            ]
          ],
          "note": "Средние: φA = 28/6 = 14/3; φB = 22/6 = 11/3; φC = 10/6 = 5/3."
        },
        "weights": {
          "title": "Почему веса равны 1/3 и 1/6",
          "description": "Для фиксированного игрока i считаем, сколько перестановок имеют заданную коалицию S перед ним.",
          "caption": "Вес каждой коалиции — доля перестановок, в которых ровно участники S стоят перед i.",
          "layout": "shapley-weights",
          "columns": [
            "Размер |S|",
            "Коалиции S",
            "Число S",
            "Вес одной S",
            "Вклад в сумму"
          ],
          "rows": [
            [
              "0",
              "∅",
              "1",
              "0!·2!/3! = 1/3",
              "1/3"
            ],
            [
              "1",
              "{A}, {B}",
              "2",
              "1!·1!/3! = 1/6",
              "2 × 1/6 = 1/3"
            ],
            [
              "2",
              "{A,B}",
              "1",
              "2!·0!/3! = 1/3",
              "1/3"
            ]
          ],
          "note": "Сумма весов: 1/3 + 1/6 + 1/6 + 1/3 = 1. Всего для трёх игроков существует 3! = 6 перестановок."
        },
        "axioms": {
          "title": "Четыре аксиомы Shapley Value",
          "description": "Каждая карточка показывает точное условие аксиомы и её следствие для распределения.",
          "caption": "Аксиомы характеризуют правило распределения, но не доказывают причинность и не выбирают функцию ценности.",
          "layout": "shapley-axioms",
          "cards": [
            [
              "Эффективность",
              "Сумма значений всех игроков равна общему приросту игры.",
              "Σ φᵢ = v(N) − v(∅)",
              "В примере: 14/3 + 11/3 + 5/3 = 10."
            ],
            [
              "Симметрия",
              "Если два игрока имеют одинаковые предельные вклады во всех коалициях, их значения равны.",
              "φᵢ = φⱼ",
              "Одинаковые возможности в любой коалиции означают равное распределение."
            ],
            [
              "Фиктивный игрок",
              "Если добавление игрока не меняет ценность ни одной коалиции, его вклад равен нулю.",
              "Δᵢ(S) = 0 ⇒ φᵢ = 0",
              "Игрок, который ничего не добавляет ни в одном контексте, получает ноль."
            ],
            [
              "Аддитивность",
              "Если ценность игры складывается из двух игр, распределение также складывается.",
              "φᵢ(v + w) = φᵢ(v) + φᵢ(w)",
              "Распределение суммы двух независимых компонентов равно сумме распределений."
            ]
          ]
        },
        "mapping": {
          "layout": "shapley-mapping",
          "title": "От кооперативной игры к объяснению модели",
          "description": "Игроки и коалиции игры сопоставляются признакам и подмножествам признаков модели.",
          "caption": "Функция ценности v_x задаёт выход модели или выбранную характеристику для каждой коалиции признаков.",
          "cards": [
            [
              "Кооперативная игра",
              "Игроки A, B и C образуют коалиции S; функция v(S) задаёт ценность каждой коалиции."
            ],
            [
              "Модель машинного обучения",
              "Игроками становятся признаки; коалиция S — выбранное подмножество признаков для объясняемого объекта x."
            ],
            [
              "Распределение вклада",
              "Значения Шепли φᵢ усредняют предельный вклад признака по всем возможным контекстам."
            ]
          ]
        },
        "distinction": {
          "layout": "shapley-distinction",
          "title": "Shapley Value и SHAP: связь, но не тождество",
          "description": "Shapley Value — правило распределения в кооперативной игре; SHAP применяет эту идею для объяснения предсказаний моделей.",
          "caption": "SHAP использует значения Шепли как теоретическую основу, но включает постановку задачи объяснения, выбор фона и способ вычисления.",
          "columns": [
            "Shapley Value",
            "SHAP"
          ],
          "rows": [
            [
              "Объект",
              "Общее правило распределения ценности между игроками.",
              "Подход к объяснению вклада признаков в предсказание модели."
            ],
            [
              "Функция ценности",
              "Задаётся кооперативной игрой v(S).",
              "Задаётся моделью, объясняемым объектом и способом представить отсутствующие признаки."
            ],
            [
              "Результат",
              "Значение φᵢ для каждого игрока.",
              "Атрибуции признаков, обычно вместе с базовым значением и объясняемым прогнозом."
            ]
          ],
          "aspectLabel": "Критерий"
        }
      },
      "practice": {
        "title": "Реализация двух независимых способов",
        "intro": "Используйте только стандартную библиотеку Python. Функция ценности задана словарём восьми коалиций.",
        "task": "Реализуйте вычисление Shapley Value двумя независимыми способами: перебором коалиций с комбинаторными весами и перебором всех перестановок. Сравните результаты и проверьте эффективность, симметрию и фиктивного игрока.",
        "steps": [
          "Представьте коалиции как frozenset и задайте value(S).",
          "Реализуйте shapley_by_coalitions: перебирайте подмножества N без i и вычисляйте вес через factorial.",
          "Реализуйте shapley_by_permutations: перебирайте permutations(N), накапливая предельный вклад при каждом присоединении.",
          "Сравните два результата с ожидаемыми 14/3, 11/3 и 5/3.",
          "Проверьте, что сумма равна v(N)−v(∅), а симметричные и фиктивные игроки ведут себя корректно."
        ],
        "install": "python --version",
        "run": "python lessons/practice/a-10-1-1-shapley-values.py",
        "expected": "Оба независимых метода должны вернуть A=4.666667, B=3.666667, C=1.666667; сумма равна 10."
      },
      "sources": [
        [
          "Lloyd S. Shapley (1953), A Value for n-Person Games",
          "https://doi.org/10.1515/9781400881970-018"
        ],
        [
          "Shapley (1953), original chapter record — JSTOR",
          "https://www.jstor.org/stable/1906952"
        ],
        [
          "Roth (ed.), The Shapley Value: Essays in Honor of Lloyd S. Shapley",
          "https://doi.org/10.1017/CBO9780511528446"
        ],
        [
          "SHAP: A Unified Approach to Interpreting Model Predictions",
          "https://arxiv.org/abs/1705.07874"
        ],
        [
          "Molnar, Interpretable Machine Learning — Shapley Values",
          "https://christophm.github.io/interpretable-ml-book/shapley.html"
        ],
        [
          "Aas, Jullum & Løland (2021), Explaining individual predictions when features are dependent",
          "https://doi.org/10.1016/j.artint.2021.103502"
        ],
        [
          "Sundararajan & Najmi (2020), The many Shapley values for model explanation",
          "https://arxiv.org/abs/1908.08474"
        ],
        [
          "Lundberg & Lee (2017), NeurIPS paper",
          "https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ]
      ],
      "glossary": [
        [
          "Кооперативная игра",
          "Cooperative game",
          "Модель, в которой участники могут образовывать коалиции."
        ],
        [
          "Игрок",
          "Player",
          "Участник, чей вклад распределяется."
        ],
        [
          "Коалиция",
          "Coalition",
          "Подмножество игроков, действующих совместно."
        ],
        [
          "Функция ценности",
          "Value function",
          "Функция v(S), назначающая ценность каждой коалиции."
        ],
        [
          "Пустая коалиция",
          "Empty coalition",
          "Коалиция без игроков; её значение v(∅) задаёт базовый уровень."
        ],
        [
          "Предельный вклад",
          "Marginal contribution",
          "Изменение v при добавлении игрока к коалиции."
        ],
        [
          "Перестановка",
          "Permutation",
          "Один из возможных порядков присоединения игроков."
        ],
        [
          "Значение Шепли",
          "Shapley Value",
          "Средний предельный вклад игрока по всем допустимым контекстам."
        ],
        [
          "Эффективность",
          "Efficiency",
          "Сумма значений Шепли равна v(N)−v(∅)."
        ],
        [
          "Симметрия",
          "Symmetry",
          "Одинаковые предельные вклады означают одинаковые значения."
        ],
        [
          "Фиктивный игрок",
          "Dummy player",
          "Игрок, добавление которого не меняет ценность коалиции."
        ],
        [
          "Аддитивность",
          "Additivity",
          "Значение для суммы игр равно сумме значений в каждой игре."
        ],
        [
          "Фоновое распределение",
          "Background distribution",
          "Распределение данных, используемое для определения отсутствующих признаков."
        ],
        [
          "Условное ожидание",
          "Conditional expectation",
          "Ожидание выхода модели при условии известных признаков."
        ]
      ],
      "quiz": [
        [
          "Что задаёт функцию v(S)?",
          [
            "Ценность каждой коалиции",
            "Порядок обучения модели",
            "Вероятность ошибки",
            "Число признаков"
          ],
          0,
          "Функция ценности назначает результат каждой коалиции."
        ],
        [
          "Обязательно ли v(∅)=0?",
          [
            "Да, по определению",
            "Нет, это зависит от нормировки игры",
            "Только при двух игроках",
            "Только в SHAP"
          ],
          1,
          "Базовое значение может быть ненулевым; эффективность использует разность."
        ],
        [
          "Что измеряет Δᵢ(S)?",
          [
            "Постоянный вклад игрока",
            "Изменение ценности при добавлении i к S",
            "Среднюю точность модели",
            "Причинный эффект"
          ],
          1,
          "Это контекстный предельный вклад."
        ],
        [
          "Сколько порядков у трёх игроков?",
          [
            "3",
            "6",
            "9",
            "12"
          ],
          1,
          "Число перестановок равно 3!=6."
        ],
        [
          "Каков вес коалиции размера 1 при n=3?",
          [
            "1/3",
            "1/6",
            "1/2",
            "1"
          ],
          1,
          "Вес равен 1!·1!/3!=1/6."
        ],
        [
          "Что утверждает эффективность?",
          [
            "Каждый получает поровну",
            "Сумма φ равна v(N)",
            "Сумма φ равна v(N)−v(∅)",
            "Фиктивный игрок получает весь выигрыш"
          ],
          2,
          "Распределяется прирост относительно пустой коалиции."
        ],
        [
          "Когда два игрока симметричны?",
          [
            "У них одинаковые имена",
            "Их предельные вклады совпадают во всех коалициях",
            "Они добавлены первыми",
            "Их признаки коррелируют"
          ],
          1,
          "Симметрия определяется функцией ценности во всех контекстах."
        ],
        [
          "Что такое фиктивный игрок?",
          [
            "Игрок с отрицательным вкладом",
            "Игрок, не меняющий ценность ни одной коалиции",
            "Игрок с пропуском данных",
            "Игрок, добавленный последним"
          ],
          1,
          "Для него все предельные вклады равны нулю."
        ],
        [
          "Почему определение v(S) важно для ML?",
          [
            "Оно задаёт смысл отсутствующих признаков",
            "Оно выбирает цвет графика",
            "Оно гарантирует причинность",
            "Оно удаляет корреляцию"
          ],
          0,
          "Способ определить выход при неполном наборе признаков меняет игру."
        ],
        [
          "Что верно о Shapley Value и SHAP?",
          [
            "Это одно название библиотеки",
            "Shapley Value — математическое правило, SHAP — семейство методов",
            "Оба всегда дают точный результат для любой модели",
            "Shapley Value доказывает причинность"
          ],
          1,
          "SHAP использует значения Шепли в методах объяснения моделей."
        ]
      ]
    },
    "en": {
      "title": "Game Theory and Shapley Values",
      "lead": "See how cooperative game theory allocates shared value and how the rule transfers to feature contributions in a model.",
      "outcomes": [
        "Define players, coalitions, and a cooperative game's value function.",
        "Explain a player's marginal contribution to a given coalition.",
        "Explain why contributions are averaged over all joining orders.",
        "Compute Shapley Values using coalitions and permutations.",
        "Interpret combinatorial weights and the four axioms.",
        "Map game elements to model features and explain the role of the value function.",
        "Distinguish Shapley Value, SHAP, and causal influence."
      ],
      "sections": [
        [
          "motivation",
          "1. Why allocate a shared outcome?",
          [
            "Imagine a project completed by three specialists, A, B, and C. The team's result depends not only on each person individually but also on how their skills combine. If A joins an empty team, A's contribution is measured against one context; if A joins after B and C, the context is different.",
            "It is therefore not generally correct to use an individual's standalone result or divide the total gain equally. The Shapley Value defines a precise rule: measure a player's marginal contribution in every possible context and average those contributions."
          ],
          null
        ],
        [
          "game",
          "2. A cooperative game: players, coalitions, and value",
          [
            "A cooperative game is defined by a set of players N and a value function v(S), which assigns an outcome to every coalition S ⊆ N. Let n=|N|. The empty coalition ∅ also has a value v(∅); it need not be zero unless the game is normalized that way.",
            "In our worked example, v(∅)=10 and v({A,B,C})=20. The amount to allocate is the gain 20−10=10, not the level 20. The table lists all eight coalition values; these numbers are illustrative and belong only to this example."
          ],
          "coalitions"
        ],
        [
          "marginal",
          "3. Marginal contribution depends on context",
          [
            "For player i and a coalition S that does not contain i, the marginal contribution is Δᵢ(S)=v(S∪{i})−v(S). It is the change in value when i joins S, not a fixed property of the player.",
            "For A, joining the empty coalition adds 14−10=4; joining {B} adds 18−13=5; joining {C} adds 16−11=5; joining {B,C} adds 20−15=5. The same player has different marginal contributions in different team contexts."
          ],
          "marginal"
        ],
        [
          "permutations",
          "4. Averaging over every joining order",
          [
            "With three players there are 3!=6 possible orders. In each order, a player receives the increase in value at the moment they join. The table columns A, B, and C show each player's contribution regardless of their position; every row sums to the total gain of 10.",
            "Averaging over the six orders gives φA=28/6=14/3≈4.667, φB=22/6=11/3≈3.667, and φC=10/6=5/3≈1.667. This is a mathematical way to account for every context, not a claim that features are literally added one by one in practice."
          ],
          "permutations"
        ],
        [
          "formula",
          "5. The Shapley Value formula and combinatorial weights",
          [
            "The Shapley Value of player i is a weighted sum of marginal contributions over all coalitions that do not contain i: φᵢ(v)=Σ₍S⊆N\\{i}₎ [|S|!(n−|S|−1)!/n!]·[v(S∪{i})−v(S)]. The first factor is the coalition's weight; the second is i's marginal contribution in that coalition.",
            "For n=3, the weight for a coalition of size 0 is 0!·2!/3!=1/3; for each coalition of size 1 it is 1!·1!/3!=1/6; and for a coalition of size 2 it is 2!·0!/3!=1/3. For a fixed S, this is the fraction of permutations where exactly S appears before i and all remaining players appear after i. The weights for one player sum to 1."
          ],
          "weights"
        ],
        [
          "axioms",
          "6. The four axioms",
          [
            "Efficiency: the Shapley Values sum to v(N)−v(∅). Symmetry: players with identical marginal contributions in every coalition receive equal values. Dummy player: a player whose addition never changes a coalition's value receives zero.",
            "Additivity: for the sum of two games, a player's value equals the sum of their values in each game. These axioms characterize the Shapley Value rule for the specified class of cooperative games. They do not prove causality, absence of bias, or universal fairness of the chosen problem formulation."
          ],
          "axioms"
        ],
        [
          "ml",
          "7. Mapping the game to model features",
          [
            "For model explanation, features become players and a coalition is a subset of features. But defining v(S) requires deciding what it means for the remaining features to be absent and how to obtain a model output with only a subset of inputs. Different definitions use conditional or marginal expectations and different background distributions.",
            "With dependent features, independently removing features can create unrealistic combinations. The background data, treatment of missing features, model output, and output scale therefore change the game itself and its Shapley Values. The allocation is relative to the chosen value function; it is not proof of a feature's causal effect."
          ],
          "mapping"
        ],
        [
          "shap",
          "8. Shapley Value and SHAP are different concepts",
          [
            "Shapley Value is a mathematical rule for allocating a gain in a cooperative game. SHAP is a family of model-explanation approaches that use Shapley Values together with particular ways of defining or estimating the value function.",
            "Shapley Value is not a library or a single algorithm. Nor should we assume every SHAP implementation always computes exact values for every model and feature count. Computation methods and their trade-offs are the subject of lesson 10.1.2."
          ],
          "distinction"
        ],
        [
          "summary",
          "9. From a game to a model explanation",
          [
            "The chain is: a cooperative game defines players and a value function; a coalition defines the context; marginal contribution measures the change when a player joins; averaging over all orders leads to the Shapley Value; in ML, the result depends on how the value function is defined for feature subsets.",
            "Before interpreting an explanation, state the explained object, model output, background data, and treatment of absent features. The next lesson examines how the SHAP family constructs and estimates such explanations in practice."
          ],
          null
        ]
      ],
      "practice": {
        "title": "Implement two independent methods",
        "intro": "Use only the Python standard library. The value function is specified by a dictionary containing all eight coalitions.",
        "task": "Implement Shapley Values in two independent ways: enumerate coalitions using combinatorial weights and enumerate all permutations. Compare the results and test efficiency, symmetry, and a dummy player.",
        "steps": [
          "Represent coalitions as frozenset objects and define value(S).",
          "Implement shapley_by_coalitions by iterating over subsets excluding i and computing factorial weights.",
          "Implement shapley_by_permutations by iterating over permutations and accumulating marginal contributions as players join.",
          "Compare both results with 14/3, 11/3, and 5/3.",
          "Check that the sum equals v(N)−v(∅), and verify symmetric and dummy players."
        ],
        "install": "python --version",
        "run": "python lessons/practice/a-10-1-1-shapley-values.py",
        "expected": "Both independent methods should return A=4.666667, B=3.666667, C=1.666667; the sum is 10."
      },
      "sources": [
        [
          "Lloyd S. Shapley (1953), A Value for n-Person Games",
          "https://doi.org/10.1515/9781400881970-018"
        ],
        [
          "Shapley (1953), original chapter record — JSTOR",
          "https://www.jstor.org/stable/1906952"
        ],
        [
          "Roth (ed.), The Shapley Value: Essays in Honor of Lloyd S. Shapley",
          "https://doi.org/10.1017/CBO9780511528446"
        ],
        [
          "SHAP: A Unified Approach to Interpreting Model Predictions",
          "https://arxiv.org/abs/1705.07874"
        ],
        [
          "Molnar, Interpretable Machine Learning — Shapley Values",
          "https://christophm.github.io/interpretable-ml-book/shapley.html"
        ],
        [
          "Aas, Jullum & Løland (2021), Explaining individual predictions when features are dependent",
          "https://doi.org/10.1016/j.artint.2021.103502"
        ],
        [
          "Sundararajan & Najmi (2020), The many Shapley values for model explanation",
          "https://arxiv.org/abs/1908.08474"
        ],
        [
          "Lundberg & Lee (2017), NeurIPS paper",
          "https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ]
      ],
      "glossary": [
        [
          "Cooperative game",
          "Cooperative game",
          "A model in which participants can form coalitions."
        ],
        [
          "Player",
          "Player",
          "A participant whose contribution is allocated."
        ],
        [
          "Coalition",
          "Coalition",
          "A subset of players acting together."
        ],
        [
          "Value function",
          "Value function",
          "A function v(S) assigning a value to each coalition."
        ],
        [
          "Empty coalition",
          "Empty coalition",
          "The coalition with no players; v(∅) is the baseline."
        ],
        [
          "Marginal contribution",
          "Marginal contribution",
          "The change in value when a player joins a coalition."
        ],
        [
          "Permutation",
          "Permutation",
          "One possible order in which players join."
        ],
        [
          "Shapley Value",
          "Shapley Value",
          "A player's average marginal contribution across contexts."
        ],
        [
          "Efficiency",
          "Efficiency",
          "The Shapley Values sum to v(N)−v(∅)."
        ],
        [
          "Symmetry",
          "Symmetry",
          "Equal marginal contributions imply equal Shapley Values."
        ],
        [
          "Dummy player",
          "Dummy player",
          "A player whose addition never changes coalition value."
        ],
        [
          "Additivity",
          "Additivity",
          "The value for a sum of games equals the sum of their values."
        ],
        [
          "Background distribution",
          "Background distribution",
          "A data distribution used to define absent features."
        ],
        [
          "Conditional expectation",
          "Conditional expectation",
          "The expected model output conditional on observed features."
        ]
      ],
      "quiz": [
        [
          "What does v(S) define?",
          [
            "Ценность каждой коалиции",
            "Порядок обучения модели",
            "Вероятность ошибки",
            "Число признаков"
          ],
          0,
          "The value function assigns a value to every coalition."
        ],
        [
          "Must v(∅) equal zero?",
          [
            "Да, по определению",
            "Нет, это зависит от нормировки игры",
            "Только при двух игроках",
            "Только в SHAP"
          ],
          1,
          "The baseline can be nonzero; efficiency uses the difference."
        ],
        [
          "What does Δᵢ(S) measure?",
          [
            "Постоянный вклад игрока",
            "Изменение ценности при добавлении i к S",
            "Среднюю точность модели",
            "Причинный эффект"
          ],
          1,
          "It is a context-specific marginal contribution."
        ],
        [
          "How many orders exist for three players?",
          [
            "3",
            "6",
            "9",
            "12"
          ],
          1,
          "There are 3!=6 permutations."
        ],
        [
          "What is the weight of a size-1 coalition when n=3?",
          [
            "1/3",
            "1/6",
            "1/2",
            "1"
          ],
          1,
          "The weight is 1!·1!/3!=1/6."
        ],
        [
          "What does efficiency state?",
          [
            "Каждый получает поровну",
            "Сумма φ равна v(N)",
            "Сумма φ равна v(N)−v(∅)",
            "Фиктивный игрок получает весь выигрыш"
          ],
          2,
          "The allocation equals the gain over the empty coalition."
        ],
        [
          "When are two players symmetric?",
          [
            "У них одинаковые имена",
            "Их предельные вклады совпадают во всех коалициях",
            "Они добавлены первыми",
            "Их признаки коррелируют"
          ],
          1,
          "Symmetry is defined by marginal contributions in every context."
        ],
        [
          "What is a dummy player?",
          [
            "Игрок с отрицательным вкладом",
            "Игрок, не меняющий ценность ни одной коалиции",
            "Игрок с пропуском данных",
            "Игрок, добавленный последним"
          ],
          1,
          "All its marginal contributions are zero."
        ],
        [
          "Why does defining v(S) matter in ML?",
          [
            "Оно задаёт смысл отсутствующих признаков",
            "Оно выбирает цвет графика",
            "Оно гарантирует причинность",
            "Оно удаляет корреляцию"
          ],
          0,
          "The treatment of absent features changes the game."
        ],
        [
          "Which statement about Shapley Value and SHAP is correct?",
          [
            "Это одно название библиотеки",
            "Shapley Value — математическое правило, SHAP — семейство методов",
            "Оба всегда дают точный результат для любой модели",
            "Shapley Value доказывает причинность"
          ],
          1,
          "SHAP is a family of model-explanation methods using Shapley Values."
        ]
      ],
      "diagrams": {
        "game": {
          "title": "Cooperative game components",
          "description": "Players form coalitions; the value function assigns each coalition a number.",
          "caption": "The function v assigns value to every coalition.",
          "layout": "causal-flow",
          "headers": [
            "Players",
            "Coalition S",
            "Value v(S)"
          ],
          "rows": [
            [
              "A, B, C",
              "{A, C}",
              "16"
            ],
            [
              "A, B, C",
              "{B}",
              "13"
            ],
            [
              "A, B, C",
              "{A, B, C}",
              "20"
            ]
          ]
        },
        "coalitions": {
          "title": "All eight coalitions",
          "description": "Each row maps one coalition to its value under the value function.",
          "caption": "The empty coalition sets the baseline at 10; the grand coalition has value 20.",
          "layout": "shapley-coalition-table",
          "columns": [
            "Coalition S",
            "Members",
            "Value v(S)"
          ],
          "rows": [
            [
              "∅",
              "none",
              "10"
            ],
            [
              "{A}",
              "A",
              "14"
            ],
            [
              "{B}",
              "B",
              "13"
            ],
            [
              "{C}",
              "C",
              "11"
            ],
            [
              "{A,B}",
              "A and B",
              "18"
            ],
            [
              "{A,C}",
              "A and C",
              "16"
            ],
            [
              "{B,C}",
              "B and C",
              "15"
            ],
            [
              "{A,B,C}=N",
              "A, B and C",
              "20"
            ]
          ],
          "note": "Allocated gain: v(N) − v(∅) = 20 − 10 = 10."
        },
        "marginal": {
          "title": "How A's contribution changes",
          "description": "Compare coalition value before and after A joins.",
          "caption": "The same player can have different marginal contributions in different coalitions.",
          "layout": "shapley-marginal-table",
          "columns": [
            "Coalition before",
            "v(S)",
            "After A joins",
            "v(S∪{A})",
            "ΔA(S)"
          ],
          "rows": [
            [
              "∅",
              "10",
              "{A}",
              "14",
              "4"
            ],
            [
              "{B}",
              "13",
              "{A,B}",
              "18",
              "5"
            ],
            [
              "{C}",
              "11",
              "{A,C}",
              "16",
              "5"
            ],
            [
              "{B,C}",
              "15",
              "{A,B,C}",
              "20",
              "5"
            ]
          ],
          "note": "ΔA(S) = v(S ∪ {A}) − v(S). A's contribution is 5 in three of the four contexts."
        },
        "permutations": {
          "title": "Six orders, six calculations",
          "description": "Each row shows a joining order and each player's marginal contribution.",
          "caption": "Every sequence allocates the same gain of 10; the Shapley Value is the average across all six rows.",
          "layout": "shapley-permutations",
          "columns": [
            "Joining order",
            "A's share",
            "B's share",
            "C's share",
            "Total"
          ],
          "rows": [
            [
              "A → B → C",
              "4",
              "4",
              "2",
              "10"
            ],
            [
              "A → C → B",
              "4",
              "4",
              "2",
              "10"
            ],
            [
              "B → A → C",
              "5",
              "3",
              "2",
              "10"
            ],
            [
              "B → C → A",
              "5",
              "3",
              "2",
              "10"
            ],
            [
              "C → A → B",
              "5",
              "4",
              "1",
              "10"
            ],
            [
              "C → B → A",
              "5",
              "4",
              "1",
              "10"
            ]
          ],
          "note": "Averages: φA = 28/6 = 14/3; φB = 22/6 = 11/3; φC = 10/6 = 5/3."
        },
        "weights": {
          "title": "Why the weights are 1/3 and 1/6",
          "description": "For a fixed player i, count permutations in which exactly coalition S appears before i.",
          "caption": "A coalition's weight is the fraction of permutations in which exactly its members precede i.",
          "layout": "shapley-weights",
          "columns": [
            "Size |S|",
            "Coalitions S",
            "Count",
            "Weight per S",
            "Subtotal"
          ],
          "rows": [
            [
              "0",
              "∅",
              "1",
              "0!·2!/3! = 1/3",
              "1/3"
            ],
            [
              "1",
              "{A}, {B}",
              "2",
              "1!·1!/3! = 1/6",
              "2 × 1/6 = 1/3"
            ],
            [
              "2",
              "{A,B}",
              "1",
              "2!·0!/3! = 1/3",
              "1/3"
            ]
          ],
          "note": "Total weight: 1/3 + 1/6 + 1/6 + 1/3 = 1. Three players have 3! = 6 possible permutations."
        },
        "axioms": {
          "title": "The four Shapley axioms",
          "description": "Each card states an axiom's precise condition and its consequence for the allocation.",
          "caption": "Axioms characterize the allocation rule; they do not establish causality or choose the value function.",
          "layout": "shapley-axioms",
          "cards": [
            [
              "Efficiency",
              "The sum of all players' values equals the game's total gain.",
              "Σ φᵢ = v(N) − v(∅)",
              "In this example: 14/3 + 11/3 + 5/3 = 10."
            ],
            [
              "Symmetry",
              "If two players have identical marginal contributions in every coalition, their values are equal.",
              "φᵢ = φⱼ",
              "Equal contributions in every context imply equal allocation."
            ],
            [
              "Dummy player",
              "If adding a player never changes any coalition's value, that player's value is zero.",
              "Δᵢ(S) = 0 ⇒ φᵢ = 0",
              "A player who adds nothing in every context receives zero."
            ],
            [
              "Additivity",
              "If a game is the sum of two games, the allocation is the sum of their allocations.",
              "φᵢ(v + w) = φᵢ(v) + φᵢ(w)",
              "The allocation of two combined components equals the sum of their separate allocations."
            ]
          ]
        },
        "mapping": {
          "layout": "shapley-mapping",
          "title": "From a cooperative game to a model explanation",
          "description": "Players and coalitions in the game correspond to model features and feature subsets.",
          "caption": "The value function vₓ assigns a model output or selected quantity to each feature coalition.",
          "cards": [
            [
              "Cooperative game",
              "Players A, B, and C form coalitions S; v(S) assigns a value to every coalition."
            ],
            [
              "Machine-learning model",
              "Features become players; coalition S is a selected subset of features for the instance x."
            ],
            [
              "Contribution allocation",
              "Shapley values φᵢ average each feature's marginal contribution across all possible contexts."
            ]
          ]
        },
        "distinction": {
          "layout": "shapley-distinction",
          "title": "Shapley Value and SHAP: related, not identical",
          "description": "The Shapley Value is an allocation rule for cooperative games; SHAP applies this idea to explain model predictions.",
          "caption": "SHAP uses Shapley values as its theoretical foundation, while also specifying an explanation setup, a background distribution, and computation methods.",
          "columns": [
            "Shapley Value",
            "SHAP"
          ],
          "rows": [
            [
              "Object",
              "A general rule for allocating value among game players.",
              "A framework for attributing a model prediction to its features."
            ],
            [
              "Value function",
              "Defined by the cooperative game v(S).",
              "Defined through the model, explained instance, and treatment of missing features."
            ],
            [
              "Output",
              "A value φᵢ for each player.",
              "Feature attributions, commonly alongside a baseline and the explained prediction."
            ]
          ],
          "aspectLabel": "Aspect"
        }
      }
    },
    "zh": {
      "title": "博弈论与 Shapley 值",
      "lead": "了解合作博弈论如何分配共同创造的价值增量，以及这一规则如何用于解释模型特征的贡献。",
      "outcomes": [
        "定义合作博弈中的参与者、联盟和价值函数。",
        "解释参与者在给定联盟中的边际贡献。",
        "说明为什么要对所有加入顺序的贡献取平均。",
        "使用联盟枚举和排列枚举计算 Shapley 值。",
        "解释组合权重和四条公理。",
        "将博弈元素映射到模型特征，并说明价值函数的作用。",
        "区分 Shapley 值、SHAP 与因果影响。"
      ],
      "sections": [
        [
          "motivation",
          "1. 为什么要分配共同成果？",
          [
            "设想 A、B、C 三位专家共同完成一个项目。团队成果不仅取决于每个人单独的能力，也取决于技能如何组合。如果 A 加入空团队，其贡献相对于一种情境衡量；如果 A 在 B 和 C 之后加入，情境就不同。",
            "因此，不能简单地把个人单独成果当作贡献，也不能自动将总增量平均分配。Shapley 值给出严格规则：衡量参与者在所有可能情境中的边际贡献，再对这些贡献取平均。"
          ],
          null
        ],
        [
          "game",
          "2. 合作博弈：参与者、联盟与价值",
          [
            "合作博弈由参与者集合 N 和价值函数 v(S) 定义，后者为每个联盟 S ⊆ N 指定一个结果。令 n=|N|。空联盟 ∅ 也有价值 v(∅)；除非对博弈进行相应归一化，否则它不一定为零。",
            "本例中 v(∅)=10，v({A,B,C})=20。需要分配的是增量 20−10=10，而不是总水平 20。表格列出八个联盟的价值；这些数字仅为本例中的教学数据。"
          ],
          "coalitions"
        ],
        [
          "marginal",
          "3. 边际贡献取决于情境",
          [
            "对于不包含 i 的联盟 S，参与者 i 的边际贡献为 Δᵢ(S)=v(S∪{i})−v(S)。它表示 i 加入 S 后价值的变化，并不是参与者固定不变的属性。",
            "对于 A，加入空联盟带来 14−10=4；加入 {B} 带来 18−13=5；加入 {C} 带来 16−11=5；加入 {B,C} 带来 20−15=5。同一参与者在不同团队情境中的边际贡献可能不同。"
          ],
          "marginal"
        ],
        [
          "permutations",
          "4. 对所有加入顺序取平均",
          [
            "三位参与者共有 3!=6 种加入顺序。在每种顺序中，参与者获得其加入时价值的增量。表格中的 A、B、C 列分别表示各参与者的贡献，与其在顺序中的位置无关；每行总和均为 10。",
            "对六种顺序取平均：φA=28/6=14/3≈4.667；φB=22/6=11/3≈3.667；φC=10/6=5/3≈1.667。这是对所有情境进行数学上的对称处理，并不表示实际特征必须逐个加入。"
          ],
          "permutations"
        ],
        [
          "formula",
          "5. Shapley 值公式与组合权重",
          [
            "参与者 i 的 Shapley 值，是对所有不包含 i 的联盟的边际贡献进行加权求和：φᵢ(v)=Σ₍S⊆N\\{i}₎ [|S|!(n−|S|−1)!/n!]·[v(S∪{i})−v(S)]。第一个因子是联盟 S 的权重，第二个因子是 i 在该联盟中的边际贡献。",
            "当 n=3 时，大小为 0 的联盟权重为 0!·2!/3!=1/3；大小为 1 的每个联盟权重为 1!·1!/3!=1/6；大小为 2 的联盟权重为 2!·0!/3!=1/3。对于固定的 S，这表示在多少比例的排列中，恰好 S 位于 i 之前，其余参与者位于 i 之后。一个参与者的所有权重之和为 1。"
          ],
          "weights"
        ],
        [
          "axioms",
          "6. 四条公理",
          [
            "效率性：Shapley 值之和等于 v(N)−v(∅)。对称性：如果两个参与者在所有联盟中的边际贡献都相同，则它们获得相同的值。虚拟参与者：如果某参与者的加入从不改变联盟价值，则其值为零。",
            "可加性：两个博弈之和中某参与者的值，等于其在两个博弈中的值之和。这些公理在指定的合作博弈类别中刻画了 Shapley 值规则。它们并不能证明因果关系、无偏性，也不能保证所选问题定义在任何场景下都绝对公平。"
          ],
          "axioms"
        ],
        [
          "ml",
          "7. 映射到模型特征",
          [
            "在模型解释中，特征对应参与者，联盟对应特征子集。但定义 v(S) 时，必须决定其余特征缺失意味着什么，以及如何在只有部分输入时获得模型输出。不同定义可能使用条件期望或边际期望，以及不同的背景分布。",
            "当特征存在依赖关系时，独立移除特征可能产生不现实的组合。因此，背景数据、缺失特征处理方式、模型输出和输出尺度都会改变博弈本身及其 Shapley 值。该分配只相对于所选价值函数成立，并不能证明特征的因果效应。"
          ],
          "mapping"
        ],
        [
          "shap",
          "8. Shapley 值与 SHAP 并非同一概念",
          [
            "Shapley 值是合作博弈中分配价值增量的数学规则。SHAP 是一类模型解释方法，它们使用 Shapley 值，并采用特定方式定义或估计价值函数。",
            "Shapley 值不是一个软件库，也不是单一算法。也不能假设任何 SHAP 实现都能对任意模型和任意特征数量始终精确计算。计算方法及其权衡将在下一课 10.1.2 中讨论。"
          ],
          "distinction"
        ],
        [
          "summary",
          "9. 从博弈到模型解释",
          [
            "逻辑链条是：合作博弈定义参与者和价值函数；联盟定义情境；边际贡献衡量参与者加入后的变化；对所有顺序取平均得到 Shapley 值；在机器学习中，结果取决于如何为特征子集定义价值函数。",
            "解释结果前，应说明解释对象、模型输出、背景数据以及缺失特征的处理方式。下一课将讨论 SHAP 家族如何在实践中构建和估计这些解释。"
          ],
          null
        ]
      ],
      "practice": {
        "title": "实现两种独立计算方法",
        "intro": "仅使用 Python 标准库。价值函数由包含八个联盟的字典给出。",
        "task": "用两种独立方式实现 Shapley 值：使用组合权重枚举联盟，以及枚举所有排列。比较结果，并检验效率性、对称性和虚拟参与者。",
        "steps": [
          "使用 frozenset 表示联盟，并定义 value(S)。",
          "实现 shapley_by_coalitions：枚举不包含 i 的子集，并使用 factorial 计算权重。",
          "实现 shapley_by_permutations：枚举 permutations(N)，参与者加入时累计边际贡献。",
          "将两种结果与 14/3、11/3 和 5/3 比较。",
          "检查总和是否等于 v(N)−v(∅)，并验证对称参与者和虚拟参与者。"
        ],
        "install": "python --version",
        "run": "python lessons/practice/a-10-1-1-shapley-values.py",
        "expected": "两种独立方法均应得到 A=4.666667、B=3.666667、C=1.666667；总和为 10。"
      },
      "sources": [
        [
          "Lloyd S. Shapley (1953), A Value for n-Person Games",
          "https://doi.org/10.1515/9781400881970-018"
        ],
        [
          "Shapley (1953), original chapter record — JSTOR",
          "https://www.jstor.org/stable/1906952"
        ],
        [
          "Roth (ed.), The Shapley Value: Essays in Honor of Lloyd S. Shapley",
          "https://doi.org/10.1017/CBO9780511528446"
        ],
        [
          "SHAP: A Unified Approach to Interpreting Model Predictions",
          "https://arxiv.org/abs/1705.07874"
        ],
        [
          "Molnar, Interpretable Machine Learning — Shapley Values",
          "https://christophm.github.io/interpretable-ml-book/shapley.html"
        ],
        [
          "Aas, Jullum & Løland (2021), Explaining individual predictions when features are dependent",
          "https://doi.org/10.1016/j.artint.2021.103502"
        ],
        [
          "Sundararajan & Najmi (2020), The many Shapley values for model explanation",
          "https://arxiv.org/abs/1908.08474"
        ],
        [
          "Lundberg & Lee (2017), NeurIPS paper",
          "https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ]
      ],
      "glossary": [
        [
          "合作博弈",
          "Cooperative game",
          "允许参与者组成联盟的模型。"
        ],
        [
          "参与者",
          "Player",
          "其贡献需要被分配的参与者。"
        ],
        [
          "联盟",
          "Coalition",
          "共同协作的参与者子集。"
        ],
        [
          "价值函数",
          "Value function",
          "为每个联盟 S 指定价值的函数 v(S)。"
        ],
        [
          "空联盟",
          "Empty coalition",
          "不包含参与者的联盟；v(∅) 是基准值。"
        ],
        [
          "边际贡献",
          "Marginal contribution",
          "参与者加入联盟时价值的变化。"
        ],
        [
          "排列",
          "Permutation",
          "参与者可能加入的一个顺序。"
        ],
        [
          "Shapley 值",
          "Shapley Value",
          "参与者在所有情境中的平均边际贡献。"
        ],
        [
          "效率性",
          "Efficiency",
          "Shapley 值之和等于 v(N)−v(∅)。"
        ],
        [
          "对称性",
          "Symmetry",
          "边际贡献相同意味着 Shapley 值相同。"
        ],
        [
          "虚拟参与者",
          "Dummy player",
          "加入后从不改变联盟价值的参与者。"
        ],
        [
          "可加性",
          "Additivity",
          "博弈之和的值等于各博弈值之和。"
        ],
        [
          "背景分布",
          "Background distribution",
          "用于定义缺失特征的数据分布。"
        ],
        [
          "条件期望",
          "Conditional expectation",
          "给定已观察特征时模型输出的期望。"
        ]
      ],
      "quiz": [
        [
          "v(S) 定义什么？",
          [
            "Ценность каждой коалиции",
            "Порядок обучения модели",
            "Вероятность ошибки",
            "Число признаков"
          ],
          0,
          "价值函数为每个联盟指定价值。"
        ],
        [
          "v(∅) 是否必须为零？",
          [
            "Да, по определению",
            "Нет, это зависит от нормировки игры",
            "Только при двух игроках",
            "Только в SHAP"
          ],
          1,
          "基准值可以非零；效率性使用两者之差。"
        ],
        [
          "Δᵢ(S) 衡量什么？",
          [
            "Постоянный вклад игрока",
            "Изменение ценности при добавлении i к S",
            "Среднюю точность модели",
            "Причинный эффект"
          ],
          1,
          "它是特定情境下的边际贡献。"
        ],
        [
          "三位参与者有多少种顺序？",
          [
            "3",
            "6",
            "9",
            "12"
          ],
          1,
          "排列数为 3!=6。"
        ],
        [
          "n=3 时大小为 1 的联盟权重是多少？",
          [
            "1/3",
            "1/6",
            "1/2",
            "1"
          ],
          1,
          "权重为 1!·1!/3!=1/6。"
        ],
        [
          "效率性说明什么？",
          [
            "Каждый получает поровну",
            "Сумма φ равна v(N)",
            "Сумма φ равна v(N)−v(∅)",
            "Фиктивный игрок получает весь выигрыш"
          ],
          2,
          "分配的总量等于相对于空联盟的增量。"
        ],
        [
          "两个参与者何时对称？",
          [
            "У них одинаковые имена",
            "Их предельные вклады совпадают во всех коалициях",
            "Они добавлены первыми",
            "Их признаки коррелируют"
          ],
          1,
          "对称性由所有情境中的边际贡献决定。"
        ],
        [
          "什么是虚拟参与者？",
          [
            "Игрок с отрицательным вкладом",
            "Игрок, не меняющий ценность ни одной коалиции",
            "Игрок с пропуском данных",
            "Игрок, добавленный последним"
          ],
          1,
          "它的所有边际贡献都为零。"
        ],
        [
          "为什么在机器学习中定义 v(S) 很重要？",
          [
            "Оно задаёт смысл отсутствующих признаков",
            "Оно выбирает цвет графика",
            "Оно гарантирует причинность",
            "Оно удаляет корреляцию"
          ],
          0,
          "缺失特征的处理方式会改变博弈定义。"
        ],
        [
          "关于 Shapley 值和 SHAP，哪项正确？",
          [
            "Это одно название библиотеки",
            "Shapley Value — математическое правило, SHAP — семейство методов",
            "Оба всегда дают точный результат для любой модели",
            "Shapley Value доказывает причинность"
          ],
          1,
          "SHAP 是使用 Shapley 值的一类模型解释方法。"
        ]
      ],
      "diagrams": {
        "game": {
          "title": "合作博弈的组成",
          "description": "参与者组成联盟；价值函数为每个联盟指定数值。",
          "caption": "函数 v 为每个联盟指定价值。",
          "layout": "causal-flow",
          "headers": [
            "参与者",
            "联盟 S",
            "价值 v(S)"
          ],
          "rows": [
            [
              "A、B、C",
              "{A, C}",
              "16"
            ],
            [
              "A、B、C",
              "{B}",
              "13"
            ],
            [
              "A、B、C",
              "{A, B, C}",
              "20"
            ]
          ]
        },
        "coalitions": {
          "title": "合作博弈的八个联盟",
          "description": "每一行将一个联盟与价值函数为它指定的数值对应起来。",
          "caption": "空联盟的基准值为 10；大联盟的价值为 20。",
          "layout": "shapley-coalition-table",
          "columns": [
            "联盟 S",
            "参与者",
            "价值 v(S)"
          ],
          "rows": [
            [
              "∅",
              "无",
              "10"
            ],
            [
              "{A}",
              "A",
              "14"
            ],
            [
              "{B}",
              "B",
              "13"
            ],
            [
              "{C}",
              "C",
              "11"
            ],
            [
              "{A,B}",
              "A 和 B",
              "18"
            ],
            [
              "{A,C}",
              "A 和 C",
              "16"
            ],
            [
              "{B,C}",
              "B 和 C",
              "15"
            ],
            [
              "{A,B,C}=N",
              "A、B 和 C",
              "20"
            ]
          ],
          "note": "分配的增量：v(N) − v(∅) = 20 − 10 = 10。"
        },
        "marginal": {
          "title": "A 的边际贡献如何变化",
          "description": "比较 A 加入前后联盟价值的变化。",
          "caption": "同一参与者在不同联盟中的边际贡献可能不同。",
          "layout": "shapley-marginal-table",
          "columns": [
            "加入前的联盟",
            "v(S)",
            "A 加入后的联盟",
            "v(S∪{A})",
            "ΔA(S)"
          ],
          "rows": [
            [
              "∅",
              "10",
              "{A}",
              "14",
              "4"
            ],
            [
              "{B}",
              "13",
              "{A,B}",
              "18",
              "5"
            ],
            [
              "{C}",
              "11",
              "{A,C}",
              "16",
              "5"
            ],
            [
              "{B,C}",
              "15",
              "{A,B,C}",
              "20",
              "5"
            ]
          ],
          "note": "ΔA(S) = v(S ∪ {A}) − v(S)。在四种情境中，有三种的贡献为 5。"
        },
        "permutations": {
          "title": "六种顺序与六次计算",
          "description": "每一行展示一种加入顺序，以及每位参与者的边际贡献。",
          "caption": "每种顺序分配的增量均为 10；Shapley 值是六行结果的平均值。",
          "layout": "shapley-permutations",
          "columns": [
            "加入顺序",
            "A 的贡献",
            "B 的贡献",
            "C 的贡献",
            "合计"
          ],
          "rows": [
            [
              "A → B → C",
              "4",
              "4",
              "2",
              "10"
            ],
            [
              "A → C → B",
              "4",
              "4",
              "2",
              "10"
            ],
            [
              "B → A → C",
              "5",
              "3",
              "2",
              "10"
            ],
            [
              "B → C → A",
              "5",
              "3",
              "2",
              "10"
            ],
            [
              "C → A → B",
              "5",
              "4",
              "1",
              "10"
            ],
            [
              "C → B → A",
              "5",
              "4",
              "1",
              "10"
            ]
          ],
          "note": "平均值：φA = 28/6 = 14/3；φB = 22/6 = 11/3；φC = 10/6 = 5/3。"
        },
        "weights": {
          "title": "为什么权重是 1/3 和 1/6",
          "description": "固定参与者 i，统计恰好由联盟 S 中成员排在 i 前面的排列数量。",
          "caption": "联盟权重表示在多少比例的排列中，恰好由 S 中的参与者排在 i 之前。",
          "layout": "shapley-weights",
          "columns": [
            "|S| 的大小",
            "联盟 S",
            "数量",
            "每个联盟的权重",
            "小计"
          ],
          "rows": [
            [
              "0",
              "∅",
              "1",
              "0!·2!/3! = 1/3",
              "1/3"
            ],
            [
              "1",
              "{A}, {B}",
              "2",
              "1!·1!/3! = 1/6",
              "2 × 1/6 = 1/3"
            ],
            [
              "2",
              "{A,B}",
              "1",
              "2!·0!/3! = 1/3",
              "1/3"
            ]
          ],
          "note": "权重总和：1/3 + 1/6 + 1/6 + 1/3 = 1。三位参与者共有 3! = 6 种排列。"
        },
        "axioms": {
          "title": "Shapley 值的四条公理",
          "description": "每张卡片说明一条公理的精确条件及其对分配结果的含义。",
          "caption": "公理刻画分配规则，但不能证明因果关系，也不会替研究者选择价值函数。",
          "layout": "shapley-axioms",
          "cards": [
            [
              "效率性",
              "所有参与者的 Shapley 值之和等于博弈的总增量。",
              "Σ φᵢ = v(N) − v(∅)",
              "本例中：14/3 + 11/3 + 5/3 = 10。"
            ],
            [
              "对称性",
              "如果两位参与者在所有联盟中的边际贡献都相同，则其 Shapley 值相同。",
              "φᵢ = φⱼ",
              "在所有情境中贡献相同，分配结果也相同。"
            ],
            [
              "虚拟参与者",
              "如果加入某参与者不会改变任何联盟的价值，则该参与者的值为零。",
              "Δᵢ(S) = 0 ⇒ φᵢ = 0",
              "在所有情境中都没有增量的参与者得到零。"
            ],
            [
              "可加性",
              "如果一个博弈是两个博弈之和，其分配结果也等于两个分配结果之和。",
              "φᵢ(v + w) = φᵢ(v) + φᵢ(w)",
              "两个组成部分合并后的分配等于分别分配后相加。"
            ]
          ]
        },
        "mapping": {
          "layout": "shapley-mapping",
          "title": "从合作博弈到模型解释",
          "description": "博弈中的参与者与联盟对应于模型特征及其子集。",
          "caption": "价值函数 vₓ 为每个特征联盟指定模型输出或选定的目标量。",
          "cards": [
            [
              "合作博弈",
              "参与者 A、B、C 组成联盟 S；函数 v(S) 为每个联盟指定价值。"
            ],
            [
              "机器学习模型",
              "特征成为参与者；联盟 S 是针对样本 x 选取的特征子集。"
            ],
            [
              "贡献分配",
              "Shapley 值 φᵢ 对所有可能情境下的特征边际贡献取平均。"
            ]
          ]
        },
        "distinction": {
          "layout": "shapley-distinction",
          "title": "Shapley 值与 SHAP：相关但不相同",
          "description": "Shapley 值是合作博弈中的分配规则；SHAP 将这一思想用于解释模型预测。",
          "caption": "SHAP 以 Shapley 值为理论基础，同时还规定了解释任务、背景分布和计算方法。",
          "columns": [
            "Shapley 值",
            "SHAP"
          ],
          "rows": [
            [
              "研究对象",
              "在博弈参与者之间分配价值的一般规则。",
              "将模型预测归因于各个特征的解释框架。"
            ],
            [
              "价值函数",
              "由合作博弈 v(S) 定义。",
              "结合模型、待解释样本以及缺失特征的处理方式定义。"
            ],
            [
              "结果",
              "每位参与者对应一个 φᵢ 值。",
              "特征归因，通常同时给出基准值和待解释预测。"
            ]
          ],
          "aspectLabel": "维度"
        }
      }
    }
  },
  "practiceCode": "\"\"\"Two independent Shapley Value implementations for lesson 10.1.1.\n\nOnly the Python standard library is required.\n\"\"\"\nfrom itertools import combinations, permutations\nfrom math import factorial\n\nPLAYERS = (\"A\", \"B\", \"C\")\nVALUES = {\n    frozenset(): 10,\n    frozenset({\"A\"}): 14,\n    frozenset({\"B\"}): 13,\n    frozenset({\"C\"}): 11,\n    frozenset({\"A\", \"B\"}): 18,\n    frozenset({\"A\", \"C\"}): 16,\n    frozenset({\"B\", \"C\"}): 15,\n    frozenset({\"A\", \"B\", \"C\"}): 20,\n}\n\n\ndef value(coalition):\n    return VALUES[frozenset(coalition)]\n\n\ndef shapley_by_coalitions(players, value_fn):\n    players = tuple(players)\n    n = len(players)\n    result = {}\n    for player in players:\n        others = tuple(p for p in players if p != player)\n        total = 0.0\n        for size in range(n):\n            weight = factorial(size) * factorial(n - size - 1) / factorial(n)\n            for subset in combinations(others, size):\n                coalition = frozenset(subset)\n                marginal = value_fn(coalition | {player}) - value_fn(coalition)\n                total += weight * marginal\n        result[player] = total\n    return result\n\n\ndef shapley_by_permutations(players, value_fn):\n    players = tuple(players)\n    result = {player: 0.0 for player in players}\n    orders = tuple(permutations(players))\n    for order in orders:\n        coalition = frozenset()\n        previous = value_fn(coalition)\n        for player in order:\n            coalition = coalition | {player}\n            current = value_fn(coalition)\n            result[player] += current - previous\n            previous = current\n    return {player: amount / len(orders) for player, amount in result.items()}\n\n\ndef main():\n    by_coalitions = shapley_by_coalitions(PLAYERS, value)\n    by_orders = shapley_by_permutations(PLAYERS, value)\n    expected = {\"A\": 14 / 3, \"B\": 11 / 3, \"C\": 5 / 3}\n    for player in PLAYERS:\n        assert abs(by_coalitions[player] - expected[player]) < 1e-12\n        assert abs(by_orders[player] - expected[player]) < 1e-12\n        assert abs(by_coalitions[player] - by_orders[player]) < 1e-12\n    gain = value(PLAYERS) - value(())\n    assert abs(sum(by_coalitions.values()) - gain) < 1e-12\n    assert abs(sum(by_orders.values()) - gain) < 1e-12\n\n    # Symmetry: two players with identical marginal contributions.\n    symmetric = {frozenset(): 0, frozenset({\"X\"}): 2,\n                 frozenset({\"Y\"}): 2, frozenset({\"X\", \"Y\"}): 5}\n    sx = shapley_by_coalitions((\"X\", \"Y\"), lambda s: symmetric[frozenset(s)])\n    assert abs(sx[\"X\"] - sx[\"Y\"]) < 1e-12\n\n    # Dummy player: adding Z never changes the value.\n    dummy = {frozenset(): 0, frozenset({\"X\"}): 3, frozenset({\"Y\"}): 2,\n             frozenset({\"X\", \"Y\"}): 5, frozenset({\"Z\"}): 0,\n             frozenset({\"X\", \"Z\"}): 3, frozenset({\"Y\", \"Z\"}): 2,\n             frozenset({\"X\", \"Y\", \"Z\"}): 5}\n    dz = shapley_by_coalitions((\"X\", \"Y\", \"Z\"), lambda s: dummy[frozenset(s)])\n    assert abs(dz[\"Z\"]) < 1e-12\n\n    print(\"Coalition enumeration:\", {k: round(v, 6) for k, v in by_coalitions.items()})\n    print(\"Permutation enumeration:\", {k: round(v, 6) for k, v in by_orders.items()})\n    print(\"Efficiency:\", round(sum(by_coalitions.values()), 6), \"=\", gain)\n    print(\"Symmetry and dummy-player checks: PASS\")\n\n\nif __name__ == \"__main__\":\n    main()\n"
};
})();
