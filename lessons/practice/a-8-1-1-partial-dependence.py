"""Reproducible PDP lab for lesson 8.1.1.
Install: python -m pip install numpy pandas matplotlib scikit-learn
Run: python lessons/practice/a-8-1-1-partial-dependence.py
Synthetic data illustrate model behaviour, not causality.
"""
from __future__ import annotations
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import PartialDependenceDisplay
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

RANDOM_STATE = 42
rng = np.random.default_rng(RANDOM_STATE)
n = 1800
area = rng.uniform(35, 180, n)
rooms = np.clip(np.round(area / 27 + rng.normal(0, .65, n)), 1, 7)
age = rng.uniform(0, 60, n)
distance = rng.gamma(2.0, 3.0, n)
noise = rng.normal(0, 9000, n)
price = (75_000 + 2_350*area + 13_000*rooms - 850*age
         - 5_500*distance + 18_000*np.sin(area/38) + noise)
X = pd.DataFrame({"area_m2":area, "rooms":rooms,
                  "building_age_years":age, "distance_to_center_km":distance})
y = pd.Series(price, name="price")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=.25, random_state=RANDOM_STATE)
model = RandomForestRegressor(n_estimators=350, min_samples_leaf=5,
    max_features=1.0, random_state=RANDOM_STATE, n_jobs=-1)
model.fit(X_train, y_train)
pred = model.predict(X_test)
print(f"Test R²: {r2_score(y_test, pred):.3f}")
print(f"Test MAE: {mean_absolute_error(y_test, pred):,.0f}")
print(f"Observed corr(area, rooms): {X_train.area_m2.corr(X_train.rooms):.3f}")

# One-way PDP: vertical values are average model predictions in target units.
fig, ax = plt.subplots(figsize=(8, 5))
PartialDependenceDisplay.from_estimator(model, X_train, features=["area_m2"],
    kind="average", method="brute", grid_resolution=35,
    percentiles=(.05, .95), ax=ax)
ax.set_title("Partial dependence of predicted price on floor area")
fig.tight_layout()
plt.show()

# Two-way PDP: colour contours represent average predicted price.
fig, ax = plt.subplots(figsize=(8, 6))
PartialDependenceDisplay.from_estimator(model, X_train,
    features=[("area_m2", "rooms")], kind="average", method="brute",
    grid_resolution=25, percentiles=(.05, .95), ax=ax)
ax.set_title("Two-way partial dependence: area and rooms")
fig.tight_layout()
plt.show()

# PDP varies area while retaining each reference row's other feature values.
reference = X_train.sample(n=min(250, len(X_train)), random_state=RANDOM_STATE)
grid = np.linspace(X_train.area_m2.quantile(.05),
                   X_train.area_m2.quantile(.95), 7)
synthetic = []
for value in grid:
    changed = reference.copy()
    changed["area_m2"] = value
    synthetic.append(changed)
synthetic = pd.concat(synthetic, ignore_index=True)
print("Reference rows:", len(reference), "PDP-style rows:", len(synthetic))
print("Correlation after replacement:",
      f"{synthetic.area_m2.corr(synthetic.rooms):.3f}")

fig, ax = plt.subplots(figsize=(8, 5))
ax.scatter(X_train.area_m2, X_train.rooms, alpha=.18, s=14,
           label="Observed training rows")
ax.scatter(synthetic.area_m2, synthetic.rooms, alpha=.12, s=10,
           label="PDP evaluation combinations")
ax.set_xlabel("Floor area (m²)")
ax.set_ylabel("Number of rooms")
ax.set_title("PDP may evaluate combinations outside observed support")
ax.legend()
ax.grid(alpha=.2)
fig.tight_layout()
plt.show()

# Discuss: nonlinear shape; sparse ranges; implausible area/room pairs;
# average trend versus individual responses; why PDP is not causal.
