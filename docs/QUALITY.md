# 品質レポート（統合フェーズ）

`feat/pwa` と `feat/design` を `main` に統合した後の検証結果。計測日: 2026-08-25。

## 1. ビルド・型検査・Lint

| チェック | 結果 |
|---|---|
| `pnpm lint` | 成功 |
| `tsc --noEmit` | 成功 |
| `pnpm build`（`next build --webpack`） | 成功。全ページ生成、`/sw.js` バンドル済み |

`@serwist/next` が `next.config.ts` に webpack 設定を注入するため、Next.js 16 の
既定バンドラである Turbopack とは非互換（`@serwist/next` は Turbopack を
公式サポートしていない）。`dev` / `build` スクリプトおよび Playwright の
ローカル起動コマンドに `--webpack` を明示することで解決した。

## 2. Playwright E2E

`CI=1 pnpm test:e2e`（Chromium、モバイル/タブレット/デスクトップ含む）

**42件中41件成功。**

| テストファイル | 結果 |
|---|---|
| `smoke.spec.ts`（主要7ページ・console エラー0件・モバイルドロワー） | 全件成功 |
| `accessibility.spec.ts`（axe-core, critical/serious 0件） | 全件成功 |
| `visual.spec.ts`（375/768/1440 スクリーンショット） | 全件成功 |
| `pwa.spec.ts`（オフライン表示・オフラインフォールバック・SW更新通知・manifest） | 全件成功 |
| `content-list.spec.ts`（無限スクロール） | 1/2件成功 |

失敗1件: 「タグ・読込件数・スクロール位置をブラウザバックで復元する」
（`content-list.spec.ts`）。状態復元の検証には同一タグで27件（3ページ分）の
記事が必要だが、現在のダミーコンテンツは最頻出タグでも27件に届かない
（TDDとして意図的に書かれたテストで、design ワークストリームも当初から
把握済み）。**原因**: フィクスチャ不足。**対応**: `content/activities/` に
同一タグを持つ記事を追加するか、テスト用の閾値を実データ量に合わせて
調整する（担当: Claude Code、`content/` 所有者）。

### 統合フェーズで見つかり、修正した不具合

マージ前は各ワークストリームが自分のブランチ内でのみテストしており、
統合後に初めてPlaywrightをフルスイートで通した結果、以下の実装バグが
見つかった（担当境界をまたぐ問題のため統合フェーズで修正）。

1. **Service Worker が一度も登録されていなかった**: `@serwist/next` の
   `<SerwistProvider>` がどこにもマウントされておらず、`/sw.js` は
   ビルドされるが `navigator.serviceWorker.register()` が呼ばれない状態
   だった。`app/layout.tsx` に `lib/pwa/serwist-provider.tsx` を追加して解決。
2. **更新通知バナーの契約不一致**: 実装は `data-testid="pwa-update-notice"`、
   テストは `"sw-update-banner"` を期待しており、かつテストが送る
   `SW_UPDATE_AVAILABLE` メッセージを実装側が購読していなかった。
   `lib/pwa/service-worker-update.tsx` を `useSerwist()` ベースに書き直し、
   実際の `waiting` イベントとテスト用メッセージの両方に対応。
3. **オフラインフォールバックが `net::ERR_FAILED` になることがあった**:
   Serwist の `fallbacks` オプションが内部で使う `PrecacheFallbackPlugin` が
   `/offline` の解決に失敗する場合があった（発生条件は特定できず）。
   `serwist.setCatchHandler()` によるグローバルなフォールバックを追加し、
   確実に `/offline` を返すようにした。
4. **`page.waitForFunction` の非同期述語バグ（テスト側）**: 非同期関数を
   渡すと、解決前の Promise オブジェクト自体が truthy と判定され即座に
   resolve してしまう。`expect.poll` に置き換えて修正。
5. **オフラインフォールバックのURLアサーションが誤り（テスト側）**:
   Service Worker のフォールバックはレスポンスの内容だけを差し替え、
   アドレスバーのURLは変化しない。`toHaveURL(/offline/)` ではなく
   フォールバックページの `data-testid` を確認するよう修正。
6. **manifest アイコンテストが `data:` URI を HTTP フェッチしようとしていた**:
   PWAのアイコンは（実画像アセットを用意していないため）インラインSVGの
   `data:` URIで実装されている。テストが `data:` URIかどうかで分岐するよう修正。

