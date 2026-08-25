# 記事を追加する

SIGINT 公式サイトの活動記録・技術ブログは `content/` 以下の MDX ファイルを
PRで追加するだけで公開できます。CMSやログインは不要です。

## 手順

1. リポジトリを clone し、依存関係をインストールする

   ```bash
   git clone <このリポジトリのURL>
   cd sigint
   corepack enable
   corepack prepare pnpm@9.15.9 --activate
   pnpm install
   ```

2. `content/activities/`（活動記録）または `content/blog/`（技術ブログ）に
   `*.mdx` ファイルを追加する。ファイル名（拡張子を除く）がそのままURLの
   スラッグになる。日本語ファイル名は使わず、`kebab-case`（例:
   `vlan-benkyoukai-2026.mdx`）にすること。

3. frontmatter を書く。スキーマは `lib/content/types.ts` の
   `frontmatterSchema` が正:

   ```mdx
   ---
   title: "記事タイトル"
   date: "2026-08-25"
   summary: "一覧カードに表示される要約（1〜2文）"
   tags: ["VLAN", "初心者向け"]
   author: "自分の名前"
   draft: false
   ---

   本文はここに Markdown / MDX で書く。
   ```

   | フィールド | 必須 | 説明 |
   |---|---|---|
   | `title` | ○ | 記事タイトル |
   | `date` | ○ | `YYYY-MM-DD` 形式 |
   | `summary` | ○ | 一覧カード・OGP用の要約 |
   | `tags` | - | 省略時は `[]`。一覧のタグ絞り込みに使われる |
   | `author` | - | 省略時は `TODO(sigint): 執筆者名` になる |
   | `draft` | - | `true` にすると本番ビルドで一覧・詳細から除外される（下書き用） |
   | `coverImage` | - | 省略可 |

4. **確定していない事実（活動日・機材名・AS番号・連絡先など）は創作せず、
   本文に `TODO(sigint): 確認中` のように残す。** 既存記事も同じ方針で
   書かれている。

5. ローカルで確認する

   ```bash
   pnpm dev
   ```

   `http://localhost:3000/activities` または `/blog` の一覧、および
   `/activities/<スラッグ>` の詳細ページで表示を確認する。

6. コミットしてPRを出す

   ```bash
   git add content/activities/<ファイル名>.mdx
   git commit -m "feat(content): add <記事タイトル>"
   ```

## 担当ディレクトリについて

このリポジトリは複数の担当領域に分かれています（詳細は
[`docs/SPEC.md`](./SPEC.md) の「エージェント間の担当境界」を参照）。
記事追加は `content/` のみで完結するため、他のディレクトリ
（`app/`, `lib/pwa/`, `components/ui/` など）を変更する必要はありません。

## 既存記事の修正

既存の `.mdx` ファイルを直接編集して構いません。日付を変更した場合、
一覧の並び順（新しい順）に影響します。
