"""Repeatability and sensitivity experiment for LIME 9.2.2."""
from itertools import combinations
import numpy as np
from scipy.stats import spearmanr
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from lime.lime_tabular import LimeTabularExplainer

SEED = 42
REPEATS = 10
NUM_SAMPLES = 2000
TOP_K = 8


def jaccard(a, b):
    a, b = set(a), set(b)
    return len(a & b) / len(a | b) if a | b else 1.0


def pairwise_jaccard(items):
    return float(np.mean([jaccard(a["top"], b["top"]) for a, b in combinations(items, 2)]))


def pairwise_spearman(items):
    values = []
    for a, b in combinations(items, 2):
        rho = spearmanr(a["weights"], b["weights"]).statistic
        if np.isfinite(rho):
            values.append(float(rho))
    return float(np.mean(values)) if values else float("nan")


def explain(training, names, classes, model, instance, class_id, width, seed):
    explainer = LimeTabularExplainer(
        training_data=training,
        feature_names=names,
        class_names=classes,
        mode="classification",
        discretize_continuous=False,
        feature_selection="none",
        kernel_width=width,
        random_state=seed,
    )
    exp = explainer.explain_instance(
        data_row=instance,
        predict_fn=model.predict_proba,
        labels=(class_id,),
        num_features=len(names),
        num_samples=NUM_SAMPLES,
    )
    weights = np.zeros(len(names), dtype=float)
    for feature_id, value in exp.as_map()[class_id]:
        weights[int(feature_id)] = float(value)
    top = np.argsort(np.abs(weights))[-TOP_K:]
    return {
        "weights": weights,
        "top": top.tolist(),
        "score": float(np.asarray(exp.score).reshape(-1)[0]),
    }


def main():
    data = load_breast_cancer()
    x_train, x_test, y_train, _ = train_test_split(
        data.data, data.target, test_size=0.25, random_state=SEED,
        stratify=data.target,
    )
    model = RandomForestClassifier(
        n_estimators=300, min_samples_leaf=2, random_state=SEED, n_jobs=-1
    )
    model.fit(x_train, y_train)
    instance = x_test[0]
    probabilities = model.predict_proba(instance.reshape(1, -1))[0]
    class_id = int(np.argmax(probabilities))
    names = list(data.feature_names)
    classes = list(data.target_names)
    default_width = 0.75 * np.sqrt(x_train.shape[1])

    print("=== Fixed model prediction ===")
    print(f"Class: {classes[class_id]}; probability: {probabilities[class_id]:.4f}")
    print(f"Runs: {REPEATS}; num_samples: {NUM_SAMPLES}; kernel_width: {default_width:.4f}")

    repeated = [
        explain(x_train, names, classes, model, instance, class_id, default_width, seed)
        for seed in range(REPEATS)
    ]
    matrix = np.vstack([item["weights"] for item in repeated])
    frequency = np.zeros(len(names), dtype=int)
    for item in repeated:
        frequency[item["top"]] += 1

    print("\n=== Stability across random seeds ===")
    print(f"Mean pairwise top-{TOP_K} Jaccard: {pairwise_jaccard(repeated):.4f}")
    print(f"Mean pairwise Spearman: {pairwise_spearman(repeated):.4f}")
    scores = [item["score"] for item in repeated]
    print(f"Local score mean: {np.mean(scores):.4f}; std: {np.std(scores, ddof=1):.4f}")
    print("Feature selection frequency and coefficient spread:")
    for index in np.argsort(frequency)[::-1][:12]:
        print(
            f"- {names[index]}: top-{TOP_K} in {frequency[index]}/{REPEATS}; "
            f"median weight={np.median(matrix[:, index]):+.5f}; "
            f"std={np.std(matrix[:, index], ddof=1):.5f}"
        )

    print("\n=== Sensitivity to kernel_width (same seed) ===")
    baseline = explain(x_train, names, classes, model, instance, class_id, default_width, 0)
    for factor in (0.5, 1.0, 2.0):
        current = explain(
            x_train, names, classes, model, instance, class_id,
            default_width * factor, 0,
        )
        print(
            f"{factor:.1f}x width: top-{TOP_K} Jaccard vs baseline="
            f"{jaccard(baseline['top'], current['top']):.4f}; "
            f"local score={current['score']:.4f}"
        )

    print("\n=== Correlation and off-support diagnostic ===")
    corr = np.corrcoef(x_train, rowvar=False)
    upper = np.triu(np.abs(corr), k=1)
    pairs = np.dstack(np.unravel_index(np.argsort(upper.ravel())[-5:], upper.shape))[0][::-1]
    for left, right in pairs:
        print(f"- {names[left]} / {names[right]}: Pearson r={corr[left, right]:+.3f}")
    independent = np.column_stack([
        np.random.default_rng(SEED + col).choice(x_train[:, col], 2000, replace=True)
        for col in range(x_train.shape[1])
    ])
    real_mean = float(np.mean(np.abs(corr[np.triu_indices_from(corr, k=1)])))
    independent_corr = np.corrcoef(independent, rowvar=False)
    independent_mean = float(
        np.mean(np.abs(independent_corr[np.triu_indices_from(independent_corr, k=1)]))
    )
    print(f"Mean absolute correlation in real data: {real_mean:.4f}")
    print(f"After independent marginal resampling: {independent_mean:.4f}")
    print("This resampling is a diagnostic illustration, not a dump of LIME's internal neighbourhood.")
    print("Stable rankings do not prove fidelity or causality. Inspect score, data support, and plausible inputs.")


if __name__ == "__main__":
    main()
