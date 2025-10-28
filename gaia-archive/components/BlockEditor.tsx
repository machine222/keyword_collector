"use client";

import { Fragment } from "react";
import { Trash2 } from "lucide-react";
import { useEditorStore } from "../lib/editor-store";
import type { BlockKind, EditorBlock, MediaBlock, TextBlock, YouTubeBlock } from "../lib/editor-types";
import { EditorToolbar } from "./EditorToolbar";
import { MediaBlockCard } from "./blocks/MediaBlockCard";
import { TextBlockEditor } from "./blocks/TextBlockEditor";
import { YouTubeBlockCard } from "./blocks/YouTubeBlockCard";
import { VoiceRecorder } from "./VoiceRecorder";

interface BlockEditorProps {
  onPolish: (text: string) => void;
}

export function BlockEditor({ onPolish }: BlockEditorProps) {
  const { blocks, addBlock, updateBlock, removeBlock } = useEditorStore();

  const handleFileChange = (block: MediaBlock, file: File, previewUrl: string) => {
    updateBlock(block.id, {
      src: previewUrl,
      fileName: file.name,
      fileSize: file.size
    } as Partial<MediaBlock>);
  };

  const renderBlock = (block: EditorBlock) => {
    switch (block.kind) {
      case "text":
        return (
          <TextBlockEditor
            block={block as TextBlock}
            onChange={(value) => updateBlock(block.id, { markdown: value })}
            onRequestPolish={onPolish}
          />
        );
      case "youtube":
        return (
          <YouTubeBlockCard
            block={block as YouTubeBlock}
            onUpdate={(url) => updateBlock(block.id, { url })}
          />
        );
      default:
        return (
          <div className="space-y-4">
            {block.kind === "voice" ? (
              <VoiceRecorder
                onRecordingReady={(file, url) => handleFileChange(block as MediaBlock, file, url)}
              />
            ) : null}
            <MediaBlockCard
              block={block as MediaBlock}
              onFileChange={(file, url) => handleFileChange(block as MediaBlock, file, url)}
              onCaptionChange={(caption) => updateBlock(block.id, { caption })}
            />
          </div>
        );
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <EditorToolbar onAdd={(kind: BlockKind) => addBlock(kind)} />
      {blocks.map((block) => (
        <Fragment key={block.id}>
          <div className="relative">
            <button
              type="button"
              onClick={() => removeBlock(block.id)}
              className="absolute right-4 top-4 rounded-full bg-cloud/90 p-2 text-slate-400 transition hover:text-midnight"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {renderBlock(block)}
          </div>
        </Fragment>
      ))}
    </section>
  );
}
