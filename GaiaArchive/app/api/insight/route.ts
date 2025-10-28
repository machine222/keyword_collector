import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createOpenAIClient } from '../../../lib/ai/openai-server';
import type { InsightResponse, InsightTopic } from '../../../lib/ai/types';

const schema = z.object({
  topic: z.enum(['summary', 'state', 'suggest'])
});

export async function POST(request: Request) {
  const json = await request.json();
  const result = schema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { topic } = result.data;
  const client = createOpenAIClient();

  const prompt = buildPrompt(topic);

  const completion = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt
  });

  const content = completion.output_text ?? '인사이트를 생성하지 못했습니다.';

  const payload: InsightResponse = {
    [topic]: {
      topic,
      content
    }
  };

  return NextResponse.json(payload);
}

function buildPrompt(topic: InsightTopic) {
  switch (topic) {
    case 'summary':
      return '다음 일기를 세 문단 이내로 요약하고 중요한 감정을 강조해 주세요.';
    case 'state':
      return '작성자의 심리 상태를 감정 단어 3개와 한 문장 설명으로 정리해 주세요.';
    case 'suggest':
      return '작성자가 다음 기록에서 더 깊이 탐구할 수 있는 질문 3개를 제안해 주세요.';
    default:
      return '';
  }
}
