# SIGINT 公式サイト 仕様書

Claude Code 1 + Codex 2 が並走して実装するにあたっての共通仕様書。
**作業前に必ずこのドキュメントを読むこと。** 自分の担当範囲外のファイルは編集せず、
変更が必要な場合は担当エージェントに申し送ること。

`feat/pwa` と `feat/design` は `main` に統合済み。品質計測・既知の課題は
[`docs/QUALITY.md`](./QUALITY.md)、記事の追加方法は
[`docs/CONTRIBUTING.md`](./CONTRIBUTING.md) を参照。

## 1. サイトの目的（優先順）

1. 新入生・在学生への入部訴求（何をやっている団体か、初心者でも入れるかが即わかる）
2. 活動の継続的な記録・発信（活動記録 / 技術ブログ）
3. 他大学・企業・NOG コミュニティとの技術的な接点（対外的な信頼の獲得）

## 2. 団体情報（未確定の事実は本文に書かず `TODO(sigint):` を残すこと）

- 名称: ネットワーク研究会 SIGINT（芝浦工業大学）
- 活動: 実機を用いたネットワーク基礎カリキュラム、部室ネットワークの設計・運用
  （マルチVLAN / VyOS / デュアルWAN / SNMP監視 / NetBox によるIPAM・資産管理 /
  Asterisk による内線）、学内イベントの WiFi 支援、将来的な AS 運用とピアリング
- 想定読者: ネットワーク未経験の1年生 / 技術のわかる他大学・社会人 / 大学の関係者
- AS番号・顧問名・活動日・連絡先などの一次情報は未確定。該当ページに
  `TODO(sigint):` として明記済み。人間が確認して埋めること。

参考にしてよいのは https://www.convivial.ne.jp/ の情報構造（どんな情報を、
どの粒度で、どう並べているか）のみ。文章・画像・ロゴ・配色の流用は禁止。

## 3. サイトマップ・実装状況

| パス | 内容 | 実装状況 |
|---|---|---|
| `/` | トップ（ヒーロー、活動の3本柱、最新の活動記録3件、最新の技術ブログ3件） | 骨組み実装済み |
| `/about` | ミッション、活動内容、年間スケジュール、部室設備 | 骨組み実装済み（スケジュール・設備はTODO） |
| `/activities` | 活動記録一覧（タグ絞り込み・無限スクロール） | 実装済み |
| `/activities/[slug]` | 活動記録詳細（MDX） | 実装済み |
| `/blog` | 技術ブログ一覧（タグ絞り込み・無限スクロール） | 実装済み |
| `/blog/[slug]` | 技術ブログ詳細（MDX） | 実装済み |
| `/network` | 部室ネットワーク紹介 | 実装済み（構成図・機材・AS番号はTODO） |
| `/join` | 入部案内 | 実装済み（活動日・見学方法はTODO） |
| `/contact` | お問い合わせ（外部フォームに委譲予定） | 実装済み（フォームURL未確定） |
| `/offline` | オフラインフォールバック画面 | 実装済み |

## 4. 技術スタック

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- コンテンツは `content/**/*.mdx` のファイルベース（CMS なし）
- MDXのコンパイルは `next-mdx-remote/rsc`、frontmatterのパースは `gray-matter`、
  型検証は `zod`、読了時間の算出は `reading-time`
  （SPECには元々指定がなかったため、コンテンツ読み込み層の実装に伴い追加。
  いずれも `lib/content/` 内でのみ使用し、他ワークストリームへの影響はない）
- Service Worker は Serwist を想定（PWAワークストリームで導入）、
  静的出力 → Cloudflare Pages を想定
- パッケージマネージャは pnpm（Node 20 環境のため `pnpm@9` を使用。
  Node 22+ が使える環境では `packageManager` を最新に更新してよい）
- E2E は Playwright（デザイン/検証ワークストリームで導入）

## 5. データモデル（frontmatter定義）

