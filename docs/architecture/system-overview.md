# システム概要（System Overview）

- 最終更新: 2025-09-01

## 構成/依存

- フロントエンド: React + React Router（SPA）
- UI: Radix UI/shadcn + Tailwind CSS（v4）
- ガント: frappe-gantt（CSS 同梱）
- データ: endoflife.date API（all.json, <tool>.json）
- ストレージ: localStorage（選択状態/キャッシュ）

## データフロー

1) 初回起動
   - clientLoader で all.json を読み込み（1 日キャッシュ）→ ツール一覧を初期化
2) ツール展開/選択
   - useProductDetails が <tool>.json を取得（1 週間キャッシュ）→ バージョン詳細を state 反映
3) タスク生成
   - convertProductVersionDetailsToGanttTasks が選択状態に応じてタスク配列を生成
4) 表示
   - GanttChart が frappe-gantt にタスクを渡して描画（ソート/時間軸は UI から制御）

## 主要モジュール

- app/routes/home.tsx: 画面構成/ソート/タスク生成の起点
- app/components/ui/productSidebar.tsx: 階層選択/検索/並び替え
- app/hooks/useSelectedProducts.ts: 選択状態と永続化
- app/hooks/useProductDetails.ts: 詳細取得と TTL 管理
- app/lib/utils.ts: タスク変換/色割当
- app/components/ui/ganttChart.tsx: 実描画と時間軸/ポップアップ

