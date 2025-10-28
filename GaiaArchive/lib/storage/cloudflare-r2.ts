export type R2UploadRequest = {
  key: string;
  type: string;
};

export async function createUploadUrl({ key, type }: R2UploadRequest) {
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const token = process.env.CLOUDFLARE_R2_ACCESS_KEY;

  if (!endpoint || !accountId || !bucket || !token) {
    throw new Error('Cloudflare R2 환경 변수가 설정되지 않았습니다.');
  }

  const url = `${endpoint}/${bucket}/${key}`;

  return {
    url,
    headers: {
      'Content-Type': type,
      Authorization: `Bearer ${token}`
    }
  } satisfies { url: string; headers: Record<string, string> };
}
