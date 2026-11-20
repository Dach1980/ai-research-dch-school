"""ICE / PDP / centered ICE lab for lesson 8.1.2.
Install: python -m pip install numpy pandas matplotlib scikit-learn
Run: python lessons/practice/a-8-1-2-individual-conditional-expectation.py
"""
from __future__ import annotations
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import PartialDependenceDisplay
from sklearn.model_selection import train_test_split

SEED = 42
rng = np.random.default_rng(SEED)
n = 1400
area = rng.uniform(35, 180, n)
rooms = np.clip(np.round(area / 27 + rng.normal(0, .7, n)), 1, 7)
premium = rng.binomial(1, 1 / (1 + np.exp(-(area - 105) / 22)), n)
age = rng.uniform(0, 60, n)
noise = rng.normal(0, 12000, n)
price = (65000 + 2100 * area + 9500 * rooms - 700 * age
         + 26000 * premium * np.tanh((area - 90) / 35)
         + noise)
X = pd.DataFrame({"area_m2": area, "rooms": rooms,
                  "premium_zone": premium, "building_age": age})
y = pd.Series(price, name="price")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=.25, random_state=SEED)
model = RandomForestRegressor(
    n_estimators=300, min_samples_leaf=5, random_state=SEED, n_jobs=-1
).fit(X_train, y_train)
print("Test R2:", round(model.score(X_test, y_test), 3))
print("corr(area, rooms):", round(X_train.area_m2.corr(X_train.rooms), 3))

# Built-in ICE and PDP using the same estimator and feature.
fig, ax = plt.subplots(figsize=(9, 6))
PartialDependenceDisplay.from_estimator(
    model, X_train, features=["area_m2"], kind="both",
    method="brute", grid_resolution=35, percentiles=(.05, .95),
    subsample=120, random_state=SEED, ax=ax
)
ax.set_title("ICE curves and their average (PDP)")
ax.set_ylabel("Predicted price")
fig.tight_layout()
plt.show()

# Explicit ICE calculation on a documented reference subset.
reference = X_train.sample(n=80, random_state=SEED)
grid = np.linspace(X_train.area_m2.quantile(.05),
                   X_train.area_m2.quantile(.95), 45)
ice = np.empty((len(reference), len(grid)))
for row_idx, (_, row) in enumerate(reference.iterrows()):
    changed = pd.DataFrame([row.to_dict()] * len(grid))
    changed["area_m2"] = grid
    ice[row_idx] = model.predict(changed)

pdp_manual = ice.mean(axis=0)
baseline_idx = int(np.argmin(np.abs(grid - np.median(grid))))
z0 = grid[baseline_idx]
centered = ice - ice[:, [baseline_idx]]
print("Reference rows:", len(reference), "grid points:", len(grid))
print("Max |manual PDP - mean ICE|:", float(np.max(np.abs(pdp_manual - ice.mean(axis=0)))))
print("Centered ICE baseline max abs:", float(np.max(np.abs(centered[:, baseline_idx]))))

fig, axes = plt.subplots(1, 2, figsize=(13, 5))
for curve in ice:
    axes[0].plot(grid, curve, alpha=.13, linewidth=1)
axes[0].plot(grid, pdp_manual, linewidth=3, label="Mean ICE = PDP")
axes[0].set_title("Individual Conditional Expectation")
axes[0].set_xlabel("Area (m²)")
axes[0].set_ylabel("Predicted price")
axes[0].legend()
for curve in centered:
    axes[1].plot(grid, curve, alpha=.16, linewidth=1)
axes[1].axvline(z0, linestyle="--", label=f"z0 = {z0:.1f}")
axes[1].axhline(0, linewidth=1)
axes[1].set_title("Centered ICE")
axes[1].set_xlabel("Area (m²)")
axes[1].set_ylabel("Change from baseline prediction")
axes[1].legend()
fig.tight_layout()
plt.show()

# Inspect an interaction by comparing ICE across premium-zone groups.
fig, ax = plt.subplots(figsize=(8, 5))
for group_value, label in [(0, "Non-premium"), (1, "Premium")]:
    subset = X_train[X_train.premium_zone == group_value].sample(
        n=min(45, int((X_train.premium_zone == group_value).sum())),
        random_state=SEED
    )
    for _, row in subset.iterrows():
        changed = pd.DataFrame([row.to_dict()] * len(grid))
        changed["area_m2"] = grid
        ax.plot(grid, model.predict(changed), alpha=.12, linewidth=1,
                label=label if _ == subset.index[0] else None)
ax.set_title("ICE by premium-zone subgroup")
ax.set_xlabel("Area (m²)")
ax.set_ylabel("Predicted price")
ax.legend()
fig.tight_layout()
plt.show()
# Interpretation: heterogeneity is model behaviour, not a causal effect.
# Correlated area/rooms may create weakly supported replacement combinations.
