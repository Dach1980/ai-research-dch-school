# P0 — browser acceptance, 25.11.2026

Base: `23422ce53b361fefaf29c8d654470231bf7b925f`.

## Confirmed evidence

- [Validate catalog](https://github.com/Dach1980/ai-research-dch-school/actions/runs/45591548551) and [managed Pages](https://github.com/Dach1980/ai-research-dch-school/actions/runs/45591548759) failed at browser acceptance; managed deploy skipped. Supabase migrations succeeded in managed Pages. [Independent Pages](https://github.com/Dach1980/ai-research-dch-school/actions/runs/45591548294) succeeded; branch-source publication bypasses the managed gate.
- Job 139126764655: 20 tests, 36 failing subtests: 7.2.1 outcomes contrast (6), outcomes spacing/code (6), 7.2.2 SVG geometry (18), 7.1.3 contrast (6). Root selectors predate hero wrapping. 7.2.1 light-theme contrast measured 1.10:1; padding 18px vs 16px limit. PFI renderer changed from measured v1 nodes to v2 without node metadata.
- Claude audit 24.11 also identified two stale exact published counts (49 vs 51).

## Proposed changes in this branch

- Match canonical hero DOM and fix theme surfaces in 7.1.3/7.2.1, measuring list contrast against its actual card. Keep original contrast and padding limits.
- Restore the previously measured PFI renderer from `db68f49f62e93c2d8ae501cb45250f28c07d0d1f` for exactly two PFI diagram types; keep all other v2 dispatch unchanged. Require four nodes each, nonempty labels, exactly three flow arrows and no grid arrows. No geometry assertion removed.
- Replace exact stale counters with canonical accepted prefix through 10.1.1, preserving existing accepted lessons and locale/file validation while permitting future releases.

## Release state

Candidate only; CI not yet verified. Do not merge/publish until both mandatory checks pass. Next: review Pages repository settings (switch source to GitHub Actions only when safe), make one production path depend on complete gates, disable automatic main writes by migration workflow, confirm live smoke. Do not change DNS, URLs, UIDs, user progress or published lesson content. Lesson 10.1.2 remains queued.
