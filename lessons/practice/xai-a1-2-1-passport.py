#!/usr/bin/env python3
"""Deterministic XAI mini-lab for DCH School lesson A.1.2.1.

Uses only the Python standard library. This is a toy score model, not a
trained predictor, calibrated probability, causal model, or decision tool.
"""
from statistics import mean

ROWS = (
    ("A", 0.60, 0.30),
    ("B", 0.20, 0.80),
    ("C", 0.80, 0.20),
    ("D", 0.40, 0.50),
    ("E", 0.70, 0.70),
    ("F", 0.10, 0.40),
)


def score(debt_ratio: float, employment_norm: float) -> float:
    """Return the toy model score for two inputs in the interval [0, 1]."""
    if not (0.0 <= debt_ratio <= 1.0 and 0.0 <= employment_norm <= 1.0):
        raise ValueError("Both normalised inputs must be between 0 and 1.")
    return 0.50 + 0.30 * debt_ratio - 0.10 * employment_norm


def main() -> None:
    mean_debt = mean(row[1] for row in ROWS)
    mean_employment = mean(row[2] for row in ROWS)
    baseline = score(mean_debt, mean_employment)

    print("TOY SCORE MODEL — output is not a probability or a real decision")
    print(f"Reference inputs: debt_ratio={mean_debt:.4f}, employment_norm={mean_employment:.4f}")
    print(f"Baseline score: {baseline:.4f}")
    print()
    print("Instance | score  | debt contribution | employment contribution | sum")
    for name, debt, employment in ROWS:
        prediction = score(debt, employment)
        debt_contribution = 0.30 * (debt - mean_debt)
        employment_contribution = -0.10 * (employment - mean_employment)
        contribution_sum = debt_contribution + employment_contribution
        assert abs((prediction - baseline) - contribution_sum) < 1e-12
        print(
            f"{name:>8} | {prediction:.4f} | {debt_contribution:+.4f}"
            f"            | {employment_contribution:+.4f}"
            f"                 | {contribution_sum:+.4f}"
        )

    instance_a = score(0.60, 0.30)
    perturbed_a = score(0.70, 0.30)
    print()
    print(f"Instance A score: {instance_a:.4f}")
    print(f"After debt_ratio 0.60 -> 0.70: {perturbed_a:.4f} (delta={perturbed_a - instance_a:+.4f})")
    print(
        "Mean absolute local contribution: "
        f"debt_ratio={mean(abs(0.30 * (d - mean_debt)) for _, d, _ in ROWS):.4f}; "
        f"employment_norm={mean(abs(-0.10 * (e - mean_employment)) for _, _, e in ROWS):.4f}"
    )
    print()
    print("Interpretation: these are algebraic contributions in this fixed linear formula.")
    print("They are not SHAP values, permutation importance, causal effects, or fairness evidence.")


if __name__ == "__main__":
    main()
