# Implementation Plan: 現行機能 As-Is 仕様化

**Branch**: `001-document-current-spec` | **Date**: 2026-02-03 | **Spec**: `/Users/sawairikeisuke/Documents/eol-timeline/specs/001-document-current-spec/spec.md`
**Input**: Feature specification from `/specs/001-document-current-spec/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

既存の EOL Timeline 実装を仕様・設計成果物へ逆展開し、現行動作と整合する
`research.md`、`data-model.md`、`contracts/`、`quickstart.md` を整備する。

## Technical Context

**Language/Version**: TypeScript 5.9, React 19, React Router 7（SPA）  
**Primary Dependencies**: Vite 7, Tailwind CSS 4, Radix UI, frappe-gantt  
**Storage**: localStorage（選択状態、一覧/詳細キャッシュ）  
**Testing**: Vitest + React Testing Library, Playwright, Storybook test-runner  
**Target Platform**: モダンブラウザ（SPA配信）
**Project Type**: 単一 Web フロントエンドアプリ  
**Performance Goals**: 一覧初期表示を高速化、ガント再描画は体感 1 フレーム内を目標  
**Constraints**: 一覧 1 日/詳細 1 週間の TTL、失敗時は継続利用可能、キーボード主要操作対応  
**Scale/Scope**: 複数製品・複数バージョンの EOL 監視利用を想定

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate

- [x] **Docs Traceability**: 既存要件 ID と E2E を plan/research/data-model/quickstart で相互参照
- [x] **Stack Consistency**: TypeScript + React Router + Vite + Tailwind の既存構成を維持
- [x] **Test Evidence**: Unit/Component/E2E/Storybook の該当テスト群を quickstart に明記
- [x] **Quality Gates**: `pnpm lint` `pnpm tsc` `pnpm test` `pnpm build` を検証手順に含める
- [x] **Dependency Discipline**: 新規依存追加なし。既存依存前提の as-is 仕様化

Gate Result: PASS（違反なし）

### Post-Design Gate (Re-check)

- [x] **Docs Traceability**: 生成成果物に仕様 ID 対応を明示
- [x] **Stack Consistency**: 設計・契約は既存実装範囲に限定
- [x] **Test Evidence**: quickstart に E2E/Unit 対応シナリオを反映
- [x] **Quality Gates**: 実行コマンドと期待結果を明記
- [x] **Dependency Discipline**: 外部依存は endoflife.date API のみと記述

Gate Result: PASS（違反なし）

## Project Structure

### Documentation (this feature)

```text
specs/001-document-current-spec/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── as-is-api.openapi.yaml
│   └── selection-state.schema.json
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── routes/
├── components/ui/
├── hooks/
└── lib/

__e2e__/

docs/
├── requirements/
└── features/
```

**Structure Decision**: 既存の単一フロントエンド構成を採用し、設計成果物のみ `specs/001-document-current-spec/` に追加する。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
