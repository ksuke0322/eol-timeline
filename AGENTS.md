# Repository Guidelines

## Project Structure & Modules

- `app/`: Application code (React + TypeScript + React Router)
  - `routes/`: Route modules (e.g., `home.tsx`)
  - `components/ui/`: UI primitives
  - `hooks/`, `lib/`: Reusable logic and helpers
  - `__tests__/`: Unit/integration tests colocated with app code
- `__e2e__/`: Playwright end-to-end tests
- `.storybook/`, `storybook-static/`: Storybook config and static build
- `public/`: Static assets
- `build/`: Production build output
- `test/setup.ts`: Vitest JSDOM/test globals setup

## Setup, Build, and Run

- Install tooling: Node `22.12.0`, pnpm `9.15.9` (see `package.json` engines)
- Install deps: `pnpm install`
- Develop: `pnpm dev` (Vite + React Router dev server)
- Type check: `pnpm typecheck` or `pnpm tsc`
- Lint/format: `pnpm lint` (ESLint with fixes)
- Build: `pnpm build` (React Router build + Vite, strips `data-testid`)
- Preview build: `pnpm start` (serves `./build/client`)
- All checks: `pnpm all-check` (lint, typecheck, unit, build, Storybook tests, e2e)

## Coding Style & Conventions

- Language: TypeScript, React function components, hooks-first design
- Formatting: Prettier (`singleQuote: true`, `semi: false`)
- Linting: ESLint (React, hooks, a11y, import order, Tailwind rules, unused-imports)
- Paths: `~/*` aliases to `app/*` (see `tsconfig.json`)
- Styling: Tailwind CSS v4; prefer utility classes; keep class lists readable
- Tests: May use `data-testid`; these are automatically removed from production builds

## Testing Guidelines

- Unit/integration: Vitest (JSDOM)
  - Naming: `app/**/*.test.ts{,x}`
  - Run: `pnpm test` (or `pnpm test:ui` for the UI)
- E2E: Playwright in `__e2e__/`
  - Run locally: `pnpm test:e2e` (starts dev server then runs tests)
- Storybook: Visual/component tests
  - Run: `pnpm storybook`, build: `pnpm build-storybook`, test: `pnpm test-storybook`

## Commit & Pull Requests

- Commits: Conventional Commits (e.g., `feat:`, `fix:`, `chore:`)
- PRs: Include clear description, linked issues, and UI screenshots/GIFs when applicable
- Before opening/merging: ensure `pnpm all-check` passes locally

## Notes

- App runs in SPA mode (`ssr: false` in `react-router.config.ts`)
- Do not commit secrets; prefer environment variables and local `.env` files ignored by Git
