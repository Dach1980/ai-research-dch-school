# Track C — аудит программы Building with AI по первичным источникам

**Дата:** 2026-11-11  
**Исходная спецификация:** `Dach1980/ai-interpretability-course/docs/TRACK_C_LLM_ENGINEERING.md`  
**Статус:** аудит структуры C0–C12 и первичных источников выполнен; уроки и лабораторные ещё не прошли lesson-level QA.

## 1. Вывод

Исходная структура C0–C12 полезна и сохраняется как основа. Она охватывает local inference, hardware, модели/форматы, LM Studio, generation settings, API, Python, MCP, Web Search, RAG, diagnostics/security и capstone.

Однако документ пока является архитектурной спецификацией: он не содержит закреплённого каталога Lesson UID, подробных лабораторных паспортов, версионированных тестовых наборов и критериев приёмки по каждому уроку. Поэтому Track C нельзя считать готовым к публикации.

## 2. Модульный аудит

| Модуль | Что уже есть в спецификации | Что обязательно дополнить | Практическая проверка |
|---|---|---|---|
| C0 Local AI | local vs cloud, privacy, licences, ecosystem | model provenance, licence compatibility, local data boundary | одинаковый кейс local/cloud и trade-off report |
| C1 Hardware | CPU/GPU/VRAM/RAM, CUDA, KV cache, monitoring | измерения memory bandwidth, context/KV-cache budget, thermal/power and concurrency | benchmark на нескольких контекстах и batch settings |
| C2 Model formats | parameters, tokenizer, context, GGUF, quantization | model cards, architecture compatibility, quantization quality degradation, checksums | сравнить model/quant variants по quality, VRAM и speed |
| C3 LM Studio | install, download, local server, logs | LM Studio v1 API, CLI automation, model load/unload, auth and network exposure | localhost-only server, model lifecycle and health check |
| C4 Generation | system prompt, template, sampling params | structured output/schema validation, stop conditions, seed/reproducibility, context budgeting | controlled experiment with fixed dataset |
| C5 API | HTTP/REST/JSON, OpenAI-compatible API, streaming | native LM Studio v1 vs compatibility layer, timeouts/retries, authentication, error taxonomy | Python client test suite and streaming test |
| C6 Python | env, HTTP client, JSON, typing, logging | packaging, config/secrets, tests, dependency pinning, async and cancellation | small typed package with pytest and lockfile |
| C7 MCP basics | host/client/server, lifecycle, transports, tools/resources/prompts, trust | update to 2026-07-28 specification, stateless core, multi-round-trip, authorization, capability negotiation | protocol trace and trust-boundary diagram |
| C8 MCP servers | tools, schemas, validation, errors, logging | authz, least privilege, input/output validation, rate limits, audit logs, filesystem/network isolation | malicious-input and permission-boundary tests |
| C9 MCP Web Search | search, extract, cite, timeouts, untrusted web content | source trust, prompt injection in pages, citation verification, SSRF/URL allowlists, provenance | poisoned-page red-team + citation checks |
| C10 RAG | ingestion, parsing, chunking, embeddings, vector search, reranking, citations | ACL-aware retrieval, hybrid retrieval, index versioning, delete/update, retrieval eval, citation entailment | benchmark with qrels and answer ground truth |
| C11 Diagnostics/security | latency, throughput, memory, injection, leakage, licences | OWASP 2026 taxonomy, model/package supply chain, data poisoning, vector weakness, output handling, excessive agency, unbounded consumption | threat model, red-team suite, perf regression |
| C12 Capstone | project alternatives and README requirements | test coverage, architecture decision record, dataset/model provenance, evaluation report, security checklist, reproducible launch | independent reviewer reproduces demo and metrics |

## 3. Runtime и API

Основной учебный runtime остаётся LM Studio, поскольку это практическая специализация школы. Но API-слой нужно преподавать как два уровня:

1. **Нативный LM Studio REST API v1** — основной путь для LM Studio-specific lifecycle, stateful chat, model operations и возможностей, которых нет в OpenAI-compatible endpoint.
2. **OpenAI-compatible endpoints** — interoperability layer для приложений, SDK и переносимости между runtime.

Не привязывать весь курс к одному endpoint. Обязательно сравнить LM Studio с альтернативным serving runtime (например, vLLM) на уровне задач, hardware constraints, API compatibility, observability и deployment assumptions. Не обещать одинаковую поддержку всех моделей/функций.

## 4. MCP — обновление по текущей спецификации

Курс C7–C9 должен использовать актуальную спецификацию MCP 2026-07-28 как основной reference point. В анонсе релиза отмечены stateless protocol core, multi-round-trip requests, header-based routing, cacheable list results, authorization hardening, extension framework и обновлённые SDK.

