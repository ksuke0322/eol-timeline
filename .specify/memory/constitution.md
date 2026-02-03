<!--
Sync Impact Report
- Version change: 0.0.0 (template) -> 1.0.0
- Modified principles:
  - PRINCIPLE_1_NAME -> I. Documentation Traceability
  - PRINCIPLE_2_NAME -> II. Stack & Structure Consistency
  - PRINCIPLE_3_NAME -> III. Test Evidence First (NON-NEGOTIABLE)
  - PRINCIPLE_4_NAME -> IV. Quality Gate Compliance
  - PRINCIPLE_5_NAME -> V. Dependency & Runtime Discipline
- Added sections:
  - Operational Constraints
  - Delivery Workflow & Quality Gates
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ⚠ pending: .specify/templates/commands/*.md (directory not present in repository)
  - ✅ updated: docs/README.md
- Follow-up TODOs:
  - None
-->
# EOL Timeline Constitution

## Core Principles

### I. Documentation Traceability
すべての仕様変更・UI 挙動変更・依存更新は、関連する `docs/` を同一変更で MUST 更新し、
仕様 ID（例: `FR-SIDEBAR-001`）を仕様・テスト・実装の少なくとも 2 箇所に MUST 紐付ける。
Rationale: 変更の根拠と影響範囲を追跡可能にし、運用時の判断コストを下げるため。

### II. Stack & Structure Consistency
実装は TypeScript + React Router + Vite + Tailwind の既存構成に MUST 準拠し、
ソース配置は `app/routes`・`app/components/ui`・`app/hooks`・`app/lib` の責務分離を MUST 維持する。
新規技術導入や責務境界の変更は、計画書で影響と代替案を MUST 明示する。
Rationale: 一貫した構造を維持し、保守性とレビュー速度を担保するため。

### III. Test Evidence First (NON-NEGOTIABLE)
機能変更には影響範囲に応じたテスト証跡を MUST 追加する。
`app/**/__tests__`（Unit/Component）、`__e2e__/`（E2E）、`app/**/__stories__/`（Storybook）のうち
該当する層を選び、少なくとも 1 つの独立検証可能なシナリオを MUST 定義する。
仕様 ID は `describe/it` 名またはコメントに MUST 記載する。
Rationale: 回帰を防ぎ、仕様との対応関係を自動・手動双方で検証可能にするため。

### IV. Quality Gate Compliance
マージ候補の変更は `pnpm lint`、`pnpm tsc`、`pnpm test`、`pnpm build` を MUST 満たす。
UI/導線を変更する場合は `pnpm test-storybook` と `pnpm test:e2e` を SHOULD 実施し、
未実施時は理由と代替確認手段を PR に MUST 記録する。
Rationale: CI と同等の品質ゲートを開発時点で満たし、統合時の失敗を最小化するため。

### V. Dependency & Runtime Discipline
Node `22.12.0` と pnpm `9.15.9` の `engines` を MUST 準拠し、依存更新では
Renovate PR を優先して採用する。手動更新時は変更理由・互換性・検証結果を MUST 記録する。
セキュリティ・運用挙動に影響する変更はドキュメント更新と合わせて MUST 提出する。
Rationale: 実行環境の再現性を維持し、依存更新のリスクを管理可能にするため。

## Operational Constraints

- コミットメッセージは Conventional Commits 形式を MUST 基本とする。
- ドキュメント Markdown の冒頭には最終更新日を MUST 記載する。
- 仕様・UI 挙動に変更がある PR は、関連 Issue と影響範囲を MUST 明記する。
- 命名規約は `PascalCase`（コンポーネント）・`useXxx`（フック）・`*.test.ts(x)`・`*.spec.ts` を MUST 維持する。

## Delivery Workflow & Quality Gates

1. 仕様策定時に、対象ユーザーストーリーへ仕様 ID を付与し、独立テスト条件を定義する。
2. 実装計画時に Constitution Check を実施し、原則違反がある場合は複雑性トラッキングへ記録する。
3. 実装時に、該当する Unit/Component/E2E/Storybook の証跡を追加し、PR に実行結果を記載する。
4. レビュー時に、コード・テスト・ドキュメント間のトレーサビリティを確認する。
5. マージ前に必須品質ゲートを再確認し、未達や例外は承認者合意付きで明示する。

## Governance

- 本憲章はリポジトリ内の運用規約に優先し、矛盾時は本憲章を正とする。
- 改訂提案は PR で行い、変更理由・影響範囲・移行手順を MUST 記載する。
- バージョニング方針は SemVer を採用し、
  - MAJOR: 原則の削除・再定義など後方互換性を壊す変更
  - MINOR: 原則/セクション追加、または実務上の義務を実質拡張する変更
  - PATCH: 意味を変えない明確化・表現修正・誤記修正
- コンプライアンスレビューは各 PR で MUST 実施し、少なくとも 1 名のレビュー承認時に
  原則適合を確認する。

**Version**: 1.0.0 | **Ratified**: 2026-02-03 | **Last Amended**: 2026-02-03
