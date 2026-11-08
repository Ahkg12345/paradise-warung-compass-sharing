# AGENTS.md

Guidance for AI coding assistants and contributors working on this repository.

## Project

Kedai Paradise is a web-based cashier and financial management system for the Kedai Paradise Foundation.

## Application Architecture

- Keep the app on the existing TanStack Start and Tailwind v4 stack. Use file-based routes, semantic CSS variables, and shared role-aware layout modules so the restaurant UI stays aligned with the supported runtime.
- Keep username credential verification and login-attempt updates in authenticated server-runtime code. Provision initial administrators with a standalone, environment-configured script so privileged credentials never enter the browser bundle.

## Security

- Never commit secrets. This includes `.env` files, API keys, database passwords, service role keys and tokens. Use `.env.example` with placeholder values to document required variables.
- Never expose server-only keys in browser code.
- Do not log or print credentials, password hashes or session tokens.

## Database

- Schema files live in `supabase/` and `drizzle/`. Do not change migrations without agreement from the project owner, since the schema must stay consistent with the live database.
- Never edit files whose header says they are automatically generated.

## Working conventions

- Use `bun` as the package manager (the repo has a `bun.lock`). Check `package.json` for the available scripts.
- Keep changes small and focused, and keep the main branch in a working state.
- Do not rewrite published git history (no force pushes, rebases or squashes of pushed commits).