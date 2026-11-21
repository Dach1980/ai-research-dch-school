"""Compare LIME neighbourhood settings on one fixed tabular instance.

Install:
    python -m pip install "lime==0.2.0.1" scikit-learn numpy

Run:
    python lessons/practice/a-9-2-1-lime-neighborhood.py

The bank customer example in the lesson is hypothetical. This lab uses the
separate Breast Cancer Wisconsin dataset bundled with scikit-learn.
"""
import numpy as np
from lime.lime_tabular import LimeTabularExplainer
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

SEED = 42
data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data,
    data.target,
    test_size=0.25,
    stratify=data.target,
    random_state=SEED,
)
model = RandomForestClassifier(
    n_estimators=240,
    min_samples_leaf=3,
    random_state=SEED,
    n_jobs=-1,
).fit(X_train, y_train)

class_names = [str(name) for name in data.target_names]
instance_index = 0
x0 = X_test[instance_index]
proba = model.predict_proba(x0.reshape(1, -1))[0]
class_id = int(np.argmax(proba))
default_width = float(np.sqrt(X_train.shape[1]) * 0.75)

def build_explainer(kernel_width):
    """Create a fresh explainer so each comparison starts from the same seed."""
    return LimeTabularExplainer(
        training_data=X_train,
        feature_names=list(data.feature_names),
        class_names=class_names,
        mode="classification",
        discretize_continuous=True,
        kernel_width=float(kernel_width),
        random_state=SEED,
    )

def explain(kernel_width, num_samples):
    explainer = build_explainer(kernel_width)
    return explainer.explain_instance(
        data_row=x0,
        predict_fn=model.predict_proba,
        labels=(class_id,),
        num_features=5,
        num_samples=int(num_samples),
    )

def report(label, kernel_width, num_samples):
    exp = explain(kernel_width, num_samples)
    local_prediction = float(np.asarray(exp.local_pred[class_id]).reshape(-1)[0])
    local_score = float(exp.score[class_id])
    print(f"\n{label}")
    print(f"  kernel_width: {kernel_width:.3f}")
    print(f"  num_samples:  {num_samples}")
    print(f"  f(x0), class {class_id}: {proba[class_id]:.4f}")
    print(f"  g(x0):        {local_prediction:.4f}")
    print(f"  local score:  {local_score:.4f}")
    print("  local conditions:")
    for condition, coefficient in exp.as_list(label=class_id):
        print(f"    {condition}: {coefficient:+.4f}")
    return exp

print("Dataset: Breast Cancer Wisconsin (scikit-learn)")
print("Class names:", class_names)
print("Explained row:", instance_index)
print("Model classes:", model.classes_.tolist())
print("Original probabilities:", np.round(proba, 4).tolist())
print("Default-width reference:", round(default_width, 3))

print("\n=== Compare kernel_width; keep num_samples fixed ===")
for width in (2.0, default_width, 7.0):
    report("Kernel-width comparison", width, 3000)

print("\n=== Compare num_samples; keep kernel_width fixed ===")
for sample_count in (500, 1500, 3000):
    report("Sample-count comparison", default_width, sample_count)

print("\nInterpretation checklist:")
print("- f(x0) is the original classifier probability for the selected class.")
print("- g(x0) is the local surrogate prediction at the same instance.")
print("- local score is a weighted local fit measure, not test accuracy.")
print("- Coefficients describe this local surrogate; they are not causal effects.")
print("- Compare configurations; do not assume more samples or a wider kernel is always better.")
