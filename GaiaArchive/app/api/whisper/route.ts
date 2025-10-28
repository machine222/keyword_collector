import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { audioUrl } = (await request.json()) as { audioUrl?: string };

  if (!audioUrl) {
    return NextResponse.json({ error: 'audioUrl is required' }, { status: 400 });
  }

  // TODO: Replace with actual Whisper transcription via OpenAI or local inference.
  return NextResponse.json({
    transcript: `이곳은 Whisper가 전사한 내용이 표시되는 자리입니다. (소스: ${audioUrl})`
  });
}
