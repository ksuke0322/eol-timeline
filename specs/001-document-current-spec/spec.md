# Feature Specification: 現行機能 As-Is 仕様化

**Feature Branch**: `001-document-current-spec`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "既存コードを探索し、現状実装を反映したas-is仕様を作成する"

## Clarifications

### Session 2026-02-03

- Q: キャッシュ TTL をどう規定するか → A: 製品一覧は 1 日、製品詳細は 1 週間
- Q: キーボード操作の必須範囲はどこまでか → A: 検索・選択・ソート・時間軸切替を必須
- Q: 期限切れキャッシュで取得失敗した場合の表示方針は → A: 直近キャッシュを暫定表示し失敗を明示

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 製品を選んで可視化する (Priority: P1)

利用者として、製品とバージョンを選択して EOL 情報を一覧で確認したい。これにより、
どのバージョンを優先的に対応すべきかを判断できる。

**Why this priority**: 本アプリの中核価値（選択と可視化）を直接提供するため。

**Independent Test**: 製品一覧を表示し、任意のバージョンを選択した時に可視化対象へ反映される
ことを確認する。

**Acceptance Scenarios**:

1. **Given** 製品一覧が表示されている, **When** 利用者が製品バージョンを選択する, **Then** 可視化対象にそのバージョンが追加される
2. **Given** 複数バージョンが可視化されている, **When** 利用者が 1 つを選択解除する, **Then** 可視化対象から該当項目だけが除外される

---

### User Story 2 - サイドバーで素早く対象を絞り込む (Priority: P2)

利用者として、製品一覧を検索し、親子選択でまとめて操作したい。これにより、対象製品が
多い場合でも短時間で必要な範囲を選択できる。

**Why this priority**: 実運用時の操作効率を大きく左右するため。

**Independent Test**: 検索語入力時の絞り込み、親子チェック連動、選択済み製品の上位表示を
個別に検証する。

**Acceptance Scenarios**:

1. **Given** 製品一覧に複数の名称がある, **When** 利用者が検索語を入力する, **Then** 一致する製品のみ表示される
2. **Given** 親製品の詳細が表示されている, **When** 親を選択する, **Then** 配下の全バージョンが選択される
3. **Given** 子バージョンが一部未選択である, **When** 利用者が残りの子を選択する, **Then** 親も選択状態になる

---

### User Story 3 - 状態を維持して継続利用する (Priority: P3)

利用者として、再読み込みや再訪問後も選択状態を維持したい。これにより、日常的な確認作業を
毎回やり直さずに済む。

**Why this priority**: 継続利用時の体験品質と運用効率に直結するため。

**Independent Test**: 選択後にページ再読み込みを行い、同一の選択状態と表示結果が再現される
ことを確認する。

**Acceptance Scenarios**:

1. **Given** 利用者が複数バージョンを選択済みである, **When** ページを再読み込みする, **Then** 選択状態が復元される
2. **Given** 取得失敗が発生した製品がある, **When** 利用者が再度表示を試みる, **Then** 状態が破損せず再取得を試行できる

### Edge Cases

- 製品詳細の取得に失敗した場合、該当製品配下にエラー表示を出し他の操作は継続できること
- 検索結果が 0 件の場合、誤操作を招かない表示状態を維持すること
- 詳細情報の一部に日付欠損や不明値がある場合でも、可視化対象全体の表示が継続できること

## Requirements *(mandatory)*

### Functional Requirements

