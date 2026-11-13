# Lesson 1.1.1. What Is Artificial Intelligence?

> **Editorial draft for review.** Not published. The current HTML lesson and its publication status remain unchanged.

**Track A · Understanding AI · Beginner · 35–45 minutes**

## Why this lesson matters

When people hear “artificial intelligence”, they often picture a chatbot or a neural network. AI is much broader. A program may search for a route, plan a sequence of actions, apply expert rules, recognize an image, or generate text. Some systems learn from data; others follow explicitly written rules.

The goal is to look beyond a product's marketing label and describe its task, inputs, processing, outputs, operating context, and limitations.

## Learning outcomes

After this lesson, you will be able to:
- explain why AI is a broad engineering and scientific field, not the name of one technology;
- distinguish rule-based systems, expert systems, search and planning, ML, and DL;
- describe an AI system in terms of its task, inputs, processing, outputs, users, and environment;
- distinguish AI, ML, and DL, as well as training, inference, and evaluation;
- explain why a successful output does not prove consciousness, reliability, or a causal mechanism;
- identify the evidence needed to evaluate a system.

## 1. Start with a practical problem

Imagine an engineering team monitoring a building's energy use. It needs to detect unusual consumption and help a specialist decide what to inspect.

There are several ways to approach this task:

1. **Explicit rule:** raise an alert when consumption exceeds a fixed threshold.
2. **Expert system:** apply engineering rules and facts about equipment state.
3. **Search and planning:** find an allowed sequence of actions under operational constraints.
4. **Machine learning:** estimate expected consumption from weather, schedules, and sensor readings, then flag deviations.
5. **Deep learning:** analyze complex signals or equipment images when suitable data is available.

All five approaches may be used in AI systems, but they are not the same method. A more complex technique is not automatically better: a fixed threshold may be easier to validate and more dependable than a trained model in some settings.

## 2. What is artificial intelligence?

> **Definition.** Artificial Intelligence (AI) is a field of computer science and engineering concerned with building machine systems that perform tasks associated with intelligent behaviour, such as perception, search, planning, learning, prediction, decision-making, and language processing.

There is no single definition used identically across all research disciplines. When examining a specific product, clarify what task it performs and under which conditions.

An **AI system** is not necessarily one model. It may combine software, data, models, rules, tools, an interface, and human oversight.

## 3. A map of approaches: where does system behaviour come from?

| Approach | Source of behaviour | Example | Typical limitation |
|---|---|---|---|
| Rules | Conditions written by developers | Consumption threshold | Unanticipated cases are not covered |
| Expert system | Knowledge base and inference mechanism | Rule-based diagnosis | Knowledge needs review and maintenance |
| Search and planning | State space, actions, goals, and costs | Route or schedule | Search spaces can grow rapidly |
| ML | Parameters fitted from data | Energy forecasting | Depends on data and evaluation quality |
| DL | Multi-layer neural network trained on data | Image analysis | Data, compute, and monitoring requirements |

These approaches can be combined. An engineering system may use ML for forecasting, rules for hard constraints, and a human specialist to approve an action.

## 4. AI, ML, and DL are not synonyms

- **AI** is the broad field of methods and systems.
- **Machine Learning (ML)** is an area of AI in which a model's parameters or behaviour are adjusted using data or experience.
- **Deep Learning (DL)** is an area of ML based on multi-layer neural networks.

Therefore, DL is a subset of ML, and ML is a subset of AI, but the reverse statements are not true. Route search can be AI without ML; a gradient-boosted model is ML without DL; a neural network is one kind of DL.

## 5. How to describe an AI system

Ask six questions about any example:

1. **Task:** what decision or action is required?
2. **Input:** what data does the system receive, and from where?
3. **Processing:** which rules, algorithms, models, or tools are used?
4. **Output:** does it produce a class, number, ranked list, plan, or text?
5. **Operating context:** who uses the result, and what happens next?
6. **Control:** how is an error detected, and who can stop or correct the action?

A simplified flow is:

`Environment → data → validation and preparation → rules / search / model → output → person or automated action`

A real product may also include feedback, monitoring, logs, external APIs, and several models. Explaining one model does not necessarily explain the whole product.

## 6. How an ML model is trained

In supervised learning, examples contain input features (x_i) and target values (y_i). A training algorithm adjusts model parameters to reduce a chosen loss function:

[
	heta^* = argmin_	heta rac{1}{N}sum_{i=1}^{N} L(f_	heta(x_i), y_i)
]

Where:
- (x_i) is the feature vector for example (i);
- (y_i) is the known target for that example;
- (f_	heta) is a model with parameters (	heta);
- (L) is a loss function measuring error under a chosen criterion;
- (N) is the number of training examples;
- (argmin) means finding parameters that minimize the average loss.

