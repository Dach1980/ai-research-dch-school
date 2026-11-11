# Единая программа DCH: решение по канонической версии, каталог и покрытие

**Дата аудита:** 2026-11-11  
**Статус:** решение о канонической архитектуре зафиксировано; миграция каталога и Track B/C IDs остаётся отдельной задачей.

## 1. Каноническое решение

Каноническим документом архитектуры Track A является `docs/management/TRACK_A_ARCHITECTURE_PROPOSAL.md` (решение от 2026-11-05). Он фиксирует 16 тематических модулей 11–26, в частности:
- 14 — причинность и причинная интерпретация;
- 15 — гетерогенные эффекты;
- 17 — классические методы объяснения;
- 24 — applied LLM analysis;
- 25 — объяснение поведения агентов;
- 26 — оценка качества объяснений, научная проверка и отдельный advanced-блок атак.

Модули 0–10 — общая фундаментальная база; их точный набор в 40-модульной реконструкции остаётся проектным, до полной спецификации outcomes и лабораторных.
Модули 27–39 — рабочее ядро Track B / Inside AI. Общие знания и переходные темы 19–26 подтверждаются диагностикой; они не проходятся повторно автоматически.
Track C / Building with AI — самостоятельная программа C0–C12, не часть счётчика 40 модулей A/B.

Иерархия: **Track → Theme → Module → Lesson**. UID каталога — стабильный технический ключ; человекочитаемые коды и старые URL не заменяют UID.

## 2. Почему выбран этот источник

`TRACK_A_ARCHITECTURE_PROPOSAL.md` содержит датированные принятые решения от 5 ноября и согласуется с ранее утверждённым разделением causal inference / heterogeneous effects, модулем 26, уроками A.1–A.5 и диагностическими маршрутами.
`CURRICULUM_SPECIFICATION.md` из репозитория `ai-interpretability-course` содержит полезную расширенную реконструкцию 0–39, но его Track A 11–26 расходится с принятым решением от 5 ноября, а раздел 1.1 дублируется с различными границами Track B. Поэтому этот документ остаётся исследовательским/историческим источником, а не канонической картой DCH. Его содержание не удаляется и не переносится автоматически.

## 3. Реальный статус каталога на дату проверки

Каталог v3 имеет статус `migration_staging`, версия `3.0.0-draft`.
- 3 трека: `trk-a`, `trk-b`, `trk-c`.
- В Track A заведены 5 Theme UID (`thm-a-01…05`) и 27 Module UID (`mod-a-…`).
- 52 Lesson UID (`les-a-0001…0052`).
- Заполнены реальные уроки Track A; отдельные Theme/Module/Lesson UID для ядра Track B и модулей C0–C12 в этом каталоге отсутствуют.
- Старый `lessons.json` всё ещё содержит A.1–A.8 и `module-11`; это legacy слой, его нельзя использовать как единственный источник истины.

## 4. Module → Theme UID / Module UID / Lesson UID

Полная машиночитаемая карта находится в `data/curriculum-governance-2026-11-11.json`. Она содержит строки для всех 40 модулей, фактические UID, lesson UID и статус покрытия. Важная оговорка: нынешние 5 Theme / 27 Module UID каталога — более детальная структура Track A и не совпадают 1:1 с 16 макромодулями 11–26. Поэтому mapping может быть many-to-many. Для Track B 27–39 UID ещё не созданы; фиктивные UID не вводятся.

## 5. Проверка существующих уроков

Проверка сделана по catalog-v3 metadata и факту наличия URL в каталоге, а не по полному построчному редакционному чтению каждой страницы. Статусы:
- **Раскрыто материалом:** есть опубликованная страница и тематически подходящий UID.
- **Частично / review:** страница есть, но находится на редакционной проверке или закрывает лишь часть макротемы.
- **Только обозначено:** тема есть в каталоге, но полноценной страницы пока нет.
- **Отсутствует в каталоге:** для направления/модуля ещё нет записи; это не утверждение, что материалов нигде нет.

