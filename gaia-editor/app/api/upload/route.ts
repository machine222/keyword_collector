import { NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/storage';
import crypto from 'node:crypto';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');
  const kind = formData.get('kind');

  if (!(file instanceof Blob) || typeof kind !== 'string') {
    return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const id = crypto.randomUUID();
  const ext = file.type.split('/')[1] ?? 'bin';
  const key = `memories/${kind}/${id}.${ext}`;

  try {
    const { url } = await uploadToR2({
      key,
      contentType: file.type,
      body: buffer,
      metadata: {
        kind
      }
    });

    return NextResponse.json({ id, url });
  } catch (error: any) {
    console.error('Upload error', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to upload file' },
      { status: 500 }
    );
  }
}
