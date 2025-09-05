# EOL Timeline

## システム構成

```mermaid
flowchart LR
  subgraph Client["ブラウザ（利用者）"]
    U[ユーザー]
  end

  subgraph CF["Cloudflare"]
    DNS[DNS / TLS / HTTP/3]
    CDN[Pages & CDN<br/>eol-timeline.dev]
    WA[Web Analytics<br/>beacon.min.js]
  end

  EOL[endoflife.date API<br/>/api/all.json]
  GSC[Googlebot / Search Console]

  %% 結線
  U -->|HTTPS GET /| CDN
  CDN -->|HTML/CSS/JS/Fonts| U
  U -->|XHR/Fetch: /api/*| EOL
  U -->|RUM Beacon| WA

  GSC -->|クロール| CDN

  %% 内部配線
  DNS -. 監視/運用 .- CDN
```

## パイプライン構成

```mermaid
flowchart TB
  Dev[Developer/Admin] -->|push/PR| GH[(GitHub Repo)]
  Renovate[renovate-bot] -->|依存更新PR| GH


subgraph PR["PRの場合"]
  PR_CI[GitHub Actions: Build/Test/Lint/etc.]
  Reviews[レビュワー]
  Merge

  PR_CI -->|結果| PR_CI_Status_Check[結果チェック]
  Reviews -->|最低一人のApprove| Merge
  PR_CI_Status_Check -->|成功| Merge
end

subgraph Main["mainマージの場合"]
  CI[GitHub Actions: Build/Test/Lint/etc.]

  CI -->|結果| Status_Check[結果チェック]
  Status_Check -->|成功| Deploy[デプロイ]
end

GH -->PR_CI
GH -->Reviews
Merge --> GH
GH --> CI
```
