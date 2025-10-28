'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEditorStore } from '@/hooks/useEditorStore';
import { requestDocumentInsights } from '@/lib/insights';

interface AiInsightPanelProps {
  active: boolean;
}

export function AiInsightPanel({ active }: AiInsightPanelProps) {
  const { document, updateAiInsight } = useEditorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !document.aiInsights) return;
    setError(null);
  }, [active, document.aiInsights]);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const insight = await requestDocumentInsights(document);
      updateAiInsight(insight);
    } catch (insightError) {
      console.error(insightError);
      setError('AI 인사이트를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI 인사이트</h2>
          <Button type="button" variant="secondary" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? '분석 중...' : '새로 분석하기'}
          </Button>
        </header>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {document.aiInsights ? (
          <div className="space-y-3">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">요약</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink">{document.aiInsights.summary}</p>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">심리 상태</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink">{document.aiInsights.emotionalTone}</p>
            </section>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">추천</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink">
                {document.aiInsights.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </section>
            <p className="text-xs text-slate-400">
              마지막 업데이트: {new Date(document.aiInsights.lastUpdated).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            아직 분석된 내용이 없습니다. 상단의 버튼으로 분석을 요청해보세요.
          </p>
        )}
      </div>
    </Card>
  );
}
