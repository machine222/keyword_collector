'use client';

import { Paperclip, Upload, FileText, Image as ImageIcon, Video, AudioLines } from 'lucide-react';
import clsx from 'clsx';

export type UploadAsset = {
  id: string;
  type: 'image' | 'video' | 'audio' | 'pdf' | 'youtube';
  label?: string;
  previewUrl?: string;
  remoteUrl: string;
};

export type AttachmentPanelProps = {
  assets: UploadAsset[];
  onAssetsChange: (assets: UploadAsset[]) => void;
};

const ACCEPTED_TYPES = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
  pdf: 'application/pdf'
};

export function AttachmentPanel({ assets, onAssetsChange }: AttachmentPanelProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: UploadAsset['type']) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const remoteUrl = `/uploads/${file.name}`; // placeholder
    const asset: UploadAsset = {
      id: `${type}-${crypto.randomUUID()}`,
      type,
      label: file.name,
      previewUrl,
      remoteUrl
    };
    onAssetsChange([...assets, asset]);
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-ink">
        <Paperclip className="h-4 w-4" /> 첨부 파일
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(
          [
            { type: 'image', label: '이미지', icon: ImageIcon },
            { type: 'video', label: '비디오', icon: Video },
            { type: 'audio', label: '오디오', icon: AudioLines },
            { type: 'pdf', label: 'PDF', icon: FileText }
          ] as const
        ).map((item) => {
          const InputIcon = item.icon;
          return (
            <label
              key={item.type}
              className="group flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-ink/5 bg-white/70 px-4 py-6 text-sm font-medium text-ink transition hover:border-ink/20 hover:bg-white/90"
            >
              <input
                accept={ACCEPTED_TYPES[item.type]}
                className="sr-only"
                onChange={(event) => handleFileChange(event, item.type)}
                type="file"
              />
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas-subtle text-ink">
                <InputIcon className="h-5 w-5" />
              </span>
              {item.label}
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className={clsx(
              'flex items-center gap-3 rounded-full border px-4 py-2 text-xs shadow-sm',
              asset.type === 'image' && 'bg-[#f0f9ff] border-[#bae6fd]',
              asset.type === 'video' && 'bg-[#fef3c7] border-[#fde68a]',
              asset.type === 'audio' && 'bg-[#ede9fe] border-[#ddd6fe]',
              asset.type === 'pdf' && 'bg-[#fee2e2] border-[#fecaca]',
              asset.type === 'youtube' && 'bg-[#e0f2fe] border-[#bae6fd]'
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            <div className="truncate">{asset.label ?? asset.remoteUrl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
