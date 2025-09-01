# テスト戦略

- 最終更新: 2025-09-01

## 方針

- 単体/結合: Vitest + React Testing Library（ロジック/副作用/アクセシビリティ）。
- E2E: Playwright（ユーザ操作シナリオ/主要フロー）。
- Storybook: UI の一次情報 + 目視/自動テスト（test-runner）。

## 責務分担

- Unit（app/lib, hooks）
  - 変換/色割当/選択ロジック/キャッシュ境界の条件分岐。
- Component（UI）
  - a11y/表示条件/基本インタラクション。
- E2E
  - 検索/親子トグル/上位表示、ガント描画とソート、再訪での復元。

## トレーサビリティ

- 仕様 ID（例: FR-SIDEBAR-001）を `describe/it` 名またはコメントに付与。
- ドキュメント⇄テスト⇄コードの相互リンクを PR で担保。

## 参照

- __e2e__/initial-display.spec.ts
- __e2e__/sidebar.spec.ts
- __e2e__/gantt-chart.spec.ts
- app/lib/__tests__/utils.test.ts
- app/hooks/__tests__/*

