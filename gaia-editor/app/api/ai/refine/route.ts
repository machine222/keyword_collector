import { NextResponse } from 'next/server';
import { refineSelection } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { selection, stylePrompt } = await request.json();
    if (!selection || typeof selection !== 'string') {
      return NextResponse.json({ error: 'Selection text is required' }, { status: 400 });
    }

    const result = await refineSelection(selection, stylePrompt);
    return NextResponse.json({ content: result });
  } catch (error: any) {
    console.error('AI refine error', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to refine selection' },
      { status: 500 }
    );
  }
}
