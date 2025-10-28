'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/hooks/useEditorStore';

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/i;

export function YoutubeEmbedInput() {
  const { document, setDocument } = useEditorStore();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const match = value.match(YOUTUBE_REGEX);
    if (!match) {
      setError('유효한 YouTube 링크를 입력해주세요.');
      return;
    }

    setDocument({
      ...document,
      youtubeEmbeds: Array.from(new Set([...document.youtubeEmbeds, match[1]]))
    });
    setValue('');
    setError(null);
  };

  return (
    <div className="flex flex-1 items-center gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="YouTube 링크 붙여넣기"
      />
      <Button type="button" variant="secondary" size="sm" onClick={handleSubmit}>
        추가
      </Button>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
