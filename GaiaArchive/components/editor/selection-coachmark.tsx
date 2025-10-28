'use client';

import type { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export function SelectionCoachmark({ editor }: { editor: Editor | null }) {
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const { ranges } = editor.state.selection;
      const rect = editor.view.coordsAtPos(ranges[0].from);
      setCoords({ left: rect.left, top: rect.top - 48 });
    };

    update();
    const observer = new ResizeObserver(() => update());
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [editor]);

  if (!coords) return null;

  return (
    <button
      className="pointer-events-auto absolute z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white shadow-lg drop-shadow-floating"
      style={{ left: coords.left, top: coords.top }}
      type="button"
    >
      <Sparkles className="h-3.5 w-3.5" /> 선택 내용을 AI에게 다듬기
    </button>
  );
}
