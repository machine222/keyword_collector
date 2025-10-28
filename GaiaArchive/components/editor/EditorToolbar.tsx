'use client';

import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  activeTab: 'editor' | 'insights';
  onTabChange: (tab: 'editor' | 'insights') => void;
  onAddBlock: () => void;
}

export function EditorToolbar({ activeTab, onTabChange, onAddBlock }: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={activeTab === 'editor' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onTabChange('editor')}
        >
          작성 모드
        </Button>
        <Button
          type="button"
          variant={activeTab === 'insights' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onTabChange('insights')}
        >
          AI 인사이트
        </Button>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onAddBlock}>
          단락 추가
        </Button>
        <Button type="button" size="sm">
          저장
        </Button>
      </div>
    </div>
  );
}
