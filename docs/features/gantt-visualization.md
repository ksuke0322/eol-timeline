# 機能詳細: ガント可視化

- 最終更新: 2026-02-03

## スコープ

- タスク生成、色分け、ポップアップ、ソート、時間軸切替。

## 仕様

1. タスク生成
   - 変換関数で ProductDetails → GanttTask[] を生成（FR-GANTT-001）。
   - 期間決定の優先順: support（文字列）→ eol（文字列）→ releaseDate。
   - EOL ステータス: 0=EOL 日付あり / 1=サポート中 or EOL:false / 2=不明。
2. 色分け
   - ツール単位で固定色（初出順にパレット循環）（FR-GANTT-002）。
3. ポップアップ
   - ホバー時に EOL 状態を文言で表示（FR-GANTT-005）。
4. ソート
   - ツール名（デフォルト）/リリース日/EOL 日で切替（FR-GANTT-003）。
5. 時間軸
   - Month/Quarter/Year を提供。余白・列幅・スナップを各ビューに最適化（FR-GANTT-004）。
   - キーボード操作でも切替できる（FR-A11Y-001）。

## 実装参照

- タスク変換/色: app/lib/utils.ts
- 描画/時間軸/ポップアップ: app/components/ui/ganttChart.tsx
- ソート UI: app/routes/home.tsx
- E2E: __e2e__/gantt-chart.spec.ts
