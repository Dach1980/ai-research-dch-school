"""Two independent Shapley Value implementations for lesson 10.1.1.

Only the Python standard library is required.
"""
from itertools import combinations, permutations
from math import factorial

PLAYERS = ("A", "B", "C")
VALUES = {
    frozenset(): 10,
    frozenset({"A"}): 14,
    frozenset({"B"}): 13,
    frozenset({"C"}): 11,
    frozenset({"A", "B"}): 18,
    frozenset({"A", "C"}): 16,
    frozenset({"B", "C"}): 15,
    frozenset({"A", "B", "C"}): 20,
}


def value(coalition):
    return VALUES[frozenset(coalition)]


def shapley_by_coalitions(players, value_fn):
    players = tuple(players)
    n = len(players)
    result = {}
    for player in players:
        others = tuple(p for p in players if p != player)
        total = 0.0
        for size in range(n):
            weight = factorial(size) * factorial(n - size - 1) / factorial(n)
            for subset in combinations(others, size):
                coalition = frozenset(subset)
                marginal = value_fn(coalition | {player}) - value_fn(coalition)
                total += weight * marginal
        result[player] = total
    return result


def shapley_by_permutations(players, value_fn):
    players = tuple(players)
    result = {player: 0.0 for player in players}
    orders = tuple(permutations(players))
    for order in orders:
        coalition = frozenset()
        previous = value_fn(coalition)
        for player in order:
            coalition = coalition | {player}
            current = value_fn(coalition)
            result[player] += current - previous
            previous = current
    return {player: amount / len(orders) for player, amount in result.items()}


def main():
    by_coalitions = shapley_by_coalitions(PLAYERS, value)
    by_orders = shapley_by_permutations(PLAYERS, value)
    expected = {"A": 14 / 3, "B": 11 / 3, "C": 5 / 3}
    for player in PLAYERS:
        assert abs(by_coalitions[player] - expected[player]) < 1e-12
        assert abs(by_orders[player] - expected[player]) < 1e-12
        assert abs(by_coalitions[player] - by_orders[player]) < 1e-12
    gain = value(PLAYERS) - value(())
    assert abs(sum(by_coalitions.values()) - gain) < 1e-12
    assert abs(sum(by_orders.values()) - gain) < 1e-12

    # Symmetry: two players with identical marginal contributions.
    symmetric = {frozenset(): 0, frozenset({"X"}): 2,
                 frozenset({"Y"}): 2, frozenset({"X", "Y"}): 5}
    sx = shapley_by_coalitions(("X", "Y"), lambda s: symmetric[frozenset(s)])
    assert abs(sx["X"] - sx["Y"]) < 1e-12

    # Dummy player: adding Z never changes the value.
    dummy = {frozenset(): 0, frozenset({"X"}): 3, frozenset({"Y"}): 2,
             frozenset({"X", "Y"}): 5, frozenset({"Z"}): 0,
             frozenset({"X", "Z"}): 3, frozenset({"Y", "Z"}): 2,
             frozenset({"X", "Y", "Z"}): 5}
    dz = shapley_by_coalitions(("X", "Y", "Z"), lambda s: dummy[frozenset(s)])
    assert abs(dz["Z"]) < 1e-12

    print("Coalition enumeration:", {k: round(v, 6) for k, v in by_coalitions.items()})
    print("Permutation enumeration:", {k: round(v, 6) for k, v in by_orders.items()})
    print("Efficiency:", round(sum(by_coalitions.values()), 6), "=", gain)
    print("Symmetry and dummy-player checks: PASS")


if __name__ == "__main__":
    main()