## 3. Lighthouse（モバイル・シミュレートスロットリング）

このコンテナ環境には Chrome が無いため、Playwright 同梱の Chromium を
`lighthouse` CLI から利用して計測した。**計測環境が本番想定（Cloudflare
Pages の CDN 配信）と大きく異なるサンドボックスであるため、絶対値は
参考値**として扱うこと。

| ページ | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 74 | 100 | 100 | 100 |
| `/activities` | 73 | 100 | 100 | 100 |

Accessibility / Best Practices / SEO はいずれも満点。Performance が
本番目標（一般に90+が目安）に届いていない。

**原因の仮説**: LCP が 13〜14秒と非常に悪い。ネットワークログを見ると、
`BIZ UDPGothic`（和文見出し/本文フォント）が文字範囲ごとに100個以上の
`.woff2` サブセットファイルへ分割されており、初期表示に必要なグリフの
取得に多数のリクエストが連鎖している可能性が高い（このサンドボックスは
ネットワーク/CPUが制約されているため、実環境より悪化して見えている
可能性もある）。

**対応案**（担当: Codex #2 / デザインワークストリーム、`styles/` 所有者）:
- 本番相当のネットワーク条件（Cloudflare Pages 上）で再計測し、
  サンドボックス由来の悪化分を切り分ける
- 見出し用フォントの `preload` / `font-display` 設定を見直す
- 和文フォントのウェイト数を絞る（現状 400/700 の2ウェイト）、または
  `next/font` のサブセット粒度を調整する

### PWAインストール可否

Lighthouse 13系ではPWAカテゴリ（インストール可否バッジ）自体が廃止され、
CLIでは計測できない。代わりに Playwright E2E（`pwa.spec.ts`）で
インストール可否の実質条件を直接検証済み:

- [x] manifest が取得でき、`name` / `short_name` / `start_url` / `display` /
      `icons` を満たす
- [x] Service Worker が登録・`activated` になり、ページを `controller` する
- [x] オフラインで訪問済みページが再表示される
- [x] オフラインで未訪問ページが `/offline` にフォールバックする

## 4. 完了条件チェックリスト（`docs/SPEC.md` §10 を実測で更新）

- [x] 初回表示は事前生成HTML、以降の遷移はクライアントサイドで即時
- [x] 一度見たページが機内モード（オフライン）で開ける
- [x] 未訪問ページはオフライン時に専用画面（`/offline`）へ落ちる
- [x] 一覧の絞り込み・件数・スクロール位置が「戻る」で復元される（無限スクロールで9件読み込んだ範囲では確認済み。27件超の状態復元は§2の既知の失敗を参照）
- [x] URL を共有すると同じ絞り込み状態で開ける
- [x] Intersection Observer による追加読み込み（JS 無効でも1ページ目は読める）
- [x] ホーム画面に追加でき、スタンドアロン表示になる（manifest要件を充足。実機/実ブラウザでのインストールは未検証）
- [x] 375 / 768 / 1440 で破綻なし、キーボードのみで全機能に到達できる
- [ ] Playwright 8項目がすべてグリーン、CI で自動実行 → 41/42（§2参照）。GitHub Actions（`.github/workflows/e2e.yml`）は追加済みだが実行未確認（要 push 後の確認）
- [x] 参考2サイトからの文章・画像・ロゴの流用がゼロ（目視レビュー済み。IIJ/convivial.ne.jpの固有表現・配色・ロゴの転用なし）

## 5. 残タスク一覧

| タスク | 担当 | 優先度 |
|---|---|---|
| 状態復元テスト用に同一タグ27件以上のフィクスチャを追加、またはテスト閾値の見直し | Claude Code（`content/`） | 中 |
| Performance スコアの本番環境での再計測とフォント読み込み最適化 | Codex #2（`styles/`） | 中 |
| GitHub Actions（`e2e.yml`）の実行確認（push後） | 統括 | 高 |
| `/about` `/network` `/join` `/contact` の `TODO(sigint):` 一次情報の確認・記入 | 人間（部員） | 高 |
| 実機ブラウザ（Android Chrome / iOS Safari）でのホーム画面インストール実地確認 | 人間 | 中 |
