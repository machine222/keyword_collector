'use client';

import { useState } from 'react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { EditorBlock } from '@/types/editor';
import { EditorToolbar } from './EditorToolbar';
import { MediaDock } from './MediaDock';
import { VoiceConsole } from './VoiceConsole';
import { AiInsightPanel } from './AiInsightPanel';
import { SelectionAssistant } from './SelectionAssistant';

export function MemoryEditor() {
  const { document, updateBlock, addBlock, removeBlock, setSelectedBlock, setDocument } =
    useEditorStore();
  const [activeTab, setActiveTab] = useState<'editor' | 'insights'>('editor');

  const handleBlockChange = (block: EditorBlock, value: string) => {
    updateBlock({ ...block, content: value });
  };

  const handleAddBlock = () => {
    const id = addBlock({ type: 'paragraph' });
    setSelectedBlock(id);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="space-y-6">
        <Card elevated>
          <div className="flex flex-col gap-6">
            <Input
              value={document.title}
              onChange={(event) => {
                const value = event.target.value;
                setDocument({
                  ...document,
                  title: value,
                  blocks: document.blocks.map((block, index) =>
                    index === 0 && block.type === 'heading' ? { ...block, content: value } : block
                  )
                });
              }}
              placeholder="추억의 제목"
              className="text-2xl font-semibold"
            />
            <EditorToolbar activeTab={activeTab} onTabChange={setActiveTab} onAddBlock={handleAddBlock} />
            <div className="flex flex-col gap-6">
              {document.blocks.map((block, index) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  isTitle={index === 0 && block.type === 'heading'}
                  onChange={(value) => handleBlockChange(block, value)}
                  onRemove={() => removeBlock(block.id)}
                />
              ))}
            </div>
          </div>
        </Card>
        <MediaDock />
        <VoiceConsole />
      </div>
      <div className="space-y-6">
        <SelectionAssistant />
        <AiInsightPanel active={activeTab === 'insights'} />
      </div>
    </div>
  );
}

function BlockRenderer({
  block,
  isTitle,
  onChange,
  onRemove
}: {
  block: EditorBlock;
  isTitle?: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
}) {
  if (block.type === 'media') {
    return null;
  }

  return (
    <div className="group relative">
      <Textarea
        value={block.content}
        onFocus={() => setSelected(block.id)}
        onChange={(event) => onChange(event.target.value)}
        placeholder={isTitle ? '제목을 입력하세요' : '내용을 입력하세요'}
        className={isTitle ? 'text-xl font-semibold leading-tight' : 'min-h-[120px]'}
      />
      {!isTitle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="absolute -right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100"
        >
          삭제
        </Button>
      )}
    </div>
  );
}

function setSelected(blockId: string) {
  useEditorStore.getState().setSelectedBlock(blockId);
}
