'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEditorStore } from '@/hooks/useEditorStore';
import { requestSelectionRefinement } from '@/lib/insights';

export function SelectionAssistant() {
  const { document } = useEditorStore();
  const [selection, setSelection] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selection.trim()) {
      setError('AI에게 전달할 내용을 선택하거나 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const refined = await requestSelectionRefinement(document, selection);
      setResponse(refined);
    } catch (selectionError) {
      console.error(selectionError);
      setError('정제 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">선택 영역 정리</h2>
          <p className="text-sm text-slate-500">노션처럼 영역을 선택해 붙여넣고 AI에게 정리를 요청할 수 있어요.</p>
        </div>
        <Textarea
          value={selection}
          onChange={(event) => setSelection(event.target.value)}
          placeholder="에디터에서 정리하고 싶은 내용을 복사해 붙여넣으세요."
          rows={4}
        />
        <Button type="button" variant="secondary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? '정리 중...' : 'AI에게 정리 요청'}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {response && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-ink">
            {response}
          </div>
        )}
      </div>
    </Card>
  );
}
