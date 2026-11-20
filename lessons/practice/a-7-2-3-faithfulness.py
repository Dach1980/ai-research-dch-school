"""Faithfulness evaluation lab for lesson 7.2.3.

Install: pip install numpy pandas matplotlib scikit-learn
Run: python lessons/practice/a-7-2-3-faithfulness.py

The experiment compares perturbation-based feature deletion and insertion.
These are model-behaviour diagnostics, not causal interventions.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split

RANDOM_STATE = 42
rng = np.random.default_rng(RANDOM_STATE)

# One informative signal and a correlated proxy make attribution ambiguous.
X_array, y = make_classification(
    n_samples=1600,
    n_features=6,
    n_informative=3,
    n_redundant=1,
    n_clusters_per_class=1,
    flip_y=0.02,
    class_sep=1.0,
    random_state=RANDOM_STATE,
)
X_array[:, 5] = 0.95 * X_array[:, 0] + rng.normal(0, 0.15, len(X_array))
feature_names = [f"feature_{i}" for i in range(X_array.shape[1])]
X = pd.DataFrame(X_array, columns=feature_names)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    stratify=y,
    random_state=RANDOM_STATE,
)

model = LogisticRegression(max_iter=2000, random_state=RANDOM_STATE)
model.fit(X_train, y_train)
baseline_probability = model.predict_proba(X_test)[:, 1]
baseline_auc = roc_auc_score(y_test, baseline_probability)
print(f"Baseline test ROC AUC: {baseline_auc:.3f}")

# Step 1. Rank features by the metric decrease after individual permutation.
pfi = permutation_importance(
    model,
    X_test,
    y_test,
    scoring="roc_auc",
    n_repeats=30,
    random_state=17,
    n_jobs=-1,
)
importance = pd.Series(pfi.importances_mean, index=feature_names).sort_values(
    ascending=False
)
order = list(importance.index)
print("\nPermutation importance (mean decrease in ROC AUC):")
print(importance.round(4))

# Step 2. Feature deletion: replace the most important features with
# training medians, one by one, and observe the model's held-out ROC AUC.
medians = X_train.median()
deletion_auc = []
for count in range(len(order) + 1):
    changed = X_test.copy()
    for name in order[:count]:
        changed[name] = medians[name]
    probability = model.predict_proba(changed)[:, 1]
    deletion_auc.append(roc_auc_score(y_test, probability))

# Step 3. Feature insertion: start from a median reference row and restore
# features in explanation order. Intermediate rows may be off-distribution.
insertion_auc = []
for count in range(len(order) + 1):
    changed = pd.DataFrame(
        np.tile(medians.to_numpy(), (len(X_test), 1)),
        columns=feature_names,
        index=X_test.index,
    )
    for name in order[:count]:
        changed[name] = X_test[name]
    probability = model.predict_proba(changed)[:, 1]
    insertion_auc.append(roc_auc_score(y_test, probability))

curve = pd.DataFrame(
    {
        "features_changed_or_restored": range(len(order) + 1),
        "deletion_auc": deletion_auc,
        "insertion_auc": insertion_auc,
    }
)
print("\nDeletion / insertion evaluation:")
print(curve.round(3).to_string(index=False))

# Step 4. A simple model-randomization sanity check.
# If the explanation barely changes after labels are randomized, investigate.
random_model = LogisticRegression(max_iter=2000, random_state=RANDOM_STATE)
random_model.fit(X_train, rng.permutation(y_train))
random_pfi = permutation_importance(
    random_model,
    X_test,
    y_test,
    scoring="roc_auc",
    n_repeats=10,
    random_state=19,
    n_jobs=-1,
)
random_ranking = pd.Series(
    random_pfi.importances_mean, index=feature_names
).sort_values(ascending=False)
print("\nTop features for randomized-label model (sanity check only):")
print(random_ranking.head(3).round(4))

# A second model makes the correlation issue visible: the proxy may share
# importance with the original signal, so individual scores can be small.
print(
    "\nCorrelation between feature_0 and feature_5: "
    f"{X_test['feature_0'].corr(X_test['feature_5']):.3f}"
)

fig, ax = plt.subplots(figsize=(9, 5))
steps = range(len(order) + 1)
ax.plot(steps, deletion_auc, marker="o", label="Feature deletion")
ax.plot(steps, insertion_auc, marker="s", label="Feature insertion")
ax.axhline(baseline_auc, linestyle="--", label="Original model")
ax.set_xlabel("Number of features changed / restored")
ax.set_ylabel("ROC AUC on the held-out sample")
ax.set_title("Faithfulness diagnostics: deletion and insertion")
ax.set_ylim(0.0, 1.02)
ax.grid(alpha=0.25)
ax.legend()
fig.tight_layout()
plt.show()

# Interpretation:
# - A steep deletion drop suggests the ranking captures model reliance.
# - A rising insertion curve suggests informative features are restored early.
# - Neither curve proves causality; median replacement can create
#   unrealistic combinations, especially with correlated features.
