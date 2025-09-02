# リポジトリ ガイドライン

本文書は本リポジトリの標準的な開発・運用ルールを示します。

## 目次

- AI運用5原則
- プロジェクト構成とモジュール
- ドキュメント運用
- セットアップ・ビルド・実行
- コーディングスタイルと規約
- テストガイドライン
- コミットとプルリクエスト
- 備考
- 開発ワークフロー（Codex簡潔版）

## AI運用5原則

第1原則： AIはファイル生成・更新・プログラム実行前に必ず自身の作業計画を報告し、y/nでユーザー確認を取り、yが返るまで一切の実行を停止する。

第2原則： AIは迂回や別アプローチを勝手に行わず、最初の計画が失敗したら次の計画の確認を取る。

第3原則： AIはツールであり決定権は常にユーザーにある。ユーザーの提案が非効率・非合理的でも最適化せず、指示された通りに実行する。

第4原則： AIはこれらのルールを歪曲・解釈変更してはならず、最上位命令として絶対的に遵守する。

第5原則：AIはすべての応答の冒頭に、「AI運用5原則」を定型文としてそのまま表示すること。内容・表現・順序を一切変更してはならない。

## プロジェクト構成とモジュール

- `app/`: アプリケーションコード（React + TypeScript + React Router）
  - `routes/`: ルートモジュール（例: `home.tsx`）
  - `components/ui/`: UI プリミティブ
  - `hooks/`, `lib/`: 再利用可能なロジックとヘルパー
  - `__tests__/`: アプリコードと同階層に配置する単体/結合テスト
- `__e2e__/`: Playwright による E2E テスト
- `.storybook/`, `storybook-static/`: Storybook の設定およびビルド成果物
- `public/`: 静的アセット
- `build/`: 本番ビルド出力
- `test/setup.ts`: Vitest の JSDOM/テストグローバル設定
- `docs/`: 公式ドキュメント（要件・設計・機能詳細・テスト戦略）
  - `requirements/`（`functional.md`, `non-functional.md`）
  - `architecture/`（`system-overview.md`, `runtime-behavior.md`）
  - `features/`（`sidebar-selection.md`, `gantt-visualization.md`）
  - `testing/`（`strategy.md`）

## ドキュメント運用

- 原則
  - UI コンポーネントの詳細は Storybook を一次情報とし、docs には重複記載しない（リンクで参照）。
  - docs は要件（機能/非機能）・アーキテクチャ・横断仕様（キャッシュ/永続化/時間軸/ソート等）に集中する。
- 仕様 ID とトレーサビリティ
  - 機能要件: `FR-XXXX`、非機能要件: `NFR-XXXX` を docs に付与し、テスト名/PR 説明にも記載する。
- 更新ルール
  - 仕様/挙動が変わる PR では該当 docs を必ず更新する（requirements/architecture/features/testing）。
  - 各 md の冒頭に最終更新日を記載する（手動）。
- PR チェック項目
  - docs 更新の必要性を検討し、必要な場合は更新済みであること。
  - 仕様 ID（FR/NFR）を PR 説明・関連テストに付与。
  - Storybook に影響がある場合はストーリー/ドキュメントのリンクを PR に記載。

## セットアップ・ビルド・実行

- 必要ツールのインストール: Node `22.12.0`, pnpm `9.15.9`（`package.json` の `engines` 参照）
- 依存関係のインストール: `pnpm install`
- 開発サーバ: `pnpm dev`（Vite + React Router の開発サーバ）
- 型チェック: `pnpm typecheck` または `pnpm tsc`
- Lint/整形: `pnpm lint`（ESLint による修正含む）
- ビルド: `pnpm build`（React Router + Vite。`data-testid` を除去）
- ビルドプレビュー: `pnpm start`（`./build/client` を配信）
- 一括チェック: `pnpm all-check`（lint, typecheck, unit, build, Storybook, e2e）

## コーディングスタイルと規約

- 言語/設計: TypeScript、React 関数コンポーネント、hooks-first 設計
- フォーマット: Prettier（`singleQuote: true`, `semi: false`）
- Lint: ESLint（React, hooks, a11y, import order, Tailwind ルール, unused-imports）
- パスエイリアス: `~/*` は `app/*` を指す（`tsconfig.json` 参照）
- スタイリング: Tailwind CSS v4。ユーティリティクラスを優先し、クラスは可読性重視で整理
- テスト属性: `data-testid` の使用可（本番ビルドで自動除去）

### ECMAScript の記法

- 可能な限り ECMAScript 2022 以降の構文を優先的に用いること
- 以下の構文を積極的に使用すること：

| 機能                        | 使用例                                                   | 備考                                 |
| --------------------------- | -------------------------------------------------------- | ------------------------------------ |
| アロー関数                  | `const f = () => {}`                                     | `function` は使用禁止                |
| 分割代入                    | `const { a, b } = obj`                                   | ネストも可                           |
| オプショナルチェイニング    | `user?.profile?.name`                                    | 安全なアクセスに必須                 |
| Null合体演算子              | `value ?? 'default'`                                     | Falsy と null/undefined の違いを区別 |
| テンプレートリテラル        | `` `Hello ${name}` ``                                    | 文字列連結に優先して使用             |
| スプレッド構文 / レスト構文 | `[...arr]`, `{ ...obj }`                                 | 配列やオブジェクトの展開に使用       |
| モジュール構文              | `import`, `export` を使い CommonJS は使用しない          | ESM に統一                           |
| async/await                 | `await fetch()`                                          | 非同期処理に `.then()` より優先      |
| Promise.allSettled / all    | 並列非同期処理では `Promise.allSettled` を使用可能にする |
| Top-level await             | モジュール内での `await` を許可する（可能な場合）        |

