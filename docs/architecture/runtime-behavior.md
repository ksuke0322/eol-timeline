# 実行時挙動（Runtime Behavior）

- 最終更新: 2026-02-03

## キャッシュ戦略

- 一覧（all.json）: 1 日 TTL（localStorage: `eol_products_list_cache`）
- 詳細（<tool>.json）: 1 週間 TTL（localStorage: `eol_products_details_cache`）
- 以下に当てはまるツールはバックグラウンド更新を試行し、成功時に state とキャッシュを更新。
  - キャッシュなしかつアコーディオン開閉したツール
  - 期限切れかつ選択中のツール
  - 期限切れかつアコーディオン開閉したツール
  - 期限切れかつ親チェックボックスを押下したツール
- 失敗時の扱い: 初回 null → 失敗なら空配列をセット（次回訪問で再通信）。
- 要件対応: FR-DATA-003, FR-DATA-004, FR-DATA-005。

## 選択ロジック

- 親（ツール）トグル: 親の ON/OFF に応じて全子を同期。
- 子（バージョン）トグル: すべての子が選択済みなら親を ON。子を一つでも外すと親を OFF。
- ID 命名: 親は `productName`、子は `productName_cycle`。
- 要件対応: FR-SIDEBAR-001, FR-PERSISTENCE-001。

## 並び順/検索

- 検索: ツール名の部分一致（小文字化）。
- 並び: 「選択有り」群 → 「選択無し」群／各群でアルファベット順。
- 要件対応: FR-SIDEBAR-004, FR-SIDEBAR-005, FR-A11Y-001。

## ガント生成

- 色: ツールごとに固定パレットから割当（初出順に循環）。
- 期間: `start = releaseDate`、`end = support|eol|releaseDate` の優先順で決定。
- EOL ステータス: `0=日付あり`, `1=サポート中/ EOL:false`, `2=不明`。
- ラベル: `"<tool> <cycle>"` を基本とし、内部状態は popup のテキストで表現。

## 時間軸

- Month / Quarter / Year を提供。各ビューで余白/列幅/スナップ日数を調整。
- 要件対応: FR-GANTT-004, FR-A11Y-001。