- **FR-DATA-001**: System MUST 初回表示時に製品一覧を取得し、利用者が選択可能な一覧として提示する
- **FR-SIDEBAR-001**: System MUST 製品とバージョンを階層で表示し、親子選択を連動させる
- **FR-SIDEBAR-004**: System MUST 検索語に対して製品名の部分一致フィルタを提供する
- **FR-SIDEBAR-005**: System MUST 選択中の製品を未選択より上位に表示し、各グループ内は名称順で表示する
- **FR-GANTT-001**: System MUST 選択されたバージョンのみを可視化対象として表示する
- **FR-GANTT-003**: System MUST 可視化対象の並び替え（名称順、リリース順、EOL順）を切り替え可能にする
- **FR-GANTT-004**: System MUST 可視化対象の時間軸表示を複数モードで切り替え可能にする
- **FR-DATA-004**: System MUST データ取得失敗時に利用者へ明示し、他機能の利用継続を可能にする
- **FR-PERSISTENCE-001**: System MUST 選択状態を保存し、同一利用者の再訪時に復元する
- **FR-DATA-003**: System MUST 製品一覧は 1 日、製品詳細は 1 週間の期限で再利用し、不要な再取得を抑制する
- **FR-A11Y-001**: System MUST 検索・選択・ソート・時間軸切替の主要操作をキーボードのみで実行可能にする
- **FR-DATA-005**: System MUST 期限切れ後の再取得が失敗した場合、直近キャッシュを暫定表示し取得失敗を明示する

### Legacy to Canonical ID Mapping

| Legacy ID | Canonical ID |
|-----------|--------------|
| FR-001 | FR-DATA-001 |
| FR-002 | FR-SIDEBAR-001 |
| FR-003 | FR-SIDEBAR-004 |
| FR-004 | FR-SIDEBAR-005 |
| FR-005 | FR-GANTT-001 |
| FR-006 | FR-GANTT-003 |
| FR-007 | FR-GANTT-004 |
| FR-008 | FR-DATA-004 |
| FR-009 | FR-PERSISTENCE-001 |
| FR-010 | FR-DATA-003 |
| FR-011 | FR-A11Y-001 |
| FR-012 | FR-DATA-005 |

### Non-Functional Requirements

- **NFR-PERF-001**: 初期表示時、主要コンテンツ（サイドバーとガント領域）の表示開始までを 3 秒以内にする（通常回線条件）。
- **NFR-REL-001**: 期限切れ再取得が失敗しても、利用者が既存表示を維持したまま次操作に進めること。
- **NFR-A11Y-001**: キーボードのみで検索・選択・ソート・時間軸切替の 4 操作が完了できること。

### Documentation & Traceability Requirements *(mandatory)*

- 本仕様は既存ドキュメントの要件 ID（`FR-SIDEBAR-*`, `FR-GANTT-*`, `FR-DATA-*`, `FR-PERSISTENCE-*`）と整合すること
- 受け入れシナリオは E2E テスト群（`__e2e__/initial-display.spec.ts`, `__e2e__/sidebar.spec.ts`, `__e2e__/gantt-chart.spec.ts`, `__e2e__/persistence.spec.ts`）で追跡可能であること
- 仕様差分が出る場合は `docs/requirements/functional.md` と `docs/features/*` を同一変更で更新すること

### Assumptions

- 対象利用者は、複数製品のライフサイクル確認を日常的に行う担当者である
- 外部データは公開 API が提供する製品一覧と製品詳細を正とする
- 将来機能（CSV取り込みなど）は本仕様の対象外とし、現行実装済み機能のみを記述対象とする

### Key Entities *(include if feature involves data)*

- **Product**: 可視化対象となる製品単位。名前と複数バージョンを持つ
- **Product Version**: 製品のサイクル情報。リリース日、サポート期限、EOL 情報を持つ
- **Selection State**: 利用者が選択した製品・バージョンの集合。再訪時復元の対象
- **Timeline Item**: 可視化表示に使う 1 行分の情報。製品名、バージョン、期間、状態を含む

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 初回利用者の 95% 以上が、3 分以内に 1 つ以上の製品バージョンを選択して可視化できる
- **SC-002**: 検索入力後、利用者は 5 秒以内に目的製品を一覧から特定できる
- **SC-003**: 再読み込み後、直前に選択した項目の 100% が復元される
- **SC-004**: 取得失敗時でも、利用者は他製品の選択と可視化操作を継続できる
