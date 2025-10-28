'use client';

import { useState } from 'react';
import { MultiModalEditor } from './rich-editor';
import { AttachmentPanel, type UploadAsset } from './upload-panel';
import { VoiceMemoComposer } from './voice-memo-composer';
import { FloatingActionBar } from './floating-action-bar';

export function EditorWorkspace() {
  const [assets, setAssets] = useState<UploadAsset[]>([]);

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-medium uppercase tracking-[0.25em] text-ink-muted">
          Memory Canvas
        </span>
        <h2 className="text-2xl font-semibold text-ink">새로운 가이아 아카이브</h2>
        <p className="text-sm leading-relaxed text-ink-muted">
          이미지를 붙여 넣고, 음성을 녹음하거나 YouTube 링크를 드롭해 추억을 한 장의 이야기로 엮어 보세요.
        </p>
      </header>

      <MultiModalEditor assets={assets} onRequestAssets={setAssets} />

      <AttachmentPanel assets={assets} onAssetsChange={setAssets} />

      <VoiceMemoComposer
        onAssetReady={(asset) => setAssets((current) => [...current, asset])}
      />

      <FloatingActionBar />
    </div>
  );
}
