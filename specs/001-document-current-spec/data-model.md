# Data Model: 現行機能 As-Is 仕様化

## Entity: Product
- Description: 一覧表示される製品。
- Fields:
  - `name` (string, required): 製品名（識別子）
  - `versions` (ProductVersion[], optional): 詳細取得後に保持
- Validation Rules:
  - `name` は空文字不可
  - 一覧内で `name` は一意
- Relationships:
  - Product 1 --- * ProductVersion

## Entity: ProductVersion
- Description: 製品サイクル情報。
- Fields:
  - `productName` (string, required)
  - `cycle` (string, required)
  - `releaseDate` (date string, required)
  - `support` (date string | boolean | null, optional)
  - `eol` (date string | boolean | null, optional)
  - `latest` (string | null, optional)
- Validation Rules:
  - 識別子 `productName + cycle` は一意
  - `releaseDate` は日付形式
  - `support`/`eol` が日付の場合は日付形式
- State Notes:
  - EOLステータスは派生値（0: 日付あり / 1: サポート中orfalse / 2: 不明）

## Entity: SelectionState
- Description: UI の選択状態と永続化対象。
- Fields:
  - `selectedProducts` (string[], required): 親選択
  - `selectedVersions` (Record<string, string[]>, required): 子選択
  - `updatedAt` (number, required): 更新時刻（epoch ms）
- Validation Rules:
  - `selectedVersions` の key は Product.name と整合
  - 子が全選択なら親選択を true と解釈
- State Transitions:
  - ParentToggle: 親ONで全子ON、親OFFで全子OFF
  - ChildToggle: 全子ONで親ON、1つでもOFFで親OFF
  - Persist/Restore: localStorage へ保存・再読込

## Entity: CacheEntry
- Description: 一覧/詳細キャッシュの格納単位。
- Fields:
  - `key` (string, required)
  - `data` (unknown, required)
  - `fetchedAt` (number, required)
  - `ttlMs` (number, required)
- Validation Rules:
  - 一覧 TTL は 86,400,000ms
  - 詳細 TTL は 604,800,000ms
- State Transitions:
  - Fresh: `now - fetchedAt < ttlMs`
  - Expired: 再取得対象
  - RefreshFailed: 直近 `data` を暫定利用し、失敗表示

## Entity: TimelineItem
- Description: ガント描画用の派生データ。
- Fields:
  - `id` (string, required): `productName_cycle`
  - `label` (string, required): `<product> <cycle>`
  - `start` (date, required): releaseDate
  - `end` (date, required): support/eol/releaseDate 優先
  - `color` (string, required)
  - `eolStatus` (number, required)
- Validation Rules:
  - `id` は選択済み ProductVersion と 1:1
  - `start <= end`

## Relationship Summary
- Product -> ProductVersion: 1対多
- SelectionState -> Product/ProductVersion: 選択参照
- CacheEntry -> Product list/detail: TTL管理
- TimelineItem <- ProductVersion + SelectionState: 表示派生
