# Security Policy

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, email **contact@fremn.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce (proof-of-concept code or requests are helpful)
- The affected component (dashboard, widget, embed script, or backend)

We'll acknowledge your report within **3 business days** and aim to provide an initial assessment — confirmation, severity, and expected timeline — within **7 business days**. We'll keep you updated as we work on a fix, and credit you in the fix's release notes if you'd like (or keep you anonymous, your call).

## Scope

Solvia is a multi-tenant SaaS platform. Reports especially welcome for:

- Cross-tenant data access (any way to read or write another organization's conversations, contacts, or settings)
- Authentication/authorization bypass (Clerk session handling, widget session tokens, Convex query/mutation access control)
- Injection vulnerabilities (in the dashboard, widget, embed script, or Convex functions)
- Exposure of secrets or credentials

Out of scope: vulnerabilities in third-party dependencies (please report those upstream — see [CONTRIBUTING.md](./CONTRIBUTING.md) if you'd also like to help us update to a patched version), and issues that require physical access to a user's device or social engineering.

## Supported Versions

This is a continuously deployed application rather than a versioned library — only the current `main` branch / production deployment is supported. There are no older versions receiving security patches.

## Disclosure

We ask that you give us a reasonable amount of time to investigate and fix an issue before any public disclosure. We don't currently run a paid bug bounty program, but we take every report seriously and appreciate the effort.
