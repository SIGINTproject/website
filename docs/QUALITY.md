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

**43件中43件成功。**

| テストファイル | 結果 |
|---|---|
| `smoke.spec.ts`（主要7ページ・console エラー0件・モバイルドロワー） | 全件成功 |
| `accessibility.spec.ts`（axe-core, critical/serious 0件） | 全件成功 |
| `visual.spec.ts`（375/768/1440 スクリーンショット） | 全件成功 |
| `pwa.spec.ts`（オフライン表示・オフラインフォールバック・SW更新通知・manifest） | 全件成功 |
| `content-list.spec.ts`（無限スクロール・タグ絞り込み・状態復元） | 全件成功 |

`content-list.spec.ts` の「27件フィクスチャが必要」という当初のテストは
想定が誤りだった（実データでは最頻出タグでも2件しかなく、そもそも
ページング閾値の9件にすら届かない）。捏造データで水増しする代わりに、
実データ量で検証できるようテストを「タグ絞り込みの復元」と「読込件数・
スクロール位置の復元」の2本に分割して書き直したところ、**これまで一度も
実行されたことのなかった経路で本物のバグが2件見つかった**（後述）。

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
7. **無限スクロールの状態復元が2ページ目以降で機能していなかった**
   （`hooks/use-infinite-content.ts`）: ブラウザの戻る/進むは常にNext.js
   のクライアントキャッシュを再利用してスクロール位置を保つ仕様のため
   （`staleTimes` の対象外。`node_modules/next/dist/docs` で確認済み）、
   `history.replaceState` でURLだけ書き換えても、戻った際にNextが古い
   （1ページ目の）レンダー結果を再利用してしまい、`initialData` が実際の
   URLと食い違う。加えて、独自に `history.state` へ埋め込んでいた
   `entryId` による復元判定も、Next Router自身が管理する `history.state`
   と競合し不安定だった。**修正**: `initialData` の代わりに
   `window.location.search` から実際のページ番号を読むよう変更し、
   `entryId`/`history.state` によるマッチングを廃止。
8. **上記7の副作用として、復元前の未完了マウントが `sessionStorage` を
   ページ1の状態で上書きしてしまうことがあった**: アンマウント時に
   無条件で `save()` を呼んでいたため、React Strict Mode の二重実行や
   その他の再マウントで、まだ復元が終わっていないインスタンスの
   クリーンアップが直前の正しい保存状態を消していた。**修正**: 復元
   完了を示す ref を追加し、未完了のマウントは保存をスキップするよう
   にした。さらに、Next.jsのクライアント遷移がアンマウント前に
   スクロール位置を0にリセットするため、`window.scrollY` を
   アンマウント時に読んでも既に0になっていた問題も判明。`pointerdown`/
   `keydown`（Enter/Space）でリンク遷移が始まる直前に保存するよう変更した。
9. **状態復元E2Eテスト自体に競合状態があった（テスト側）**: 記事へ
   クリック遷移した直後、その`pushState`が実際に反映されるのを待たずに
   `page.goBack()` を呼んでいたため、タグ絞り込みページを飛び越えて
   1つ手前の履歴に戻ってしまうことがあった。遷移先URLを待ってから
   `goBack()` するよう修正。

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
- [x] 一覧の絞り込み・件数・スクロール位置が「戻る」で復元される（複数ページ読込後の状態でも確認済み。§2の不具合7・8を参照）
- [x] URL を共有すると同じ絞り込み状態で開ける
- [x] Intersection Observer による追加読み込み（JS 無効でも1ページ目は読める）
- [x] ホーム画面に追加でき、スタンドアロン表示になる（manifest要件を充足。実機/実ブラウザでのインストールは未検証）
- [x] 375 / 768 / 1440 で破綻なし、キーボードのみで全機能に到達できる
- [x] Playwright 8項目がすべてグリーン、CI で自動実行 → 43/43（§2参照）。`https://github.com/chipchop7/sigint` に push 後、GitHub Actions（`.github/workflows/e2e.yml`）の実行を確認済み
- [x] 参考2サイトからの文章・画像・ロゴの流用がゼロ（目視レビュー済み。IIJ/convivial.ne.jpの固有表現・配色・ロゴの転用なし）

## 5. 残タスク一覧

| タスク | 担当 | 優先度 |
|---|---|---|
| Performance スコアの本番環境での再計測とフォント読み込み最適化 | Codex #2（`styles/`） | 中 |
| `/about` `/network` `/join` `/contact` の `TODO(sigint):` 一次情報の確認・記入 | 人間（部員） | 高 |
| 実機ブラウザ（Android Chrome / iOS Safari）でのホーム画面インストール実地確認 | 人間 | 中 |