This is a general illustration, not a description of every ML algorithm. It also does not guarantee good performance in the real world. Unrepresentative data, a poorly chosen target, or changed operating conditions can make low training error misleading.

Do not confuse three processes:
- **Training** adjusts parameters using training data.
- **Inference** applies a trained model to a new input.
- **Evaluation** measures performance under a defined protocol and metrics.

## 7. A running example: a building energy assistant

Suppose the system receives outdoor temperature, the building schedule, floor area, and meter readings.

1. Data validation detects missing values and inconsistent units.
2. A model predicts expected consumption.
3. The system compares the prediction with the observed value.
4. A rule flags a deviation above a threshold.
5. The interface shows the specialist a chart, input data, and the reason for the alert.
6. An engineer checks sensors, operating schedules, and equipment before deciding what to do.

**What can go wrong?** A sensor may be faulty; timestamps may be misaligned; the model may have been trained on a different season; the building schedule may have changed; or the threshold may be too sensitive. An unusual value does not automatically mean that equipment has failed.

**How should we evaluate it?** Compare the model with a simple baseline, test a separate time period, measure errors, inspect false alarms and missed events, check changed operating conditions, and preserve human review.

## 8. What tasks do AI systems perform?

- **Recognition:** identify what is present in an input.
- **Classification:** assign an item to a category.
- **Prediction and forecasting:** estimate an unknown or future value.
- **Anomaly detection:** identify observations that differ from expected behaviour.
- **Recommendation and ranking:** order options for a user.
- **Generation:** create text, images, audio, video, or code.
- **Search and planning:** find a valid solution or sequence of actions.

A single product may perform several tasks. Do not call every automated process AI without clarifying which methods and functions it actually uses.

## 9. Boundaries: intelligence, consciousness, and AGI

Classifying an image or generating text is observable task performance. By itself, it does not demonstrate subjective experience or consciousness.

Most deployed systems are designed for bounded tasks and operating conditions. **Artificial General Intelligence (AGI)** is a debated concept referring to systems with broad abilities to transfer across tasks. There is no universally accepted test whose single result proves that AGI has been achieved.

Also distinguish:
- answer accuracy from reliability in a real environment;
- an explanation of a prediction from proof of a causal mechanism;
- a local explanation of one example from a description of system-wide behaviour;
- high performance from compliance with legal, ethical, and engineering requirements.

## 10. Why this foundation matters for XAI

Explainable AI (XAI) studies methods for analysing and communicating the behaviour of AI models and systems. Before asking “why did the model produce this answer?”, identify what needs explaining: the model, one prediction, the data-processing pipeline, or the product's final decision.

An explanation must itself be evaluated: does it reflect the model's actual behaviour, is it stable under reasonable input changes, does it omit important system components, and does it mistake correlation for causation? A detailed explanation is not automatically a true one.

## 11. Practical assignment

Choose an AI-enabled product, such as a document assistant, defect-detection system, or recommender.

Complete this worksheet:
1. task and user;
2. input data and its source;
3. likely methods: rules, search, ML, DL, or a combination;
4. output and the action that may follow;
5. two possible failure modes;
6. a baseline and metric for evaluating performance;
7. where human oversight is required.

**A strong answer** keeps methods distinct, separates assumptions from verified facts, identifies at least two risks, connects evaluation to the task, and proposes a way to detect errors.

## 12. Self-check

1. Can an AI system work without ML? Give an example.
2. Why is every DL method part of ML, but not every ML method DL?
3. How do training, inference, and evaluation differ?
4. Why does low training error not guarantee good operational performance?
5. Why does an explanation of one prediction not prove a causal mechanism?
6. Which components besides the model should be checked in an AI product?

**Key ideas:** AI is broader than neural networks; methods should fit the task; an AI product is a system of components; quality must be evaluated on relevant independent data; explanations require validation.

## Glossary

AI system; rule-based system; expert system; search; planning; machine learning (ML); deep learning (DL); feature; target; parameter; loss function; training; inference; evaluation; baseline; distribution shift; Explainable AI (XAI).

## Further reading

- [Stanford Encyclopedia of Philosophy — Artificial Intelligence](https://plato.stanford.edu/entries/artificial-intelligence/)
- [An Introduction to Statistical Learning](https://www.statlearning.com/)
- [Deep Learning — Goodfellow, Bengio, Courville](https://www.deeplearningbook.org/)

*This is an engineering introduction. Formal definitions vary by research context; specific methods and metrics are developed in later lessons.*
