(function(){
"use strict";
window.DCH_SHAP_1021={
  "content": {
    "ru": {
      "title": "Глобальная важность признаков",
      "lead": "Агрегируем локальные SHAP-вклады, сравним подгруппы, оценим неопределённость и разберём отличие от PFI и SAGE.",
      "outcomes": [
        "Определять выборку, модель, выход и фоновую игру.",
        "Проверять форму матрицы SHAP и аддитивность каждой строки.",
        "Вычислять средний модуль и подписанное среднее.",
        "Распознавать компенсацию знаков и потерю распределения.",
        "Сравнивать группы при фиксированном фоне и взвешивать их.",
        "Читать глобальный bar и отличать его от локального.",
        "Различать вопросы SHAP, PFI и SAGE.",
        "Оценивать выборочную неопределённость bootstrap.",
        "Составлять воспроизводимый глобальный отчёт без причинных выводов."
      ],
      "sections": [
        [
          "population",
          "1. От объекта к совокупности",
          [
            "Локальный SHAP отвечает на вопрос об одном прогнозе. Чтобы получить картину поведения модели, соберём объяснения для заранее определённой совокупности, например для 200 тестовых квартир. Глобальная важность здесь означает статистику именно этой выборки, а не универсальное свойство признака. Зафиксируйте модель, preprocessing, фон, правило маскирования и один выход. Если сравниваются классы, анализируйте каждый выход отдельно.",
            "Паспорт: вход — объяснения одной модели для n объектов и m признаков; выход — ранжирование и статистики атрибуций в единицах f. Для описания распределения SHAP истинные y не обязательны; для оценки качества и PFI/SAGE они нужны. Не смешивайте данные для обучения и оценки. В лаборатории фон берём только из train, а объясняем test."
          ],
          null,
          []
        ],
        [
          "matrix",
          "2. Матрица атрибуций и агрегирование",
          [
            "Пусть φᵢⱼ — вклад признака j для объекта i. Для скалярного выхода матрица имеет n строк и m столбцов. Сначала проверьте, что имена, порядок строк, выход и base_values соответствуют прогнозам: f(xᵢ) ≈ bᵢ + Σⱼφᵢⱼ. Затем Iⱼ — средний модуль, а Dⱼ — средний подписанный вклад. Оба имеют единицы выбранного выхода; Iⱼ неотрицателен, Dⱼ может быть любого знака.",
            "Неравенство треугольника даёт |Σᵢφᵢⱼ| ≤ Σᵢ|φᵢⱼ|. Делим обе части на n, получаем |Dⱼ| ≤ Iⱼ. Равенство достигается, когда ненулевые вклады имеют один знак. Сумма Dⱼ соответствует среднему отклонению от базы, но сумма Iⱼ не обязана совпадать с ним. Поэтому не нормируйте Iⱼ как долю объяснённого качества модели."
          ],
          "matrix",
          [
            "Iⱼ = (1/n) Σᵢ |φᵢⱼ|",
            "Dⱼ = (1/n) Σᵢ φᵢⱼ",
            "|Dⱼ| ≤ Iⱼ"
          ]
        ],
        [
          "cancellation",
          "3. Компенсация знаков: ручной расчёт",
          [
            "Учебный набор (не результат обучения): четыре объекта, база 5, вклады A=(+2,−2,+2,−2), B=(+1,+1,+1,+1). Прогнозы 8,4,8,4. У A подписанное среднее равно нулю, однако каждый объект имеет вклад по модулю 2; у B оба средних равны 1. Значит, по mean absolute A выше B. Нулевой D_A означает компенсацию, а не отсутствие влияния.",
            "Если все вклады A равны 2, I_A останется 2, но D_A станет 2. Две разные картины будут иметь одинаковый глобальный bar. Для понимания направлений нужны исходные подписанные значения, распределения и контекст конкретных объектов. В следующем уроке изучим beeswarm и dependence."
          ],
          "bars",
          []
        ],
        [
          "bar",
          "4. Как читать глобальный bar",
          [
            "В SHAP shap.plots.bar(explanation) с несколькими строками обычно строит mean absolute SHAP. Ось показывает средний модуль, порядок — ранжирование. Для одной строки бар отражает локальные атрибуции; проверяйте размерность Explanation и подписи. Не сравнивайте длины между графиками с разными шкалами выхода. Группировка оставшихся признаков зависит от max_display и API; для аудита сохраняйте полную таблицу.",
            "Среднее скрывает знак, разброс, редкие большие вклады и различия подгрупп. Высокое I не доказывает монотонность, полезность для метрики, причинность или необходимость признака. Локальные waterfall и force из 10.1.3 объясняют отдельные прогнозы. Глобальный бар — начало исследования, не конечный вывод."
          ],
          null,
          []
        ],
        [
          "cohorts",
          "5. Подгруппы и размер выборки",
          [
            "Рассмотрим отдельный учебный пример: в группе G1 три объекта, I_A=3, I_B=1; в G2 один объект, I_A=1, I_B=2. Ранги различаются. Общие I_A=(3×3+1×1)/4=2,5 и I_B=(3×1+1×2)/4=1,25. Простое среднее двух групп ошибочно, если их размеры различаются. Для непересекающихся групп, покрывающих выборку, общий средний модуль — взвешенное среднее групповых.",
            "Чтобы сравнивать возрастные группы в лаборатории, применим один обученный регрессор, одну игру и фон. Если сменить background, изменится и точка сравнения — это другой эксперимент. Малые группы дают нестабильные оценки; указывайте n, правила отбора и неопределённость. Не переносите результат выборки на весь рынок без проверки репрезентативности."
          ],
          "cohorts",
          [
            "Iⱼ = Σ_g (n_g/n) Iⱼ(g)"
          ]
        ],
        [
          "noise",
          "6. Шумовые и зависимые признаки",
          [
            "Добавим к синтетическим данным независимый шумовой столбец, не участвующий в генерации y. Обученная конечная модель всё равно может случайно использовать его; ненулевой SHAP у шума возможен. Это повод проверить качество на отложенной выборке и повторить обучение, а не объявлять метод неверным. Сравните шум с сигналом и его интервалы, не обещайте заранее конкретный ранг.",
            "Сильная зависимость признаков может перераспределять атрибуции в зависимости от игры. Нельзя из одного глобального ранга заключить, что признак нужно удалить: сравните качество, альтернативные модели, зависимость и требования задачи. Сходство train/test графиков не доказывает отсутствие переобучения — отдельно проверяйте MAE, RMSE и R²."
          ],
          null,
          []
        ],
        [
          "methods",
          "7. SHAP, PFI и SAGE — три вопроса",
          [
            "Mean absolute SHAP измеряет типичный размер атрибуции прогноза; истинный y для агрегации не нужен. PFI измеряет изменение качества при перестановке столбца у фиксированной модели, например MAE_permuted − MAE_original. Это не переобучение без признака (LOCO). При корреляциях маргинальная перестановка может нарушить структуру данных; знак PFI может быть отрицательным.",
            "SAGE распределяет выигрыш в игре качества: v(S)=E[L(Y,f_empty)]−E[L(Y,f_S)]. f_S — согласованный прогноз с доступными признаками S, полученный выбранной стратегией исключения остальных. При v(∅)=0 сумма SAGE равна v(full). Это значения Шепли для другой игры, а не усреднённые модули SHAP; PFI не обязана складываться в выигрыш. Conditional и marginal стратегии задают разные вопросы. Полный вычислительный практикум SAGE остаётся отдельным углублением."
          ],
          "methods",
          [
            "PFIⱼ = MAE(permuted j) − MAE(original)",
            "v(S) = E[L(Y,f_empty)] − E[L(Y,f_S)]"
          ]
        ],
        [
          "uncertainty",
          "8. Неопределённость и bootstrap",
          [
            "Для фиксированной модели и фона повторно выбираем n строк объяснений с возвращением и вычисляем I в каждой реплике. Квантили 2,5% и 97,5% образуют приближённый percentile interval. Иллюстрация использует учебный набор модулей (0,1,2,3), а не модельные результаты: среднее 1,5, перебор 4⁴=256 равновероятных bootstrap выборок даёт границы 0,5 и 2,5 при линейной интерполяции квантилей.",
            "В практике используем 1000 повторов. Интервалы отражают выборочную вариативность при условии фиксированной модели/фона и предположении независимых одинаково распределённых строк. Это не гарантия покрытия для малых выборок, не неопределённость обучения и не интервал причинного эффекта. Для зависимых объектов нужен групповой/блочный bootstrap. SD повторов PFI характеризует случайные перестановки, не тот же интервал. Для проверки устойчивости рангов повторяйте весь эксперимент на других выборках и моделях."
          ],
          "interval",
          []
        ],
        [
          "report",
          "9. Профессиональный отчёт и следующий шаг",
          [
            "Отчёт должен содержать модель/версию, данные и разбиение, n и размеры подгрупп, фоновую выборку, explainer и выход, единицы, проверку аддитивности, MAE/RMSE/R², таблицу I/D с интервалами, сравнение PFI и ограничения. Пример формулировки: «в этой тестовой выборке и игре A имеет больший средний модуль атрибуции, чем B». Не пишите «A причинно определяет цену».",
            "Самостоятельно измените границу возраста, сохранив фон, затем повторите с другим train-only фоном и объясните отличие двух экспериментов. Оценка: 25% корректность расчёта, 25% воспроизводимость, 25% интерпретация, 25% ограничения. Для исследовательского уровня повторите fit с новым seed и сравните ранги, отдельно от bootstrap. Далее 10.2.2: выбор графика для задачи, восстановление информации о знаке и распределении."
          ],
          null,
          []
        ]
      ],
      "diagrams": {
        "matrix": {
          "layout": "shap-global-matrix",
          "title": "Матрица → агрегаты",
          "description": "Четыре учебные строки, два признака, база 5. Значения не получены обучением.",
          "caption": "Четыре учебные строки, два признака, база 5. Значения не получены обучением.",
          "labels": {
            "row": "Объект",
            "prediction": "Прогноз",
            "overall": "Общий",
            "unit": "Единицы выхода",
            "count": "Частота",
            "mean": "Среднее"
          },
          "methodRows": [
            [
              "SHAP",
              "Размер вклада в прогноз",
              "Выход модели",
              "Нет"
            ],
            [
              "PFI",
              "Рост потерь при перестановке",
              "Единицы loss",
              "Да"
            ],
            [
              "SAGE",
              "Доля выигрыша коалиций",
              "Единицы loss",
              "Да"
            ]
          ],
          "headers": [
            "Метод",
            "Вопрос",
            "Единицы",
            "Нужен y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "bars": {
          "layout": "shap-global-bars",
          "title": "Знак и модуль",
          "description": "A: I=2, D=0; B: I=1, D=1. Один масштаб.",
          "caption": "A: I=2, D=0; B: I=1, D=1. Один масштаб.",
          "labels": {
            "row": "Объект",
            "prediction": "Прогноз",
            "overall": "Общий",
            "unit": "Единицы выхода",
            "count": "Частота",
            "mean": "Среднее"
          },
          "methodRows": [
            [
              "SHAP",
              "Размер вклада в прогноз",
              "Выход модели",
              "Нет"
            ],
            [
              "PFI",
              "Рост потерь при перестановке",
              "Единицы loss",
              "Да"
            ],
            [
              "SAGE",
              "Доля выигрыша коалиций",
              "Единицы loss",
              "Да"
            ]
          ],
          "headers": [
            "Метод",
            "Вопрос",
            "Единицы",
            "Нужен y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "cohorts": {
          "layout": "shap-global-cohorts",
          "title": "Сравнение подгрупп",
          "description": "Отдельный учебный пример: G1 n=3, G2 n=1, общие I=(2.5,1.25).",
          "caption": "Отдельный учебный пример: G1 n=3, G2 n=1, общие I=(2.5,1.25).",
          "labels": {
            "row": "Объект",
            "prediction": "Прогноз",
            "overall": "Общий",
            "unit": "Единицы выхода",
            "count": "Частота",
            "mean": "Среднее"
          },
          "methodRows": [
            [
              "SHAP",
              "Размер вклада в прогноз",
              "Выход модели",
              "Нет"
            ],
            [
              "PFI",
              "Рост потерь при перестановке",
              "Единицы loss",
              "Да"
            ],
            [
              "SAGE",
              "Доля выигрыша коалиций",
              "Единицы loss",
              "Да"
            ]
          ],
          "headers": [
            "Метод",
            "Вопрос",
            "Единицы",
            "Нужен y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "methods": {
          "layout": "shap-global-methods",
          "title": "Три разных вопроса",
          "description": "SHAP — прогноз; PFI — перестановка; SAGE — игра качества.",
          "caption": "SHAP — прогноз; PFI — перестановка; SAGE — игра качества.",
          "labels": {
            "row": "Объект",
            "prediction": "Прогноз",
            "overall": "Общий",
            "unit": "Единицы выхода",
            "count": "Частота",
            "mean": "Среднее"
          },
          "methodRows": [
            [
              "SHAP",
              "Размер вклада в прогноз",
              "Выход модели",
              "Нет"
            ],
            [
              "PFI",
              "Рост потерь при перестановке",
              "Единицы loss",
              "Да"
            ],
            [
              "SAGE",
              "Доля выигрыша коалиций",
              "Единицы loss",
              "Да"
            ]
          ],
          "headers": [
            "Метод",
            "Вопрос",
            "Единицы",
            "Нужен y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "interval": {
          "layout": "shap-global-interval",
          "title": "Учебный bootstrap",
          "description": "Распределение средних всех 256 пересборок (0,1,2,3); не CI модели.",
          "caption": "Распределение средних всех 256 пересборок (0,1,2,3); не CI модели.",
          "labels": {
            "row": "Объект",
            "prediction": "Прогноз",
            "overall": "Общий",
            "unit": "Единицы выхода",
            "count": "Частота",
            "mean": "Среднее"
          },
          "methodRows": [
            [
              "SHAP",
              "Размер вклада в прогноз",
              "Выход модели",
              "Нет"
            ],
            [
              "PFI",
              "Рост потерь при перестановке",
              "Единицы loss",
              "Да"
            ],
            [
              "SAGE",
              "Доля выигрыша коалиций",
              "Единицы loss",
              "Да"
            ]
          ],
          "headers": [
            "Метод",
            "Вопрос",
            "Единицы",
            "Нужен y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      "glossary": [
        [
          "Глобальная важность",
          "Статистика важности на заданной совокупности."
        ],
        [
          "Матрица SHAP",
          "Строки — объекты, столбцы — признаки выбранного выхода."
        ],
        [
          "Mean absolute SHAP",
          "Среднее |φ| по объектам."
        ],
        [
          "Подписанное среднее",
          "Среднее φ с сохранением знака."
        ],
        [
          "Компенсация",
          "Противоположные вклады уменьшают подписанное среднее."
        ],
        [
          "Подгруппа",
          "Определённое подмножество объектов."
        ],
        [
          "Взвешенное среднее",
          "Среднее групп с весами n_g/n."
        ],
        [
          "Фон",
          "Референс, определяющий игру и базу."
        ],
        [
          "Шумовой признак",
          "В данном эксперименте независимый столбец вне генератора цели."
        ],
        [
          "PFI",
          "Изменение метрики после перестановки признака."
        ],
        [
          "SAGE",
          "Значения Шепли для игры предсказательного качества."
        ],
        [
          "Bootstrap",
          "Повторная выборка наблюдений с возвращением."
        ],
        [
          "Percentile interval",
          "Интервал по эмпирическим квантилям bootstrap статистики."
        ],
        [
          "Аддитивность",
          "База и сумма вкладов восстанавливают выбранный прогноз."
        ],
        [
          "Model reliance",
          "Зависимость качества конкретной модели от признака в определённой оценке."
        ]
      ],
      "quiz": [
        [
          "Какой I_A для (+2,−2,+2,−2)?",
          [
            "0",
            "2",
            "8"
          ],
          1,
          "Среднее четырёх модулей равно 2."
        ],
        [
          "Какой D_A для той же строки вкладов?",
          [
            "0",
            "2",
            "−2"
          ],
          0,
          "Знаки взаимно компенсируются."
        ],
        [
          "Какое неравенство верно?",
          [
            "I < |D|",
            "I = D всегда",
            "I ≥ |D|"
          ],
          2,
          "Это следует из неравенства треугольника."
        ],
        [
          "Что теряется на mean absolute bar?",
          [
            "Знак и распределение",
            "Средний модуль",
            "Имена всех отображённых признаков"
          ],
          0,
          "Один агрегат не сохраняет исходные значения."
        ],
        [
          "Группы n=3 и n=1 имеют I=3 и I=1. Общий I?",
          [
            "2",
            "2.5",
            "4"
          ],
          1,
          "(3×3+1×1)/4=2.5."
        ],
        [
          "Как сравнить подгруппы?",
          [
            "Сменить фон в каждой без оговорки",
            "Игнорировать размеры",
            "Фиксировать модель, выход, игру и n"
          ],
          2,
          "Иначе меняется сравниваемый вопрос."
        ],
        [
          "Может ли шум иметь ненулевой SHAP?",
          [
            "Да, обученная модель может его использовать",
            "Нет, никогда",
            "Только если ошибка библиотеки"
          ],
          0,
          "Конечная обученная модель может выучить случайную связь."
        ],
        [
          "Что измеряет PFI с neg MAE?",
          [
            "Средний прогноз",
            "Рост MAE после перестановки",
            "Средний модуль SHAP"
          ],
          1,
          "Разность score_original−score_permuted равна росту MAE."
        ],
        [
          "Что распределяет SAGE?",
          [
            "Один прогноз",
            "Сумму I",
            "Выигрыш в игре качества"
          ],
          2,
          "Это другая игра Шепли."
        ],
        [
          "Что отражает bootstrap строк при фиксированной модели?",
          [
            "Выборочную вариативность условно на модели и фоне",
            "Полную неопределённость обучения",
            "Причинный эффект"
          ],
          0,
          "Обучение и фон не перевыбираются."
        ],
        [
          "Что доказывает сходство train/test рангов?",
          [
            "Отсутствие переобучения",
            "Само по себе не доказывает качество",
            "Причинность"
          ],
          1,
          "Проверяйте независимые метрики и устойчивость."
        ],
        [
          "Как сформулировать вывод?",
          [
            "A всегда повышает цену",
            "A причинно важен",
            "A имеет больший I в указанной выборке и игре"
          ],
          2,
          "Вывод ограничен постановкой."
        ]
      ],
      "sources": [
        [
          "Lundberg & Lee (2017). A Unified Approach to Interpreting Model Predictions.",
          "https://papers.nips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ],
        [
          "Lundberg et al. (2020). From local explanations to global understanding with explainable AI for trees.",
          "https://www.nature.com/articles/s42256-019-0138-9"
        ],
        [
          "Covert, Lundberg & Lee (2020). Understanding Global Feature Contributions With Additive Importance Measures.",
          "https://proceedings.neurips.cc/paper/2020/hash/c7bf0b7c1a86d5eb3be2c722cf2cf746-Abstract.html"
        ],
        [
          "Fisher, Rudin & Dominici (2019). All Models are Wrong, but Many are Useful.",
          "https://www.jmlr.org/beta/papers/v20/18-760.html"
        ],
        [
          "SHAP — global and local bar examples",
          "https://shap.readthedocs.io/en/stable/example_notebooks/api_examples/plots/bar.html"
        ],
        [
          "SHAP — beeswarm examples",
          "https://shap.readthedocs.io/en/stable/example_notebooks/api_examples/plots/beeswarm.html"
        ],
        [
          "SHAP — TreeExplainer",
          "https://shap.readthedocs.io/en/latest/generated/shap.TreeExplainer.html"
        ],
        [
          "SHAP — Explanation",
          "https://shap.readthedocs.io/en/latest/generated/shap.Explanation.html"
        ],
        [
          "scikit-learn — permutation feature importance",
          "https://scikit-learn.org/stable/modules/permutation_importance"
        ]
      ],
      "practice": {
        "title": "Глобальный SHAP на тестовых квартирах",
        "intro": "Синтетический регрессор, 600 train и 200 test, независимый шум, 64 фоновых строки, 1000 bootstrap и 20 перестановок. Это не оценка реальной недвижимости.",
        "task": "Сравните I, D, группы и PFI; проверьте остатки и интерпретируйте шум.",
        "steps": [
          "Установите закреплённые зависимости в Python 3.12.",
          "Запустите код; прочитайте shape, остаток и метрики из JSON.",
          "Откройте CSV и два PNG, сравните подписанные и абсолютные вклады.",
          "Измените группу и повторите с другим train-only фоном; оцените по рубрике раздела 9."
        ],
        "install": "python -m pip install numpy==2.5.5 shap==0.54.1 scikit-learn==1.9.1 matplotlib==3.11.2 pandas==3.1.1",
        "run": "python a-10-2-1-shap-global-importance.py"
      }
    },
    "en": {
      "title": "Global Feature Importance",
      "lead": "Aggregate local SHAP contributions, compare cohorts, quantify uncertainty and distinguish SHAP from PFI and SAGE.",
      "outcomes": [
        "Specify the sample, model, output and background game.",
        "Check SHAP matrix shape and row-wise additivity.",
        "Compute mean absolute and mean signed attributions.",
        "Recognise sign cancellation and loss of distribution information.",
        "Compare cohorts under a fixed background and weight them.",
        "Interpret a global bar plot versus a local one.",
        "Distinguish the questions answered by SHAP, PFI and SAGE.",
        "Estimate sampling uncertainty by bootstrap.",
        "Write a reproducible global report without causal claims."
      ],
      "sections": [
        [
          "population",
          "1. From one instance to a population",
          [
            "Local SHAP answers a question about one prediction. To study model behaviour, collect explanations for a specified set, such as 200 held-out apartments. Global importance here is a statistic of that sample, not a universal feature property. Fix model, preprocessing, background, masking rule and one output. For multiple classes, analyse each output separately.",
            "Passport: inputs are explanations from one model for n instances and m features; outputs are attribution statistics and a ranking in units of f. True y is unnecessary for describing SHAP distributions, but is needed for performance and PFI/SAGE. Keep training and evaluation separate. Our lab takes background only from train and explains test."
          ],
          null,
          []
        ],
        [
          "matrix",
          "2. Attribution matrix and aggregation",
          [
            "Let φᵢⱼ denote feature j's attribution for instance i. A scalar-output explanation has n rows and m columns. First verify names, row order, output and base_values: f(xᵢ) ≈ bᵢ + Σⱼφᵢⱼ. Then Iⱼ is mean absolute attribution and Dⱼ is mean signed attribution. Both have output units; Iⱼ is nonnegative and Dⱼ may have either sign.",
            "The triangle inequality gives |Σᵢφᵢⱼ| ≤ Σᵢ|φᵢⱼ|. Dividing by n gives |Dⱼ| ≤ Iⱼ. Equality holds when nonzero contributions have one sign. The sum of Dⱼ equals the average deviation from base, but the sum of Iⱼ need not equal it. Do not interpret normalised Iⱼ as shares of predictive quality."
          ],
          "matrix",
          [
            "Iⱼ = (1/n) Σᵢ |φᵢⱼ|",
            "Dⱼ = (1/n) Σᵢ φᵢⱼ",
            "|Dⱼ| ≤ Iⱼ"
          ]
        ],
        [
          "cancellation",
          "3. Sign cancellation: a worked example",
          [
            "Constructed teaching data (not a trained-model result): four instances, base 5, A=(+2,−2,+2,−2), B=(+1,+1,+1,+1). Predictions are 8,4,8,4. A has signed mean zero but magnitude 2 on every instance; B has both means equal to 1. A therefore ranks above B by mean absolute SHAP. Zero D_A means cancellation, not absence of influence.",
            "If all A contributions are 2, I_A remains 2 but D_A becomes 2. Two very different patterns yield the same global bar. Directions require signed values, distributions and instance context. The next lesson studies beeswarm and dependence plots."
          ],
          "bars",
          []
        ],
        [
          "bar",
          "4. Reading a global bar plot",
          [
            "In SHAP, shap.plots.bar(explanation) with multiple rows normally displays mean absolute SHAP. The axis is magnitude and order is ranking. With one row it is a local attribution plot; check Explanation shape and labels. Do not compare lengths across different output scales. Grouping of remaining features depends on max_display and API; keep the full table for audit.",
            "A mean hides sign, dispersion, rare large contributions and subgroup differences. High I establishes neither monotonicity, metric utility, causality nor indispensability. Local waterfall and force plots from 10.1.3 explain individual predictions. A global bar starts an investigation; it does not finish it."
          ],
          null,
          []
        ],
        [
          "cohorts",
          "5. Cohorts and sample size",
          [
            "Consider a separate teaching example: G1 has three instances with I_A=3, I_B=1; G2 has one instance with I_A=1, I_B=2. Rankings differ. Overall I_A=(3×3+1×1)/4=2.5 and I_B=(3×1+1×2)/4=1.25. Averaging groups equally is wrong when their sizes differ. For disjoint cohorts covering the sample, the overall mean absolute attribution is the size-weighted mean.",
            "To compare age cohorts in the lab, keep one trained regressor, game and background. Changing the background changes the reference question and constitutes a different experiment. Small groups yield unstable estimates; state n, selection rules and uncertainty. Do not generalise a sample to the entire market without checking representativeness."
          ],
          "cohorts",
          [
            "Iⱼ = Σ_g (n_g/n) Iⱼ(g)"
          ]
        ],
        [
          "noise",
          "6. Noise and dependent features",
          [
            "Add an independent noise column that does not enter the synthetic target generator. A fitted finite-sample model may still use it by chance, so noise SHAP can be nonzero. This motivates held-out quality checks and repeated fitting, not automatic rejection of the explainer. Compare noise with signal and its intervals; do not promise a rank before execution.",
            "Strong dependence can redistribute attributions according to the game. A global rank alone cannot establish that a feature should be removed: examine performance, alternative models, dependence and task requirements. Similar train/test plots do not establish absence of overfitting; separately evaluate MAE, RMSE and R²."
          ],
          null,
          []
        ],
        [
          "methods",
          "7. SHAP, PFI and SAGE: three questions",
          [
            "Mean absolute SHAP measures typical prediction attribution magnitude; aggregation does not require true y. PFI measures performance change after permuting a column for a fixed model, e.g. MAE_permuted − MAE_original. It is not retraining without a feature (LOCO). With correlation, marginal permutation may disrupt data structure; PFI may be negative.",
            "SAGE allocates gain in a performance game: v(S)=E[L(Y,f_empty)]−E[L(Y,f_S)]. f_S is the restricted prediction obtained under a chosen feature-removal strategy. With v(∅)=0 the sum of SAGE equals v(full). These are Shapley values for a different game, not mean absolute SHAP; PFI need not sum to the gain. Conditional and marginal strategies pose different questions. A full SAGE computation lab remains an advanced topic."
          ],
          "methods",
          [
            "PFIⱼ = MAE(permuted j) − MAE(original)",
            "v(S) = E[L(Y,f_empty)] − E[L(Y,f_S)]"
          ]
        ],
        [
          "uncertainty",
          "8. Uncertainty and bootstrap",
          [
            "With model and background fixed, resample n explanation rows with replacement and compute I in each replicate. The 2.5% and 97.5% quantiles form an approximate percentile interval. The diagram uses teaching magnitudes (0,1,2,3), not model outputs: mean 1.5; enumerating all 4⁴=256 equally likely bootstrap resamples gives 0.5 and 2.5 under linear quantile interpolation.",
            "In the lab use 1000 replicates. Intervals reflect sampling variation conditional on fixed model/background and an iid row assumption. They are not guaranteed small-sample coverage, training uncertainty or causal-effect intervals. Dependent rows require group/block bootstrap. PFI repeat SD reflects random permutations, not the same interval. Repeat the whole experiment on other samples and models to study ranking stability."
          ],
          "interval",
          []
        ],
        [
          "report",
          "9. Professional report and next step",
          [
            "A report includes model/version, data split, n and cohort sizes, background, explainer and output, units, additivity checks, MAE/RMSE/R², I/D with intervals, PFI comparison and limitations. Example: “in this test sample and game A has a larger mean absolute attribution than B.” Do not write “A causally determines price.”",
            "Independently change the age cutoff while holding background fixed; then use another train-only background and explain the difference between experiments. Rubric: 25% arithmetic, 25% reproducibility, 25% interpretation, 25% limitations. For research depth refit with another seed and compare ranks separately from bootstrap. Next, 10.2.2 chooses plots for tasks and recovers sign and distribution information."
          ],
          null,
          []
        ]
      ],
      "diagrams": {
        "matrix": {
          "layout": "shap-global-matrix",
          "title": "Matrix → aggregates",
          "description": "Four teaching rows, two features, base 5; not trained outputs.",
          "caption": "Four teaching rows, two features, base 5; not trained outputs.",
          "labels": {
            "row": "Instance",
            "prediction": "Prediction",
            "overall": "Overall",
            "unit": "Output units",
            "count": "Count",
            "mean": "Mean"
          },
          "methodRows": [
            [
              "SHAP",
              "Prediction attribution size",
              "Model output",
              "No"
            ],
            [
              "PFI",
              "Loss increase on permutation",
              "Loss units",
              "Yes"
            ],
            [
              "SAGE",
              "Allocation of coalition gain",
              "Loss units",
              "Yes"
            ]
          ],
          "headers": [
            "Method",
            "Question",
            "Units",
            "Needs y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "bars": {
          "layout": "shap-global-bars",
          "title": "Sign and magnitude",
          "description": "A: I=2, D=0; B: I=1, D=1. Common scale.",
          "caption": "A: I=2, D=0; B: I=1, D=1. Common scale.",
          "labels": {
            "row": "Instance",
            "prediction": "Prediction",
            "overall": "Overall",
            "unit": "Output units",
            "count": "Count",
            "mean": "Mean"
          },
          "methodRows": [
            [
              "SHAP",
              "Prediction attribution size",
              "Model output",
              "No"
            ],
            [
              "PFI",
              "Loss increase on permutation",
              "Loss units",
              "Yes"
            ],
            [
              "SAGE",
              "Allocation of coalition gain",
              "Loss units",
              "Yes"
            ]
          ],
          "headers": [
            "Method",
            "Question",
            "Units",
            "Needs y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "cohorts": {
          "layout": "shap-global-cohorts",
          "title": "Cohort comparison",
          "description": "Separate teaching example: G1 n=3, G2 n=1, overall I=(2.5,1.25).",
          "caption": "Separate teaching example: G1 n=3, G2 n=1, overall I=(2.5,1.25).",
          "labels": {
            "row": "Instance",
            "prediction": "Prediction",
            "overall": "Overall",
            "unit": "Output units",
            "count": "Count",
            "mean": "Mean"
          },
          "methodRows": [
            [
              "SHAP",
              "Prediction attribution size",
              "Model output",
              "No"
            ],
            [
              "PFI",
              "Loss increase on permutation",
              "Loss units",
              "Yes"
            ],
            [
              "SAGE",
              "Allocation of coalition gain",
              "Loss units",
              "Yes"
            ]
          ],
          "headers": [
            "Method",
            "Question",
            "Units",
            "Needs y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "methods": {
          "layout": "shap-global-methods",
          "title": "Three different questions",
          "description": "SHAP: prediction; PFI: permutation; SAGE: performance game.",
          "caption": "SHAP: prediction; PFI: permutation; SAGE: performance game.",
          "labels": {
            "row": "Instance",
            "prediction": "Prediction",
            "overall": "Overall",
            "unit": "Output units",
            "count": "Count",
            "mean": "Mean"
          },
          "methodRows": [
            [
              "SHAP",
              "Prediction attribution size",
              "Model output",
              "No"
            ],
            [
              "PFI",
              "Loss increase on permutation",
              "Loss units",
              "Yes"
            ],
            [
              "SAGE",
              "Allocation of coalition gain",
              "Loss units",
              "Yes"
            ]
          ],
          "headers": [
            "Method",
            "Question",
            "Units",
            "Needs y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "interval": {
          "layout": "shap-global-interval",
          "title": "Teaching bootstrap",
          "description": "Distribution of means of all 256 resamples of (0,1,2,3); not model CI.",
          "caption": "Distribution of means of all 256 resamples of (0,1,2,3); not model CI.",
          "labels": {
            "row": "Instance",
            "prediction": "Prediction",
            "overall": "Overall",
            "unit": "Output units",
            "count": "Count",
            "mean": "Mean"
          },
          "methodRows": [
            [
              "SHAP",
              "Prediction attribution size",
              "Model output",
              "No"
            ],
            [
              "PFI",
              "Loss increase on permutation",
              "Loss units",
              "Yes"
            ],
            [
              "SAGE",
              "Allocation of coalition gain",
              "Loss units",
              "Yes"
            ]
          ],
          "headers": [
            "Method",
            "Question",
            "Units",
            "Needs y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      "glossary": [
        [
          "Global importance",
          "Importance statistic over a specified set."
        ],
        [
          "SHAP matrix",
          "Rows are instances, columns features of the chosen output."
        ],
        [
          "Mean absolute SHAP",
          "Average |φ| over instances."
        ],
        [
          "Signed mean",
          "Mean φ preserving its sign."
        ],
        [
          "Cancellation",
          "Opposite contributions reduce the signed mean."
        ],
        [
          "Cohort",
          "Defined subset of instances."
        ],
        [
          "Weighted mean",
          "Mean of groups weighted by n_g/n."
        ],
        [
          "Background",
          "Reference defining the game and base."
        ],
        [
          "Noise feature",
          "Here an independent column excluded from target generation."
        ],
        [
          "PFI",
          "Metric change after feature permutation."
        ],
        [
          "SAGE",
          "Shapley values for a predictive-power game."
        ],
        [
          "Bootstrap",
          "Resampling observations with replacement."
        ],
        [
          "Percentile interval",
          "Interval from empirical bootstrap quantiles."
        ],
        [
          "Additivity",
          "Base plus sum of contributions reconstructs the selected prediction."
        ],
        [
          "Model reliance",
          "A model's performance dependence on a feature under a specified assessment."
        ]
      ],
      "quiz": [
        [
          "What is I_A for (+2,−2,+2,−2)?",
          [
            "0",
            "2",
            "8"
          ],
          1,
          "Mean of four magnitudes is 2."
        ],
        [
          "What is D_A for these contributions?",
          [
            "0",
            "2",
            "−2"
          ],
          0,
          "Signs cancel."
        ],
        [
          "Which inequality holds?",
          [
            "I < |D|",
            "I = D always",
            "I ≥ |D|"
          ],
          2,
          "By the triangle inequality."
        ],
        [
          "What does mean absolute bar hide?",
          [
            "Sign and distribution",
            "Mean magnitude",
            "All displayed feature names"
          ],
          0,
          "One aggregate does not retain the original values."
        ],
        [
          "Cohorts n=3 and n=1 have I=3 and I=1. Overall I?",
          [
            "2",
            "2.5",
            "4"
          ],
          1,
          "(3×3+1×1)/4=2.5."
        ],
        [
          "How should cohorts be compared?",
          [
            "Change each background silently",
            "Ignore sizes",
            "Fix model, output, game and record n"
          ],
          2,
          "Otherwise the reference question changes."
        ],
        [
          "Can noise have nonzero SHAP?",
          [
            "Yes, the fitted model may use it",
            "No, never",
            "Only if library is broken"
          ],
          0,
          "A finite-sample model may learn chance patterns."
        ],
        [
          "What does PFI with neg MAE measure?",
          [
            "Mean prediction",
            "Increase in MAE after permutation",
            "Mean absolute SHAP"
          ],
          1,
          "Score_original−score_permuted equals MAE increase."
        ],
        [
          "What does SAGE allocate?",
          [
            "One prediction",
            "Sum of I",
            "Gain in a performance game"
          ],
          2,
          "It is a different Shapley game."
        ],
        [
          "What does row bootstrap with fixed model reflect?",
          [
            "Sampling variation conditional on model and background",
            "Full training uncertainty",
            "Causal effect"
          ],
          0,
          "Model fitting and background are not resampled."
        ],
        [
          "What does similarity of train/test ranks prove?",
          [
            "No overfitting",
            "By itself it does not establish quality",
            "Causality"
          ],
          1,
          "Check held-out metrics and stability."
        ],
        [
          "Which report statement is appropriate?",
          [
            "A always increases price",
            "A is causally important",
            "A has greater I in the stated sample and game"
          ],
          2,
          "The conclusion is conditional on the setup."
        ]
      ],
      "sources": [
        [
          "Lundberg & Lee (2017). A Unified Approach to Interpreting Model Predictions.",
          "https://papers.nips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ],
        [
          "Lundberg et al. (2020). From local explanations to global understanding with explainable AI for trees.",
          "https://www.nature.com/articles/s42256-019-0138-9"
        ],
        [
          "Covert, Lundberg & Lee (2020). Understanding Global Feature Contributions With Additive Importance Measures.",
          "https://proceedings.neurips.cc/paper/2020/hash/c7bf0b7c1a86d5eb3be2c722cf2cf746-Abstract.html"
        ],
        [
          "Fisher, Rudin & Dominici (2019). All Models are Wrong, but Many are Useful.",
          "https://www.jmlr.org/beta/papers/v20/18-760.html"
        ],
        [
          "SHAP — global and local bar examples",
          "https://shap.readthedocs.io/en/stable/example_notebooks/api_examples/plots/bar.html"
        ],
        [
          "SHAP — beeswarm examples",
          "https://shap.readthedocs.io/en/stable/example_notebooks/api_examples/plots/beeswarm.html"
        ],
        [
          "SHAP — TreeExplainer",
          "https://shap.readthedocs.io/en/latest/generated/shap.TreeExplainer.html"
        ],
        [
          "SHAP — Explanation",
          "https://shap.readthedocs.io/en/latest/generated/shap.Explanation.html"
        ],
        [
          "scikit-learn — permutation feature importance",
          "https://scikit-learn.org/stable/modules/permutation_importance"
        ]
      ],
      "practice": {
        "title": "Global SHAP on held-out apartments",
        "intro": "Synthetic regressor, 600 train and 200 test, independent noise, 64 background rows, 1000 bootstrap and 20 permutations. Not real property appraisal.",
        "task": "Compare I, D, cohorts and PFI; verify residuals and interpret noise.",
        "steps": [
          "Install pinned dependencies in Python 3.12.",
          "Run code; inspect shape, residual and metrics in JSON.",
          "Open CSV and two PNGs; compare signed and absolute contributions.",
          "Change cohort and repeat with a different train-only background; use section 9 rubric."
        ],
        "install": "python -m pip install numpy==2.5.5 shap==0.54.1 scikit-learn==1.9.1 matplotlib==3.11.2 pandas==3.1.1",
        "run": "python a-10-2-1-shap-global-importance.py"
      }
    },
    "zh": {
      "title": "全局特征重要性",
      "lead": "聚合局部 SHAP 贡献，比较子群体，评估不确定性，并区分 SHAP、PFI 与 SAGE。",
      "outcomes": [
        "确定样本、模型、输出与背景博弈。",
        "检查 SHAP 矩阵形状及逐行可加性。",
        "计算平均绝对归因与有符号平均归因。",
        "识别符号抵消与分布信息丢失。",
        "在固定背景下比较子群并正确加权。",
        "解读全局条形图并与局部图区分。",
        "区分 SHAP、PFI 与 SAGE 所回答的问题。",
        "通过 bootstrap 评估抽样不确定性。",
        "撰写可复现的全局报告，不作因果断言。"
      ],
      "sections": [
        [
          "population",
          "1. 从单个样本到总体",
          [
            "局部 SHAP 回答单个预测的问题。为研究模型行为，收集预先确定的样本集合的解释，例如 200 个测试公寓。这里的全局重要性是该样本的统计量，不是特征的普遍属性。固定模型、预处理、背景、掩蔽规则和一个输出。多类别应分别分析各输出。",
            "方法概览：输入为同一模型对 n 个样本、m 个特征的解释；输出为以 f 的单位表示的归因统计与排序。描述 SHAP 分布不需要真实 y，但性能评估与 PFI/SAGE 需要。训练与评估分离；实验仅从训练集取背景，解释测试集。"
          ],
          null,
          []
        ],
        [
          "matrix",
          "2. 归因矩阵与聚合",
          [
            "令 φᵢⱼ 表示样本 i 的特征 j 的归因。标量输出的解释有 n 行、m 列。先核对名称、行顺序、输出和 base_values：f(xᵢ) ≈ bᵢ + Σⱼφᵢⱼ。Iⱼ 为平均绝对归因，Dⱼ 为有符号平均。二者均使用输出单位；Iⱼ 非负，Dⱼ 可正可负。",
            "三角不等式给出 |Σᵢφᵢⱼ| ≤ Σᵢ|φᵢⱼ|。两边除以 n 得 |Dⱼ| ≤ Iⱼ。非零贡献同号时取等。Dⱼ 之和等于相对基值的平均偏差，而 Iⱼ 之和不必等于它。不要把归一化 Iⱼ 解释为预测质量的份额。"
          ],
          "matrix",
          [
            "Iⱼ = (1/n) Σᵢ |φᵢⱼ|",
            "Dⱼ = (1/n) Σᵢ φᵢⱼ",
            "|Dⱼ| ≤ Iⱼ"
          ]
        ],
        [
          "cancellation",
          "3. 符号抵消：手算示例",
          [
            "构造的教学数据（非训练结果）：四个样本，基值 5，A=(+2,−2,+2,−2)，B=(+1,+1,+1,+1)。预测为 8,4,8,4。A 的有符号均值为零，但每个样本的绝对贡献为 2；B 的两个均值均为 1。因此按平均绝对 SHAP，A 排在 B 前。D_A 为零表示抵消，不表示没有影响。",
            "若 A 的贡献全为 2，I_A 仍为 2，但 D_A 变为 2。两种不同模式得到相同的全局条形图。方向分析需要有符号值、分布和样本语境。下一课学习蜂群图与依赖图。"
          ],
          "bars",
          []
        ],
        [
          "bar",
          "4. 阅读全局条形图",
          [
            "SHAP 的 shap.plots.bar(explanation) 对多行通常显示平均绝对 SHAP。坐标轴为大小，顺序为排序。单行则是局部归因图；核对 Explanation 形状与标签。不同输出尺度的条长不可直接比较。剩余特征的分组依赖 max_display 与 API；审计应保留完整表。",
            "均值隐藏符号、离散程度、罕见大贡献及子群差异。高 I 不能证明单调性、指标效用、因果性或不可缺少性。10.1.3 的局部瀑布图和力图解释单个预测；全局条形图只是研究的起点。"
          ],
          null,
          []
        ],
        [
          "cohorts",
          "5. 子群与样本规模",
          [
            "另一个教学例：G1 有三个样本，I_A=3、I_B=1；G2 有一个样本，I_A=1、I_B=2。排序不同。总体 I_A=(3×3+1×1)/4=2.5，I_B=(3×1+1×2)/4=1.25。组大小不同时，不能简单等权平均。对于不重叠且覆盖样本的子群，总体平均绝对归因为按大小加权的均值。",
            "实验中比较年龄子群时，保持同一训练好的回归器、博弈与背景。改变背景会改变参照问题，是另一个实验。小群估计可能不稳定，应报告 n、选择规则与不确定性。未核验代表性，不能推广至整个市场。"
          ],
          "cohorts",
          [
            "Iⱼ = Σ_g (n_g/n) Iⱼ(g)"
          ]
        ],
        [
          "noise",
          "6. 噪声与依赖特征",
          [
            "加入不参与合成目标生成的独立噪声列。有限样本训练的模型仍可能偶然使用它，因此噪声 SHAP 可非零。这应促使检查留出集质量并重复训练，而非直接否定解释器。比较噪声与信号及其区间，不预先承诺排名。",
            "强依赖可能随博弈设定重新分配归因。仅凭全局排名不能决定删除特征；应检查性能、替代模型、依赖与任务要求。训练/测试图相似不能证明没有过拟合；另行评估 MAE、RMSE 和 R²。"
          ],
          null,
          []
        ],
        [
          "methods",
          "7. SHAP、PFI 与 SAGE：三个问题",
          [
            "平均绝对 SHAP 衡量典型预测归因大小，聚合不需要真实 y。PFI 衡量固定模型在列置换后性能的变化，例如 MAE_permuted − MAE_original。这不同于去掉特征重新训练（LOCO）。相关性存在时，边际置换可能破坏数据结构；PFI 可为负。",
            "SAGE 分配性能博弈的收益：v(S)=E[L(Y,f_empty)]−E[L(Y,f_S)]。f_S 是按所选特征移除策略得到的受限预测。v(∅)=0 时 SAGE 之和等于 v(full)。这是另一博弈的 Shapley 值，并非平均绝对 SHAP；PFI 不必加总为收益。条件与边际策略回答不同问题。完整 SAGE 计算实验留作进阶主题。"
          ],
          "methods",
          [
            "PFIⱼ = MAE(permuted j) − MAE(original)",
            "v(S) = E[L(Y,f_empty)] − E[L(Y,f_S)]"
          ]
        ],
        [
          "uncertainty",
          "8. 不确定性与 bootstrap",
          [
            "固定模型和背景，有放回重采样 n 行解释，每次计算 I。2.5% 与 97.5% 分位数构成近似百分位区间。图示采用教学绝对值 (0,1,2,3)，而非模型结果：均值 1.5；枚举 4⁴=256 个等概率重采样，线性分位插值得到 0.5 与 2.5。",
            "实验使用 1000 次重复。区间反映固定模型/背景且样本独立同分布假设下的抽样变异。它不保证小样本覆盖率，不是训练不确定性或因果效应区间。依赖样本需要分组/分块 bootstrap。PFI 重复标准差反映随机置换，不是同一类区间。研究排名稳定性应更换样本和模型重做整个实验。"
          ],
          "interval",
          []
        ],
        [
          "report",
          "9. 专业报告与下一步",
          [
            "报告应包含模型/版本、数据划分、n 与子群大小、背景、解释器和输出、单位、可加性检查、MAE/RMSE/R²、带区间的 I/D 表、PFI 比较与局限。示例：“在该测试样本和博弈中，A 的平均绝对归因大于 B”。不要写“A 因果决定价格”。",
            "自行改变年龄阈值而保持背景固定；再使用另一训练集背景，说明两个实验的差别。评分：计算正确 25%、可复现 25%、解释 25%、局限 25%。研究层次用新种子重新拟合，独立于 bootstrap 比较排名。下一课 10.2.2 将按任务选择图形并恢复符号与分布信息。"
          ],
          null,
          []
        ]
      ],
      "diagrams": {
        "matrix": {
          "layout": "shap-global-matrix",
          "title": "矩阵 → 聚合",
          "description": "四个教学样本、两个特征、基值 5；非训练输出。",
          "caption": "四个教学样本、两个特征、基值 5；非训练输出。",
          "labels": {
            "row": "样本",
            "prediction": "预测",
            "overall": "总体",
            "unit": "输出单位",
            "count": "频数",
            "mean": "均值"
          },
          "methodRows": [
            [
              "SHAP",
              "预测归因大小",
              "模型输出",
              "否"
            ],
            [
              "PFI",
              "置换后损失增量",
              "损失单位",
              "是"
            ],
            [
              "SAGE",
              "联盟收益分配",
              "损失单位",
              "是"
            ]
          ],
          "headers": [
            "方法",
            "问题",
            "单位",
            "需要 y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "bars": {
          "layout": "shap-global-bars",
          "title": "符号与绝对值",
          "description": "A: I=2，D=0；B: I=1，D=1。相同尺度。",
          "caption": "A: I=2，D=0；B: I=1，D=1。相同尺度。",
          "labels": {
            "row": "样本",
            "prediction": "预测",
            "overall": "总体",
            "unit": "输出单位",
            "count": "频数",
            "mean": "均值"
          },
          "methodRows": [
            [
              "SHAP",
              "预测归因大小",
              "模型输出",
              "否"
            ],
            [
              "PFI",
              "置换后损失增量",
              "损失单位",
              "是"
            ],
            [
              "SAGE",
              "联盟收益分配",
              "损失单位",
              "是"
            ]
          ],
          "headers": [
            "方法",
            "问题",
            "单位",
            "需要 y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "cohorts": {
          "layout": "shap-global-cohorts",
          "title": "子群比较",
          "description": "独立教学例：G1 n=3，G2 n=1，总体 I=(2.5,1.25)。",
          "caption": "独立教学例：G1 n=3，G2 n=1，总体 I=(2.5,1.25)。",
          "labels": {
            "row": "样本",
            "prediction": "预测",
            "overall": "总体",
            "unit": "输出单位",
            "count": "频数",
            "mean": "均值"
          },
          "methodRows": [
            [
              "SHAP",
              "预测归因大小",
              "模型输出",
              "否"
            ],
            [
              "PFI",
              "置换后损失增量",
              "损失单位",
              "是"
            ],
            [
              "SAGE",
              "联盟收益分配",
              "损失单位",
              "是"
            ]
          ],
          "headers": [
            "方法",
            "问题",
            "单位",
            "需要 y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "methods": {
          "layout": "shap-global-methods",
          "title": "三个不同问题",
          "description": "SHAP：预测；PFI：置换；SAGE：性能博弈。",
          "caption": "SHAP：预测；PFI：置换；SAGE：性能博弈。",
          "labels": {
            "row": "样本",
            "prediction": "预测",
            "overall": "总体",
            "unit": "输出单位",
            "count": "频数",
            "mean": "均值"
          },
          "methodRows": [
            [
              "SHAP",
              "预测归因大小",
              "模型输出",
              "否"
            ],
            [
              "PFI",
              "置换后损失增量",
              "损失单位",
              "是"
            ],
            [
              "SAGE",
              "联盟收益分配",
              "损失单位",
              "是"
            ]
          ],
          "headers": [
            "方法",
            "问题",
            "单位",
            "需要 y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        },
        "interval": {
          "layout": "shap-global-interval",
          "title": "教学 bootstrap",
          "description": "(0,1,2,3) 的全部 256 次重采样均值分布；非模型区间。",
          "caption": "(0,1,2,3) 的全部 256 次重采样均值分布；非模型区间。",
          "labels": {
            "row": "样本",
            "prediction": "预测",
            "overall": "总体",
            "unit": "输出单位",
            "count": "频数",
            "mean": "均值"
          },
          "methodRows": [
            [
              "SHAP",
              "预测归因大小",
              "模型输出",
              "否"
            ],
            [
              "PFI",
              "置换后损失增量",
              "损失单位",
              "是"
            ],
            [
              "SAGE",
              "联盟收益分配",
              "损失单位",
              "是"
            ]
          ],
          "headers": [
            "方法",
            "问题",
            "单位",
            "需要 y"
          ],
          "values": [
            [
              2,
              1
            ],
            [
              -2,
              1
            ],
            [
              2,
              1
            ],
            [
              -2,
              1
            ]
          ],
          "cohorts": [
            {
              "n": 3,
              "values": [
                3,
                1
              ]
            },
            {
              "n": 1,
              "values": [
                1,
                2
              ]
            }
          ]
        }
      },
      "glossary": [
        [
          "全局重要性",
          "指定样本集合上的重要性统计。"
        ],
        [
          "SHAP 矩阵",
          "行为样本，列为所选输出的特征。"
        ],
        [
          "平均绝对 SHAP",
          "样本 |φ| 的平均值。"
        ],
        [
          "有符号均值",
          "保留符号的 φ 均值。"
        ],
        [
          "抵消",
          "相反贡献使有符号均值减小。"
        ],
        [
          "子群",
          "确定的样本子集。"
        ],
        [
          "加权均值",
          "以 n_g/n 为权重的组均值。"
        ],
        [
          "背景数据",
          "决定博弈与基线的参照。"
        ],
        [
          "噪声特征",
          "本实验中不参与目标生成的独立列。"
        ],
        [
          "置换特征重要性",
          "置换特征后的指标变化。"
        ],
        [
          "SAGE",
          "预测能力博弈的 Shapley 值。"
        ],
        [
          "自助法",
          "有放回重采样观测。"
        ],
        [
          "百分位区间",
          "由 bootstrap 统计量经验分位数构成的区间。"
        ],
        [
          "可加性",
          "基值加贡献之和重构所选预测。"
        ],
        [
          "模型依赖",
          "特定评估下模型性能对特征的依赖。"
        ]
      ],
      "quiz": [
        [
          "(+2,−2,+2,−2) 的 I_A？",
          [
            "0",
            "2",
            "8"
          ],
          1,
          "四个绝对值的平均为 2。"
        ],
        [
          "相同贡献的 D_A？",
          [
            "0",
            "2",
            "−2"
          ],
          0,
          "符号相互抵消。"
        ],
        [
          "哪个不等式成立？",
          [
            "I < |D|",
            "I = D 总成立",
            "I ≥ |D|"
          ],
          2,
          "由三角不等式得到。"
        ],
        [
          "平均绝对条形图隐藏什么？",
          [
            "符号与分布",
            "平均绝对值",
            "所有显示特征的名称"
          ],
          0,
          "单个聚合量不保留原始值。"
        ],
        [
          "组 n=3 与 n=1，I=3 与 I=1，总体 I？",
          [
            "2",
            "2.5",
            "4"
          ],
          1,
          "(3×3+1×1)/4=2.5。"
        ],
        [
          "如何比较子群？",
          [
            "不说明地改变各组背景",
            "忽略大小",
            "固定模型、输出、博弈并记录 n"
          ],
          2,
          "否则参照问题改变。"
        ],
        [
          "噪声可有非零 SHAP 吗？",
          [
            "可以，训练模型可能使用它",
            "绝不可能",
            "仅库出错时"
          ],
          0,
          "有限样本模型可能学习偶然模式。"
        ],
        [
          "neg MAE 下 PFI 衡量什么？",
          [
            "平均预测",
            "置换后 MAE 增量",
            "平均绝对 SHAP"
          ],
          1,
          "原始分数减置换分数等于 MAE 增量。"
        ],
        [
          "SAGE 分配什么？",
          [
            "一个预测",
            "I 的和",
            "性能博弈的收益"
          ],
          2,
          "这是另一 Shapley 博弈。"
        ],
        [
          "固定模型的行 bootstrap 反映什么？",
          [
            "固定模型与背景下的抽样变异",
            "完整训练不确定性",
            "因果效应"
          ],
          0,
          "不重新训练模型或选择背景。"
        ],
        [
          "训练/测试排名相似证明什么？",
          [
            "无过拟合",
            "本身不能证明质量",
            "因果性"
          ],
          1,
          "检查留出集指标与稳定性。"
        ],
        [
          "哪种报告结论合适？",
          [
            "A 总是提高价格",
            "A 因果重要",
            "A 在指定样本与博弈中的 I 更大"
          ],
          2,
          "结论受设定约束。"
        ]
      ],
      "sources": [
        [
          "Lundberg & Lee (2017). A Unified Approach to Interpreting Model Predictions.",
          "https://papers.nips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ],
        [
          "Lundberg et al. (2020). From local explanations to global understanding with explainable AI for trees.",
          "https://www.nature.com/articles/s42256-019-0138-9"
        ],
        [
          "Covert, Lundberg & Lee (2020). Understanding Global Feature Contributions With Additive Importance Measures.",
          "https://proceedings.neurips.cc/paper/2020/hash/c7bf0b7c1a86d5eb3be2c722cf2cf746-Abstract.html"
        ],
        [
          "Fisher, Rudin & Dominici (2019). All Models are Wrong, but Many are Useful.",
          "https://www.jmlr.org/beta/papers/v20/18-760.html"
        ],
        [
          "SHAP — global and local bar examples",
          "https://shap.readthedocs.io/en/stable/example_notebooks/api_examples/plots/bar.html"
        ],
        [
          "SHAP — beeswarm examples",
          "https://shap.readthedocs.io/en/stable/example_notebooks/api_examples/plots/beeswarm.html"
        ],
        [
          "SHAP — TreeExplainer",
          "https://shap.readthedocs.io/en/latest/generated/shap.TreeExplainer.html"
        ],
        [
          "SHAP — Explanation",
          "https://shap.readthedocs.io/en/latest/generated/shap.Explanation.html"
        ],
        [
          "scikit-learn — permutation feature importance",
          "https://scikit-learn.org/stable/modules/permutation_importance"
        ]
      ],
      "practice": {
        "title": "测试公寓的全局 SHAP",
        "intro": "合成回归器、600 训练样本与 200 测试样本、独立噪声、64 背景样本、1000 次 bootstrap 和 20 次置换。非真实房产估价。",
        "task": "比较 I、D、子群与 PFI；核验残差并解释噪声。",
        "steps": [
          "在 Python 3.12 安装固定版本依赖。",
          "运行代码；从 JSON 查看形状、残差与指标。",
          "打开 CSV 与两个 PNG，比较有符号与绝对贡献。",
          "改变子群并使用另一训练集背景重复；按第 9 节评分。"
        ],
        "install": "python -m pip install numpy==2.5.5 shap==0.54.1 scikit-learn==1.9.1 matplotlib==3.11.2 pandas==3.1.1",
        "run": "python a-10-2-1-shap-global-importance.py"
      }
    }
  },
  "practiceCode": "\"\"\"DCH School 10.2.1: global SHAP, synthetic housing data, not appraisal.\"\"\"\nimport csv\nimport json\nimport os\nfrom pathlib import Path\nimport matplotlib\nmatplotlib.use(\"Agg\")\nimport matplotlib.pyplot as plt\nimport numpy as np\nimport pandas as pd\nimport shap\nimport sklearn\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score\nfrom sklearn.model_selection import train_test_split\n\nSEED = 42\nOUT = Path(os.environ.get(\"DCH_LAB_OUTPUT\", \"shap-global-results\"))\nOUT.mkdir(parents=True, exist_ok=True)\nrng = np.random.default_rng(SEED)\nn = 800\nX = pd.DataFrame({\n    \"area_m2\": rng.uniform(25, 120, n),\n    \"location_score\": rng.integers(1, 11, n),\n    \"age_years\": rng.integers(0, 61, n),\n    \"floor\": rng.integers(1, 17, n),\n    \"noise\": rng.normal(0, 1, n),\n})\ny = (1.6 + .065 * X.area_m2 + .25 * X.location_score\n     - .026 * X.age_years + .02 * X.floor\n     + .003 * (60-X.age_years) * X.location_score\n     + rng.normal(0, .2, n))\ntrain, test, y_train, y_test = train_test_split(\n    X, y, test_size=.25, random_state=SEED)\nmodel = RandomForestRegressor(n_estimators=32, max_depth=6,\n                              random_state=SEED, n_jobs=1)\nmodel.fit(train, y_train)\nbg = train.sample(64, random_state=SEED)\nassert set(bg.index).issubset(train.index)\nassert set(train.index).isdisjoint(test.index)\nexplainer = shap.TreeExplainer(model, data=bg,\n    feature_perturbation=\"interventional\", model_output=\"raw\")\nexp = explainer(test)\nphi = np.asarray(exp.values, dtype=float)\nbase = np.asarray(exp.base_values, dtype=float)\npred = model.predict(test)\nassert phi.shape == (len(test), len(test.columns))\nassert list(exp.feature_names) == list(test.columns)\nassert np.isfinite(phi).all()\nnp.testing.assert_allclose(exp.data, test.to_numpy())\nnp.testing.assert_allclose(base + phi.sum(axis=1), pred, atol=2e-5, rtol=1e-6)\nI, D = np.abs(phi).mean(axis=0), phi.mean(axis=0)\nassert np.all(I + 1e-12 >= np.abs(D))\nyoung = test.age_years.to_numpy() <= 30\nassert young.any() and (~young).any()\ncohort_a, cohort_b = np.abs(phi[young]).mean(0), np.abs(phi[~young]).mean(0)\nnp.testing.assert_allclose((young.sum()*cohort_a+(~young).sum()*cohort_b)/len(test), I)\n# Conditional on the fitted model and the fixed background.\nboot_rng = np.random.default_rng(SEED+1)\ndraw = boot_rng.integers(0, len(test), size=(1000, len(test)))\nlo, hi = np.percentile(np.abs(phi)[draw].mean(axis=1), [2.5, 97.5], axis=0)\npfi = permutation_importance(model, test, y_test, n_repeats=20,\n    random_state=SEED, scoring=\"neg_mean_absolute_error\", n_jobs=1)\norder = np.argsort(-I, kind=\"stable\")\nrows = [{\"feature\": str(test.columns[j]), \"mean_abs\": float(I[j]),\n         \"signed_mean\": float(D[j]), \"cohort_young\": float(cohort_a[j]),\n         \"cohort_older\": float(cohort_b[j]), \"bootstrap_lo\": float(lo[j]),\n         \"bootstrap_hi\": float(hi[j]), \"pfi_mean\": float(pfi.importances_mean[j]),\n         \"pfi_repeat_sd\": float(pfi.importances_std[j])} for j in order]\nmetrics = {}\nfor split, xx, yy in [(\"train\", train, y_train), (\"test\", test, y_test)]:\n    pp = model.predict(xx)\n    metrics[split] = {\"mae\": float(mean_absolute_error(yy,pp)),\n        \"rmse\": float(np.sqrt(mean_squared_error(yy,pp))), \"r2\": float(r2_score(yy,pp))}\nreport = {\"seed\": SEED, \"versions\": {\"numpy\": np.__version__, \"shap\": shap.__version__,\n          \"sklearn\": sklearn.__version__, \"pandas\": pd.__version__,\n          \"matplotlib\": matplotlib.__version__},\n          \"units\": \"million RUB\", \"n_train\": len(train), \"n_test\": len(test),\n          \"background_rows\": len(bg), \"shape\": list(phi.shape), \"mode\": \"interventional\", \"output\": \"raw regression\",\n          \"cohort_young_n\": int(young.sum()), \"cohort_older_n\": int((~young).sum()),\n          \"bootstrap_repeats\": 1000, \"pfi_repeats\": 20,\n          \"max_abs_residual\": float(np.max(np.abs(pred-base-phi.sum(axis=1)))),\n          \"metrics\": metrics, \"features\": rows}\n(OUT/\"results.json\").write_text(json.dumps(report,indent=2)+\"\\n\",encoding=\"utf-8\")\nwith (OUT/\"importance.csv\").open(\"w\",encoding=\"utf-8\",newline=\"\") as file:\n    writer=csv.DictWriter(file,fieldnames=list(rows[0]))\n    writer.writeheader()\n    writer.writerows(rows)\nshap.plots.bar(exp, show=False, max_display=len(test.columns))\nplt.savefig(OUT/\"global-bar.png\",dpi=160,bbox_inches=\"tight\")\nplt.close(\"all\")\nfig,ax=plt.subplots(figsize=(8,4))\nax.barh(np.array(test.columns)[order], D[order])\nax.axvline(0,color=\"black\",linewidth=1)\nax.set_xlabel(\"Mean signed SHAP (million RUB)\")\nax.invert_yaxis()\nfig.tight_layout()\nfig.savefig(OUT/\"signed-bar.png\",dpi=160)\nplt.close(fig)\nprint(json.dumps(report,indent=2))\nprint(\"PASS: test-only explanation, train-only background, additivity, aggregation and weighted cohorts\")\n"
};
})();
