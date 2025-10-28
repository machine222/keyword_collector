import OpenAI from 'openai';
import { EditorInsights } from '@/types/editor';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function summarizeEntry(content: string): Promise<EditorInsights> {
  const response = await client.responses.create({
    model: process.env.OPENAI_SUMMARY_MODEL ?? 'gpt-4.1-mini',
    input: `You are assisting a user reflecting on their memories. Read the diary entry and produce:
1. A concise 2-3 sentence summary.
2. An empathetic assessment of the writer's mood.
3. Three gentle suggestions or questions to help them deepen their reflection.

Return your answer as JSON with keys summary, mood, suggestions (an array of strings).

Diary entry:\n${content}`
  });

  const message = response.output?.[0]?.content?.[0];
  const text = message?.type === 'output_text' ? message.text : '';
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Failed to parse AI insight response.');
  }

  const data = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  return {
    summary: data.summary,
    mood: data.mood,
    suggestions: data.suggestions
  };
}

export async function refineSelection(selection: string, stylePrompt?: string) {
  const response = await client.responses.create({
    model: process.env.OPENAI_REWRITE_MODEL ?? 'gpt-4.1-mini',
    input: `Rewrite the following text to be clear, emotionally resonant, and suitable for a premium memory archive. Preserve original meaning and perspective. ${
      stylePrompt ? `Follow these extra instructions: ${stylePrompt}.` : ''
    }\n\n${selection}`
  });

  const message = response.output?.[0]?.content?.[0];
  if (message?.type !== 'output_text') {
    throw new Error('No rewrite text returned');
  }

  return message.text.trim();
}

export async function transcribeAudio(file: File | Blob) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const response = await client.audio.transcriptions.create({
    model: process.env.OPENAI_WHISPER_MODEL ?? 'whisper-1',
    file: new File([buffer], 'recording.wav')
  });

  return response.text;
}
