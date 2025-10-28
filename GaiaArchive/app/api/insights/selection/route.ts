import { NextResponse } from 'next/server';
import { MemoryDocument } from '@/types/editor';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { document, selection } = (await request.json()) as {
    document?: MemoryDocument;
    selection?: string;
  };

  if (!document || !selection) {
    return NextResponse.json({ error: 'document and selection are required' }, { status: 400 });
  }

  const refinement = `선택한 내용 정리:\n\n${selection.trim()}\n\n제안:\n- 감정을 한 문장으로 요약해보세요.\n- 필요한 경우 사진이나 음성을 추가하여 분위기를 보완하세요.`;

  return NextResponse.json({ refinement });
}
