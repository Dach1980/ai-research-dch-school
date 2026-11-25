(function(){
"use strict";
window.DCH_SHAP_1013={
  "content": {
    "ru": {
      "title": "Локальные объяснения SHAP",
      "lead": "Научимся читать вклад признаков для одного прогноза, проверять аддитивность, строить waterfall и force plot и не путать log-odds с вероятностью.",
      "outcomes": [
        "Определять модель, объект, выход, фон и baseline.",
        "Проверять локальную аддитивность в одной шкале.",
        "Различать значение признака, знак и модуль атрибуции.",
        "Читать waterfall и проверять сумму скрытых вкладов.",
        "Читать force plot и сравнивать его с waterfall.",
        "Объяснять зависимость результата от фона и выбранного выхода.",
        "Преобразовывать полный logit в вероятность без ложной аддитивности.",
        "Проверять shape, имена признаков, base_values и values в Explanation.",
        "Формулировать проверяемый локальный вывод без причинных обещаний."
      ],
      "sections": [
        [
          "object",
          "1. Что объясняет локальный SHAP",
          [
            "Представьте, что модель оценила конкретную квартиру в 7,7 млн рублей. Нас интересует не рыночная истина, а вопрос о поведении именно этой модели: почему её выход отличается от выбранной базовой линии? Сначала фиксируем версию модели, строку x и один скалярный выход f(x). Из 10.1.2 мы знаем, что фон и правило отсутствующих признаков задают игру, относительно которой распределяется вклад.",
            "Отделяйте три утверждения: площадь квартиры наблюдается в данных; модель присвоила площади положительную атрибуцию; увеличение площади в реальном мире изменит цену. Первые два можно проверить по данным и объяснению, третье требует отдельного причинного анализа. Локальный SHAP сам по себе не проверяет точность модели и не подтверждает реальную стоимость."
          ],
          null,
          []
        ],
        [
          "additivity",
          "2. Baseline, вклады и прогноз",
          [
            "В выбранной скалярной шкале φ₀ — базовое значение данного объяснения, φᵢ — подписанная атрибуция i-го признака. Остаток r измеряет несогласованность реконструкции с прогнозом; для численной проверки заранее задайте абсолютный и относительный допуск с учётом единиц и метода. Проверка суммы необходима, но не доказывает корректность фона или смысла атрибуций.",
            "Baseline относится к выбранной игре и объяснителю. Он не обязан быть нулём, средним истинных y или средним предсказанием произвольного тестового набора; в некоторых постановках base_values различаются по объектам и выходам. В учебной схеме зададим φ₀=6,0; площадь +1,8; расположение +0,7; возраст −0,6; этаж −0,2 млн руб. Положительная сумма +2,5, отрицательная −0,8, сдвиг +1,7, итог 7,7. Это специально заданный пример, а не результат обучения."
          ],
          "decomposition",
          [
            "f(x) = φ₀ + Σᵢ φᵢ",
            "r = f(x) − (φ₀ + Σᵢ φᵢ)"
          ]
        ],
        [
          "sign",
          "3. Значение признака и знак вклада",
          [
            "В учебном примере площадь 80 м² имеет атрибуцию +1,8 млн руб.; расположение — оценка 7/10, вклад +0,7; возраст 30 лет, вклад −0,6; этаж 2, вклад −0,2. Исходные значения принадлежат пространству входов, атрибуции — шкале выхода. Нельзя сравнивать 80 м² и 1,8 млн рублей как числа одного вида.",
            "Знак φ показывает направление относительно базы, модуль |φ| — размер локального вклада. Большой модуль не доказывает глобальную важность; нулевой вклад в одной строке не делает признак бесполезным. Даже положительный вклад площади здесь не означает, что прибавление метра всегда повысит прогноз: для этого нужен отдельный анализ поведения модели при изменении входа, а для причинности — ещё и причинная постановка."
          ],
          null,
          []
        ],
        [
          "waterfall",
          "4. Как читать Waterfall Plot",
          [
            "Waterfall показывает подписанные шаги от baseline до f(x). В нашем примере 6,0 → 7,8 → 8,5 → 7,9 → 7,7. Каждый отрезок начинается на предыдущем значении; его длина равна |φ| и направление соответствует знаку. Это арифметическая декомпозиция, а не порядок действий алгоритма или последовательность вмешательств в квартиру.",
            "В реальном shap.plots.waterfall признаки обычно отсортированы по модулю; при max_display=3 для четырёх признаков остаются два индивидуальных вклада и группа остальных. В нашем примере −0,6−0,2=−0,8: группа сохраняет знак и сумму, итог остаётся 7,7. Группа может скрывать взаимную компенсацию. Сверяйте ось, единицы, подписи и значение конечной точки; сортировка не меняет набор атрибуций."
          ],
          "waterfall",
          []
        ],
        [
          "force",
          "5. Force Plot и альтернативные представления",
          [
            "Force plot подчёркивает противодействие подписанных вкладов. У положительных признаков общий вклад +2,5, у отрицательных −0,8. На одной числовой оси их результирующая +1,7 переносит базу 6,0 в прогноз 7,7. Наша учебная схема показывает баланс групп, а не копирует оформление библиотеки. В реальном force plot прочитайте подписи, легенду и шкалу прежде, чем интерпретировать цвет.",
            "Waterfall удобен для пошаговой проверки суммы; force — для компактного представления конкурирующих вкладов. Decision plot может показывать накопленные атрибуции одной или нескольких строк; это не путь по ветвям дерева. Сравнение визуализаций для многих объектов будет в 10.2.2. Не трактуйте красный цвет как обязательно плохой, синий как хороший: знак определяется выбранным выходом."
          ],
          "force",
          []
        ],
        [
          "scale",
          "6. Log-odds, вероятность и выход модели",
          [
            "Для регрессора вклад выражается в единицах прогнозируемой величины. Для классификатора сначала выберите класс и то, что объясняется: вероятность, raw margin или другой поддерживаемый выход. Если выход — логит z=ln(p/(1−p)), вычислите вероятность только после суммирования. База −0,4, два вклада +1,0 и −0,3 дают z=0,3. σ(−0,4)≈0,401312, σ(0,3)≈0,574443; сдвиг вероятности ≈0,173131, или 17,31 процентного пункта.",
            "Сигмоида нелинейна: σ(φ₁)+σ(φ₂) не представляет сумму вкладов в вероятность. Отдельные logit-атрибуции нельзя подписывать процентными пунктами. Если выбранный explainer действительно поддерживает model_output='probability' для конкретной модели и режима, проверяйте аддитивность непосредственно в этой шкале. Raw output не всегда логит: у регрессора это прогноз, у других моделей семантика зависит от реализации. При нескольких выходах проверьте shape и индекс класса; не складывайте все классы."
          ],
          "sigmoid",
          [
            "σ(z) = 1 / (1 + exp(−z))",
            "−0.4 + 1.0 − 0.3 = 0.3"
          ]
        ],
        [
          "background",
          "7. Почему объяснение может измениться",
          [
            "Пусть в 10.1.2 f(a,r)=a/10, фон состоит из квартир (40,1) и (80,3), объясняем (80,3). База 6, прогноз 8. Маргинальная игра даёт (2,0), условная — (1,1), потому что число комнат несёт информацию о площади. Обе пары суммируются до 2, но отвечают на разные вопросы. Это не утверждение, что модель непосредственно использует число комнат.",
            "Даже в одной семантике фон всего города и фон небольших квартир задают разные сравнения. При фиксированной модели и x тот же скалярный prediction не меняется, но база и сумма вкладов могут измениться. Разделяйте смену постановки, конечную выборочную вариативность и программную ошибку. В практике сравним две фоновые выборки только из train и проверим реконструкцию обеих игр. Не делаем вывод, что любой изменившийся вклад неверен."
          ],
          null,
          []
        ],
        [
          "api",
          "8. SHAP Explanation и диагностика",
          [
            "Объект Explanation объединяет values, base_values, data, feature_names и, если предоставлены, output_names и output_indexes. Для одно-выходной табличной модели values обычно имеет форму (n_samples,n_features), а после выбора строки — (n_features,). Многовыходные формы различаются по версии и модели: прежде чем брать индекс, напечатайте shape и сверяйте документацию. Не предполагайте, что последний индекс всегда выбран правильно.",
            "Проверка: (1) совпадают версия модели и строка; (2) выбран тот же класс/выход, например predict для нашего регрессора, не predict_proba; (3) совпадают преобразования и порядок столбцов; (4) взят base_values именно этой строки/выхода; (5) r в заданном допуске. Если использовано one-hot или другое преобразование, атрибуции относятся к преобразованным признакам до явного группового отображения. При ошибке исправьте постановку, а не увеличивайте допуск, чтобы получить PASS."
          ],
          "diagnostic",
          []
        ],
        [
          "report",
          "9. Как оформить локальный вывод",
          [
            "Отчёт: идентификатор и версия модели → строка/объект и выход → фоновая выборка и semantics → baseline → prediction → важнейшие подписанные вклады и группа остальных → residual и допуск → границы вывода. Для учебного примера: относительно базы 6,0 модель дала 7,7 млн руб.; площадь и расположение объясняют +2,5, возраст и этаж −0,8; сумма +1,7, r=0 с точностью учебных чисел. Укажи, что значения заданы искусственно.",
            "Не пишите «площадь вызвала повышение рыночной цены на 1,8 млн»: корректно «в выбранном объяснении площадь получила вклад +1,8 млн в прогноз модели». Аддитивность не доказывает справедливость, пригодность модели или причинный эффект. Следующий шаг 10.2.1: агрегировать множество объяснений для изучения глобальной важности, не переносить вывод с одной квартиры на всю совокупность."
          ],
          null,
          []
        ]
      ],
      "diagrams": {
        "decomposition": {
          "layout": "shap-local-decomposition",
          "title": "Декомпозиция прогноза",
          "description": "Учебные числа: база 6,0; +2,5; −0,8; итог 7,7 млн руб.",
          "caption": "Учебные числа: база 6,0; +2,5; −0,8; итог 7,7 млн руб.",
          "labels": {
            "baseline": "База",
            "prediction": "Прогноз",
            "positive": "Положительные +2.5",
            "negative": "Отрицательные −0.8",
            "unit": "млн руб.",
            "net": "Сдвиг +1.7",
            "probability": "Вероятность"
          },
          "features": [
            {
              "label": "Площадь · 80 м²",
              "value": 1.8
            },
            {
              "label": "Расположение · 7/10",
              "value": 0.7
            },
            {
              "label": "Возраст · 30 лет",
              "value": -0.6
            },
            {
              "label": "Этаж · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "waterfall": {
          "layout": "shap-local-waterfall",
          "title": "Учебный waterfall",
          "description": "Каждый шаг соединяет предыдущую сумму со следующей, не изображая вмешательства.",
          "caption": "Каждый шаг соединяет предыдущую сумму со следующей, не изображая вмешательства.",
          "labels": {
            "baseline": "База",
            "prediction": "Прогноз",
            "positive": "Положительные +2.5",
            "negative": "Отрицательные −0.8",
            "unit": "млн руб.",
            "net": "Сдвиг +1.7",
            "probability": "Вероятность"
          },
          "features": [
            {
              "label": "Площадь · 80 м²",
              "value": 1.8
            },
            {
              "label": "Расположение · 7/10",
              "value": 0.7
            },
            {
              "label": "Возраст · 30 лет",
              "value": -0.6
            },
            {
              "label": "Этаж · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "force": {
          "layout": "shap-local-force",
          "title": "Баланс противоположных вкладов",
          "description": "Учебная force-схема, не скриншот библиотеки: положительные и отрицательные группы на общей шкале.",
          "caption": "Учебная force-схема, не скриншот библиотеки: положительные и отрицательные группы на общей шкале.",
          "labels": {
            "baseline": "База",
            "prediction": "Прогноз",
            "positive": "Положительные +2.5",
            "negative": "Отрицательные −0.8",
            "unit": "млн руб.",
            "net": "Сдвиг +1.7",
            "probability": "Вероятность"
          },
          "features": [
            {
              "label": "Площадь · 80 м²",
              "value": 1.8
            },
            {
              "label": "Расположение · 7/10",
              "value": 0.7
            },
            {
              "label": "Возраст · 30 лет",
              "value": -0.6
            },
            {
              "label": "Этаж · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "sigmoid": {
          "layout": "shap-local-sigmoid",
          "title": "Нелинейное преобразование logit",
          "description": "Преобразуем полную сумму: σ(−0,4)≈0,401312; σ(0,3)≈0,574443.",
          "caption": "Преобразуем полную сумму: σ(−0,4)≈0,401312; σ(0,3)≈0,574443.",
          "labels": {
            "baseline": "База",
            "prediction": "Прогноз",
            "positive": "Положительные +2.5",
            "negative": "Отрицательные −0.8",
            "unit": "млн руб.",
            "net": "Сдвиг +1.7",
            "probability": "Вероятность"
          },
          "features": [
            {
              "label": "Площадь · 80 м²",
              "value": 1.8
            },
            {
              "label": "Расположение · 7/10",
              "value": 0.7
            },
            {
              "label": "Возраст · 30 лет",
              "value": -0.6
            },
            {
              "label": "Этаж · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "diagnostic": {
          "layout": "shap-compute-pipeline",
          "title": "Протокол проверки",
          "description": "На каждом шаге исправьте несоответствие до перехода к интерпретации.",
          "caption": "На каждом шаге исправьте несоответствие до перехода к интерпретации.",
          "nodes": [
            {
              "id": "step-0",
              "title": "Объект и модель",
              "detail": "Не совпадают → выбрать версию и строку заново."
            },
            {
              "id": "step-1",
              "title": "Класс и шкала",
              "detail": "Не совпадают → использовать тот же выход."
            },
            {
              "id": "step-2",
              "title": "Признаки и mapping",
              "detail": "Не совпадают → восстановить порядок/преобразование."
            },
            {
              "id": "step-3",
              "title": "Фон и база",
              "detail": "Не совпадают → взять base_values этого объяснения."
            },
            {
              "id": "step-4",
              "title": "Остаток r",
              "detail": "Вне допуска → диагностировать, не скрывать."
            },
            {
              "id": "step-5",
              "title": "Локальный вывод",
              "detail": "Указать единицы, условия, ограничения и не делать причинных выводов."
            }
          ]
        }
      },
      "glossary": [
        [
          "Локальное объяснение",
          "Объяснение выбранного выхода для одного объекта."
        ],
        [
          "Атрибуция признака",
          "Подписанный вклад в разность с базой в заданной игре."
        ],
        [
          "Базовое значение",
          "Значение отсчёта конкретного объяснения."
        ],
        [
          "Фоновые данные",
          "Данные, относительно которых определены отсутствующие признаки и база."
        ],
        [
          "Шкала выхода",
          "Единицы величины, которую объясняет SHAP."
        ],
        [
          "Исходный выход",
          "Непреобразованный выход в семантике данной модели."
        ],
        [
          "Логарифм шансов",
          "ln(p/(1−p)) для 0<p<1."
        ],
        [
          "Вероятность",
          "Число от 0 до 1 для выбранного события/класса."
        ],
        [
          "Локальная аддитивность",
          "База плюс сумма вкладов реконструирует выбранный выход."
        ],
        [
          "Остаток",
          "Разность между выходом и восстановленной суммой."
        ],
        [
          "Waterfall Plot",
          "Накопительная диаграмма подписанных вкладов."
        ],
        [
          "Force Plot",
          "Представление противоположно направленных аддитивных вкладов."
        ],
        [
          "Explanation",
          "Контейнер SHAP со значениями, базой, данными и метаданными."
        ],
        [
          "Индекс выхода",
          "Позиция выбранного выхода после проверки формы массива."
        ],
        [
          "Отображение признаков",
          "Явная связь преобразованных признаков с исходными полями."
        ],
        [
          "Группировка вкладов",
          "Суммирование подписанных атрибуций отображаемой группы."
        ]
      ],
      "quiz": [
        [
          "Какой прогноз в учебном примере?",
          [
            "8,5",
            "7,7",
            "6,0"
          ],
          1,
          "6+2,5−0,8=7,7 млн руб."
        ],
        [
          "Что означает φ=−0,6?",
          [
            "Снижение выхода относительно базы на 0,6 в данной игре",
            "Признак равен −0,6",
            "Ошибка модели −0,6"
          ],
          0,
          "Атрибуция имеет единицы выбранного выхода."
        ],
        [
          "Что показывает |φ|?",
          [
            "Причинный эффект",
            "Глобальный рейтинг",
            "Размер вклада в этом объяснении"
          ],
          2,
          "Модуль относится к конкретной строке и игре."
        ],
        [
          "После шагов +1,8 и +0,7 от базы 6,0 получаем?",
          [
            "8,5",
            "7,7",
            "2,5"
          ],
          0,
          "Это промежуточная сумма, не итог."
        ],
        [
          "Как объединить −0,6 и −0,2?",
          [
            "+0,8",
            "−0,8",
            "−0,4"
          ],
          1,
          "Группа сохраняет подписанную сумму."
        ],
        [
          "Как получить вероятность из итогового logit 0,3?",
          [
            "0,3",
            "Суммировать sigmoid отдельных вкладов",
            "σ(0,3)≈0,574443"
          ],
          2,
          "Сигмоида применяется к полной сумме."
        ],
        [
          "Что сравнивать с SHAP в шкале logit?",
          [
            "Соответствующий logit модели",
            "Любую вероятность",
            "Средний y"
          ],
          0,
          "База, вклады и прогноз должны быть в одной шкале."
        ],
        [
          "При смене фона и фиксированном f,x что может измениться?",
          [
            "Только prediction",
            "Baseline и атрибуции",
            "Обязательно каждый вклад"
          ],
          1,
          "Меняется вопрос сравнения; тот же prediction сохраняется."
        ],
        [
          "Как выбрать класс при многовыходном Explanation?",
          [
            "Сложить все выходы",
            "Взять произвольный индекс",
            "Проверить shape, имена и соответствующий индекс"
          ],
          2,
          "Форма зависит от модели/API; не угадываем."
        ],
        [
          "Остаток велик. Что делать сначала?",
          [
            "Проверить строку, выход, базу и mapping",
            "Поднять допуск до PASS",
            "Удалить отрицательные вклады"
          ],
          0,
          "Диагностируйте несогласованность, а не скрывайте её."
        ],
        [
          "Что доказывает положительный SHAP площади?",
          [
            "Причинный рост цены",
            "Положительную атрибуцию выбранного прогноза",
            "Справедливость модели"
          ],
          1,
          "Это утверждение о модели в выбранной игре, не об интервенции."
        ],
        [
          "Можно ли из одного объекта получить глобальную важность?",
          [
            "Да, если r=0",
            "Да, если вклад положителен",
            "Нет, нужна определённая совокупность и агрегация"
          ],
          2,
          "Один локальный вывод не представляет распределение."
        ]
      ],
      "sources": [
        [
          "Lundberg & Lee (2017). A Unified Approach to Interpreting Model Predictions.",
          "https://papers.nips.cc/paper_files/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ],
        [
          "Lundberg et al. (2020). From local explanations to global understanding with explainable AI for trees.",
          "https://doi.org/10.1038/s42256-019-0138-9"
        ],
        [
          "Aas, Jullum & Løland (2021). Explaining individual predictions when features are dependent.",
          "https://arxiv.org/abs/1903.10464"
        ],
        [
          "SHAP — Explanation",
          "https://shap.readthedocs.io/en/latest/generated/shap.Explanation.html"
        ],
        [
          "SHAP — TreeExplainer",
          "https://shap.readthedocs.io/en/latest/generated/shap.TreeExplainer.html"
        ],
        [
          "SHAP — waterfall",
          "https://shap.readthedocs.io/en/latest/generated/shap.plots.waterfall.html"
        ],
        [
          "SHAP — force",
          "https://shap.readthedocs.io/en/latest/generated/shap.plots.force.html"
        ],
        [
          "SHAP — decision",
          "https://shap.readthedocs.io/en/latest/generated/shap.plots.decision.html"
        ],
        [
          "scikit-learn — RandomForestRegressor",
          "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html"
        ]
      ],
      "practice": {
        "title": "Локальное объяснение двух фонов",
        "intro": "Синтетические квартиры, RandomForestRegressor, два train-only фона. Код создаёт настоящие waterfall и force plot, JSON-отчёт и проверяет сумму.",
        "task": "Сравнить одно предсказание и два объяснения; затем выбрать другую тестовую строку и объяснить разницу, не приписывая причинности.",
        "steps": [
          "Установить зависимости в отдельном Python 3.12 окружении.",
          "Запустить файл; сверить имена, значения, shape, baseline и residual.",
          "Открыть PNG и results.json в shap-local-results; сгруппировать два оставшихся признака.",
          "Сменить объект и фон; объяснить разницу. Найти ошибку сравнения logit с probability."
        ],
        "install": "python -m pip install numpy==2.5.5 shap==0.54.1 scikit-learn==1.9.1 matplotlib pandas",
        "run": "python a-10-1-3-shap-local-explanations.py"
      }
    },
    "en": {
      "title": "Local SHAP Explanations",
      "lead": "Read feature contributions for a single prediction, verify additivity, interpret waterfall and force plots, and distinguish log-odds from probability.",
      "outcomes": [
        "Identify the model, instance, output, background and baseline.",
        "Verify local additivity on a consistent scale.",
        "Distinguish feature values, signs and attribution magnitudes.",
        "Read a waterfall plot and check grouped contributions.",
        "Read a force plot and compare it with a waterfall.",
        "Explain dependence on background and selected output.",
        "Transform the total logit to probability without false additivity.",
        "Check shape, feature names, base_values and values in an Explanation.",
        "Write a verifiable local report without causal claims."
      ],
      "sections": [
        [
          "object",
          "1. What local SHAP explains",
          [
            "Suppose a model predicts 7.7 million rubles for an apartment. Our question is not its true market price, but why this model's output differs from a selected baseline. Fix the model version, row x and one scalar output f(x). Lesson 10.1.2 established that the background and missing-feature rule determine the game whose contributions we allocate.",
            "Separate three claims: the apartment's area is observed in the data; the model assigns area a positive attribution; increasing area in the real world changes price. The first two can be checked against data and the explanation; the third needs a causal analysis. Local SHAP does not itself validate predictive accuracy or the true price."
          ],
          null,
          []
        ],
        [
          "additivity",
          "2. Baseline, contributions and prediction",
          [
            "On the selected scalar scale, φ₀ is the base value for this explanation and φᵢ is the signed attribution of feature i. Residual r measures the disagreement between reconstruction and prediction; set absolute and relative tolerances appropriate to the units and method. Additivity is necessary for the stated decomposition, but does not establish that the background or interpretation is appropriate.",
            "The baseline belongs to the chosen game and explainer. It need not be zero, the mean of observed y, or the mean prediction on an arbitrary test set; base_values may vary across instances and outputs. In a constructed example let φ₀=6.0; area +1.8; location +0.7; age −0.6; floor −0.2 million rubles. The positive sum is +2.5, negative sum −0.8, net +1.7 and prediction 7.7. These are teaching values, not trained-model results."
          ],
          "decomposition",
          [
            "f(x) = φ₀ + Σᵢ φᵢ",
            "r = f(x) − (φ₀ + Σᵢ φᵢ)"
          ]
        ],
        [
          "sign",
          "3. Feature value and attribution sign",
          [
            "In the teaching example, area 80 m² has attribution +1.8 million rubles; location score 7/10 contributes +0.7; age 30 years −0.6; floor 2 −0.2. Feature values belong to input space; attributions belong to the output scale. Do not compare 80 m² with 1.8 million rubles as quantities of the same kind.",
            "The sign of φ gives direction relative to the baseline and |φ| gives magnitude for this instance. A large magnitude is not global importance; zero for one row does not imply uselessness. Even a positive area contribution does not imply that adding one square metre always raises the prediction: that requires a separate analysis of model responses to changed inputs, and causal claims require more."
          ],
          null,
          []
        ],
        [
          "waterfall",
          "4. Reading a waterfall plot",
          [
            "A waterfall displays signed steps from the baseline to f(x). Here: 6.0 → 7.8 → 8.5 → 7.9 → 7.7. Each segment starts at the previous total, its length equals |φ|, and direction gives the sign. This is arithmetic decomposition, not an execution order or a sequence of interventions on the apartment.",
            "In shap.plots.waterfall, features are typically ordered by magnitude. With max_display=3 for four features, two are individual and the remainder are grouped. Here −0.6−0.2=−0.8: grouping preserves the signed sum, and the final prediction stays 7.7. A group may hide cancellation. Check axis, units, labels and endpoint; sorting does not change the attributions."
          ],
          "waterfall",
          []
        ],
        [
          "force",
          "5. Force plot and alternative views",
          [
            "A force plot emphasises opposing signed contributions. Positive features sum to +2.5 and negative features to −0.8. On a common scale their net +1.7 takes the base 6.0 to the prediction 7.7. Our teaching schematic shows this balance rather than copying the library design. In a real force plot read labels, legend and scale before interpreting colours.",
            "A waterfall makes signed arithmetic easy to audit; force offers a compact view of competing contributions. A decision plot can show cumulative attributions for one or several rows; it is not a traversal of a decision tree. Lesson 10.2.2 will compare visualisations for collections of instances. Red need not mean bad and blue good; sign depends on the explained output."
          ],
          "force",
          []
        ],
        [
          "scale",
          "6. Log-odds, probability and output scale",
          [
            "For regression, contributions use prediction units. For classification first choose the class and the explained quantity: probability, raw margin or another supported output. If that quantity is logit z=ln(p/(1−p)), convert only after summation. Base −0.4, contributions +1.0 and −0.3 give z=0.3. σ(−0.4)≈0.401312, σ(0.3)≈0.574443; the probability change is about 0.173131, or 17.31 percentage points.",
            "The sigmoid is nonlinear: σ(φ₁)+σ(φ₂) is not a decomposition of probability. Individual logit attributions are not percentage points. If the chosen explainer supports model_output='probability' for the actual model and mode, test additivity on that scale. Raw output is not always a logit: it is the prediction for a regressor, and semantics differ across models. For multiple outputs inspect shape and class index; do not sum classes."
          ],
          "sigmoid",
          [
            "σ(z) = 1 / (1 + exp(−z))",
            "−0.4 + 1.0 − 0.3 = 0.3"
          ]
        ],
        [
          "background",
          "7. Why an explanation can change",
          [
            "Recall the model f(a,r)=a/10 from 10.1.2 with background apartments (40,1) and (80,3), explaining (80,3). Base 6, prediction 8. The marginal game yields (2,0); the conditional game yields (1,1), because room count conveys information about area. Both sum to 2 but answer different questions. This does not mean the model directly uses room count.",
            "Even with the same semantics, a city-wide background and one restricted to smaller apartments define different comparisons. With fixed model and x the same scalar prediction stays unchanged, but base value and contributions may change. Separate a change of question, sampling variation and a software error. In the lab compare two train-only backgrounds and reconstruct both games; changed contributions are not automatically wrong."
          ],
          null,
          []
        ],
        [
          "api",
          "8. SHAP Explanation and diagnostics",
          [
            "An Explanation bundles values, base_values, data, feature_names and, where supplied, output_names and output_indexes. A single-output tabular model typically returns values shaped (n_samples,n_features), with (n_features,) after selecting a row. Multi-output shapes vary by model and API version: print shape and consult documentation before indexing. Do not assume the last index is always the desired output.",
            "Check: (1) model version and row match; (2) the same output/class is used, e.g. predict for our regressor rather than predict_proba; (3) preprocessing and column order match; (4) base_values belongs to this row/output; (5) r is within the chosen tolerance. After one-hot or other transforms, attributions belong to the transformed features until an explicit mapping is defined. Fix the setup rather than inflate tolerances to obtain PASS."
          ],
          "diagnostic",
          []
        ],
        [
          "report",
          "9. Writing a local report",
          [
            "Report: model ID and version → row and selected output → background and semantics → base → prediction → largest signed contributions and grouped remainder → residual and tolerance → limitations. In the teaching example: relative to base 6.0, the model output is 7.7 million rubles; area and location account for +2.5, age and floor −0.8; net +1.7, r=0 at the given precision. These values are constructed.",
            "Do not write “area caused a 1.8 million increase in market price.” Say “in the chosen explanation, area received a +1.8 million attribution to the model prediction.” Additivity does not establish fairness, fitness for use or causal effect. Next, 10.2.1 aggregates multiple explanations for global importance rather than generalising from one apartment."
          ],
          null,
          []
        ]
      ],
      "diagrams": {
        "decomposition": {
          "layout": "shap-local-decomposition",
          "title": "Prediction decomposition",
          "description": "Teaching values: base 6.0; +2.5; −0.8; prediction 7.7 million rubles.",
          "caption": "Teaching values: base 6.0; +2.5; −0.8; prediction 7.7 million rubles.",
          "labels": {
            "baseline": "Base",
            "prediction": "Prediction",
            "positive": "Positive +2.5",
            "negative": "Negative −0.8",
            "unit": "million RUB",
            "net": "Net +1.7",
            "probability": "Probability"
          },
          "features": [
            {
              "label": "Area · 80 m²",
              "value": 1.8
            },
            {
              "label": "Location · 7/10",
              "value": 0.7
            },
            {
              "label": "Age · 30 years",
              "value": -0.6
            },
            {
              "label": "Floor · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "waterfall": {
          "layout": "shap-local-waterfall",
          "title": "Teaching waterfall",
          "description": "Each step connects successive totals; it is not an intervention.",
          "caption": "Each step connects successive totals; it is not an intervention.",
          "labels": {
            "baseline": "Base",
            "prediction": "Prediction",
            "positive": "Positive +2.5",
            "negative": "Negative −0.8",
            "unit": "million RUB",
            "net": "Net +1.7",
            "probability": "Probability"
          },
          "features": [
            {
              "label": "Area · 80 m²",
              "value": 1.8
            },
            {
              "label": "Location · 7/10",
              "value": 0.7
            },
            {
              "label": "Age · 30 years",
              "value": -0.6
            },
            {
              "label": "Floor · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "force": {
          "layout": "shap-local-force",
          "title": "Balance of opposing contributions",
          "description": "Teaching force schematic, not a library screenshot: opposing groups share one scale.",
          "caption": "Teaching force schematic, not a library screenshot: opposing groups share one scale.",
          "labels": {
            "baseline": "Base",
            "prediction": "Prediction",
            "positive": "Positive +2.5",
            "negative": "Negative −0.8",
            "unit": "million RUB",
            "net": "Net +1.7",
            "probability": "Probability"
          },
          "features": [
            {
              "label": "Area · 80 m²",
              "value": 1.8
            },
            {
              "label": "Location · 7/10",
              "value": 0.7
            },
            {
              "label": "Age · 30 years",
              "value": -0.6
            },
            {
              "label": "Floor · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "sigmoid": {
          "layout": "shap-local-sigmoid",
          "title": "Nonlinear logit transformation",
          "description": "Transform the total: σ(−0.4)≈0.401312; σ(0.3)≈0.574443.",
          "caption": "Transform the total: σ(−0.4)≈0.401312; σ(0.3)≈0.574443.",
          "labels": {
            "baseline": "Base",
            "prediction": "Prediction",
            "positive": "Positive +2.5",
            "negative": "Negative −0.8",
            "unit": "million RUB",
            "net": "Net +1.7",
            "probability": "Probability"
          },
          "features": [
            {
              "label": "Area · 80 m²",
              "value": 1.8
            },
            {
              "label": "Location · 7/10",
              "value": 0.7
            },
            {
              "label": "Age · 30 years",
              "value": -0.6
            },
            {
              "label": "Floor · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "diagnostic": {
          "layout": "shap-compute-pipeline",
          "title": "Validation protocol",
          "description": "Resolve any mismatch at each step before interpreting.",
          "caption": "Resolve any mismatch at each step before interpreting.",
          "nodes": [
            {
              "id": "step-0",
              "title": "Instance and model",
              "detail": "Mismatch → select correct version and row."
            },
            {
              "id": "step-1",
              "title": "Class and scale",
              "detail": "Mismatch → use the same output."
            },
            {
              "id": "step-2",
              "title": "Features and mapping",
              "detail": "Mismatch → restore order and preprocessing."
            },
            {
              "id": "step-3",
              "title": "Background and base",
              "detail": "Mismatch → use this explanation's base_values."
            },
            {
              "id": "step-4",
              "title": "Residual r",
              "detail": "Outside tolerance → diagnose, not conceal."
            },
            {
              "id": "step-5",
              "title": "Local report",
              "detail": "State units, conditions, limitations; no causal claims."
            }
          ]
        }
      },
      "glossary": [
        [
          "Local explanation",
          "Explanation of a selected output for one instance."
        ],
        [
          "Feature attribution",
          "Signed allocation of the difference from the base in a specified game."
        ],
        [
          "Base value",
          "Reference output for a particular explanation."
        ],
        [
          "Background data",
          "Reference data used to define missing features and the base."
        ],
        [
          "Output scale",
          "Units of the quantity explained by SHAP."
        ],
        [
          "Raw output",
          "Untransformed output as defined by the model."
        ],
        [
          "Log-odds",
          "ln(p/(1−p)) for 0<p<1."
        ],
        [
          "Probability",
          "Number from 0 to 1 for the chosen event/class."
        ],
        [
          "Local additivity",
          "Base plus the sum of contributions reconstructs the selected output."
        ],
        [
          "Residual",
          "Difference between output and reconstructed sum."
        ],
        [
          "Waterfall plot",
          "Cumulative chart of signed contributions."
        ],
        [
          "Force plot",
          "Visual representation of opposing additive contributions."
        ],
        [
          "Explanation",
          "SHAP container for values, base, data and metadata."
        ],
        [
          "Output index",
          "Position of the selected output after checking array shape."
        ],
        [
          "Feature mapping",
          "Explicit correspondence between transformed features and original fields."
        ],
        [
          "Contribution grouping",
          "Sum of signed attributions in a displayed group."
        ]
      ],
      "quiz": [
        [
          "What is the teaching example prediction?",
          [
            "8.5",
            "7.7",
            "6.0"
          ],
          1,
          "6+2.5−0.8=7.7 million rubles."
        ],
        [
          "What does φ=−0.6 mean?",
          [
            "A −0.6 contribution relative to the base in this game",
            "Feature value is −0.6",
            "Model error is −0.6"
          ],
          0,
          "Attribution has the units of the selected output."
        ],
        [
          "What does |φ| describe?",
          [
            "Causal effect",
            "Global ranking",
            "Magnitude in this explanation"
          ],
          2,
          "Magnitude refers to the specific row and game."
        ],
        [
          "After +1.8 and +0.7 from 6.0, what is the total?",
          [
            "8.5",
            "7.7",
            "2.5"
          ],
          0,
          "This is the intermediate sum, not the endpoint."
        ],
        [
          "How should −0.6 and −0.2 be grouped?",
          [
            "+0.8",
            "−0.8",
            "−0.4"
          ],
          1,
          "Grouping preserves the signed sum."
        ],
        [
          "How to obtain probability from total logit 0.3?",
          [
            "0.3",
            "Sum sigmoid of individual contributions",
            "σ(0.3)≈0.574443"
          ],
          2,
          "Apply sigmoid to the total."
        ],
        [
          "What should logit-scale SHAP reconstruct?",
          [
            "The corresponding model logit",
            "Any probability",
            "Mean y"
          ],
          0,
          "Base, contributions and prediction must share the scale."
        ],
        [
          "With fixed f,x, what can change when background changes?",
          [
            "Only prediction",
            "Baseline and attributions",
            "Necessarily every contribution"
          ],
          1,
          "The reference question changes; the same prediction remains."
        ],
        [
          "How to choose a class in multi-output Explanation?",
          [
            "Sum all outputs",
            "Take an arbitrary index",
            "Check shape, names and corresponding index"
          ],
          2,
          "Shapes depend on model/API; do not guess."
        ],
        [
          "Residual is large. What to do first?",
          [
            "Check row, output, base and mapping",
            "Raise tolerance to PASS",
            "Remove negative contributions"
          ],
          0,
          "Diagnose disagreement rather than conceal it."
        ],
        [
          "What does positive area SHAP establish?",
          [
            "Causal price increase",
            "Positive attribution for the selected prediction",
            "Model fairness"
          ],
          1,
          "It is a model statement in the chosen game, not an intervention."
        ],
        [
          "Can one instance establish global importance?",
          [
            "Yes, if r=0",
            "Yes, if a contribution is positive",
            "No, a defined population and aggregation are needed"
          ],
          2,
          "One local explanation does not represent a distribution."
        ]
      ],
      "sources": [
        [
          "Lundberg & Lee (2017). A Unified Approach to Interpreting Model Predictions.",
          "https://papers.nips.cc/paper_files/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ],
        [
          "Lundberg et al. (2020). From local explanations to global understanding with explainable AI for trees.",
          "https://doi.org/10.1038/s42256-019-0138-9"
        ],
        [
          "Aas, Jullum & Løland (2021). Explaining individual predictions when features are dependent.",
          "https://arxiv.org/abs/1903.10464"
        ],
        [
          "SHAP — Explanation",
          "https://shap.readthedocs.io/en/latest/generated/shap.Explanation.html"
        ],
        [
          "SHAP — TreeExplainer",
          "https://shap.readthedocs.io/en/latest/generated/shap.TreeExplainer.html"
        ],
        [
          "SHAP — waterfall",
          "https://shap.readthedocs.io/en/latest/generated/shap.plots.waterfall.html"
        ],
        [
          "SHAP — force",
          "https://shap.readthedocs.io/en/latest/generated/shap.plots.force.html"
        ],
        [
          "SHAP — decision",
          "https://shap.readthedocs.io/en/latest/generated/shap.plots.decision.html"
        ],
        [
          "scikit-learn — RandomForestRegressor",
          "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html"
        ]
      ],
      "practice": {
        "title": "Local explanation with two backgrounds",
        "intro": "Synthetic apartments, RandomForestRegressor, two train-only backgrounds. Code saves real waterfall and force plots, JSON and checks the sums.",
        "task": "Compare one prediction and two explanations; then choose another test row and explain differences without causal claims.",
        "steps": [
          "Install dependencies in an isolated Python 3.12 environment.",
          "Run the file; compare names, values, shape, baseline and residual.",
          "Inspect PNG and results.json in shap-local-results; group the two remaining features.",
          "Change instance and background; explain the difference. Identify the logit/probability scale error."
        ],
        "install": "python -m pip install numpy==2.5.5 shap==0.54.1 scikit-learn==1.9.1 matplotlib pandas",
        "run": "python a-10-1-3-shap-local-explanations.py"
      }
    },
    "zh": {
      "title": "SHAP 局部解释",
      "lead": "学习解读单个预测的特征贡献，验证可加性，阅读瀑布图和力图，并区分对数几率与概率。",
      "outcomes": [
        "识别模型、样本、输出、背景数据和基线。",
        "在一致的尺度上验证局部可加性。",
        "区分特征取值、归因符号和归因绝对值。",
        "阅读瀑布图并核对合并贡献。",
        "阅读力图并与瀑布图比较。",
        "解释结果对背景与所选输出的依赖。",
        "将完整 logit 转换为概率，避免错误的可加性假设。",
        "核对 Explanation 的形状、特征名、base_values 和 values。",
        "撰写可核验的局部解释报告，不作因果承诺。"
      ],
      "sections": [
        [
          "object",
          "1. 局部 SHAP 解释什么",
          [
            "假设模型预测某套公寓价值 770 万卢布。问题不是它的真实市场价格，而是该模型的输出为什么偏离选定基线。先固定模型版本、样本 x 和一个标量输出 f(x)。10.1.2 已说明，背景数据与缺失特征规则决定了归因所依据的博弈。",
            "区分三个命题：数据中观察到公寓面积；模型为面积赋予正归因；现实中增加面积会改变价格。前两个可以用数据和解释验证，第三个需要独立的因果分析。局部 SHAP 本身不验证预测准确性或真实价格。"
          ],
          null,
          []
        ],
        [
          "additivity",
          "2. 基线、贡献与预测",
          [
            "在选定标量尺度上，φ₀ 是该解释的基值，φᵢ 是第 i 个特征的有符号归因。残差 r 衡量重构与预测的差异；根据单位和方法预先设定绝对与相对容差。可加性是分解的必要检查，但不能证明背景或解释含义恰当。",
            "基线属于所选博弈与解释器，不一定是零、真实 y 的均值或任意测试集预测均值；base_values 可能随样本和输出而变化。教学例设 φ₀=6.0，面积 +1.8，位置 +0.7，楼龄 −0.6，楼层 −0.2（单位：百万卢布）。正贡献 +2.5，负贡献 −0.8，净变化 +1.7，预测 7.7。这是预设教学数值，不是训练结果。"
          ],
          "decomposition",
          [
            "f(x) = φ₀ + Σᵢ φᵢ",
            "r = f(x) − (φ₀ + Σᵢ φᵢ)"
          ]
        ],
        [
          "sign",
          "3. 特征取值与归因符号",
          [
            "教学例中面积 80 m² 的归因为 +1.8 百万卢布；位置评分 7/10 对应 +0.7；楼龄 30 年对应 −0.6；楼层 2 对应 −0.2。特征取值属于输入空间，归因属于输出尺度。不能把 80 m² 与 1.8 百万卢布当作同类数值比较。",
            "φ 的符号表示相对基线的方向，|φ| 表示当前样本的贡献大小。绝对值大不等于全局重要；某个样本归因为零也不代表特征无用。面积正贡献并不说明增加一平方米必然提高预测：需要另行分析模型对输入变化的响应，因果结论还需因果设定。"
          ],
          null,
          []
        ],
        [
          "waterfall",
          "4. 阅读瀑布图",
          [
            "瀑布图从基线到 f(x) 显示有符号的步骤。本例为 6.0 → 7.8 → 8.5 → 7.9 → 7.7。每段从前一累计值开始，长度为 |φ|，方向对应符号。这是算术分解，不是算法执行顺序或对公寓的连续干预。",
            "实际 shap.plots.waterfall 通常按绝对值排序。四个特征且 max_display=3 时显示两个单独贡献，其余合并。本例 −0.6−0.2=−0.8，合并保留有符号和，终点仍为 7.7。合并可能掩盖相互抵消。核对坐标轴、单位、标签和终点；排序不改变归因。"
          ],
          "waterfall",
          []
        ],
        [
          "force",
          "5. 力图与其他表示",
          [
            "力图强调相反方向的有符号贡献。正特征合计 +2.5，负特征合计 −0.8；在同一尺度上净贡献 +1.7 将基线 6.0 移至预测 7.7。教学图展示这种平衡，不复制库的外观。阅读真实力图时先查看标签、图例和尺度，再解释颜色。",
            "瀑布图便于逐步核算；力图适合紧凑展示竞争贡献。决策图可显示一行或多行样本的累积归因，并非决策树路径。10.2.2 将比较多样本可视化。红色不一定表示坏、蓝色不一定表示好；符号由解释的输出决定。"
          ],
          "force",
          []
        ],
        [
          "scale",
          "6. 对数几率、概率与输出尺度",
          [
            "回归贡献使用预测量的单位。分类先选类别和解释量：概率、raw margin 或其他支持的输出。如果输出为 logit z=ln(p/(1−p))，应先求和再转概率。基线 −0.4，贡献 +1.0 和 −0.3，得到 z=0.3。σ(−0.4)≈0.401312，σ(0.3)≈0.574443；概率变化约 0.173131，即 17.31 个百分点。",
            "Sigmoid 非线性：σ(φ₁)+σ(φ₂) 不是概率分解。单个 logit 归因不是百分点。如果解释器确实支持该模型及模式的 model_output='probability'，在概率尺度检查可加性。Raw output 并不总是 logit：回归器的 raw output 是预测，其他模型取决于实现。多输出时核对形状和类别索引，不能对所有类别求和。"
          ],
          "sigmoid",
          [
            "σ(z) = 1 / (1 + exp(−z))",
            "−0.4 + 1.0 − 0.3 = 0.3"
          ]
        ],
        [
          "background",
          "7. 为什么解释会变化",
          [
            "回顾 10.1.2 中 f(a,r)=a/10，背景为 (40,1) 与 (80,3)，解释 (80,3)。基线 6、预测 8。边际博弈得 (2,0)，条件博弈得 (1,1)，因为房间数包含面积信息。两者均合计 2，但回答不同问题。这并不表示模型直接使用房间数。",
            "即使采用相同语义，全城背景与小户型背景也定义不同参照。在固定模型和 x 的情况下，同一标量预测不变，但基线和贡献可能改变。区分问题设定变化、采样变异和程序错误。实验比较两个仅来自训练集的背景并重构两种博弈；贡献变化不自动意味着错误。"
          ],
          null,
          []
        ],
        [
          "api",
          "8. SHAP Explanation 与诊断",
          [
            "Explanation 包含 values、base_values、data、feature_names，以及可用时的 output_names 和 output_indexes。单输出表格模型的 values 通常形状为 (n_samples,n_features)，选一行后为 (n_features,)。多输出的形状取决于模型和 API 版本：索引前打印 shape 并核对文档，不假定最后一个索引就是目标输出。",
            "检查：(1) 模型版本与样本一致；(2) 输出/类别一致，例如回归器用 predict 而非 predict_proba；(3) 预处理与列顺序一致；(4) base_values 属于当前样本/输出；(5) r 在容差内。One-hot 等变换后的归因属于变换特征，直到建立明确映射。出现错误应修正设定，不能只放宽容差换取 PASS。"
          ],
          "diagnostic",
          []
        ],
        [
          "report",
          "9. 撰写局部解释报告",
          [
            "报告：模型 ID 与版本 → 样本和所选输出 → 背景与语义 → 基线 → 预测 → 最大有符号贡献与其余分组 → 残差与容差 → 局限。教学例：基线 6.0，输出 7.7 百万卢布；面积与位置合计 +2.5，楼龄与楼层 −0.8，净 +1.7，按给定精度 r=0。明确这些数值为人为构造。",
            "不要写“面积导致市场价格上涨 1.8 百万卢布”。应写“在所选解释中，面积对模型预测的归因为 +1.8 百万卢布”。可加性不证明公平性、适用性或因果效应。下一课 10.2.1 通过聚合多个解释研究全局重要性，而不是从一套公寓推论总体。"
          ],
          null,
          []
        ]
      ],
      "diagrams": {
        "decomposition": {
          "layout": "shap-local-decomposition",
          "title": "预测分解",
          "description": "教学数值：基线 6.0；+2.5；−0.8；预测 7.7 百万卢布。",
          "caption": "教学数值：基线 6.0；+2.5；−0.8；预测 7.7 百万卢布。",
          "labels": {
            "baseline": "基线",
            "prediction": "预测",
            "positive": "正贡献 +2.5",
            "negative": "负贡献 −0.8",
            "unit": "百万卢布",
            "net": "净变化 +1.7",
            "probability": "概率"
          },
          "features": [
            {
              "label": "面积 · 80 m²",
              "value": 1.8
            },
            {
              "label": "位置 · 7/10",
              "value": 0.7
            },
            {
              "label": "楼龄 · 30 年",
              "value": -0.6
            },
            {
              "label": "楼层 · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "waterfall": {
          "layout": "shap-local-waterfall",
          "title": "教学瀑布图",
          "description": "每一步连接相邻累计值，不代表干预。",
          "caption": "每一步连接相邻累计值，不代表干预。",
          "labels": {
            "baseline": "基线",
            "prediction": "预测",
            "positive": "正贡献 +2.5",
            "negative": "负贡献 −0.8",
            "unit": "百万卢布",
            "net": "净变化 +1.7",
            "probability": "概率"
          },
          "features": [
            {
              "label": "面积 · 80 m²",
              "value": 1.8
            },
            {
              "label": "位置 · 7/10",
              "value": 0.7
            },
            {
              "label": "楼龄 · 30 年",
              "value": -0.6
            },
            {
              "label": "楼层 · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "force": {
          "layout": "shap-local-force",
          "title": "相反贡献的平衡",
          "description": "教学力图示意，并非库截图；正负贡献使用同一尺度。",
          "caption": "教学力图示意，并非库截图；正负贡献使用同一尺度。",
          "labels": {
            "baseline": "基线",
            "prediction": "预测",
            "positive": "正贡献 +2.5",
            "negative": "负贡献 −0.8",
            "unit": "百万卢布",
            "net": "净变化 +1.7",
            "probability": "概率"
          },
          "features": [
            {
              "label": "面积 · 80 m²",
              "value": 1.8
            },
            {
              "label": "位置 · 7/10",
              "value": 0.7
            },
            {
              "label": "楼龄 · 30 年",
              "value": -0.6
            },
            {
              "label": "楼层 · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "sigmoid": {
          "layout": "shap-local-sigmoid",
          "title": "Logit 的非线性变换",
          "description": "转换总和：σ(−0.4)≈0.401312；σ(0.3)≈0.574443。",
          "caption": "转换总和：σ(−0.4)≈0.401312；σ(0.3)≈0.574443。",
          "labels": {
            "baseline": "基线",
            "prediction": "预测",
            "positive": "正贡献 +2.5",
            "negative": "负贡献 −0.8",
            "unit": "百万卢布",
            "net": "净变化 +1.7",
            "probability": "概率"
          },
          "features": [
            {
              "label": "面积 · 80 m²",
              "value": 1.8
            },
            {
              "label": "位置 · 7/10",
              "value": 0.7
            },
            {
              "label": "楼龄 · 30 年",
              "value": -0.6
            },
            {
              "label": "楼层 · 2",
              "value": -0.2
            }
          ],
          "baseline": 6,
          "prediction": 7.7
        },
        "diagnostic": {
          "layout": "shap-compute-pipeline",
          "title": "核验流程",
          "description": "每一步先纠正不一致，再进行解释。",
          "caption": "每一步先纠正不一致，再进行解释。",
          "nodes": [
            {
              "id": "step-0",
              "title": "样本与模型",
              "detail": "不一致 → 重新选择正确版本与样本。"
            },
            {
              "id": "step-1",
              "title": "类别与尺度",
              "detail": "不一致 → 使用相同输出。"
            },
            {
              "id": "step-2",
              "title": "特征与映射",
              "detail": "不一致 → 恢复列顺序与预处理。"
            },
            {
              "id": "step-3",
              "title": "背景与基线",
              "detail": "不一致 → 使用当前解释的 base_values。"
            },
            {
              "id": "step-4",
              "title": "残差 r",
              "detail": "超出容差 → 诊断而非掩盖。"
            },
            {
              "id": "step-5",
              "title": "局部报告",
              "detail": "说明单位、条件和局限，不作因果结论。"
            }
          ]
        }
      },
      "glossary": [
        [
          "局部解释",
          "对一个样本所选输出的解释。"
        ],
        [
          "特征归因",
          "指定博弈中相对基线差值的有符号分配。"
        ],
        [
          "基值",
          "特定解释的参照输出。"
        ],
        [
          "背景数据",
          "用于定义缺失特征与基线的参照数据。"
        ],
        [
          "输出尺度",
          "SHAP 所解释量的单位。"
        ],
        [
          "原始输出",
          "由模型定义的未转换输出。"
        ],
        [
          "对数几率",
          "0<p<1 时的 ln(p/(1−p))。"
        ],
        [
          "概率",
          "选定事件或类别的 0 至 1 数值。"
        ],
        [
          "局部可加性",
          "基值加贡献之和重构所选输出。"
        ],
        [
          "残差",
          "输出与重构和的差。"
        ],
        [
          "瀑布图",
          "有符号贡献的累积图。"
        ],
        [
          "力图",
          "相反方向的加性贡献表示。"
        ],
        [
          "Explanation 对象",
          "包含归因、基值、数据和元数据的 SHAP 容器。"
        ],
        [
          "输出索引",
          "核对数组形状后选定输出的位置。"
        ],
        [
          "特征映射",
          "变换特征与原始字段之间的明确对应。"
        ],
        [
          "贡献分组",
          "显示分组内有符号归因的求和。"
        ]
      ],
      "quiz": [
        [
          "教学例的预测是多少？",
          [
            "8.5",
            "7.7",
            "6.0"
          ],
          1,
          "6+2.5−0.8=7.7 百万卢布。"
        ],
        [
          "φ=−0.6 表示什么？",
          [
            "该博弈中相对基线的 −0.6 贡献",
            "特征值是 −0.6",
            "模型误差是 −0.6"
          ],
          0,
          "归因具有所选输出的单位。"
        ],
        [
          "|φ| 描述什么？",
          [
            "因果效应",
            "全局排序",
            "当前解释的贡献大小"
          ],
          2,
          "绝对值针对特定样本与博弈。"
        ],
        [
          "从 6.0 加 +1.8 与 +0.7 后是多少？",
          [
            "8.5",
            "7.7",
            "2.5"
          ],
          0,
          "这是中间和，不是终点。"
        ],
        [
          "如何合并 −0.6 与 −0.2？",
          [
            "+0.8",
            "−0.8",
            "−0.4"
          ],
          1,
          "分组保留有符号和。"
        ],
        [
          "如何从总 logit 0.3 得到概率？",
          [
            "0.3",
            "对单项贡献的 sigmoid 求和",
            "σ(0.3)≈0.574443"
          ],
          2,
          "对完整和应用 sigmoid。"
        ],
        [
          "Logit 尺度的 SHAP 应重构什么？",
          [
            "对应模型 logit",
            "任意概率",
            "y 均值"
          ],
          0,
          "基值、贡献与预测须在同一尺度。"
        ],
        [
          "固定 f,x 改变背景时什么可能改变？",
          [
            "只有预测",
            "基线与归因",
            "必然是每个贡献"
          ],
          1,
          "参照问题改变，同一预测保持。"
        ],
        [
          "多输出 Explanation 如何选择类别？",
          [
            "对所有输出求和",
            "任取索引",
            "核对形状、名称与对应索引"
          ],
          2,
          "形状取决于模型/API，不猜测。"
        ],
        [
          "残差较大，首先做什么？",
          [
            "核对样本、输出、基值和映射",
            "放宽容差到 PASS",
            "删除负贡献"
          ],
          0,
          "诊断不一致，而非掩盖。"
        ],
        [
          "面积正 SHAP 能证明什么？",
          [
            "因果价格上涨",
            "所选预测的正归因",
            "模型公平性"
          ],
          1,
          "这是所选博弈中的模型命题，不是干预。"
        ],
        [
          "一个样本能确定全局重要性吗？",
          [
            "可以，若 r=0",
            "可以，若贡献为正",
            "不能，需要定义总体并聚合"
          ],
          2,
          "单个局部解释不代表分布。"
        ]
      ],
      "sources": [
        [
          "Lundberg & Lee (2017). A Unified Approach to Interpreting Model Predictions.",
          "https://papers.nips.cc/paper_files/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
        ],
        [
          "Lundberg et al. (2020). From local explanations to global understanding with explainable AI for trees.",
          "https://doi.org/10.1038/s42256-019-0138-9"
        ],
        [
          "Aas, Jullum & Løland (2021). Explaining individual predictions when features are dependent.",
          "https://arxiv.org/abs/1903.10464"
        ],
        [
          "SHAP — Explanation",
          "https://shap.readthedocs.io/en/latest/generated/shap.Explanation.html"
        ],
        [
          "SHAP — TreeExplainer",
          "https://shap.readthedocs.io/en/latest/generated/shap.TreeExplainer.html"
        ],
        [
          "SHAP — waterfall",
          "https://shap.readthedocs.io/en/latest/generated/shap.plots.waterfall.html"
        ],
        [
          "SHAP — force",
          "https://shap.readthedocs.io/en/latest/generated/shap.plots.force.html"
        ],
        [
          "SHAP — decision",
          "https://shap.readthedocs.io/en/latest/generated/shap.plots.decision.html"
        ],
        [
          "scikit-learn — RandomForestRegressor",
          "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html"
        ]
      ],
      "practice": {
        "title": "两个背景下的局部解释",
        "intro": "合成公寓数据、RandomForestRegressor、两个仅训练集背景。代码生成真实瀑布图、力图、JSON 报告并核对求和。",
        "task": "比较同一预测的两种解释，再选择另一测试样本，说明差异而不作因果归因。",
        "steps": [
          "在独立 Python 3.12 环境安装依赖。",
          "运行文件，核对名称、取值、形状、基线和残差。",
          "查看 shap-local-results 中的 PNG 与 results.json，合并其余两个特征。",
          "改变样本与背景，解释差异；识别 logit 与概率的尺度错误。"
        ],
        "install": "python -m pip install numpy==2.5.5 shap==0.54.1 scikit-learn==1.9.1 matplotlib pandas",
        "run": "python a-10-1-3-shap-local-explanations.py"
      }
    }
  },
  "practiceCode": "\"\"\"DCH School 10.1.3 — local SHAP. Synthetic housing data, not an appraisal.\"\"\"\nimport json\nimport math\nimport os\nfrom pathlib import Path\n\nimport matplotlib\nmatplotlib.use(\"Agg\")\nimport matplotlib.pyplot as plt\nimport numpy as np\nimport pandas as pd\nimport shap\nimport sklearn\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.model_selection import train_test_split\n\nSEED = 42\nOUT = Path(os.environ.get(\"DCH_LAB_OUTPUT\", \"shap-local-results\"))\nOUT.mkdir(parents=True, exist_ok=True)\nrng = np.random.default_rng(SEED)\nn = 600\nX = pd.DataFrame({\n    \"area_m2\": rng.uniform(25, 120, n),\n    \"location_score\": rng.integers(1, 11, n),\n    \"age_years\": rng.integers(0, 61, n),\n    \"floor\": rng.integers(1, 17, n),\n})\ny = (1.6 + 0.065 * X.area_m2 + 0.21 * X.location_score\n     - 0.026 * X.age_years + 0.02 * X.floor\n     + 0.001 * X.area_m2 * X.location_score\n     + rng.normal(0, 0.18, n))\ntrain, test, y_train, _ = train_test_split(X, y, test_size=0.25, random_state=SEED)\nmodel = RandomForestRegressor(n_estimators=32, max_depth=6, random_state=SEED, n_jobs=1)\nmodel.fit(train, y_train)\nx = test.iloc[[0]]\nprediction = float(model.predict(x)[0])\nbackgrounds = {\n    \"all_train\": train.sample(64, random_state=SEED),\n    \"small_train\": train.nsmallest(120, \"area_m2\").sample(64, random_state=SEED),\n}\nATOL, RTOL = 2e-5, 1e-6  # million RUB; allow tree implementation roundoff\nnames = list(x.columns)\nresults = {}\nfor name, bg in backgrounds.items():\n    assert set(bg.index).issubset(set(train.index))\n    explainer = shap.TreeExplainer(model, data=bg,\n        feature_perturbation=\"interventional\", model_output=\"raw\")\n    batch = explainer(x)\n    print(name, \"batch shape\", batch.shape, \"output names\", batch.output_names)\n    assert batch.values.shape == (1, len(names))\n    e = batch[0]\n    phi = np.asarray(e.values, dtype=float)\n    base = float(np.asarray(e.base_values).item())\n    assert phi.shape == (len(names),)\n    assert list(e.feature_names) == names\n    np.testing.assert_allclose(np.asarray(e.data, dtype=float), x.iloc[0].to_numpy(dtype=float))\n    assert np.isfinite(phi).all() and math.isfinite(base)\n    reconstruction = base + float(phi.sum())\n    np.testing.assert_allclose(reconstruction, prediction, atol=ATOL, rtol=RTOL)\n    np.testing.assert_allclose(base, model.predict(bg).mean(), atol=ATOL, rtol=RTOL)\n    order = np.argsort(-np.abs(phi), kind=\"stable\")\n    table = [{\"feature\": names[i], \"value\": float(x.iloc[0, i]),\n              \"phi_million_rub\": float(phi[i])} for i in order]\n    grouped = float(phi[order[2:]].sum())\n    np.testing.assert_allclose(base + float(phi[order[:2]].sum()) + grouped,\n                               prediction, atol=ATOL, rtol=RTOL)\n    results[name] = {\"background_rows\": len(bg), \"base\": base,\n                     \"prediction\": prediction, \"reconstructed\": reconstruction,\n                     \"residual\": prediction - reconstruction, \"grouped_other\": grouped,\n                     \"features\": table}\n    print(name, json.dumps(results[name], indent=2))\n    shap.plots.waterfall(e, max_display=3, show=False)\n    plt.savefig(OUT / f\"waterfall-{name}.png\", dpi=160, bbox_inches=\"tight\")\n    plt.close(\"all\")\n    if name == \"all_train\":\n        shap.plots.force(e, matplotlib=True, show=False)\n        plt.savefig(OUT / \"force-all_train.png\", dpi=160, bbox_inches=\"tight\")\n        plt.close(\"all\")\n\nassert math.isclose(results[\"all_train\"][\"prediction\"], results[\"small_train\"][\"prediction\"])\nsigmoid = lambda z: 1 / (1 + math.exp(-z))\nz0, z = -0.4, -0.4 + 1.0 - 0.3\nprint(\"Teaching logits:\", z0, z, \"probabilities:\", sigmoid(z0), sigmoid(z))\nassert math.isclose(sigmoid(z), 0.574442516811659)\nreport = {\"seed\": SEED, \"versions\": {\"numpy\": np.__version__, \"shap\": shap.__version__,\n           \"sklearn\": sklearn.__version__, \"pandas\": pd.__version__,\n           \"matplotlib\": matplotlib.__version__}, \"units\": \"million RUB\",\n          \"object_index\": int(x.index[0]), \"object\": {k: float(v) for k,v in x.iloc[0].items()},\n          \"mode\": \"interventional\", \"output\": \"raw regression\", \"atol\": ATOL, \"rtol\": RTOL,\n          \"backgrounds\": results}\n(OUT / \"results.json\").write_text(json.dumps(report, indent=2) + \"\\n\", encoding=\"utf-8\")\nprint(\"PASS: identity, baseline, additivity, grouping, fixed prediction and sigmoid\")\n"
};
})();