`content/activities/*.mdx` と `content/blog/*.mdx` は共通のスキーマ。
実装は `lib/content/types.ts` の `frontmatterSchema`（zod）が正。

```ts
{
  title: string;       // 必須
  date: string;        // 必須, "YYYY-MM-DD"
  summary: string;     // 必須, 一覧カード・OGP用の要約
  tags: string[];      // 省略時 []
  author: string;      // 省略時 "TODO(sigint): 執筆者名"
  draft: boolean;      // 省略時 false。true の記事は本番ビルドで一覧・詳細から除外
  coverImage?: string; // 省略可
}
```

- スラッグはファイル名（拡張子除く）。日本語不可、`kebab-case` 推奨。
- `lib/content/index.ts` が読み込み・検証・キャッシュ・ページングを担当する
  唯一の窓口。ページコンポーネントやAPIルートは直接 `fs` や `gray-matter` を
  呼ばず、必ずこの層を経由すること。

## 6. コンテンツ読み込み層 `lib/content/`

- `getAllSlugs(collection)` — 静的パス生成用
- `getEntryBySlug(collection, slug)` — 詳細ページ用（見つからなければ `null`）
- `getAllTags(collection)` — タグ絞り込みUI用（件数付き、件数降順）
- `getContentPage({ collection, page, pageSize, tag })` — **一覧のページングAPI**。
  1ページ `PAGE_SIZE = 9` 件（`lib/content/types.ts` で定義）。
  サーバーコンポーネント（`/activities`, `/blog` の1ページ目・JS無効時の
  `?page=n` 遷移）と、`app/api/content/[collection]/route.ts`
  （クライアント側の無限スクロールが叩くJSON API）の両方が、
  この同じ関数を単一の情報源として使う。

```
GET /api/content/:collection?tag=<string>&page=<number>
→ { items, page, pageSize, totalItems, totalPages, hasNextPage, tag }
```

`items` の型は `ContentSummary`（本文を含まない一覧用の軽量な形）。

## 7. エージェント間の担当境界

| 領域 | 担当 | ディレクトリ |
|---|---|---|
| 統括 / 基盤・情報設計・コンテンツ層 | Claude Code | `app/`, `content/`, `lib/content/`, `docs/` |
| モダンWeb機能（SW / PWA / 無限スクロール / 状態復元） | Codex #1 | `lib/pwa/`, `hooks/`, `public/manifest.webmanifest`, `app/sw.ts`, `app/offline/` |
| デザインシステム + Playwright 検証 | Codex #2 | `styles/`, `components/ui/`, `tests/e2e/`, `playwright.config.ts` |

補足:

- `app/` はルーティングの骨組み・データ取得・文言の所有者は Claude Code だが、
  以下は例外的に他ワークストリームの成果物であり、対応する担当が作成・編集する:
  - `app/sw.ts`, `app/offline/**` … Codex #1
  - 各ページの見た目（クラス名・マークアップの装飾）と `app/_components/*` の
    スタイリング差し替え … Codex #2 が `components/ui/` のコンポーネントに
    置き換える形で行う（構造・data-testid・propsの契約は変えないこと）
- `app/_components/content-list.tsx` と `app/_components/content-detail.tsx` が
  一覧・詳細の共通ロジックを持つ。無限スクロールを実装する際は、この
  `ContentList` が返す `data-testid="content-list"` / `"content-card"` /
  `"load-more-link"` / `"pagination"` / `"tag-filter"` を起点に、
  IntersectionObserverで拡張するクライアントコンポーネントを
  `app/_components/` または `hooks/` 側に追加する形を想定している。
  既存のサーバーレンダリングによる1ページ目・`もっと見る`リンクは
  プログレッシブエンハンスメントの土台として残すこと（削除しない）。
- 担当外のファイルは編集せず、必要なら「◯◯を変えてほしい」と統括に上げる。
- コミットは小さく、`feat(pwa): ...` のような Conventional Commits で。

