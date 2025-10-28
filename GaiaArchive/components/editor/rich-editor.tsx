'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Editor } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import { motion } from 'framer-motion';
import { UploadAsset } from './upload-panel';
import { YoutubeEmbed } from './youtube-embed';
import { EditorToolbar } from './toolbar';
import { SelectionCoachmark } from './selection-coachmark';

const YOUTUBE_REGEX = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/i;

export type MultiModalEditorProps = {
  assets: UploadAsset[];
  onRequestAssets: (assets: UploadAsset[]) => void;
};

export function MultiModalEditor({ assets, onRequestAssets }: MultiModalEditorProps) {
  const [hasSelection, setHasSelection] = useState(false);

  const detectSelection = useCallback((editorInstance: Editor) => {
    const { from, to } = editorInstance.state.selection;
    setHasSelection(to - from > 0);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder: '기억을 설명하고, 사진과 느낌을 더해 보세요…'
      }),
      Link.configure({
        autolink: true,
        openOnClick: false,
        defaultProtocol: 'https'
      }),
      CharacterCount.configure({
        limit: 5000
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none font-sans text-base leading-7 outline-none'
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData('text/plain');
        if (text && YOUTUBE_REGEX.test(text)) {
          event.preventDefault();
          const match = text.match(YOUTUBE_REGEX);
          if (match?.[1]) {
            view.dispatch(view.state.tr.insertText(' '));
            insertYoutube(view.state.tr, view, match[1]);
            return true;
          }
        }
        return false;
      }
    },
    onUpdate({ editor }) {
      detectSelection(editor);
    },
    onSelectionUpdate({ editor }) {
      detectSelection(editor);
    }
  });

  useEffect(() => {
    if (!editor) return;
    const observer = new MutationObserver(() => detectSelection(editor));
    const view = editor.view.dom;
    observer.observe(view, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [editor, detectSelection]);

  useEffect(() => {
    if (!editor) return;
    if (!assets.length) return;
    assets.forEach((asset) => {
      if (asset.type === 'youtube') {
        editor.commands.insertContent({
          type: 'paragraph',
          content: [{ type: 'text', text: asset.label ?? 'YouTube 링크' }]
        });
      }
      if (asset.type === 'image') {
        editor.commands.insertContent({
          type: 'paragraph',
          content: [
            {
              type: 'image',
              attrs: { src: asset.previewUrl ?? asset.remoteUrl, alt: asset.label ?? '' }
            }
          ]
        });
      }
      if (asset.type === 'video') {
        editor.commands.insertContent(
          `<iframe src="${asset.remoteUrl}" data-asset-id="${asset.id}" class="w-full rounded-2xl bg-black aspect-video"></iframe>`
        );
      }
      if (asset.type === 'pdf') {
        editor.commands.insertContent(
          `<embed src="${asset.remoteUrl}" type="application/pdf" class="w-full min-h-[400px] rounded-2xl border border-ink/10" />`
        );
      }
      if (asset.type === 'audio') {
        editor.commands.insertContent(
          `<audio controls src="${asset.remoteUrl}" data-asset-id="${asset.id}" class="w-full rounded-2xl bg-canvas-subtle"></audio>`
        );
      }
    });
    onRequestAssets([]);
  }, [assets, editor, onRequestAssets]);

  const characterCount = editor?.storage.characterCount as { characters: number } | undefined;
  const count = characterCount?.characters ?? 0;

  const selectionCoachmark = useMemo(() => {
    if (!hasSelection) return null;
    return <SelectionCoachmark editor={editor} />;
  }, [hasSelection, editor]);

  return (
    <div className="flex flex-col gap-4">
      <EditorToolbar editor={editor} />
      <div className="relative rounded-2xl border border-ink/5 bg-white/80 p-6 shadow-inner">
        <EditorContent editor={editor} />
        {selectionCoachmark}
      </div>
      <motion.div
        aria-live="polite"
        className="text-right text-xs text-ink-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {count.toLocaleString()} / 5,000자
      </motion.div>
      <YoutubeEmbed editor={editor} />
    </div>
  );
}

function insertYoutube(tr: any, view: any, videoId: string) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.className = 'w-full rounded-3xl bg-black aspect-video';
  view.dom.parentNode?.insertBefore(iframe, view.dom.nextSibling);
  view.dispatch(tr);
}
