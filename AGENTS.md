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

## GEMINI.md ルールの統合

本リポジトリでは、既存の開発ガイドライン（本ファイル）に加えて、`GEMINI.md` に記載の基本ルール・ワークフローを併用します。以下は両者を統合した要点です。Gemini CLI 実行時は `GEMINI.md` を厳守し、他エージェント（例: Codex CLI）では本ファイルの方針に沿いつつ、可能な限り `GEMINI.md` の原則を尊重してください。

### 運用原則（GEMINI 準拠）

- **承認フロー:** 重要/破壊的な操作や広範な変更前に、簡潔な計画を提示しユーザーの確認を得る。代替案に移る場合も再承認を取る。
- **決定権:** エージェントはツールであり最終判断はユーザー。指示に忠実に従う。
- **最上位規則:** これらの原則を恣意的に緩和・再解釈しない。Gemini CLI では `GEMINI.md` を優先。
- **注記:** `GEMINI.md` の「全応答の冒頭に原則を表示」要件は Gemini CLI 専用。Codex CLI など他環境では本リポの対話規約に従い、同等の承認行動で代替します。

### 開発ワークフロー（TDD）

- **計画提示:** 要求の整理、実装方針、タスクリスト（対象ファイル・正常/異常系含む）を提示しレビューを受ける。
- **Red-Green-Refactor:**
  - まずテストを作成し実行して失敗を確認（Red）。
  - 最小実装でテストを通す（Green）。仕様乖離などの明確な理由なくテストは変更しない。
  - 必要に応じてリファクタ（Refactor）。
- **最終確認コマンド:** すべて完了後に以下を順に実行し、失敗時は原因を特定・修正。
  - `pnpm lint`
  - `pnpm tsc`
  - `pnpm test`
  - `pnpm build`
  - `pnpm test-storybook`（a11y 問題はスキップ可）
  - `pnpm test:e2e`

### 開発ルール（抜粋）

- **NEVER:** 秘密情報をハードコーディングしない。ユーザー確認なしにデータ削除しない。外部依存（`node_modules` 等）を直接変更しない。
- **MUST:** 命名は基本 `camelCase`、定数は大文字 `SNAKE_CASE`。要件を過不足なく満たす。性能・セキュリティ・アクセシビリティのベストプラクティスに従う。
- **IMPORTANT:** 既存技術スタックと親和性の高い選択を優先（新規ライブラリ導入は慎重に）。

### コーディングスタイル（補足）

- **ECMAScript:** 可能な限り新しめの構文を使用。アロー関数、分割代入、オプショナルチェーン、Null 合体、テンプレートリテラルを推奨。
- **関数/変数:** 1 つの関数は 1 つの責務を意識。読みやすさを最優先し、過度なワンライナーは避ける。
- **コメント:** 意図がコードから読み取りづらい箇所のみ最小限で。
- **本リポ設定:** Prettier と ESLint の既定設定に従う（`singleQuote: true`, `semi: false`）。Tailwind は可読性の高いユーティリティクラス構成を心掛ける。

### テスト方針（配置とツール）

- **ユニット/結合:** Vitest（JSDOM）。命名は `app/**/*.test.ts{,x}`。セットアップは `test/setup.ts`。
- **E2E:** Playwright。配置はリポジトリ直下の `__e2e__/`。ローカル実行は `pnpm test:e2e`。
- **Storybook:** UI/ビジュアルテスト。`pnpm storybook` / `pnpm build-storybook` / `pnpm test-storybook`。

### プロジェクト概要（参考）

- **目的:** `endoflife.date` の API 情報を基に、ツール/バージョンのリリース〜EOL をガント形式で可視化。
- **主な要件:**
  - サイドメニューでツール/バージョンを階層表示・選択（チェックボックス・検索・優先表示・永続化）。
  - 選択内容に応じてガント描画（ツール配色・各種ソート・月/年スケール）。
  - カスタム CSV（`ツール名,バージョン,リリース日(YYYY-MM-DD),EOL日(YYYY-MM-DD)`）の読み込み・検証・上書き・クリア・永続化。

### 実装時のヒント

- **承認→実行:** 作業前に計画を短く共有し、必要に応じて確認を取得。
- **最小差分:** 既存スタイルに合わせ、変更は課題に必要な最小限に留める。
- **検証の順序:** 変更点に近いテストから順に実行し、信頼を高めつつ広げる。

詳細な規則や例は `GEMINI.md` を参照してください。
