import { nanoid } from 'nanoid';

const WHISPER_ENDPOINT = process.env.NEXT_PUBLIC_WHISPER_ENDPOINT ?? '/api/whisper';

export async function uploadAudioBlob(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', blob, `${nanoid()}.webm`);

  const response = await fetch('/api/uploads', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload audio');
  }

  const { url } = (await response.json()) as { url: string };
  return url;
}

export async function transcribeAudio(audioUrl: string): Promise<string> {
  const response = await fetch(WHISPER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ audioUrl })
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  const { transcript } = (await response.json()) as { transcript: string };
  return transcript;
}
