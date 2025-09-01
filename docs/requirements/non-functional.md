# 非機能要件（Non-Functional Requirements）

- 最終更新: 2025-09-01

## パフォーマンス

- NFR-PERF-001: 初回一覧表示（サイドバー可視化）までの体感遅延を抑制するため、製品一覧は 1 日キャッシュする。
- NFR-PERF-002: ツール選択後のガント再描画は 1 フレーム内で完了することを目標（タスク数に比例）。
- NFR-PERF-003: 不要な再フェッチを避けるため、詳細データは 1 週間キャッシュする。

## アクセシビリティ

- NFR-A11Y-001: キーボード操作で主要機能（選択/検索/ソート/時間軸切替）が利用可能。
- NFR-A11Y-002: 操作要素に適切な ARIA 属性を付与（例: ガントの view mode セレクトに aria-label）。
- NFR-A11Y-003: 視認性の確保（色分けはテキストラベルや状態表現と併用）。

## 信頼性/回復性

- NFR-REL-001: API 取得失敗時は UI 上で明示（"API Error"）し、状態は壊れない。
- NFR-REL-002: 再訪時に再取得が可能になるよう、失敗時のキャッシュ更新を適切に制御する。

## 保守性

- NFR-MAINT-001: TypeScript + ESLint + Prettier の基準に準拠。
- NFR-MAINT-002: Storybook を UI の一次情報とし、重複ドキュメントを避ける。
- NFR-MAINT-003: 本番ビルドで data-testid を除去（運用時の不要属性を削減）。

## セキュリティ/プライバシ

- NFR-SEC-001: 機密情報は扱わない。ユーザーデータは localStorage のみを使用。
- NFR-SEC-002: 外部依存は endoflife.date のパブリック API のみ。

## 運用/デプロイ

- NFR-OPS-001: SPA モードで動作（SSR 無効）。
- NFR-OPS-002: CI で lint/typecheck/unit/build/Storybook/e2e を順に実行。

