"""Reproducible comparison of coefficient-based and MDI feature importance.

Install: python -m pip install scikit-learn pandas numpy
Run:     python xai-feature-importance.py
"""
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

data = load_breast_cancer(as_frame=True)
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

linear = make_pipeline(
    StandardScaler(),
    LogisticRegression(max_iter=5000, random_state=42),
)
forest = RandomForestClassifier(
    n_estimators=400, min_samples_leaf=2,
    random_state=42, n_jobs=-1,
)
linear.fit(X_train, y_train)
forest.fit(X_train, y_train)

result = pd.DataFrame({
    "feature": X.columns,
    "linear_abs_standardised_coefficient": abs(linear[-1].coef_[0]),
    "random_forest_mdi": forest.feature_importances_,
})
print("\nLogistic regression — top 10")
print(result.nlargest(10, "linear_abs_standardised_coefficient").to_string(index=False))
print("\nRandom forest MDI — top 10")
print(result.nlargest(10, "random_forest_mdi").to_string(index=False))
print(
    "\nTest accuracy:",
    round(linear.score(X_test, y_test), 3),
    round(forest.score(X_test, y_test), 3),
)
