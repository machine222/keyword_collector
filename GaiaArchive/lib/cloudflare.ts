import { nanoid } from 'nanoid';
import { MediaAsset } from '@/types/editor';

export interface UploadConfig {
  r2Endpoint: string;
  bucketName: string;
  accessKey: string;
  secretKey: string;
}

// Placeholder configuration to be replaced with environment variables.
const CONFIG: UploadConfig = {
  r2Endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT ?? 'https://example.r2.cloudflarestorage.com',
  bucketName: process.env.NEXT_PUBLIC_R2_BUCKET ?? 'gaia-archive',
  accessKey: process.env.R2_ACCESS_KEY ?? '',
  secretKey: process.env.R2_SECRET_KEY ?? ''
};

export async function uploadMediaAsset(file: File): Promise<MediaAsset> {
  const id = nanoid();
  const extension = file.name.split('.').pop()?.toLowerCase();
  const kind = inferKind(extension);

  // TODO: Implement actual upload to Cloudflare R2 and Stream using signed URLs.
  const fakeUrl = `${CONFIG.r2Endpoint}/${CONFIG.bucketName}/${id}-${file.name}`;

  return {
    id,
    kind,
    url: fakeUrl,
    title: file.name,
    sizeBytes: file.size,
    provider: 'cloudflare'
  };
}

function inferKind(extension?: string): MediaAsset['kind'] {
  if (!extension) return 'image';
  if (['mp4', 'mov', 'webm'].includes(extension)) return 'video';
  if (['mp3', 'wav', 'm4a', 'aac', 'flac'].includes(extension)) return 'audio';
  if (extension === 'pdf') return 'pdf';
  return 'image';
}
