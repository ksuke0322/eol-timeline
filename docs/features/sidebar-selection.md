# 機能詳細: サイドバー選択/検索/並び替え

- 最終更新: 2026-02-03

## スコープ

- ツール/バージョンの階層表示、選択トグル、検索、選択中ツールの上位表示。

## 仕様

1. 親子選択
   - 親チェックで全子を ON/OFF（FR-SIDEBAR-002）。
   - 子をすべて ON にすると親も ON、子のいずれかを OFF にすると親は OFF（FR-SIDEBAR-003）。
2. 検索
   - 入力はデバウンスして小文字化、ツール名の部分一致でフィルタ（FR-SIDEBAR-004）。
3. 並び替え
   - 選択状態の有無で 2 群に分割し、各群はアルファベット順（FR-SIDEBAR-005）。
4. 表示制御
   - アコーディオンで詳細を開閉。未取得時/期限切れ時は詳細取得をトリガ（FR-DATA-002）。
5. エラー表示
   - 詳細取得失敗時は配下に "API Error" と表示（FR-SIDEBAR-007, FR-DATA-004）。
6. キーボード操作
   - 検索・選択・ソート・時間軸切替をキーボードのみで操作可能（FR-A11Y-001）。

## 実装参照

- 階層/検索/並び替え: app/components/ui/productSidebar.tsx
- 選択状態/永続化: app/hooks/useSelectedProducts.ts
- 詳細データ取得: app/hooks/useProductDetails.ts
- E2E: __e2e__/sidebar.spec.ts
