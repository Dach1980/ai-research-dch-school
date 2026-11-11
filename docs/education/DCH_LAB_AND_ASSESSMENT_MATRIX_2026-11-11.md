# Матрица лабораторных работ и оценивания DCH (A/B/C)

**Дата:** 2026-11-11  
**Статус:** проект стандарта для включения в разработку уроков; не означает, что лабораторные уже созданы.

## 1. Обязательный паспорт лабораторной

Каждая лабораторная должна включать:
1. ID, связанный Track/Theme/Module/Lesson UID;
2. проверяемые learning outcomes и prerequisites;
3. ОС, CPU/GPU/RAM/VRAM и альтернативный облегчённый маршрут;
4. точные версии Python, runtime, SDK, библиотек, модели и датасета;
5. лицензию, происхождение модели/данных, checksums или revision pin;
6. пошаговые действия и ожидаемые результаты;
7. артефакты (notebook, код, графики, trace, отчёт);
8. критерии оценивания и проходной порог;
9. негативные/edge-case тесты;
10. воспроизводимость: seed, config, environment lock, logs;
11. ограничения и риски интерпретации;
12. критерии безопасности и приватности, если затрагиваются инструменты/данные.

## 2. Матрица лабораторных

| ID | Track | Область | Практика | Обязательный артефакт | Критерии |
|---|---|---|---|---|---|
| LAB-01 | A/Foundation | ML и данные | train/test, baseline, метрики, leakage | notebook + data card | корректная постановка, отсутствие leakage |
| LAB-02 | A | Линейные модели | коэффициенты, scaling, regularization | model card + notebook | интерпретация шкалы и ограничений |
| LAB-03 | A | Нелинейные модели | tree/KNN/SVM/ensemble | comparative notebook | сравнение при равных условиях |
| LAB-04 | A | Causal inference | DAG, estimand, confounding, sensitivity | DAG + analysis | assumptions и границы causal claim |
| LAB-05 | A | Heterogeneous effects | CATE/meta-learners, subgroup validation | notebook + robustness report | overlap, multiplicity, uncertainty |
| LAB-06 | A | PDP/ICE/ALE | сравнить кривые, correlated features | plots + interpretation | extrapolation и correlation caveats |
| LAB-07 | A | SHAP/LIME/Anchors/CF | сравнить объяснения одной модели | notebook + explanation cards | baseline, fidelity, plausibility |
| LAB-08 | A | Feature interactions | main/interaction effects | plots + report | не путать interaction и causality |
| LAB-09 | A | CNN | layers, feature maps, receptive fields | architecture worksheet | корректная интерпретация слоёв |
| LAB-10 | A | Gradients | saliency/IG/SmoothGrad | attribution maps + sanity checks | sensitivity ≠ causal importance |
| LAB-11 | A | CAM | Grad-CAM across layers/classes | maps + failure analysis | localization ≠ causality |
| LAB-12 | A | Concept methods | concept set, TCAV-like tests | concept dataset + report | concept validity, coverage, bias |
| LAB-13 | A | Attention | compare attention with attribution/intervention | notebook + comparison | attention weights не объявлять объяснением автоматически |
| LAB-14 | A | LLM analysis | controlled prompt/context/output tests | experiment matrix + logs | controls, repeatability |
| LAB-15 | A | Agent behaviour | traces, tool choice, state, failures | annotated traces | answer vs trajectory explanation |
| LAB-16 | A | XAI evaluation | faithfulness/stability/robustness/sanity/attacks | evaluation protocol + red-team cases | controls, reproducibility |
| LAB-17 | B | Transformer internals | residual stream, QK/OV, MLP, LayerNorm | small-model notebook | корректная трассировка активаций |
| LAB-18 | B | Probes/lenses | probes, control tasks, tuned lens | probe report | decodability ≠ causal use |
| LAB-19 | B | Causal interventions | ablation, activation/path patching | intervention notebook | clean/corrupted pairs and controls |
| LAB-20 | B | Circuit discovery | induction heads/IOI/ACDC/EAP | circuit graph + replication | completeness, alternatives |
| LAB-21 | B | SAE/features | train/analyse SAE | SAE artifact + eval | reconstruction, sparsity, splitting/merging |
| LAB-22 | B | Steering/editing | steering vectors and side effects | benchmark | causal efficacy, side effects |
| LAB-23 | B | Safety/robustness | threat model, refusal/unlearning, red-team | threat model + report | limits; no safety-guarantee claims |
| LAB-24 | B | Developmental interp. | compare checkpoints/features | checkpoint study | comparability and confounds |
| LAB-25 | A/B | Capstone | reproduce one result end-to-end | paper-style report + code | question, method, evidence, limitations |
| C-L01 | C | Model choice | model/license/quantization/hardware fit | model card + benchmark | provenance, compatibility, VRAM |
| C-L02 | C | LM Studio | install and local endpoint | config + health check | localhost boundary, repeatable launch |
| C-L03 | C | Generation | controlled sampling experiment | experiment table | fixed prompt/config and comparisons |
| C-L04 | C | API/Python | typed client, streaming, retries | package + tests | error handling and reproducibility |
| C-L05 | C | MCP protocol | protocol trace and trust boundary | sequence diagram | lifecycle, auth and capability negotiation |
| C-L06 | C | MCP server | implement tools with schemas | server + negative tests | least privilege, validation |
| C-L07 | C | MCP Web Search | search, extract, cite; poisoned page test | citations + red-team log | source validation and injection isolation |
| C-L08 | C | RAG | ingest, retrieve, rerank, generate | dataset + qrels + eval report | retrieval + groundedness + citation |
| C-L09 | C | Security/performance | threat model and benchmark | red-team + perf report | critical security gates |
| C-L10 | C | Capstone | complete local AI application | app + README + tests + eval | reproducibility, security, quality |

## 3. Система оценивания

| Слой | Проверяет | Формат | Условие |
|---|---|---|---|
| Knowledge check | понятия и различия | quiz с rationale | 80% ориентир, повторная попытка |
| Worked analysis | применение метода | notebook/worksheet | rubric по assumptions, implementation, interpretation |
| Reproducibility gate | повторяемость | rerun + environment manifest | независимый запуск успешен |
| Method comparison | выбор и trade-offs | comparative report | вывод подкреплён данными |
| Research critique | качество claim и evidence | structured paper review | различает observation/inference/causality |
| Capstone | самостоятельное исследование/продукт | code, report, artifacts, presentation | проходит rubric и устную защиту |

## 4. Общая рубрика для исследовательской лабораторной

- Корректность постановки и prerequisites — 15%.
- Метод и корректность реализации — 20%.
- Качество эксперимента и controls — 20%.
- Интерпретация результатов — 15%.
- Robustness / negative tests — 10%.
- Воспроизводимость и документация — 10%.
- Ограничения, безопасность и приватность — 10%.

Порог — 80/100. Критическая ошибка безопасности, утечка данных или недостоверный causal claim без исправления являются блокирующим дефектом и не компенсируются баллами.

Для Track C security/privacy gate — обязательный: при критическом дефекте лабораторная не засчитывается независимо от суммы баллов.
