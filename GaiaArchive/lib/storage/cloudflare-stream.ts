export type StreamUploadConfig = {
  accountId: string;
  token: string;
};

export async function createStreamDirectUpload({ accountId, token }: StreamUploadConfig) {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ maxDurationSeconds: 600 })
  });

  if (!response.ok) {
    throw new Error('Cloudflare Stream 업로드 URL 생성에 실패했습니다.');
  }

  return response.json();
}
