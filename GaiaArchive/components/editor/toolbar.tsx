'use client';

import type { Editor } from '@tiptap/react';
import { useMemo } from 'react';
import { Bold, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Quote } from 'lucide-react';
import clsx from 'clsx';

const groups = [
  {
    label: 'Title',
    commands: [
      {
        icon: Heading1,
        name: 'H1',
        run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 1 })
      },
      {
        icon: Heading2,
        name: 'H2',
        run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 2 })
      },
      {
        icon: Heading3,
        name: 'H3',
        run: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 3 })
      }
    ]
  },
  {
    label: 'Style',
    commands: [
      {
        icon: Bold,
        name: 'Bold',
        run: (editor: Editor) => editor.chain().focus().toggleBold().run(),
        isActive: (editor: Editor) => editor.isActive('bold')
      },
      {
        icon: Italic,
        name: 'Italic',
        run: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
        isActive: (editor: Editor) => editor.isActive('italic')
      },
      {
        icon: Quote,
        name: 'Quote',
        run: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
        isActive: (editor: Editor) => editor.isActive('blockquote')
      }
    ]
  },
  {
    label: 'List',
    commands: [
      {
        icon: List,
        name: 'Bullet list',
        run: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
        isActive: (editor: Editor) => editor.isActive('bulletList')
      },
      {
        icon: ListOrdered,
        name: 'Ordered list',
        run: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
        isActive: (editor: Editor) => editor.isActive('orderedList')
      }
    ]
  }
];

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  const disabled = useMemo(() => !editor, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-full border border-ink/5 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
      {groups.map((group) => (
        <div className="flex items-center gap-1" key={group.label}>
          {group.commands.map((command) => {
            const Icon = command.icon;
            const active = !!editor && command.isActive(editor);
            return (
              <button
                key={command.name}
                aria-label={command.name}
                className={clsx(
                  'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                  active
                    ? 'bg-ink text-white'
                    : 'bg-white text-ink hover:bg-canvas-subtle/80'
                )}
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => editor && command.run(editor)}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
