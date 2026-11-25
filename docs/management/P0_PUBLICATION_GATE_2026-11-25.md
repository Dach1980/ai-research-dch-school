# P0 — controlled publication gate, 2026-11-25

Base 0b74f346ff93e36c825f4b65a66291339844e02a. PR #4 catalog acceptance succeeded: run 45592653872, 73 steps, merged. The managed production run 45594158123 was still running when this candidate was prepared. No claim of successful live deployment.

## Proposed changes
- Run the full catalog check as a reusable job in Pages on the same SHA; keep pull-request and manual checks. Deployment requires catalog, existing validation, and Supabase migration jobs. PRs never deploy.
- Production deployments are serialized; do not cancel an active deploy. Production Pages must be configured to use GitHub Actions, not branch source.
- Extend production smoke to all published locale routes (including 10.1.1); preserve existing content markers. Generic smoke checks HTTP success and heading, not full visual parity.
- Replace automatic migration commits with manual read-only preview and patch artifact. No credentials retained; no main writes.

## Owner setting required
GitHub repository Settings → Pages → Build and deployment → Source: GitHub Actions. Preserve custom domain dchai.ru and DNS. Connector cannot read/write the Pages setting. Before merging, confirm existing managed deployment state and validate this PR. Source setting must be verified; separate dynamic Pages success is not a quality gate. No automatic domain or DNS changes.

## Remaining
CI and deployment of this candidate pending; inspect smoke logs, verify source setting, then confirm public URLs. Artifact allowlist remains P1. Lesson 10.1.2 remains subject to separate review and release gates.