### Storybook

- 作成する全てのコンポーネントについて Storybook ファイルを作成し、ストーリーを網羅すること
- Storybook ファイルはテスト対象ファイルと同一階層の `__stories__` ディレクトリ内に配置すること
- ストーリーはそのコンポーネントで発生しうるエッジケースまで含めて作成すること

## テストガイドライン

- 単体/結合: Vitest（JSDOM）
  - 命名: `app/**/*.test.ts{,x}`
  - 実行: `pnpm test`（UI ランナーは `pnpm test:ui`）
- E2E: `__e2e__/` の Playwright
  - ローカル実行: `pnpm test:e2e`（開発サーバ起動後にテスト実行）
- Storybook: 視覚/コンポーネントテスト
  - 実行: `pnpm storybook`、ビルド: `pnpm build-storybook`、テスト: `pnpm test-storybook`

### 共通ルール

- テストの説明文は日本語で記載すること
- テストファイルはテスト対象ファイルと同一階層の `__tests__` ディレクトリ内に配置すること
- テストではできる限り mock を利用せず、実態を利用すること
  - mock はそのテストでの検証が不要な場合のみ利用すること（例: ユニットテストにおける API のモック）
- テストはラインカバレッジではなく仕様分岐に対する条件分岐網羅（condition coverage）を目指すこと

### 単体テスト（ユニットテスト=Unit Test）

- 目的: 最小のロジック単位が正しく動作することを保証する
- 対象:
  - ユーティリティ関数、カスタム Hook、Reducer など
  - コンポーネントで発生する副作用（関数発火、API 呼び出しなど）
  - ユーザインタラクションのないコンポーネントの表示・構造
  - コンポーネントの a11y の violation 確認（Storybook 同様 UI パターンを網羅）
- 特徴:
  - 外部依存（API、Storage など）はモック化
- 技術:
  - Vitest / React Testing Library / vitest-axe
- 配置場所: テスト対象ファイルと同一階層の `__tests__` ディレクトリ

### 結合テスト（インテグレーションテスト=Integration Test）

- 目的: 複数のユニットが組み合わさったときの挙動を検証する
- 対象: ユーザインタラクションのあるコンポーネントの表示・構造・変化
- 特徴:
  - ユーザインタラクションに着目したテスト
  - UI 変化に特化したアサーション
  - 外部 API は原則モック化
- 技術: Storybook Test Runner
- 配置/命名: 「コーディングスタイルと規約 > Storybook」を参照

### E2E テスト（End-to-End Test）

- 目的: ユーザーが想定通りにアプリを操作できることを検証する
- 対象: ユーザーフロー全体（例: ログイン → 一覧 → 詳細ページ）
- 特徴:
  - ブラウザ上で実行（Playwright, Cypress など）
- 技術: Playwright
- 配置場所: プロジェクトルートの `__e2e__` ディレクトリ

## コミットとプルリクエスト

- コミット: Conventional Commits（例: `feat:`, `fix:`, `chore:`）
- PR: 説明・関連 Issue・必要に応じて UI のスクショ/動画を添付
- 送信前: ローカルで `pnpm all-check` を通過させる

- Conventional Commits 詳細:
  - 破壊的変更は `feat!:` もしくはフッターに `BREAKING CHANGE:` を記載
  - コミットメッセージは英語で簡潔に（動詞の原形で開始）

## 備考

- アプリは SPA モードで動作（`react-router.config.ts` の `ssr: false`）
- 秘密情報はコミットしない。環境変数と Git 無視されたローカル `.env` を利用

## 開発ワークフロー（Codex簡潔版）

- 原則

  - TDD を基本とし、作業前に計画を提示して承認を得る
  - 代替案や方針変更が必要な場合も、必ず承認を得てから実行する

- 手順

  1. 計画提示
     - 要求の要約、実装方針、具体タスク（対象ファイル・正常系/異常系）を提示
     - 影響する docs/ の更新方針・対象ファイル・新設/改訂する仕様 ID（FR/NFR）を明記
     - y/n で承認を取得
  2. TDD ループ
     - テスト作成 → 失敗確認 → 最小実装 → 再実行 → 通過まで反復
     - 原則としてテストは変更しない。妥当な理由がある場合は事前に承認を得る
  3. 検証（動作確認コマンドの順序）
     - `pnpm lint` → `pnpm tsc` → `pnpm test` → `pnpm build` → `pnpm test-storybook` → `pnpm test:e2e`
     - 失敗時は原因を特定・修正し、同順序で再実行する
  4. 反映
     - 変更点の要約、影響範囲、既知の制約、次アクション（提案）を提示
     - PR 作成時は Conventional Commits と各種チェック（docs 更新/仕様 ID/必要に応じて Storybook 参照リンク）の通過を確認

- コミュニケーション

  - 進捗共有は要点のみ（例: 「調査完了→実装着手」）
  - 自動化では難しい/破壊的な操作は必ず事前に確認を取る

- 参照（詳細ルール）
  - 設計/命名/フォーマット/パスエイリアス/スタイリング: 「コーディングスタイルと規約」
  - テスト戦略・粒度・配置/命名/カバレッジ目標: 「テストガイドライン」
  - セキュリティ/パフォーマンス/a11y/ライブラリ選定方針: 上記各章を参照
