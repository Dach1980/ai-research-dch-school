# Prerequisites и диагностические маршруты Track A / Track B

**Дата:** 2026-11-11  
**Принцип:** доступ к продвинутому модулю определяется подтверждёнными компетенциями, а не формальным прохождением всех предыдущих URL.

## 1. Диагностические блоки

| Gate | Компетенция | Минимальное подтверждение | Bridge при пробеле |
|---|---|---|---|
| G0 | базовая математика и цифровая грамотность | функции, графики, файлы, таблицы | вводный foundation |
| G1 | Python | функции, коллекции, исключения, env, чтение кода | Python foundations |
| G2 | NumPy/pandas | arrays, vectorization, DataFrame, missing values | computational tools |
| G3 | Probability/statistics | distributions, conditional probability, mean/variance, confidence intervals | probability/statistics |
| G4 | Linear algebra/calculus | vectors/matrices, dot product, derivatives, chain rule, SVD for B | math bridge |
| G5 | ML | train/validation/test, leakage, loss, regression/classification, metrics | ML foundations |
| G6 | Deep learning | tensors, autograd, backprop, optimization, CNN | PyTorch/DL bridge |
| G7 | Transformer | tokens, embeddings, attention, residual stream, MLP, LayerNorm | Transformer bridge |
| G8 | Research practice | hypothesis, controls, baseline, seed, replication, uncertainty | scientific method lab |

## 2. Маршрут Track A

- A-START: G0 → G5. Студент без базы проходит вводную последовательность.
- A-FAST: G1–G5 подтверждены — ускоренный вход к интерпретируемым моделям.
- A-CAUSAL: G3 + G5 + регрессия подтверждены — вход к модулю 14; модуль 15 дополнительно требует успешного модуля 14 и проверки causal identification.
- A-DEEP: G1–G6 подтверждены — вход к CNN/gradient/CAM/concept methods (19–22).
- A-LLM: G1 + G6 + G7 подтверждены — вход к Applied LLM (24); agent behaviour (25) дополнительно требует API/tool-use literacy.
- A-EVAL: G3 + G8 + опыт с методами 12–25 — вход к модулю 26.

## 3. Маршрут Track B

Не требовать повторного прохождения всех уроков Track A. Входной gate:
- G1/G2: Python, NumPy, PyTorch tensors;
- G3/G4: probability, linear algebra, derivatives, SVD;
- G5/G6: ML/DL, backpropagation, embeddings;
- G7: Transformer forward pass, attention, residual stream, MLP, LayerNorm;
- G8: experiment design, controls, reproducibility.

После диагностики:
- все gates подтверждены → прямой вход к B27;
- пробелы только в математике → соответствующие bridge modules 4–7;
- пробелы в DL/PyTorch → bridge module 9;
- пробелы в Transformer → bridge 25/28;
- пробелы в experimental methods → bridge 10/26.

Переход 27 → 28 → 29 → 30 → 31/32 → 33/34; safety/robustness 35/36 и developmental 37; frontier 38; capstone 39. Это рабочая dependency graph, детальные module-level pass thresholds ещё должны быть заданы в каждом уроке.

## 4. Правила допуска

1. Диагностика не блокирует обучение: при провале даёт bridge route.
2. Учитывается доказательство компетенции, а не только completion.
3. Каждый gate имеет versioned item bank, pass threshold, attempts policy и evidence record.
4. Нельзя допускать к causal/MI claims только на основании правильных терминов; требуется практическое задание.
5. После bridge выполняется повторная диагностика.
6. Успешный gate сохраняется как evidence, чтобы студент не пересдавал одну компетенцию без причины.
7. Track B не должен требовать прохождения всей Track A повторно.
