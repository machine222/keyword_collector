"use client";

import { Upload } from "lucide-react";
import type { MediaBlock } from "../../lib/editor-types";

interface MediaBlockCardProps {
  block: MediaBlock;
  onFileChange: (file: File, previewUrl: string) => void;
  onCaptionChange: (caption: string) => void;
}

const acceptedTypes: Record<MediaBlock["kind"], string> = {
  image: "image/*",
  video: "video/*",
  audio: "audio/*",
  voice: "audio/*",
  pdf: "application/pdf"
};

const labelCopy: Record<MediaBlock["kind"], string> = {
  image: "사진 업로드",
  video: "동영상 업로드",
  audio: "음성 파일 업로드",
  voice: "녹음 파일 업로드",
  pdf: "PDF 업로드"
};

const helperCopy: Record<MediaBlock["kind"], string> = {
  image: "고해상도 이미지를 업로드하세요. Cloudflare R2에 저장됩니다.",
  video: "최대 1GB의 영상을 업로드하면 Stream으로 재생됩니다.",
  audio: "음성 파일을 업로드하면 Whisper로 전사할 수 있어요.",
  voice: "녹음한 음성을 업로드하여 AI 요약을 받으세요.",
  pdf: "계약서, 전시 팸플릿 등 관련 문서를 보관하세요."
};

export function MediaBlockCard({ block, onFileChange, onCaptionChange }: MediaBlockCardProps) {
  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{labelCopy[block.kind]}</span>
        {block.fileName ? <span className="truncate text-xs">{block.fileName}</span> : null}
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-mist bg-cloud/60 p-6 text-center text-sm text-slate-500 transition hover:border-midnight hover:text-midnight">
        <Upload className="h-6 w-6" />
        <span>파일을 드래그하거나 클릭해서 선택하세요.</span>
        <span className="text-xs text-slate-400">{helperCopy[block.kind]}</span>
        <input
          type="file"
          className="sr-only"
          accept={acceptedTypes[block.kind]}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const previewUrl = URL.createObjectURL(file);
            onFileChange(file, previewUrl);
          }}
        />
      </label>
      {block.src ? (
        <div className="overflow-hidden rounded-xl border border-mist bg-black/5">
          {block.kind === "image" && (
            <img src={block.src} alt={block.caption ?? ""} className="h-72 w-full object-cover" />
          )}
          {block.kind === "video" && (
            <video src={block.src} controls className="h-72 w-full object-cover" />
          )}
          {(block.kind === "audio" || block.kind === "voice") && (
            <audio controls src={block.src} className="w-full" />
          )}
          {block.kind === "pdf" && (
            <embed src={block.src} type="application/pdf" className="h-72 w-full" />
          )}
        </div>
      ) : null}
      <input
        className="w-full rounded-lg border border-mist bg-cloud/70 px-3 py-2 text-sm outline-none focus:border-midnight focus:ring-2 focus:ring-midnight/30"
        placeholder="캡션을 입력하세요."
        value={block.caption ?? ""}
        onChange={(event) => onCaptionChange(event.target.value)}
      />
    </div>
  );
}
