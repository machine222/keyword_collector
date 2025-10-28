'use client';

import { useState } from 'react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MediaAsset } from '@/types/editor';
import { uploadMediaAsset } from '@/lib/cloudflare';
import { YoutubeEmbedInput } from './YoutubeEmbedInput';

export function MediaDock() {
  const { document, attachMedia } = useEditorStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const asset = await uploadMediaAsset(file);
      attachMedia(asset);
    } catch (uploadError) {
      console.error(uploadError);
      setError('업로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <header>
          <h2 className="text-lg font-semibold">추억 보관함</h2>
          <p className="mt-1 text-sm text-slate-500">
            사진, 영상, 음성, PDF를 업로드하거나 YouTube 링크를 추가하세요.
          </p>
        </header>
        <div className="flex flex-wrap gap-3">
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileUpload} />
            <Button type="button" variant="secondary" size="sm" disabled={isUploading}>
              {isUploading ? '업로드 중...' : '파일 업로드'}
            </Button>
          </label>
          <YoutubeEmbedInput />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <section className="grid gap-3 md:grid-cols-2">
          {document.assets.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              아직 업로드된 파일이 없습니다. 당신의 추억을 담아보세요.
            </p>
          )}
          {document.assets.map((asset) => (
            <MediaPreview key={asset.id} asset={asset} />
          ))}
        </section>
      </div>
    </Card>
  );
}

function MediaPreview({ asset }: { asset: MediaAsset }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{asset.kind.toUpperCase()}</span>
        <span>{asset.provider}</span>
      </div>
      <p className="text-sm font-medium text-ink">{asset.title ?? '제목 없는 추억'}</p>
      <a
        href={asset.url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-accent hover:underline"
      >
        열기
      </a>
    </div>
  );
}
