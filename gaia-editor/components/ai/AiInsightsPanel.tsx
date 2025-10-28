'use client';

import * as React from 'react';
import useSWR from 'swr';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { EditorInsights } from '@/types/editor';

interface AiInsightsPanelProps {
  content: string;
}

const fetcher = (url: string, body: unknown) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to generate insights');
    }
    return res.json();
  });

export function AiInsightsPanel({ content }: AiInsightsPanelProps) {
  const [trigger, setTrigger] = React.useState(0);
  const shouldFetch = content.trim().length > 0;

  const { data, error, isValidating } = useSWR<EditorInsights>(
    shouldFetch ? ['api/ai/summarize', { content, trigger }] : null,
    ([url, body]) => fetcher(url, body),
    {
      revalidateOnFocus: false
    }
  );

  const requestInsights = () => setTrigger((value) => value + 1);

  return (
    <Card id="ai-insights" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI reflection</h3>
          <p className="text-sm text-neutral-500">Optional insights generated with GPT to deepen your archive.</p>
        </div>
        <Button onClick={requestInsights} disabled={!shouldFetch || isValidating}>
          <Sparkles className="mr-2 h-4 w-4" /> {isValidating ? 'Thinking…' : 'Generate'}
        </Button>
      </div>
      {!shouldFetch && <p className="text-sm text-neutral-400">Start writing to unlock reflective insights.</p>}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      {data && (
        <div className="space-y-4 text-sm text-neutral-600">
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Summary</h4>
            <p className="mt-1 leading-relaxed">{data.summary}</p>
          </section>
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Emotional climate</h4>
            <p className="mt-1 leading-relaxed">{data.mood}</p>
          </section>
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Next steps</h4>
            <ul className="mt-1 space-y-2">
              {data.suggestions.map((suggestion, index) => (
                <li key={index} className="rounded-2xl bg-neutral-100 px-4 py-2">
                  {suggestion}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Card>
  );
}
