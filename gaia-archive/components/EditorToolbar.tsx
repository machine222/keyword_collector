"use client";

import type { ElementType } from "react";
import { AudioLines, FileText, Film, ImageIcon, Link2, Mic, Paperclip } from "lucide-react";
import type { BlockKind } from "../lib/editor-types";

interface EditorToolbarProps {
  onAdd: (kind: BlockKind) => void;
}

const blockButtons: Array<{ kind: BlockKind; label: string; icon: ElementType }> = [
  { kind: "text", label: "텍스트", icon: FileText },
  { kind: "image", label: "이미지", icon: ImageIcon },
  { kind: "video", label: "비디오", icon: Film },
  { kind: "audio", label: "음성", icon: AudioLines },
  { kind: "voice", label: "녹음", icon: Mic },
  { kind: "pdf", label: "PDF", icon: Paperclip },
  { kind: "youtube", label: "YouTube", icon: Link2 }
];

export function EditorToolbar({ onAdd }: EditorToolbarProps) {
  return (
    <div className="sticky top-6 z-10 flex flex-wrap gap-2 rounded-full border border-mist bg-white/90 p-2 shadow-soft backdrop-blur">
      {blockButtons.map(({ kind, label, icon: Icon }) => (
        <button
          key={kind}
          type="button"
          onClick={() => onAdd(kind)}
          className="flex items-center gap-2 rounded-full bg-cloud px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-midnight hover:text-white"
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
