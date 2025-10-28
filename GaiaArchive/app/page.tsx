import { MemoryEditor } from '@/components/editor/MemoryEditor';

export default function Page() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Gaia Archive Editor</h1>
        <p className="text-sm text-slate-500">
          추억을 텍스트, 이미지, 영상, 음성으로 담아 세상에 단 하나의 디지털 아카이브로 만들어보세요.
        </p>
      </header>
      <MemoryEditor />
    </section>
  );
}
