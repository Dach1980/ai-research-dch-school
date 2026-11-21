"""Explain one tabular classifier prediction with LIME.
Install: python -m pip install "lime>=0.2.0.1" scikit-learn numpy
Run: python lessons/practice/a-9-1-3-lime-tabular.py
"""
import numpy as np
from lime.lime_tabular import LimeTabularExplainer
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

SEED = 42
data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.25,
    stratify=data.target, random_state=SEED
)
model = RandomForestClassifier(
    n_estimators=240, min_samples_leaf=3,
    random_state=SEED, n_jobs=-1
).fit(X_train, y_train)

class_names = list(data.target_names)
explainer = LimeTabularExplainer(
    training_data=X_train,
    feature_names=list(data.feature_names),
    class_names=class_names,
    mode="classification",
    discretize_continuous=True,
    random_state=SEED,
)
instance_index = 0
x0 = X_test[instance_index]
proba = model.predict_proba(x0.reshape(1, -1))[0]
class_id = int(np.argmax(proba))
explanation = explainer.explain_instance(
    data_row=x0,
    classifier_fn=model.predict_proba,
    labels=(class_id,),
    num_features=3,
    num_samples=3000,
)
print("Explained instance:", instance_index)
print("Original prediction:", class_names[class_id])
print("Class probabilities:", dict(zip(class_names, np.round(proba, 4))))
print("LIME local prediction:", np.round(explanation.local_pred[class_id], 4))
print("Local weighted R2:", round(float(explanation.score[class_id]), 4))
print("Top local conditions:")
for condition, weight in explanation.as_list(label=class_id):
    print(f"  {condition}: {weight:+.4f}")

assert explanation.predict_proba is not None
assert explanation.predict_proba.shape[0] == len(class_names)
assert np.isfinite(explanation.score[class_id])
assert len(explanation.as_list(label=class_id)) <= 3
print("Check: explanation class index matches model.classes_.")
print("Reminder: coefficients describe a local model, not causal effects.")
