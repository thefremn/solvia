# Solvia

Solvia is a multi-tenant, AI-powered customer support platform. Organizations embed a live chat widget on their site with a single `<script>` tag; an AI agent answers first from a per-organization knowledge base, and escalates to a human operator when it can't help or the customer asks for one. Operators work from a real-time dashboard with no page refreshes.

## Features

- **Embeddable chat widget** — one `<script>` tag adds a floating chat bubble to any site, loaded in an iframe and configured via data attributes
- **AI-powered first response** — GPT-4o-mini answers from a per-organization RAG knowledge base (`text-embedding-3-small`, via `@convex-dev/rag`)
- **AI-to-human escalation** — the AI calls an escalation tool when it can't help or the customer asks for a human
- **Operator dashboard** — real-time, paginated, infinite-scroll conversation list filterable by status
- **Conversation thread view** — full history, status control, and a reply box; operators can send manual replies that bypass the AI
- **AI message enhancement** — rewrites an operator's draft reply in place before sending
- **Contact panel** — per-conversation visitor context: name, email, browser/OS/device, screen resolution, timezone, inferred country
- **Session-based widget auth** — customers identify with name + email; session persisted in `localStorage`, expires after 24h
- **Voice chat** — Vapi integration for voice calls from the widget
- **Subscription gating** — AI responses only fire for organizations with an active subscription

## Tech stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Dashboard & widget frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui |
| Embed script | Vanilla TypeScript, bundled with Vite |
| Backend / database | [Convex](https://www.convex.dev/) (real-time reactive backend) |
| Auth + multi-tenancy | [Clerk](https://clerk.com/) (organizations as tenants) |
| AI agent | `@convex-dev/agent` + Vercel AI SDK + OpenAI GPT-4o-mini |
| Knowledge base / RAG | `@convex-dev/rag` |
| Voice | [Vapi](https://vapi.ai/) (`@vapi-ai/web`) |
| Error monitoring | Sentry (`@sentry/nextjs`) |

## Project structure

```
apps/
  web/        operator dashboard (Next.js, port 3000)
  widget/     chat widget app (Next.js, port 3001)
  embed/      embeddable script (Vite bundle, port 3002 in dev)
packages/
  backend/    Convex schema, mutations, queries, AI agent
  ui/         shared component library (shadcn/ui)
  math/       shared utilities
```

The Convex backend in `packages/backend` is split into three layers:

- `private/` — auth-gated (Clerk identity), used by the dashboard
- `public/` — session-validated (no Clerk), used by the widget
- `system/` — internal, called only by other Convex functions

Every query scopes data by `organizationId` read from the Clerk JWT (`ctx.auth.orgId`) — never from a client-supplied parameter.

## Getting started

### Prerequisites

- Node.js >= 20
- pnpm 10.24.0 (see `packageManager` in `package.json`)
- A [Convex](https://www.convex.dev/) project
- A [Clerk](https://clerk.com/) application (with organizations enabled)
- An OpenAI API key
- (Optional) AWS credentials for Secrets Manager, a Sentry DSN, and a Vapi account for voice

### Setup

```bash
pnpm install
```

Each app/package that needs environment variables reads from its own `.env.local` — copy the matching `.env.example` to get started:

- `apps/web/.env.local` — Convex URL, Clerk keys, Sentry auth token
- `apps/widget/.env.local` — Convex URL
- `packages/backend/.env.local` — Convex deployment, Clerk JWT issuer + secret key, AWS credentials, OpenAI API key

Set up your Convex deployment first (`packages/backend`), since the other apps depend on its generated API and `NEXT_PUBLIC_CONVEX_URL`:

```bash
cd packages/backend
pnpm setup   # runs `convex dev --until-success`
```

Then, from the repo root:

```bash
pnpm dev     # runs dev servers for all apps in parallel via turbo
```

- Dashboard: http://localhost:3000
- Widget: http://localhost:3001
- Embed script dev server: http://localhost:3002

### Common scripts

Run from the repo root (fanned out to every workspace via Turborepo):

```bash
pnpm build     # production build for all apps
pnpm lint      # lint all apps/packages
pnpm format    # prettier --write across the repo
```

Per-app scripts (`apps/web`, `apps/widget`) also include `typecheck`.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) for setup details and PR expectations.

## License

[MIT](./LICENSE)

<!-- test: verifying the clean workflow (build command reverted, deploy keys removed) and Clerk preview auth -->
