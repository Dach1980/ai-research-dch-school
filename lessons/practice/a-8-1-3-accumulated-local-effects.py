"""One-dimensional Accumulated Local Effects lab for lesson 8.1.3.
Install: python -m pip install numpy pandas matplotlib scikit-learn
Run: python lessons/practice/a-8-1-3-accumulated-local-effects.py
"""
from __future__ import annotations
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import PartialDependenceDisplay
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

SEED = 42
rng = np.random.default_rng(SEED)
n = 1800
area = rng.uniform(35, 180, n)
rooms = np.clip(np.round(area / 27 + rng.normal(0, .7, n)), 1, 7)
premium = rng.binomial(1, 1 / (1 + np.exp(-(area - 105) / 22)), n)
age = rng.uniform(0, 60, n)
noise = rng.normal(0, 12000, n)
price = (65000 + 2100 * area + 9500 * rooms - 700 * age
         + 26000 * premium * np.tanh((area - 90) / 35) + noise)
X = pd.DataFrame({"area_m2": area, "rooms": rooms,
                  "premium_zone": premium, "building_age": age})
y = pd.Series(price, name="price")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=.25, random_state=SEED)
model = RandomForestRegressor(n_estimators=300, min_samples_leaf=5,
                              random_state=SEED, n_jobs=-1).fit(X_train, y_train)
print("Test R2:", round(r2_score(y_test, model.predict(X_test)), 3))
print("Test MAE:", round(mean_absolute_error(y_test, model.predict(X_test)), 1))
print("corr(area, rooms):", round(X_train.area_m2.corr(X_train.rooms), 3))

def accumulated_local_effects(model, frame, feature, bins=20):
    """Return bin boundaries, counts, centered ALE values and raw increments.

    Quantile boundaries are deduplicated. Each row is evaluated twice with
    only the selected feature replaced by the lower/upper bin boundary.
    Centering uses the empirical row-weighted mean of the step function.
    """
    values = frame[feature].to_numpy()
    edges = np.unique(np.quantile(values, np.linspace(0, 1, bins + 1)))
    if len(edges) < 3:
        raise ValueError("Feature has too few unique values for ALE bins")
    bin_id = np.searchsorted(edges[1:-1], values, side="right")
    counts = np.bincount(bin_id, minlength=len(edges) - 1)
    increments = np.full(len(edges) - 1, np.nan)
    for k in range(len(edges) - 1):
        mask = bin_id == k
        if not mask.any():
            continue
        lower = frame.loc[mask].copy()
        upper = lower.copy()
        lower[feature] = edges[k]
        upper[feature] = edges[k + 1]
        increments[k] = np.mean(model.predict(upper) - model.predict(lower))
    if np.isnan(increments).any():
        raise ValueError("Empty bin encountered; reduce bins or merge boundaries")
    accumulated = np.r_[0.0, np.cumsum(increments)]
    # Step-function value for each observed row is the accumulated value
    # at the lower boundary of its bin; center with empirical row weights.
    raw_per_row = accumulated[bin_id]
    center = float(raw_per_row.mean())
    centered = accumulated - center
    return edges, counts, centered, increments

for bins in (10, 20, 30):
    edges, counts, ale, increments = accumulated_local_effects(
        model, X_train, "area_m2", bins=bins)
    print(f"\\nALE with {bins} bins")
    print("Bin counts:", counts.tolist())
    print("Centered ALE at boundaries:", np.round(ale, 1).tolist())
    plt.step(edges, ale, where="post", label=f"ALE ({bins} bins)")
plt.axhline(0, color="black", linewidth=1)
plt.xlabel("Floor area (m²)")
plt.ylabel("Centered accumulated local effect (price units)")
plt.title("One-dimensional ALE sensitivity to bin count")
plt.legend()
plt.tight_layout()
plt.show()

# Compare with PDP and ICE on the same fitted model.
fig, ax = plt.subplots(figsize=(9, 5))
PartialDependenceDisplay.from_estimator(
    model, X_train, features=["area_m2"], kind="both", method="brute",
    grid_resolution=35, percentiles=(.05, .95), subsample=100,
    random_state=SEED, ax=ax)
ax.set_title("PDP and ICE: global substitutions")
ax.set_ylabel("Predicted price")
fig.tight_layout()
plt.show()

# Validation: ALE increments are finite and the centered empirical step
# function has mean approximately zero by construction.
edges, counts, ale, increments = accumulated_local_effects(
    model, X_train, "area_m2", bins=20)
check = np.repeat(ale[:-1], counts).mean()
print("Centered empirical ALE mean:", round(float(check), 8))
print("All increments finite:", bool(np.isfinite(increments).all()))
