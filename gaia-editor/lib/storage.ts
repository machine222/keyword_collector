import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? '';
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID ?? '';
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY ?? '';
const R2_BUCKET = process.env.CLOUDFLARE_BUCKET ?? '';

function createR2Client() {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
    throw new Error('Cloudflare R2 environment variables are not fully configured.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY
    }
  });
}

export interface UploadParams {
  key: string;
  contentType: string;
  body: Buffer | Uint8Array | string;
  metadata?: Record<string, string>;
}

export async function uploadToR2({ key, contentType, body, metadata }: UploadParams) {
  const client = createR2Client();
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata
  });

  await client.send(command);

  const baseUrl = process.env.CLOUDFLARE_PUBLIC_BASE_URL;
  if (baseUrl) {
    return { url: `${baseUrl}/${key}` };
  }

  return {
    url: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${key}`
  };
}
