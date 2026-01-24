# Repository Guidelines

## プロジェクト概要

EOL Timeline は React Router + Vite で構成されたフロントエンドアプリです。依存更新は Renovate が多く、CI はビルド/テスト/リンタを通します。

## Project Structure & Module Organization

- `app/`: アプリ本体。`app/routes/` が画面・ルート、`app/components/ui/` が UI 部品、`app/hooks/` がカスタムフック、`app/lib/` が共有ロジック。
- `app/**/__tests__/`: 単体/結合テスト、`app/**/__stories__/`: Storybook。
- `__e2e__/`: Playwright の E2E シナリオ。
- `docs/`: 要件/アーキ/テスト戦略（変更時は更新必須）。
- `public/`: 静的アセット。

## Build, Test, and Development Commands

- `pnpm dev`: 開発サーバー起動（React Router dev）。
- `pnpm build`: 本番ビルド（`build/client` 生成）。
- `pnpm start`: ビルド結果のプレビュー。
- `pnpm typecheck` / `pnpm tsc`: 型生成 + 型検査。
- `pnpm lint`: ESLint（Prettier 連携、`--fix`）。
- `pnpm test` / `pnpm test:ui`: Vitest 実行。
- `pnpm storybook` / `pnpm test-storybook`: Storybook 起動/テスト。
- `pnpm test:e2e`: Playwright 実行。
- `pnpm all-check`: 主要チェックを一括実行。

## Coding Style & Naming Conventions

- TypeScript/React を前提。ESLint + Prettier に従う（自動整形を優先）。
- インポート順は ESLint `import/order` ルールに準拠。
- コンポーネントは `PascalCase`、フックは `useXxx`、テストは `*.test.ts(x)`、E2E は `*.spec.ts`。
- スタイルは Tailwind（`app/app.css` がエントリ）。

## Testing Guidelines

- Unit/Component: Vitest + React Testing Library（`app/**/__tests__`、`test/setup.ts`）。
- E2E: Playwright（`__e2e__/`）。
- Storybook: test-runner を使用。
- 仕様 ID（例: `FR-SIDEBAR-001`）を `describe/it` 名やコメントに付与してトレース可能にする。

## Commit & Pull Request Guidelines

- コミットは概ね Conventional Commits 形式（例: `chore(deps): update dependency ...`, `fix(deps): ...`）。
- 仕様や UI の挙動が変わる場合は `docs/` を更新。
- PR には変更概要と関連 Issue を記載し、可能なら `pnpm all-check` を通す。

## セキュリティ & 運用メモ

- Node/Pnpm のバージョンは `package.json` の `engines` に合わせる。
- ドキュメントの最終更新日を各 md 冒頭に記載する運用を維持する。
