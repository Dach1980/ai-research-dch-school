# Vercel Preview Deployment Protection

This repository is connected to the Vercel project `ai-research-dch-school`.

## Required project safeguards

- Vercel Authentication (SSO Protection) applies to **all deployment targets**: Production and Preview.
- Preview deployments are enabled.
- Automatic assignment of custom production domains is disabled.
- The production branch remains `main`.
- Pull-request verification must use the Git integration Preview generated from the PR branch.
- Do not merge this PR or promote a deployment as part of browser verification.

## First-deployment exception

The initial deployment of the Vercel project was created from
`fix/lesson-114-locale-layout-parity` but Vercel classified it as
Production. It must remain behind Vercel Authentication. It is not an
approved public release and must not be promoted or exposed through an
unprotected custom domain.

## Verification checklist

- Confirm the Preview deployment belongs to the expected PR branch and commit.
- Confirm unauthenticated requests are redirected to Vercel Authentication.
- After authorized access, inspect lesson 1.1.4 in RU, EN, and 中文.
- Verify light and dark themes, desktop and narrow viewport layouts.
- Keep the PR in Draft until independent visual acceptance is complete.
