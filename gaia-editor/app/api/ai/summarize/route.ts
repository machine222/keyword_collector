import { NextResponse } from 'next/server';
import { summarizeEntry } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const insights = await summarizeEntry(content);
    return NextResponse.json(insights);
  } catch (error: any) {
    console.error('AI summarize error', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to summarize content' },
      { status: 500 }
    );
  }
}
