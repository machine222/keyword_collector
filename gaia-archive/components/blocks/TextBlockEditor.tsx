"use client";

import { useCallback, useRef } from "react";
import { Sparkles } from "lucide-react";
import type { TextBlock } from "../../lib/editor-types";

interface TextBlockEditorProps {
  block: TextBlock;
  onChange: (value: string) => void;
  onRequestPolish: (selectedText: string) => void;
}

export function TextBlockEditor({ block, onChange, onRequestPolish }: TextBlockEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handlePolish = useCallback(() => {
    const node = textareaRef.current;
    if (!node) return;
    const { selectionStart, selectionEnd, value } = node;
    const selected = value.slice(selectionStart, selectionEnd) || value;
    onRequestPolish(selected);
  }, [onRequestPolish]);

  return (
    <div className="space-y-3 rounded-2xl bg-white p-6 shadow-soft transition hover:shadow-lg">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>서사 블록</span>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-midnight px-3 py-1 text-xs font-medium text-white shadow-soft transition hover:bg-slate-900"
          onClick={handlePolish}
        >
          <Sparkles className="h-4 w-4" />
          AI 다듬기
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="w-full resize-none border-none bg-transparent text-base outline-none"
        rows={6}
        placeholder="추억을 노션처럼 자유롭게 기록하세요. 마크다운도 지원합니다."
        value={block.markdown}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
