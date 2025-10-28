import { EditorWorkspace } from '../components/editor/editor-workspace';
import { InsightPanel } from '../components/editor/insight-panel';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-10 px-6 pb-12 pt-14 lg:px-16">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Gaia Archive</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
          기억을 온전히 기록하고 온체인으로 연결하는 노트
        </h1>
        <p className="text-balance text-base leading-7 text-ink-muted md:text-lg">
          사진, 음성, 영상 그리고 생각의 결을 한 곳에서 엮어 추억을 NFT로 새기는 스튜디오입니다.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <EditorWorkspace />
        <InsightPanel />
      </section>
    </main>
  );
}
