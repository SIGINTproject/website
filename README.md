# SIGINT 公式サイト

芝浦工業大学ネットワーク研究会 SIGINT の公式サイト。仕様の全体像は
[`docs/SPEC.md`](./docs/SPEC.md) を参照（作業前に必ず読むこと）。

## セットアップ

パッケージマネージャは pnpm を使用する。

```bash
corepack enable
corepack prepare pnpm@9 --activate   # Node 22+ が使える環境では最新版でよい
pnpm install
```

Node.js は LTS を想定。開発時に Node 20 系までしか使えない環境では、
pnpm は v9系を使うこと（pnpm 11系以降は Node 22+ が必須）。

## 開発

```bash
pnpm dev      # 開発サーバ (http://localhost:3000)
pnpm lint     # ESLint
pnpm build    # 本番ビルド
pnpm start    # ビルド成果物の起動確認
```

## ディレクトリ構成と担当

詳細は `docs/SPEC.md` の「エージェント間の担当境界」を参照。

| ディレクトリ | 役割 |
|---|---|
| `app/` | ルーティング・データ取得・文言（基盤） |
| `content/` | 記事本文（MDX、ファイルベース） |
| `lib/content/` | コンテンツ読み込み・ページングAPI |
| `lib/pwa/`, `hooks/`, `app/sw.ts`, `app/offline/` | PWA / Service Worker / 無限スクロール |
| `styles/`, `components/ui/`, `tests/e2e/` | デザインシステム / Playwright |
| `docs/` | 仕様・受け入れ条件・品質レポート |

## 記事の追加方法

`content/activities/` または `content/blog/` に `*.mdx` ファイルを追加する。
frontmatter のスキーマは `lib/content/types.ts` の `frontmatterSchema` を参照。

```mdx
---
title: "記事タイトル"
date: "2026-08-25"
summary: "一覧カードに表示される要約"
tags: ["VLAN", "初心者向け"]
author: "氏名"
draft: false
---

本文はここに Markdown / MDX で書く。
```

ファイル名（拡張子を除く）がそのままURLのスラッグになる。日本語は使わず
`kebab-case` を推奨。
