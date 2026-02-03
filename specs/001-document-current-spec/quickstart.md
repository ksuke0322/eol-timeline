# Quickstart: 現行機能 As-Is 仕様化

## 1. 前提

- Node `22.12.0`
- pnpm `9.15.9`
- ブランチ: `001-document-current-spec`

## 2. セットアップ

```bash
pnpm install
```

## 3. 品質ゲート実行

```bash
pnpm lint
pnpm tsc
pnpm test
pnpm build
```

## 4. 主要シナリオ確認（E2E）

```bash
pnpm test:e2e
```

確認対象:
- 製品選択が可視化へ反映される
- 検索/親子選択/並び替えが動作する
- ソート/時間軸切替が動作する
- 再読込で選択状態が復元される

## 5. 受け入れ観点（Spec ID 対応）

- `FR-SIDEBAR-*`: `__e2e__/sidebar.spec.ts`
- `FR-GANTT-*`: `__e2e__/gantt-chart.spec.ts`
- `FR-DATA-*`: `__e2e__/initial-display.spec.ts`
- `FR-PERSISTENCE-*`: `__e2e__/persistence.spec.ts`

## 6. 追加確認（任意）

```bash
pnpm test-storybook
```
