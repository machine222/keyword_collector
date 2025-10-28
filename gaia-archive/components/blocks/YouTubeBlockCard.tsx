"use client";

import { LinkIcon } from "lucide-react";
import type { YouTubeBlock } from "../../lib/editor-types";

interface YouTubeBlockCardProps {
  block: YouTubeBlock;
  onUpdate: (url: string) => void;
}

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return id;
      const paths = parsed.pathname.split("/").filter(Boolean);
      return paths[0] === "embed" ? paths[1] ?? null : null;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function YouTubeBlockCard({ block, onUpdate }: YouTubeBlockCardProps) {
  const id = block.url ? extractVideoId(block.url) : null;

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <LinkIcon className="h-4 w-4" />
        <span>YouTube 링크</span>
      </div>
      <input
        className="w-full rounded-lg border border-mist bg-cloud/70 px-3 py-2 text-sm outline-none focus:border-midnight focus:ring-2 focus:ring-midnight/30"
        placeholder="https://youtube.com/watch?v=..."
        value={block.url}
        onChange={(event) => onUpdate(event.target.value)}
      />
      {id ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-mist">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-xs text-slate-400">유효한 YouTube 링크를 입력하면 미리보기가 나타납니다.</p>
      )}
    </div>
  );
}