## 8. 技術要件（"モダンWeb" の定義）と実装ステータス

| 要件 | ステータス | 担当 |
|---|---|---|
| SPA的なクライアント遷移・初回プリレンダリング | 実装済み（Next.js App Router） | - |
| Service Worker によるオフライン表示 | 実装済み | Codex #1 |
| 表示状態の復元（タグ・ページ数はURL、スクロール位置・件数はsessionStorage） | 実装済み | Codex #1 |
| Intersection Observer による無限スクロール | 実装済み（JS無効時のページングも維持） | Codex #1 |
| PWA（manifest / インストール可能 / オフラインUI） | 実装済み。実機でのインストール確認は未実施（`docs/QUALITY.md`参照） | Codex #1 |
| レスポンシブ（375 / 768 / 1440） | 実装済み・Playwright visual regressionで検証済み | Codex #2 |
| UX（キーボード操作、フォーカス可視、reduced-motion、空/エラー/ローディング文言） | 実装済み・axe-coreで検証済み | Codex #2 |

### 実際にどう作ったか（各担当が実装後に追記する）

- **Codex #1（PWA/無限スクロール）:** `@serwist/next` の InjectManifest 構成で
  `app/sw.ts` とビルド成果物を `/sw.js` にまとめた。App Shell・静的成果物・
  `/offline` をプリキャッシュし、同一オリジンの画面遷移は
  stale-while-revalidate、画像は最大80件・30日間の cache-first とした。
  未取得ページのオフライン遷移は `/offline` にフォールバックする。
  `skipWaiting` は自動実行せず、待機中の Worker を検知した場合に限り
  「新しいバージョンがあります」の通知を出し、利用者が「再読み込み」を
  選んだ後で更新する。

  一覧は SSR の `ContentList` と通常の `?page=n` リンクを初期HTMLに残し、
  hydration 後に `useInfiniteContent` が `rootMargin: 600px` のセンチネルを監視する。
  APIから9件ずつ追加し、処理中の多重取得を ref で防止、unmount 時に observer と
  復元用 fetch を停止する。読み込み中は3件のスケルトン、完了時は
  「これで全部です。」を表示する。読み込みページ数はURLへ反映する。

  復元状態は collection・tag ごとに sessionStorage へページ数と scrollY を保存する。
  履歴エントリへ固有IDを付け、詳細ページから同じエントリへ「戻る」で復帰した場合のみ
  1ページ目から保存ページまでを再取得してスクロール位置を戻す。新規ナビゲーションの
  エントリIDは一致しないため保存状態を適用しない。E2E向けに sentinel、loading、error、
  update notice、offline page にも `data-testid` を付与した。
- **Codex #2（デザイン/Playwright）:** デザインコンセプト「静かな基盤 / Quiet
  Infrastructure」のもと、案B「Network Index」レイアウトとシグネチャ要素
  「VLAN Trunk Line」を採用。カラー・タイポグラフィ・余白のトークンを
  `styles/tokens.css` に集約し、`components/ui/`（Button, Card, Tag,
  Breadcrumb, Skeleton, EmptyState, Pagination, SiteHeader, SiteFooter,
  VlanTrunkLine ほか）に実装。SiteHeaderのモバイルドロワーは `<details>` で
  実装し、キーボード操作・フォーカスリング・`prefers-reduced-motion` に対応。
  Playwright E2E（`tests/e2e/`）で主要7ページのスモークテスト・axe-core
  によるアクセシビリティ検査・375/768/1440のvisual regression・無限スクロール
  検証・PWA検証（8項目）を実装し、GitHub Actions（`.github/workflows/e2e.yml`）
  に配線した。

## 9. ディレクトリ構成（現状）

