# 機能要件（Functional Requirements）

- 最終更新: 2025-09-01

## 概要

本アプリは endoflife.date API から取得したツール/バージョンを選択し、ガントチャートで可視化する SPA である。

## FR-SIDEBAR（サイドメニュー）

- FR-SIDEBAR-001: ツール→バージョンの階層表示ができる。
- FR-SIDEBAR-002: ツール（親）チェックで配下の全バージョン（子）を選択/解除できる。
- FR-SIDEBAR-003: 全子が選択された場合は親を選択状態にする。子のいずれかが未選択なら親は未選択にする。
- FR-SIDEBAR-004: 検索ボックスで部分一致フィルタができる（ケースインサンシティブ）。
- FR-SIDEBAR-005: 選択中のツールはリスト上部に優先表示する（選択有/無で2群に分けて名前順）。
- FR-SIDEBAR-006: アコーディオンでツールの詳細（バージョン）を展開/折り畳みできる。
- FR-SIDEBAR-007: API 取得失敗時は該当ツール配下に "API Error" を表示する。

参照: app/components/ui/productSidebar.tsx, app/hooks/useSelectedProducts.ts, __e2e__/sidebar.spec.ts

## FR-GANTT（ガントチャート表示）

- FR-GANTT-001: サイドバー選択状態に応じたタスクを表示する。
- FR-GANTT-002: ツールごとに一貫した色で表示する。
- FR-GANTT-003: ソート順を切替できる（ツール名／リリース日／EOL日）。
- FR-GANTT-004: 時間軸ビューを切替できる（Month／Quarter／Year）。
- FR-GANTT-005: タスクホバーでポップアップ（EOL 状態）を表示する。

参照: app/components/ui/ganttChart.tsx, app/lib/utils.ts, app/routes/home.tsx, __e2e__/gantt-chart.spec.ts

## FR-DATA（データ取得と反映）

- FR-DATA-001: 初回に製品一覧（all.json）を取得し、ローカルに 1 日キャッシュする。
- FR-DATA-002: ツール展開/選択時に詳細（<tool>.json）を取得し、ローカルに 1 週間キャッシュする。
- FR-DATA-003: キャッシュが有効な間はネットワーク取得をスキップする。
- FR-DATA-004: 取得失敗時は該当ツールの配下リストを空にし、再訪問時に再取得可能とする。

参照: app/routes/home.tsx (clientLoader), app/hooks/useProductDetails.ts

## FR-PERSISTENCE（状態の永続化）

- FR-PERSISTENCE-001: 選択状態を localStorage に保存し、ページ再訪問時に復元する。
- FR-PERSISTENCE-002: 同一オリジン内の他タブ操作（storage イベント）で選択状態を同期する。

参照: app/hooks/useSelectedProducts.ts, __e2e__/persistence.spec.ts

## 非スコープ（将来対応予定）

- FR-FUTURE-CSV-001: カスタムデータ（CSV）の読み込み/検証/表示/クリア/永続化。
  - 書式: ツール名,バージョン,リリース日(YYYY-MM-DD),EOL日(YYYY-MM-DD)
  - 現時点では未実装（home.test.tsx に TODO 記載あり）。

