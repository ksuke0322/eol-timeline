---

description: "Task list template for feature implementation"
---

# Tasks: 現行機能 As-Is 仕様化

**Input**: Design documents from `/specs/001-document-current-spec/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 変更には影響範囲に応じたテストタスクを MUST 含める（Unit/Component/E2E/Storybook の該当層）。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Application**: `app/routes/`, `app/components/ui/`, `app/hooks/`, `app/lib/`
- **Unit/Component Tests**: `app/**/__tests__/`
- **Storybook**: `app/**/__stories__/`
- **E2E**: `__e2e__/`
- **Docs**: `docs/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: As-Is 仕様化に必要な検証基盤と追跡情報を整理する

- [ ] T001 仕様トレーサビリティ表を `specs/001-document-current-spec/research.md` に追記する
- [ ] T002 キャッシュ・選択状態のテストフィクスチャを `test/setup.ts` と `app/routes/__tests__/home.test.tsx` で整備する
- [ ] T003 [P] 契約ファイルの妥当性確認メモを `specs/001-document-current-spec/contracts/as-is-api.openapi.yaml` と `specs/001-document-current-spec/contracts/selection-state.schema.json` に反映する

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 全ユーザーストーリー共通の前提ロジックを確定する

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 TTL/失敗時フォールバックの共通定数を `app/lib/types.ts` に定義する
- [ ] T005 [P] ProductVersion から TimelineItem への変換ルールを `app/lib/utils.ts` で明文化する
- [ ] T006 [P] 選択状態の共通データ構造と永続化ガード基盤を `app/hooks/useSelectedProducts.ts` に実装する
- [ ] T007 詳細データの TTL 判定と再取得失敗フォールバックの共通処理を `app/hooks/useProductDetails.ts` に実装する
- [ ] T008 [P] アプリ全体の主要キーボード操作導線を `app/routes/home.tsx` と `app/components/ui/productSidebar.tsx` で統一する
- [ ] T009 共有エラーメッセージと空状態表示を `app/components/ui/productSidebar.tsx` と `app/components/ui/ganttChart.tsx` で統一する

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 製品を選んで可視化する (Priority: P1) 🎯 MVP

**Goal**: 選択した製品バージョンがガントへ確実に反映される

**Independent Test**: `__e2e__/initial-display.spec.ts` で選択追加・解除がガント表示へ反映されることを確認する

### Tests for User Story 1 ⚠️

- [ ] T010 [P] [US1] 選択→タスク生成の単体テスト（FR-GANTT-001）を `app/lib/__tests__/utils.test.ts` に追加する
- [ ] T011 [P] [US1] 画面統合テスト（FR-DATA-001, FR-GANTT-001）を `app/routes/__tests__/home.test.tsx` に追加する
- [ ] T012 [US1] E2E 受け入れテスト（FR-DATA-001, FR-GANTT-001）を `__e2e__/initial-display.spec.ts` に追加・更新する

### Implementation for User Story 1

- [ ] T013 [P] [US1] ガントタスク生成と色割当の不変条件を `app/lib/utils.ts` に実装する
- [ ] T014 [P] [US1] 選択済みバージョンの表示マッピングを `app/routes/home.tsx` に実装する
- [ ] T015 [US1] バージョン選択UIとガント反映の連携を `app/components/ui/productSidebar.tsx` と `app/components/ui/ganttChart.tsx` に実装する
- [ ] T016 [US1] US1 の仕様ID追跡コメントを `docs/requirements/functional.md` に追記する

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - サイドバーで素早く対象を絞り込む (Priority: P2)

**Goal**: 検索・親子選択・上位表示・キーボード操作を一貫動作させる

**Independent Test**: `__e2e__/sidebar.spec.ts` で検索、親子連動、選択済み上位表示、キーボード操作を確認する

### Tests for User Story 2 ⚠️

- [ ] T017 [P] [US2] サイドバー検索/並び順のコンポーネントテスト（FR-SIDEBAR-004, FR-SIDEBAR-005）を `app/components/ui/__tests__/productSidebar.test.tsx` に追加する
- [ ] T018 [P] [US2] 親子選択ロジックのフックテスト（FR-SIDEBAR-001）を `app/hooks/__tests__/useSelectedProducts.test.ts` に追加する
- [ ] T019 [US2] E2E 受け入れテスト（FR-SIDEBAR-001, FR-SIDEBAR-004, FR-SIDEBAR-005）を `__e2e__/sidebar.spec.ts` に追加・更新する

### Implementation for User Story 2

- [ ] T020 [P] [US2] 検索デバウンスとフィルタ条件を `app/components/ui/searchInputWithDebounce.tsx` に実装する
- [ ] T021 [P] [US2] 親子チェックボックス連動ルール（US2要件適用）を `app/hooks/useSelectedProducts.ts` に実装する
- [ ] T022 [US2] 選択済み優先ソートと表示順制御を `app/components/ui/productSidebar.tsx` に実装する
- [ ] T023 [US2] キーボード操作（検索・選択・ソート・時間軸切替）を `app/routes/home.tsx` と `app/components/ui/productSidebar.tsx` に実装する
- [ ] T024 [US2] US2 の仕様ID追跡コメントを `docs/features/sidebar-selection.md` に追記する

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 状態を維持して継続利用する (Priority: P3)