```
app/
  layout.tsx              # ルートレイアウト（SerwistProvider, SiteHeader/Footer）
  sw.ts                    # Service Worker ソース（Codex #1）
  offline/page.tsx         # オフラインフォールバック画面（Codex #1）
  page.tsx                # トップページ
  about/page.tsx
  activities/page.tsx
  activities/[slug]/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  network/page.tsx
  join/page.tsx
  contact/page.tsx
  api/content/[collection]/route.ts   # 一覧のJSONページングAPI
  _components/
    content-list.tsx           # 一覧の共通UI（server component、タグ絞り込み）
    content-detail.tsx         # 詳細の共通UI（server component, MDXRemote）
    infinite-content-list.tsx  # 無限スクロール本体（client component, Codex #1構造 + Codex #2見た目）
content/
  activities/*.mdx         # 活動記録10本（ダミーコンテンツ）
  blog/*.mdx                # 技術ブログ10本（ダミーコンテンツ）
lib/
  content/
    types.ts               # frontmatterスキーマ・型定義
    index.ts                # 読み込み・検証・キャッシュ・ページング
  pwa/
    serwist-provider.tsx    # SW登録（@serwist/next の SerwistProvider）
    service-worker-update.tsx  # 更新通知バナー
hooks/
  use-infinite-content.ts   # 無限スクロール・状態復元フック
components/
  ui/                       # デザインシステム（Button, Card, Tag, SiteHeader ほか）
styles/
  tokens.css                # デザイントークン
  base.css
tests/
  e2e/                      # Playwright（smoke, accessibility, visual, content-list, pwa）
public/
  manifest.webmanifest
.github/
  workflows/e2e.yml         # CI（lint/型検査/build/Chromium E2E）
docs/
  SPEC.md                   # 本ドキュメント
  QUALITY.md                 # 統合フェーズの品質レポート
  CONTRIBUTING.md            # 記事の追加方法
```

## 10. 受け入れ条件

実測結果の詳細は [`docs/QUALITY.md`](./QUALITY.md) を参照。

- [x] 初回表示は事前生成HTML、以降の遷移はクライアントサイドで即時
- [x] 一度見たページが機内モード（オフライン）で開ける
- [x] 未訪問ページはオフライン時に専用画面（`/offline`）へ落ちる
- [x] 一覧の絞り込み・件数・スクロール位置が「戻る」で復元される
- [x] URL を共有すると同じ絞り込み状態で開ける（`?tag=&page=`）
- [x] Intersection Observer による追加読み込み（JS 無効でも1ページ目は読める）
- [x] ホーム画面に追加でき、スタンドアロン表示になる（manifest要件は充足。実機確認は未実施）
- [x] 375 / 768 / 1440 で破綻なし、キーボードのみで全機能に到達できる
- [ ] Playwright 8項目がすべてグリーン、CI で自動実行 → 41/42（残り1件は状態復元テスト用フィクスチャ不足）
- [x] 参考2サイトからの文章・画像・ロゴの流用がゼロ

## 11. 確認したいこと（人間の判断が必要）

- 団体の一次情報（AS番号の有無・活動日・部室の場所・顧問名・正式な連絡先）が
  未確定のため、該当ページに `TODO(sigint):` を残した。埋めるまで
  `/about`, `/network`, `/join`, `/contact` は情報として不完全な状態で公開される。
- お問い合わせフォームに使う外部サービス（Google フォーム等）が未確定。
- Node.js の実行環境が v20.12.0 のため、pnpm は v9系を使用している
  （最新の pnpm 11系は Node 22+ が必須で動かなかった）。`package.json` に
  `"packageManager": "pnpm@9.15.9"` を設定済み。Node 22+ のCI/デプロイ環境に
  移行する場合は見直すこと。
- `@serwist/next` が Next.js 16 既定の Turbopack と非互換のため、
  `dev` / `build` は `--webpack` を明示している（`docs/QUALITY.md` §1参照）。
  Serwist が Turbopack に対応した場合は削除を検討する。
- ダミーコンテンツ（活動記録・技術ブログ各10本）は無限スクロール検証のための
  架空の内容。実際の活動記録に差し替える、またはそのまま初期コンテンツとして
  残すかは要判断。
