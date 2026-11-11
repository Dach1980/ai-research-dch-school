# Code Teaching Standard

## Core rule
Every substantial code fragment must explain what it does and why it is needed. A code block without instructional context is not a complete teaching unit.

## Required sequence
1. **Context:** what problem this fragment solves and why it appears here.
2. **Code:** a short, runnable, logically complete fragment.
3. **Syntax:** explain each new operator, function, method, class and meaningful parameter.
4. **Execution logic:** explain operation order and data flow.
5. **Expected result:** show or describe the output and how to interpret it.
6. **Experiment:** suggest a safe change and what should change.
7. **Typical errors:** likely mistakes and how to diagnose them.
8. **Connection:** how this block uses previous knowledge and prepares the next step.

## Explanation granularity
- Explain every new or non-obvious construct on first use.
- Explain operators when their semantics affect the result: assignment, comparison, arithmetic, indexing, slicing, unpacking, iteration, boolean logic, comprehensions, context managers and exceptions.
- Explain function parameters that materially change behavior.
- Do not mechanically explain every parenthesis, comma or repeated syntax token.
- On later use, refer to the earlier explanation and focus on what is new.
- Never assume a beginner knows library APIs merely because Python syntax is familiar.

## Long-program structure
For a classification workflow, a suitable sequence is:
1. imports and library roles;
2. data source and target;
3. train/test split and stratification;
4. baseline model;
5. preprocessing pipeline;
6. model fitting;
7. predictions and probability scores;
8. confusion matrix and classification metrics;
9. cross-validation;
10. interpretation and limitations.

Do not omit important lines from the runnable sequence. Learners should be able to assemble the blocks in order and reproduce the complete experiment.

## Required checks
A learner can state the purpose before running the block. New operators and parameters are explained. Expected output is included. Limitations and assumptions are stated. Code is executable in the documented environment. RU / EN / 中文 preserve the same instructional sequence and technical meaning.
