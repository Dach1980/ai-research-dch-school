"""Reproducible PFI lab for lesson 7.2.2.

Install: pip install numpy pandas matplotlib scikit-learn
Run: python lessons/practice/a-7-2-2-permutation-importance.py
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.datasets import make_regression
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

rng = np.random.default_rng(42)
X_base, y = make_regression(
    n_samples=1600, n_features=5, n_informative=3,
    noise=12.0, random_state=42
)
df = pd.DataFrame(X_base, columns=[f"x{i}" for i in range(5)])
df["signal"] = df["x0"]
df["signal_proxy"] = 0.92 * df["x0"] + rng.normal(0, 0.12, len(df))
df["noise"] = rng.normal(size=len(df))
X = df[["signal", "signal_proxy", "x1", "x2", "x3", "x4", "noise"]]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=7
)
model = RandomForestRegressor(
    n_estimators=350, min_samples_leaf=2, random_state=7, n_jobs=-1
)
model.fit(X_train, y_train)
baseline = r2_score(y_test, model.predict(X_test))
print(f"Baseline test R2: {baseline:.3f}")

result = permutation_importance(
    model, X_test, y_test,
    scoring="r2",
    n_repeats=30,
    random_state=11,
    n_jobs=-1,
    max_samples=1.0,
)
pfi = pd.DataFrame({
    "feature": X.columns,
    "mean": result.importances_mean,
    "std": result.importances_std,
}).sort_values("mean", ascending=False)

mdi = pd.Series(model.feature_importances_, index=X.columns, name="MDI")
comparison = pfi.set_index("feature").join(mdi).sort_values("mean", ascending=False)
print("\nPFI (mean +/- std) and MDI:")
print(comparison.round(4))

ax = comparison[["mean", "MDI"]].plot.barh(figsize=(9, 5))
ax.set_xlabel("Importance (PFI: R2 decrease; MDI: impurity-based)")
ax.set_ylabel("")
ax.invert_yaxis()
plt.tight_layout()
plt.show()

# Jointly permute the correlated pair using the same row order.
X_group = X_test.copy()
group_rng = np.random.default_rng(123)
group_drops = []
for _ in range(30):
    order = group_rng.permutation(len(X_group))
    X_perm = X_group.copy()
    X_perm[["signal", "signal_proxy"]] = (
        X_group[["signal", "signal_proxy"]].iloc[order].to_numpy()
    )
    group_drops.append(baseline - r2_score(y_test, model.predict(X_perm)))

print(
    f"Grouped PFI for signal pair: {np.mean(group_drops):.3f} "
    f"+/- {np.std(group_drops, ddof=1):.3f}"
)
# PFI is model- and data-dependent; it is not a causal effect.
