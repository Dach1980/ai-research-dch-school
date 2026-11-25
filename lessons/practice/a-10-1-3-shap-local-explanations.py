"""DCH School 10.1.3 — local SHAP. Synthetic housing data, not an appraisal."""
import json
import math
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
from sklearn.model_selection import train_test_split

SEED = 42
OUT = Path(os.environ.get("DCH_LAB_OUTPUT", "shap-local-results"))
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(SEED)
n = 600
X = pd.DataFrame({
    "area_m2": rng.uniform(25, 120, n),
    "location_score": rng.integers(1, 11, n),
    "age_years": rng.integers(0, 61, n),
    "floor": rng.integers(1, 17, n),
})
y = (1.6 + 0.065 * X.area_m2 + 0.21 * X.location_score
     - 0.026 * X.age_years + 0.02 * X.floor
     + 0.001 * X.area_m2 * X.location_score
     + rng.normal(0, 0.18, n))
train, test, y_train, _ = train_test_split(X, y, test_size=0.25, random_state=SEED)
model = RandomForestRegressor(n_estimators=32, max_depth=6, random_state=SEED, n_jobs=1)
model.fit(train, y_train)
x = test.iloc[[0]]
prediction = float(model.predict(x)[0])
backgrounds = {
    "all_train": train.sample(64, random_state=SEED),
    "small_train": train.nsmallest(120, "area_m2").sample(64, random_state=SEED),
}
ATOL, RTOL = 2e-5, 1e-6  # million RUB; allow tree implementation roundoff
names = list(x.columns)
results = {}
for name, bg in backgrounds.items():
    assert set(bg.index).issubset(set(train.index))
    explainer = shap.TreeExplainer(model, data=bg,
        feature_perturbation="interventional", model_output="raw")
    batch = explainer(x)
    print(name, "batch shape", batch.shape, "output names", batch.output_names)
    assert batch.values.shape == (1, len(names))
    e = batch[0]
    phi = np.asarray(e.values, dtype=float)
    base = float(np.asarray(e.base_values).item())
    assert phi.shape == (len(names),)
    assert list(e.feature_names) == names
    np.testing.assert_allclose(np.asarray(e.data, dtype=float), x.iloc[0].to_numpy(dtype=float))
    assert np.isfinite(phi).all() and math.isfinite(base)
    reconstruction = base + float(phi.sum())
    np.testing.assert_allclose(reconstruction, prediction, atol=ATOL, rtol=RTOL)
    np.testing.assert_allclose(base, model.predict(bg).mean(), atol=ATOL, rtol=RTOL)
    order = np.argsort(-np.abs(phi), kind="stable")
    table = [{"feature": names[i], "value": float(x.iloc[0, i]),
              "phi_million_rub": float(phi[i])} for i in order]
    grouped = float(phi[order[2:]].sum())
    np.testing.assert_allclose(base + float(phi[order[:2]].sum()) + grouped,
                               prediction, atol=ATOL, rtol=RTOL)
    results[name] = {"background_rows": len(bg), "base": base,
                     "prediction": prediction, "reconstructed": reconstruction,
                     "residual": prediction - reconstruction, "grouped_other": grouped,
                     "features": table}
    print(name, json.dumps(results[name], indent=2))
    shap.plots.waterfall(e, max_display=3, show=False)
    plt.savefig(OUT / f"waterfall-{name}.png", dpi=160, bbox_inches="tight")
    plt.close("all")
    if name == "all_train":
        shap.plots.force(e, matplotlib=True, show=False)
        plt.savefig(OUT / "force-all_train.png", dpi=160, bbox_inches="tight")
        plt.close("all")

assert math.isclose(results["all_train"]["prediction"], results["small_train"]["prediction"])
sigmoid = lambda z: 1 / (1 + math.exp(-z))
z0, z = -0.4, -0.4 + 1.0 - 0.3
print("Teaching logits:", z0, z, "probabilities:", sigmoid(z0), sigmoid(z))
assert math.isclose(sigmoid(z), 0.574442516811659)
report = {"seed": SEED, "versions": {"numpy": np.__version__, "shap": shap.__version__,
           "sklearn": sklearn.__version__, "pandas": pd.__version__,
           "matplotlib": matplotlib.__version__}, "units": "million RUB",
          "object_index": int(x.index[0]), "object": {k: float(v) for k,v in x.iloc[0].items()},
          "mode": "interventional", "output": "raw regression", "atol": ATOL, "rtol": RTOL,
          "backgrounds": results}
(OUT / "results.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print("PASS: identity, baseline, additivity, grouping, fixed prediction and sigmoid")
