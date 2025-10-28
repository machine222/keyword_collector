import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export const runtime = 'edge';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // TODO: Integrate with Cloudflare R2 or Google Cloud Storage using presigned URLs.
  const fakeUrl = `https://storage.gaia-archive.com/${nanoid()}-${file.name}`;

  return NextResponse.json({ url: fakeUrl });
}
