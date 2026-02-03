# Research: 現行機能 As-Is 仕様化

## Decision 1: キャッシュ TTL を一覧 1 日 / 詳細 1 週間とする
- Rationale: 既存仕様（FR-DATA / runtime-behavior）と実装が一致しており、一覧の鮮度と詳細再取得コストのバランスが取れる。
- Alternatives considered:
  - すべて 1 日: 詳細再取得が増え体感性能が悪化しやすい
  - すべて 1 週間: 一覧鮮度が下がる

## Decision 2: 期限切れ再取得失敗時は直近キャッシュを暫定表示する
- Rationale: 利用者の確認作業を止めないことが運用価値に直結するため。
- Alternatives considered:
  - 失敗時に空表示: 監視業務が中断される
  - 成功まで待機: 失敗時の回復性が低い

## Decision 3: キーボード操作必須範囲を検索・選択・ソート・時間軸切替とする
- Rationale: 主要業務フローを入力デバイス非依存で完遂でき、受け入れテストが明確になる。
- Alternatives considered:
  - 検索のみ対応: 実運用のアクセシビリティ要件を満たしにくい
  - 明記しない: テスト可能性が下がる

## Decision 4: API 契約は外部依存の read-only 2 エンドポイントを基準化する
- Rationale: 現行実装は `all.json` と `<product>.json` 読み取りのみを利用している。
- Alternatives considered:
  - アプリ内 API を新設: as-is から逸脱
  - 契約を未定義: テスト境界が曖昧

## Decision 5: データモデルは Product / ProductVersion / SelectionState / TimelineItem を正規エンティティとする
- Rationale: 既存コード（hooks/lib/components）と docs の要件 ID に対応しやすい。
- Alternatives considered:
  - UI 単位のモデル分割のみ: 仕様トレーサビリティが低下
  - 単一巨大モデル: 検証粒度が粗くなる

## Clarification Resolution

Technical Context に `NEEDS CLARIFICATION` は存在しない。上記決定により設計前提を固定した。