По фактическому каталогу: 52 UID; 8 published, 6 review, остальные planned. Среди review: 1.2.2, 1.2.4, 1.2.5, 1.2.6, 1.3.1; плюс полный список статусов хранится в JSON. Урок 1.2.1 опубликован. Для A/B ядра 27–39 страниц и UID отсутствуют. Этот инвентарь нужно дополнить редакционным QA всех локализаций и практик.

## 6. Prerequisites и маршруты

### Track A
- Start: Theme 1, диагностика базовой математики и цифровой грамотности.
- Ускоренный вход: подтвердить Python/NumPy/pandas, статистику, train/test, базовые ML метрики.
- В 12–18: проверить регрессию/классификацию, scikit-learn, вероятность и линейную алгебру.
- В 14 → 15: причинная идентификация обязательна до CATE/heterogeneous effects.
- В 19–23: проверить DL/CNN/PyTorch, производные и chain rule.
- В 24–25: проверить Transformer, tokens/context, API/tool use.
- В 26: статистика, экспериментальный дизайн и воспроизводимость.

### Track B
Вход не блокируется номером урока. Диагностика должна подтвердить:
1. Python, NumPy/PyTorch, тензоры/autograd;
2. линейная алгебра, SVD, производные, вероятность;
3. ML/DL, backpropagation, embeddings;
4. Transformer forward pass, attention, residual stream, MLP, LayerNorm;
5. экспериментальный дизайн и чтение статей.

Если компетенция не подтверждена — назначается bridge lesson/lab, затем повторная проверка. Track B использует подтверждённые prerequisites Track A, но не требует повторного прохождения всех страниц A.

## 7. Лабораторные и оценивание

Отдельная матрица `labs` и `assessments` содержится в JSON. Она покрывает:
- базовые ML/данные и воспроизводимость;
- линейные/нелинейные модели, causal inference, CATE;
- PDP/ICE/ALE, SHAP/LIME/Anchors/counterfactuals;
- CNN, gradients, CAM, concepts, attention, LLM/agents, XAI evaluation;
- Transformer internals, probes/lenses, causal interventions, circuits, SAE/features, steering, safety, developmental interpretability;
- Track C local inference, APIs, MCP, Web Search, RAG, security and capstone.

Каждая лабораторная должна иметь входные требования, окружение/версии, данные/модель/лицензию, ожидаемый артефакт, rubric, проверку воспроизводимости и ограничения. Для assessment приняты шесть слоёв: knowledge check, worked analysis, reproducibility gate, method comparison, research critique, capstone.

## 8. Аудит Track C по первичным источникам

Программа C0–C12 в исходном документе существует, но аудит выявил пробелы:
- runtime/API: обновлять учебный путь на LM Studio REST API v1; OpenAI-compatible API преподавать как interoperability interface, не как единственный API;
- serving: добавить сравнение runtime (LM Studio и альтернативы вроде vLLM) и мониторинг;
- MCP: обновить по спецификации 2026-07-28; учесть authorization, trust boundaries, server/tool validation, lifecycle, error handling, user consent;
- RAG: разделить ingestion, retrieval и generation evaluation; нужны retrieval qrels/Recall@k/NDCG/MRR, context relevance, groundedness, answer relevance/completeness, citation correctness;
- security: опираться на OWASP GenAI LLM Top 10 2026, включить prompt injection, data leakage, supply chain, poisoning, output handling, excessive agency, unbounded consumption, vector/embedding weaknesses;
- privacy: ACL-aware retrieval, tenant isolation, local data retention/deletion, secrets and network egress;
- reliability: pinned dependencies/models, model hashes/licences, test fixtures, latency/throughput/VRAM/TTFT and fallback profiles.

Полная программа C0–C12 и gap map находятся в JSON. Это аудит спецификации и источников, не QA ещё не написанных уроков.

## 9. Что не менялось намеренно

Не менялись публичный каталог, страницы уроков, URL и published statuses. Каталог v3 ещё migration_staging, а макроархитектура A/B и детальная 5-theme Track A структура требуют формальной миграционной таблицы и CI проверки. Не создавались фиктивные UID Track B/C. Следующий технический этап — согласованная миграция каталога с alias registry и consumer compatibility.