Обязательные учебные понятия:
- protocol lifecycle и capability negotiation;
- host/client/server responsibilities;
- tools, resources, prompts и notifications;
- stdio vs Streamable HTTP transport и их разные security assumptions;
- authorization, token audience, credential handling;
- user consent и подтверждение чувствительных действий;
- server trust, tool provenance, least privilege;
- validation of tool arguments/results, timeouts, cancellation, rate limits;
- audit logging, error handling и safe defaults;
- prompt injection из tool results как недоверенный контент, а не инструкции.

Нельзя преподавать MCP как «просто подключить функцию к модели». Это протокол интеграции и граница доверия.

## 5. RAG — обязательная матрица качества

RAG нельзя оценивать одной метрикой ответа. Нужны отдельные слои:

**Retrieval/process quality**
- Recall@k / Precision@k;
- MRR / nDCG;
- retrieval relevance;
- coverage и отсутствие нужного фрагмента;
- metadata filters и ACL correctness.

**Generation/system quality**
- groundedness / faithfulness к retrieved context;
- answer relevance;
- completeness against ground truth;
- citation correctness and support;
- abstention when evidence is missing.

**Operational quality**
- latency by stage;
- index freshness;
- embedding/model version compatibility;
- cost/resource use;
- update/delete propagation.

В лаборатории должны быть qrels (query → relevant document/chunk labels) и answer ground truth. LLM-as-judge может дополнять, но не заменять детерминированные проверки и human review.

## 6. Security baseline

Использовать OWASP GenAI LLM Top 10 2026 как актуальную базовую таксономию риска (не застревать на номерах и формулировках редакции 2025). Отдельные практики:
- direct/indirect prompt injection;
- sensitive data disclosure and tenant isolation;
- supply chain and model provenance;
- data/model/embedding poisoning;
- insecure output handling;
- excessive agency and tool permissions;
- system prompt/tool schema leakage;
- vector and embedding weaknesses;
- misinformation/overreliance;
- unbounded consumption/DoS.

Для MCP/agentic workflows нужен threat model уровня инструментов: кто инициирует вызов, кто авторизует, какие ресурсы доступны, какие действия требуют подтверждения, как ограничивается ущерб при компрометации tool result.

## 7. Лабораторная матрица Track C

| Lab | Модуль | Практика | Артефакт / критерий |
|---|---|---|---|
| C-L01 | C0–C2 | Выбрать локальную модель под hardware/task | model card, licence, quantization, VRAM budget, benchmark |
| C-L02 | C3 | Развернуть LM Studio и локальный endpoint | воспроизводимая конфигурация, health check, localhost boundary |
| C-L03 | C4 | Контролируемая генерация | экспериментальная таблица, фиксированные запросы и параметры |
| C-L04 | C5–C6 | API client на Python | typed client, retries/timeouts, tests, streaming |
| C-L05 | C7 | MCP protocol analysis | protocol trace, capability map, trust boundary |
| C-L06 | C8 | Собственный MCP server | schema validation, permissions, negative tests |
| C-L07 | C9 | MCP Web Search | источники, цитаты, poisoned-content red-team |
| C-L08 | C10 | Local RAG | dataset, qrels, retrieval metrics, groundedness/citation report |
| C-L09 | C11 | Security and performance audit | threat model, red-team cases, latency/VRAM report |
| C-L10 | C12 | Final local AI project | reproducible app, README, tests, evaluation and security report |

## 8. Оценивание Track C

Рекомендуемая рубрика для каждой практики:
- Functional correctness — 20%;
- Security and privacy — 20%;
- Evaluation quality — 20%;
- Reproducibility and documentation — 15%;
- Reliability and error handling — 15%;
- Technical explanation and limitations — 10%.

Порог: 80/100 и отсутствие критического security failure. Нельзя компенсировать небезопасное управление инструментами хорошими функциональными баллами.

## 9. Первичные источники

1. LM Studio REST API v1: https://lmstudio.ai/docs/developer/rest
2. LM Studio local server: https://lmstudio.ai/docs/developer/core/server
3. LM Studio developer docs: https://lmstudio.ai/docs/developer
4. MCP specification release 2026-07-28: https://blog.modelcontextprotocol.io/posts/2026-07-28/
5. MCP authorization reference (verify current spec version before implementation): https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-06-18/basic/authorization.mdx
6. Microsoft RAG concepts: https://learn.microsoft.com/azure/ai-studio/concepts/retrieval-augmented-generation
7. Microsoft RAG evaluation: https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators
8. OWASP GenAI LLM Top 10 2026: https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
9. vLLM OpenAI-compatible serving: https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/
10. vLLM metrics: https://docs.vllm.ai/en/latest/usage/metrics/

## 10. Что остаётся

- Полностью проверить исходные материалы пользователя: 13 видео, Python course, MCP examples, code and repositories.
- Привязать C0–C12 к отдельным Theme/Module/Lesson UID после утверждения структуры.
- Зафиксировать версии документации/SDK/runtime на момент каждой лабораторной.
- Разработать лабораторные C-L01–C-L10 и оценочные датасеты.
- Провести threat-model review и security QA каждого MCP/RAG практикума.
- Создать RU/EN/中文 уроки только после утверждения лабораторных и evaluation gates.
