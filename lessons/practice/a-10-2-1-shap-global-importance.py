"""DCH School 10.2.1: global SHAP, synthetic housing data, not appraisal."""
import csv
import json
import os
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import shap
import sklearn
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

SEED = 42
OUT = Path(os.environ.get("DCH_LAB_OUTPUT", "shap-global-results"))
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(SEED)
n = 800
X = pd.DataFrame({
    "area_m2": rng.uniform(25, 120, n),
    "location_score": rng.integers(1, 11, n),
    "age_years": rng.integers(0, 61, n),
    "floor": rng.integers(1, 17, n),
    "noise": rng.normal(0, 1, n),
})
y = (1.6 + .065 * X.area_m2 + .25 * X.location_score
     - .026 * X.age_years + .02 * X.floor
     + .003 * (60-X.age_years) * X.location_score
     + rng.normal(0, .2, n))
train, test, y_train, y_test = train_test_split(
    X, y, test_size=.25, random_state=SEED)
model = RandomForestRegressor(n_estimators=32, max_depth=6,
                              random_state=SEED, n_jobs=1)
model.fit(train, y_train)
bg = train.sample(64, random_state=SEED)
assert set(bg.index).issubset(train.index)
assert set(train.index).isdisjoint(test.index)
explainer = shap.TreeExplainer(model, data=bg,
    feature_perturbation="interventional", model_output="raw")
exp = explainer(test)
phi = np.asarray(exp.values, dtype=float)
base = np.asarray(exp.base_values, dtype=float)
pred = model.predict(test)
assert phi.shape == (len(test), len(test.columns))
assert list(exp.feature_names) == list(test.columns)
assert np.isfinite(phi).all()
np.testing.assert_allclose(exp.data, test.to_numpy())
np.testing.assert_allclose(base + phi.sum(axis=1), pred, atol=2e-5, rtol=1e-6)
I, D = np.abs(phi).mean(axis=0), phi.mean(axis=0)
assert np.all(I + 1e-12 >= np.abs(D))
young = test.age_years.to_numpy() <= 30
assert young.any() and (~young).any()
cohort_a, cohort_b = np.abs(phi[young]).mean(0), np.abs(phi[~young]).mean(0)
np.testing.assert_allclose((young.sum()*cohort_a+(~young).sum()*cohort_b)/len(test), I)
# Conditional on the fitted model and the fixed background.
boot_rng = np.random.default_rng(SEED+1)
draw = boot_rng.integers(0, len(test), size=(1000, len(test)))
lo, hi = np.percentile(np.abs(phi)[draw].mean(axis=1), [2.5, 97.5], axis=0)
pfi = permutation_importance(model, test, y_test, n_repeats=20,
    random_state=SEED, scoring="neg_mean_absolute_error", n_jobs=1)
order = np.argsort(-I, kind="stable")
rows = [{"feature": str(test.columns[j]), "mean_abs": float(I[j]),
         "signed_mean": float(D[j]), "cohort_young": float(cohort_a[j]),
         "cohort_older": float(cohort_b[j]), "bootstrap_lo": float(lo[j]),
         "bootstrap_hi": float(hi[j]), "pfi_mean": float(pfi.importances_mean[j]),
         "pfi_repeat_sd": float(pfi.importances_std[j])} for j in order]
metrics = {}
for split, xx, yy in [("train", train, y_train), ("test", test, y_test)]:
    pp = model.predict(xx)
    metrics[split] = {"mae": float(mean_absolute_error(yy,pp)),
        "rmse": float(np.sqrt(mean_squared_error(yy,pp))), "r2": float(r2_score(yy,pp))}
report = {"seed": SEED, "versions": {"numpy": np.__version__, "shap": shap.__version__,
          "sklearn": sklearn.__version__, "pandas": pd.__version__,
          "matplotlib": matplotlib.__version__},
          "units": "million RUB", "n_train": len(train), "n_test": len(test),
          "background_rows": len(bg), "mode": "interventional", "output": "raw regression",
          "cohort_young_n": int(young.sum()), "cohort_older_n": int((~young).sum()),
          "bootstrap_repeats": 1000, "pfi_repeats": 20,
          "max_abs_residual": float(np.max(np.abs(pred-base-phi.sum(axis=1)))),
          "metrics": metrics, "features": rows}
(OUT/"results.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
with (OUT/"importance.csv").open("w",encoding="utf-8",newline="") as file:
    writer=csv.DictWriter(file,fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
shap.plots.bar(exp, show=False, max_display=len(test.columns))
plt.savefig(OUT/"global-bar.png",dpi=160,bbox_inches="tight")
plt.close("all")
fig,ax=plt.subplots(figsize=(8,4))
ax.barh(np.array(test.columns)[order], D[order])
ax.axvline(0,color="black",linewidth=1)
ax.set_xlabel("Mean signed SHAP (million RUB)")
ax.invert_yaxis()
fig.tight_layout()
fig.savefig(OUT/"signed-bar.png",dpi=160)
plt.close(fig)
print(json.dumps(report,indent=2))
print("PASS: test-only explanation, train-only background, additivity, aggregation and weighted cohorts")
