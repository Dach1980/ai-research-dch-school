"""Lesson 10.1.2: fixed empirical marginal game, exact reference and SHAP."""
# Python 3.12. pip install shap==0.54.1 scikit-learn==1.9.1
from itertools import combinations
from math import factorial
from time import perf_counter
import numpy as np
import shap
import sklearn
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

def exact_game(model, x, background):
    """Cache one value per coalition and independently allocate marginal gains."""
    m = x.size
    values = {}
    for k in range(m + 1):
        for subset in combinations(range(m), k):
            masked = background.copy()
            masked[:, list(subset)] = x[list(subset)]
            values[frozenset(subset)] = float(model.predict(masked).mean())
    phi = np.zeros(m)
    for i in range(m):
        for s, v in values.items():
            if i not in s:
                k = len(s)
                w = factorial(k) * factorial(m - k - 1) / factorial(m)
                phi[i] += w * (values[s | {i}] - v)
    return values[frozenset()], phi, len(values)

def main():
    rng = np.random.default_rng(42)
    x_all = rng.normal(size=(600, 6))
    x_all[:, 1] = 0.8 * x_all[:, 0] + 0.6 * x_all[:, 1]
    y = (3*x_all[:, 0] + 2*x_all[:, 2]*x_all[:, 3]
         - x_all[:, 4] + 0.2*rng.normal(size=len(x_all)))
    train, test, y_train, _ = train_test_split(
        x_all, y, test_size=0.25, random_state=42
    )
    model = RandomForestRegressor(n_estimators=20, max_depth=4,
                                  random_state=42, n_jobs=1)
    model.fit(train, y_train)
    background = train[rng.choice(len(train), 32, replace=False)]
    x = test[0]
    m = x.size
    target = float(model.predict(x[None, :])[0])
    baseline = float(model.predict(background).mean())
    print("versions:", "numpy", np.__version__, "shap", shap.__version__,
          "sklearn", sklearn.__version__)
    print("M =", m, "B =", len(background), "prediction =", target)
    print("game = marginal empirical background; output = regression raw")

    start = perf_counter()
    exact_base, exact, masks = exact_game(model, x, background)
    print("exact", "seconds =", perf_counter()-start,
          "masks =", masks, "rows =", masks*len(background), "phi =", exact)
    assert masks == 2**m
    np.testing.assert_allclose(exact_base, baseline, atol=1e-8)
    np.testing.assert_allclose(exact_base + exact.sum(), target, atol=1e-8)

    def report(name, base, phi, seconds, calls=None, rows=None):
        phi = np.asarray(phi, dtype=float).reshape(-1)
        assert phi.shape == (m,) and np.isfinite(phi).all()
        np.testing.assert_allclose(base, baseline, atol=1e-6)
        residual = float(base + phi.sum() - target)
        assert abs(residual) < 1e-5, residual
        print(name, "seconds =", round(seconds, 6),
              "calls =", calls, "rows =", rows, "phi =", phi,
              "residual =", residual, "MAE vs exact =", np.abs(phi-exact).mean())
        return phi

    start = perf_counter()
    tree = shap.TreeExplainer(model, data=background,
                              feature_perturbation="interventional",
                              model_output="raw")
    result = tree(x[None, :], check_additivity=True)
    tree_phi = report("TreeSHAP", float(np.asarray(result.base_values).item()),
                      result.values[0], perf_counter()-start)
    # Tree traversal is internal, so calls/rows are deliberately not fabricated.
    np.testing.assert_allclose(tree_phi, exact, atol=1e-5, rtol=1e-5)

    def kernel(budget, seed):
        np.random.seed(seed)
        stats = {"calls": 0, "rows": 0}
        def counted_predict(rows):
            stats["calls"] += 1
            stats["rows"] += len(rows)
            return model.predict(rows)
        start = perf_counter()
        explainer = shap.KernelExplainer(counted_predict, background,
                                         link="identity")
        values = explainer.shap_values(x[None, :], nsamples=budget,
                                       l1_reg=0, silent=True)
        return report(f"KernelSHAP nsamples={budget} seed={seed}",
                      float(np.asarray(explainer.expected_value).item()),
                      values[0], perf_counter()-start,
                      stats["calls"], stats["rows"])

    low_a = kernel(24, 42)
    low_b = kernel(24, 43)
    full = kernel(2**m-2, 42)
    np.testing.assert_allclose(full, exact, atol=1e-5, rtol=1e-5)
    print("low-budget repeat MAE =", np.abs(low_a-low_b).mean())
    print("PASS: fixed-game reference, baselines, additivity and full budgets")
    # No timing or monotonic-improvement assertion: hardware and sampling vary.

if __name__ == "__main__":
    main()
