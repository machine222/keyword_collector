'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { Button } from '@/components/ui/button';
import { Bold, Heading1, Heading2, Italic, List, ListOrdered, Quote, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export type EditorContentPayload = {
  json: any;
  text: string;
};

export interface RichTextEditorProps {
  defaultValue?: string;
  onContentChange?: (payload: EditorContentPayload) => void;
  onSelectionCommand?: (selection: string) => void;
  onInsertAttachment?: (type: 'image' | 'video' | 'audio' | 'pdf') => void;
  onInsertYoutube?: () => void;
  onReady?: (editor: Editor) => void;
}

const headingOptions = [
  { level: 1, icon: Heading1, label: 'Title' },
  { level: 2, icon: Heading2, label: 'Heading' }
];

export function RichTextEditor({
  defaultValue,
  onContentChange,
  onSelectionCommand,
  onInsertAttachment,
  onInsertYoutube,
  onReady
}: RichTextEditorProps) {
  const [selectionText, setSelectionText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder: 'Tell the story of your memory with words, media, and sound…'
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'underline decoration-accent/50 decoration-2 underline-offset-4 hover:decoration-accent'
        }
      }),
      Image.configure({ inline: false }),
      Youtube.configure({
        controls: true,
        nocookie: false
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none text-base md:text-lg focus:outline-none'
      }
    },
    content: defaultValue ?? ''
  });

  useEffect(() => {
    if (!editor || !onContentChange) return;

    const handler = () => {
      onContentChange({ json: editor.getJSON(), text: editor.getText() });
    };

    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, onContentChange]);

  useEffect(() => {
    if (!editor) return;

    const selectionHandler = () => {
      const text = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        '\n'
      );
      setSelectionText(text.trim());
    };

    editor.on('selectionUpdate', selectionHandler);
    return () => {
      editor.off('selectionUpdate', selectionHandler);
    };
  }, [editor]);

  useEffect(() => {
    if (editor && onReady) {
      onReady(editor);
    }
  }, [editor, onReady]);

  const triggerSelectionCommand = useCallback(() => {
    if (!selectionText || !selectionText.trim()) return;
    onSelectionCommand?.(selectionText.trim());
  }, [selectionText, onSelectionCommand]);

  const isActive = useCallback(
    (action: () => boolean | null | undefined) => {
      return editor ? action() ?? false : false;
    },
    [editor]
  );

  const toolbar = useMemo(() => {
    if (!editor) return null;
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-muted/60 bg-white/80 px-4 py-2 shadow-sm shadow-black/5 backdrop-blur">
        {headingOptions.map((heading) => {
          const Icon = heading.icon;
          const active = editor.isActive('heading', { level: heading.level });
          return (
            <Button
              key={heading.level}
              variant={active ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: heading.level }).run()}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        <Button
          variant={isActive(() => editor.isActive('bold')) ? 'accent' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={isActive(() => editor.isActive('italic')) ? 'accent' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={isActive(() => editor.isActive('bulletList')) ? 'accent' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={isActive(() => editor.isActive('orderedList')) ? 'accent' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant={isActive(() => editor.isActive('blockquote')) ? 'accent' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="mx-2 h-6 w-px bg-muted" />
        <Button variant="ghost" size="sm" onClick={() => onInsertAttachment?.('image')}>
          Image
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onInsertAttachment?.('video')}>
          Video
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onInsertAttachment?.('pdf')}>
          PDF
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onInsertAttachment?.('audio')}>
          Audio
        </Button>
        <Button variant="ghost" size="sm" onClick={onInsertYoutube}>
          YouTube
        </Button>
        <div className="flex-1" />
        <Button
          variant={selectionText ? 'accent' : 'ghost'}
          size="sm"
          disabled={!selectionText}
          onClick={triggerSelectionCommand}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Refine selection
        </Button>
      </div>
    );
  }, [editor, isActive, onInsertAttachment, onInsertYoutube, selectionText, triggerSelectionCommand]);

  if (!editor) {
    return (
      <div className="h-64 animate-pulse rounded-3xl bg-white/60" />
    );
  }

  return (
    <div id="editor" className="flex flex-col gap-4">
      {toolbar}
      <div
        className={clsx(
          'rounded-3xl border border-muted/60 bg-white/90 p-6 shadow-inner shadow-black/5 backdrop-blur transition focus-within:border-accent'
        )}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
