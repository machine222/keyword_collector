'use client';

import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Youtube } from 'lucide-react';
import clsx from 'clsx';

const YOUTUBE_REGEX = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/i;

export function YoutubeEmbed({ editor }: { editor: Editor | null }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editor) return;
    const match = url.match(YOUTUBE_REGEX);
    if (!match) {
      setError('올바른 YouTube 링크를 입력해주세요.');
      return;
    }
    editor.commands.insertContent(
      `<iframe src="https://www.youtube-nocookie.com/embed/${match[1]}" class="w-full rounded-3xl bg-black aspect-video" allowfullscreen></iframe>`
    );
    setUrl('');
    setError(null);
  };

  return (
    <form
      className="flex flex-col gap-2 rounded-2xl border border-dashed border-ink/10 bg-white/60 px-4 py-3 text-sm"
      onSubmit={handleSubmit}
    >
      <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-ink-muted">
        <Youtube className="h-4 w-4" /> YouTube 링크 붙여 넣기
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={clsx(
            'flex-1 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-ink/50',
            error && 'border-rose-400 focus:border-rose-500'
          )}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://youtu.be/..."
          value={url}
        />
        <button
          className="rounded-full bg-ink px-6 py-2 text-sm font-medium text-white transition hover:bg-black"
          type="submit"
        >
          임베드
        </button>
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </form>
  );
}
