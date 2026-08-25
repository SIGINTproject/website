import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6" data-testid="offline-page">
      <h1 className="text-2xl font-bold">オフラインです</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        一度開いたページは表示できますが、まだ取得していないページは圏外では開けません。通信できる場所で、もう一度お試しください。
      </p>
      <Link href="/" className="mt-8 inline-block rounded border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">
        トップページへ戻る
      </Link>
    </div>
  );
}
