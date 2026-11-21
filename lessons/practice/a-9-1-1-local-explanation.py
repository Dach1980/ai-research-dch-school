"""Teaching demo of local approximation; this is NOT an implementation of LIME.
Install: python -m pip install numpy matplotlib scikit-learn
Run: python lessons/practice/a-9-1-1-local-explanation.py
"""
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle
from sklearn.datasets import make_moons
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error

SEED = 42
rng = np.random.default_rng(SEED)
X, y = make_moons(n_samples=1800, noise=0.24, random_state=SEED)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=SEED
)
black_box = RandomForestClassifier(
    n_estimators=240, min_samples_leaf=4, random_state=SEED, n_jobs=-1
).fit(X_train, y_train)
x0 = X_test[0].copy()
prediction = float(black_box.predict_proba(x0.reshape(1, -1))[0, 1])

# Nearby variations are sampled only to illustrate a local region.
local_train = x0 + rng.normal(0, 0.20, size=(1400, 2))
local_valid = x0 + rng.normal(0, 0.20, size=(500, 2))
target_train = black_box.predict_proba(local_train)[:, 1]
target_valid = black_box.predict_proba(local_valid)[:, 1]
surrogate = DecisionTreeRegressor(
    max_depth=2, min_samples_leaf=24, random_state=SEED
).fit(local_train, target_train)
local_mse = mean_squared_error(target_valid, surrogate.predict(local_valid))

xx, yy = np.meshgrid(np.linspace(-1.6, 2.6, 180),
                     np.linspace(-1.2, 1.7, 150))
grid = np.column_stack([xx.ravel(), yy.ravel()])
original_surface = black_box.predict_proba(grid)[:, 1]
local_surface = surrogate.predict(grid)
global_mse = mean_squared_error(original_surface, local_surface)

assert X_train.shape[1] == 2
assert local_train.shape == (1400, 2) and local_valid.shape == (500, 2)
assert 0.0 <= prediction <= 1.0
assert np.isfinite(local_mse) and np.isfinite(global_mse)
assert np.isfinite(local_surface).all()

print("Explained instance:", np.round(x0, 3).tolist())
print("Original model probability for class 1:", round(prediction, 3))
print("Local approximation MSE:", round(float(local_mse), 4))
print("Broad-grid approximation MSE:", round(float(global_mse), 4))
print("These are regional agreement checks, not proof of a global explanation.")

fig, axes = plt.subplots(1, 2, figsize=(12, 5), constrained_layout=True)
for ax, surface, title in (
    (axes[0], original_surface, "Original model"),
    (axes[1], local_surface, "Local approximation"),
):
    contour = ax.contourf(xx, yy, surface.reshape(xx.shape),
                          levels=np.linspace(0, 1, 11),
                          cmap="coolwarm", alpha=0.82)
    ax.scatter(X_test[:, 0], X_test[:, 1], c=y_test, cmap="coolwarm",
               s=10, alpha=0.25, edgecolors="none")
    ax.scatter([x0[0]], [x0[1]], marker="*", s=220, c="gold",
               edgecolors="black", label="Explained instance")
    ax.add_patch(Circle(x0, 0.48, fill=False, linewidth=2,
                        linestyle="--", edgecolor="black"))
    ax.set_title(title)
    ax.set_xlabel("Feature 1")
    ax.set_ylabel("Feature 2")
    ax.legend()
fig.colorbar(contour, ax=axes, label="Predicted probability for class 1")
plt.show()