**Goal**: 再訪・再読込時の状態復元と取得失敗時の回復性を担保する

**Independent Test**: `__e2e__/persistence.spec.ts` で再読込復元、`__e2e__/initial-display.spec.ts` で取得失敗時継続利用を確認する

### Tests for User Story 3 ⚠️

- [ ] T025 [P] [US3] 詳細取得TTLと失敗時挙動のフックテスト（FR-DATA-003, FR-DATA-005）を `app/hooks/__tests__/useProductDetails.test.ts` に追加する
- [ ] T026 [P] [US3] 永続化復元のフックテスト（FR-PERSISTENCE-001）を `app/hooks/__tests__/useSelectedProducts.test.ts` に追加する
- [ ] T027 [US3] E2E 受け入れテスト（FR-PERSISTENCE-001）を `__e2e__/persistence.spec.ts` に追加・更新する

### Implementation for User Story 3

- [ ] T028 [P] [US3] 一覧1日/詳細1週間TTLのUS3受け入れ条件向け調整を `app/hooks/useProductDetails.ts` に実装する
- [ ] T029 [P] [US3] 期限切れ再取得失敗時の暫定表示メッセージと再試行導線を `app/hooks/useProductDetails.ts` と `app/components/ui/productSidebar.tsx` に実装する
- [ ] T030 [US3] localStorage 保存・復元・同期イベント処理を `app/hooks/useSelectedProducts.ts` に実装する
- [ ] T031 [US3] US3 の仕様ID追跡コメントを `docs/architecture/runtime-behavior.md` と `docs/requirements/functional.md` に追記する

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 全体品質とドキュメント整合の最終仕上げ

- [ ] T032 [P] ドキュメント整合（要件・機能・アーキ）を `docs/requirements/functional.md` `docs/features/gantt-visualization.md` `docs/features/sidebar-selection.md` で更新する
- [ ] T033 [P] Storybook 回帰確認を `app/routes/__stories__/home.stories.tsx` と `app/components/ui/__stories__/productSidebar.stories.tsx` で更新する
- [ ] T034 quality gate 実行結果を `specs/001-document-current-spec/quickstart.md` に記録する
- [ ] T035 `pnpm lint` `pnpm tsc` `pnpm test` `pnpm build` `pnpm test:e2e` を実行して結果を `specs/001-document-current-spec/quickstart.md` に追記する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - 実施順は P1 → P2 → P3
  - ただし US2/US3 のテスト準備は並列実施可能
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - MVP
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - US1 の UI/状態管理を利用
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - US1/US2 の選択状態を前提

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Hooks/logic before UI wiring
- UI wiring before docs traceability update
- Story complete before moving to next priority

### Parallel Opportunities

- T003, T005, T006, T008, T013, T014, T017, T018, T020, T021, T025, T026, T028, T029, T032, T033 can run in parallel
- E2E tasks (T012, T019, T027) are parallelizable only after their story implementation tasks complete

---

## Parallel Example: User Story 1

```bash
# Launch US1 tests together
Task: "T010 [US1] app/lib/__tests__/utils.test.ts"
Task: "T011 [US1] app/routes/__tests__/home.test.tsx"

# Launch US1 implementation together
Task: "T013 [US1] app/lib/utils.ts"
Task: "T014 [US1] app/routes/home.tsx"
```

## Parallel Example: User Story 2

```bash
# Launch US2 tests together
Task: "T017 [US2] app/components/ui/__tests__/productSidebar.test.tsx"
Task: "T018 [US2] app/hooks/__tests__/useSelectedProducts.test.ts"

# Launch US2 implementation together
Task: "T020 [US2] app/components/ui/searchInputWithDebounce.tsx"
Task: "T021 [US2] app/hooks/useSelectedProducts.ts"
```

## Parallel Example: User Story 3

```bash
# Launch US3 tests together
Task: "T025 [US3] app/hooks/__tests__/useProductDetails.test.ts"
Task: "T026 [US3] app/hooks/__tests__/useSelectedProducts.test.ts"

# Launch US3 implementation together
Task: "T028 [US3] app/hooks/useProductDetails.ts"
Task: "T029 [US3] app/components/ui/productSidebar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate with `__e2e__/initial-display.spec.ts`
5. Share MVP baseline

### Incremental Delivery

1. Setup + Foundational を完了
2. US1 を提供し、独立テストで確認
3. US2 を追加し、操作性要件を確認
4. US3 を追加し、復元/回復性を確認
5. Polish で docs と品質ゲートを締める

### Parallel Team Strategy

1. Developer A: `app/lib` / `app/routes`（US1中心）
2. Developer B: `app/components/ui` / `app/hooks`（US2中心）
3. Developer C: `app/hooks` / `__e2e__`（US3中心）

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Keep spec IDs in tests/docs for traceability
