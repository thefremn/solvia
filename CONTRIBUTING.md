# Contributing to Solvia

Thanks for your interest in contributing! This document covers how to get set up, the conventions we use, and what to expect from the PR process.

## Getting set up

See the [README](./README.md#getting-started) for prerequisites and local setup. In short:

```bash
pnpm install
cd packages/backend && pnpm setup   # sets up your Convex deployment
pnpm dev                            # from repo root, runs all apps
```

You'll need your own Convex project, Clerk application, and OpenAI API key — each app/package reads its config from its own `.env.local` (see the README for which variables go where).

## Project layout

This is a pnpm + Turborepo monorepo:

- `apps/web` — operator dashboard (Next.js)
- `apps/widget` — customer-facing chat widget (Next.js)
- `apps/embed` — embeddable script that loads the widget (Vite)
- `packages/backend` — Convex schema, functions, and the AI agent
- `packages/ui` — shared component library (shadcn/ui)
- `packages/math`, `packages/eslint-config`, `packages/typescript-config` — shared internal tooling

Convex functions in `packages/backend/convex` are split by trust boundary — see the README's [architecture section](./README.md#project-structure) before adding a new one, since it determines whether it belongs in `private/`, `public/`, or `system/`.

## Before opening a PR

There's no automated test suite yet, so please verify your change manually:

```bash
pnpm build       # from repo root — builds all apps via turbo
pnpm lint        # lints all apps/packages
```

Per-app, also run:

```bash
pnpm typecheck   # in apps/web or apps/widget
```

If your change touches the widget or embed script, load it in a browser and click through the actual flow — a passing build doesn't confirm the feature works.

## Commit messages

We don't enforce a strict format, but prefer short, imperative, scoped messages, e.g.:

```
fix: resolve infinite scroll in conversation list
feat: add subscription gating to AI responses
chore: bump convex to 1.26
```

## Branches and PRs

- Branch off `main`; use a short descriptive name (e.g. `fix/widget-auth-redirect`).
- Keep PRs focused — one logical change per PR is easier to review than a bundle of unrelated fixes.
- Describe *why* the change is needed, not just what changed, especially for anything touching multi-tenancy, auth, or the AI agent's tool definitions.
- Link any related issue.

## Security

Multi-tenant data isolation matters a lot here: every Convex query should scope by `organizationId` read from the Clerk JWT (`ctx.auth.orgId`), never from a client-supplied parameter. If you're touching auth, `private/`/`public/`/`system/` boundaries, or anything that reads org/session identity, call that out explicitly in your PR description.

For reporting a vulnerability rather than a regular bug, see [SECURITY.md](./SECURITY.md).

## Code style

- TypeScript throughout; ESLint (flat config) + Prettier are configured at the workspace root and inherited by each app/package — run `pnpm lint` before pushing.
- Match the conventions already used in the file/module you're editing over introducing a new pattern.

## Questions

Open an issue if something in this guide is unclear or out of date — that's useful signal on its own.
