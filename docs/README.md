# ドキュメント概要

本ディレクトリは本アプリケーションの公式ドキュメントを管理します。仕様変更時は必ず該当ドキュメントを更新し、PR テンプレートで確認する運用を前提とします。

## 目次

- requirements/
  - functional.md（機能要件）
  - non-functional.md（非機能要件）
- architecture/
  - system-overview.md（全体像・依存関係・データフロー）
  - runtime-behavior.md（実行時の挙動・キャッシュ・ソート）
- features/
  - sidebar-selection.md（サイドバーの選択・検索・並び替え）
  - gantt-visualization.md（ガント可視化・時間軸・色分け）
- testing/
  - strategy.md（テスト戦略と責務分担）

補助情報は Storybook（UI の一次情報）と E2E／単体テストを一次参照とします。

## 更新ガバナンス

- 責任者: ksuke_dev
- 更新契機: 仕様変更／UI 変更／依存アップデート／不具合修正で挙動が変わる場合
- 最終更新日の明記: 各 md の冒頭に記載（手動）
- トレーサビリティ: 仕様ごとに識別子（例: FR-SIDEBAR-001）を付与し、テスト名/コミットメッセージに含める
- 憲章準拠: `.specify/memory/constitution.md` の原則を最上位ルールとして適用

## UI ドキュメント方針

UI コンポーネントの props/バリアントは Storybook を一次情報とし、本ディレクトリからリンクで参照します。Markdown に重複記述しないことで陳腐化を防ぎます。
