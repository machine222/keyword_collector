import { NextResponse } from 'next/server';
import { MemoryDocument, AiInsight } from '@/types/editor';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { document } = (await request.json()) as { document?: MemoryDocument };

  if (!document) {
    return NextResponse.json({ error: 'document is required' }, { status: 400 });
  }

  const insight: AiInsight = {
    summary: summarize(document),
    emotionalTone: inferEmotion(document),
    recommendations: generateRecommendations(document),
    lastUpdated: new Date().toISOString()
  };

  return NextResponse.json({ insight });
}

function summarize(document: MemoryDocument): string {
  const body = document.blocks.map((block) => block.content).join(' ');
  return body.length > 0
    ? `문서에는 ${document.blocks.length}개의 블록과 ${document.assets.length}개의 미디어가 포함되어 있습니다.`
    : '아직 내용이 충분하지 않습니다. 추억을 더 기록해보세요.';
}

function inferEmotion(document: MemoryDocument): string {
  const text = document.blocks.map((block) => block.content).join(' ');
  if (/행복|기쁨|감사/.test(text)) return '따뜻하고 행복한 감정이 느껴집니다.';
  if (/슬픔|우울/.test(text)) return '슬픔이 묻어나며 위로가 필요해 보입니다.';
  return '평온한 마음 상태로 보입니다.';
}

function generateRecommendations(document: MemoryDocument): string[] {
  const recommendations: string[] = [];
  if (document.assets.length === 0) {
    recommendations.push('추억을 더욱 생생하게 하기 위해 사진이나 영상을 추가해보세요.');
  }
  if (document.youtubeEmbeds.length === 0) {
    recommendations.push('관련된 YouTube 링크를 추가하면 분위기를 더 살릴 수 있어요.');
  }
  recommendations.push('하루를 마무리하며 느낀 감정을 더 자세히 적어보면 도움이 됩니다.');
  return recommendations;
}
