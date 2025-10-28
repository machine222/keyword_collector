'use client';

import useSWRMutation from 'swr/mutation';
import { useCallback } from 'react';
import { InsightResponse, InsightTopic } from './types';

async function fetcher(url: string, { arg }: { arg: InsightTopic }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: arg })
  });
  if (!response.ok) {
    throw new Error('Failed to fetch insights');
  }
  return (await response.json()) as InsightResponse;
}

export function useChatInsights() {
  const { data, trigger, isMutating, mutate } = useSWRMutation('/api/insight', fetcher);

  const requestInsight = useCallback(
    async (topic: InsightTopic) => {
      const payload = await trigger(topic, { throwOnError: false });
      if (payload) {
        mutate({ ...data, ...payload }, { revalidate: false });
      }
    },
    [trigger, mutate, data]
  );

  return {
    data,
    requestInsight,
    isLoading: isMutating
  };
}
