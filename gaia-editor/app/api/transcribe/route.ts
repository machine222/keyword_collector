import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import crypto from 'node:crypto';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'Audio file required' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `voice-${crypto.randomUUID()}.webm`;

  try {
    const response = await client.audio.transcriptions.create({
      model: process.env.OPENAI_WHISPER_MODEL ?? 'whisper-1',
      file: new File([buffer], filename)
    });

    return NextResponse.json({ transcript: response.text });
  } catch (error: any) {
    console.error('Transcription error', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
