import { MemoryDocument, AiInsight } from '@/types/editor';

const INSIGHTS_ENDPOINT = '/api/insights';

export async function requestDocumentInsights(document: MemoryDocument): Promise<AiInsight> {
  const response = await fetch(INSIGHTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ document })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch insights');
  }

  const payload = (await response.json()) as { insight: AiInsight };
  return payload.insight;
}

export async function requestSelectionRefinement(
  document: MemoryDocument,
  selection: string
): Promise<string> {
  const response = await fetch(`${INSIGHTS_ENDPOINT}/selection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ document, selection })
  });

  if (!response.ok) {
    throw new Error('Failed to refine selection');
  }

  const payload = (await response.json()) as { refinement: string };
  return payload.refinement;
}
