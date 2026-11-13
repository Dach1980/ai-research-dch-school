# A.1.2.1 — XAI mini-lab: model passport

## Русский

**Цель:** отличить коэффициент модели, локальный вклад относительно baseline и чувствительность прогноза.

- Среда: Python 3.10 или новее.
- Зависимости: только стандартная библиотека Python.
- GPU и интернет не нужны.
- Данные: шесть фиксированных синтетических строк в самом скрипте.
- Модель: `score = 0.50 + 0.30 × debt_ratio − 0.10 × employment_norm`.

Запуск из корня репозитория:

```bash
python lessons/practice/xai-a1-2-1-passport.py
```

Ожидаемые контрольные значения:
- среднее `debt_ratio` = 0.4667;
- среднее `employment_norm` = 0.4833;
- baseline score = 0.5917;
- score объекта A = 0.6500;
- локальные вклады A: +0.0400 и +0.0183;
- при изменении `debt_ratio` с 0.60 до 0.70 score увеличивается на 0.0300.

**Важно:** модель учебная, не обучена на данных и не выдаёт вероятность. Синтетические строки не описывают реальных людей. Локальные вклады являются точным алгебраическим разложением только этой аддитивной формулы. Это не SHAP, не permutation importance, не причинный эффект и не доказательство справедливости.

Задания:
1. Проверьте, что сумма локальных вкладов равна разнице прогноза и baseline.
2. Измените baseline и посмотрите, как изменятся локальные вклады, хотя прогноз модели останется тем же.
3. Измените коэффициент при одном признаке и повторите расчёт.
4. Объясните, почему коэффициент модели не равен причинному эффекту.
5. Объясните, почему среднее абсолютное значение локальных вкладов нельзя называть permutation importance.

## English

**Goal:** distinguish a model coefficient, a local contribution relative to a baseline, and prediction sensitivity.

- Environment: Python 3.10 or later.
- Dependencies: Python standard library only.
- No GPU or internet connection is required.
- Data: six fixed synthetic rows included in the script.
- Model: `score = 0.50 + 0.30 × debt_ratio − 0.10 × employment_norm`.

Run from the repository root:

```bash
python lessons/practice/xai-a1-2-1-passport.py
```

Expected checkpoints:
- mean `debt_ratio` = 0.4667;
- mean `employment_norm` = 0.4833;
- baseline score = 0.5917;
- instance A score = 0.6500;
- A's local contributions: +0.0400 and +0.0183;
- changing `debt_ratio` from 0.60 to 0.70 increases the score by 0.0300.

**Important:** this is a toy model, not trained on data, and its output is not a probability. The synthetic rows do not describe real people. Local contributions are an exact algebraic decomposition only for this additive formula. They are not SHAP values, permutation importance, causal effects, or evidence of fairness.

Tasks:
1. Verify that local contributions sum to the prediction minus the baseline.
2. Change the baseline and observe how local contributions change even though the model prediction does not.
3. Change one feature coefficient and repeat the calculation.
4. Explain why a model coefficient is not a causal effect.
5. Explain why mean absolute local contributions must not be called permutation importance.

## 中文

**目标：**区分模型系数、相对于 baseline 的局部贡献，以及预测敏感性。

- 环境：Python 3.10 或更高版本。
- 依赖：仅使用 Python 标准库。
- 无需 GPU 或互联网。
- 数据：脚本中包含六条固定的合成样本。
- 模型：`score = 0.50 + 0.30 × debt_ratio − 0.10 × employment_norm`。

在仓库根目录运行：

```bash
python lessons/practice/xai-a1-2-1-passport.py
```

预期检查值：
- `debt_ratio` 均值 = 0.4667；
- `employment_norm` 均值 = 0.4833；
- baseline score = 0.5917；
- 样本 A 的 score = 0.6500；
- A 的局部贡献：+0.0400 和 +0.0183；
- 将 `debt_ratio` 从 0.60 改为 0.70，score 增加 0.0300。

**重要：**这是教学模型，没有使用数据训练，输出也不是概率。合成样本不代表真实个人。局部贡献仅是该加法公式的精确代数分解，并非 SHAP 值、permutation importance、因果效应或公平性证据。

练习：
1. 验证局部贡献之和等于预测值减去 baseline。
2. 改变 baseline，观察局部贡献如何变化，而模型预测保持不变。
3. 改变一个特征的系数并重新计算。
4. 解释为什么模型系数不等于因果效应。
5. 解释为什么不能把局部贡献绝对值的平均值称为 permutation importance。
