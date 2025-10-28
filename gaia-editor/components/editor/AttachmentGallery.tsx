'use client';

import Image from 'next/image';
import { Attachment } from '@/types/editor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileAudio2, FileText } from 'lucide-react';

interface AttachmentGalleryProps {
  attachments: Attachment[];
}

export function AttachmentGallery({ attachments }: AttachmentGalleryProps) {
  if (!attachments.length) {
    return (
      <Card id="uploads" className="flex flex-col items-center gap-3 text-center text-neutral-400">
        <FileText className="h-12 w-12" />
        <div>
          <p className="text-sm font-medium text-neutral-500">No attachments yet</p>
          <p className="text-sm text-neutral-400">Add images, videos, audio notes, or PDFs to enrich your memory.</p>
        </div>
      </Card>
    );
  }

  return (
    <div id="uploads" className="grid gap-4 md:grid-cols-2">
      {attachments.map((item) => (
        <Card key={item.id} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-neutral-400">Added {new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="icon">
                <a href={item.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href={item.url} download>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          {item.kind === 'image' && item.thumbnailUrl && (
            <div className="relative h-52 overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src={item.thumbnailUrl ?? item.url}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          {item.kind === 'video' && (
            <div className="relative h-52 overflow-hidden rounded-2xl bg-black">
              <video controls className="h-full w-full" src={item.url} />
            </div>
          )}
          {item.kind === 'audio' && (
            <div className="flex items-center gap-3 rounded-2xl border border-muted/60 bg-white/70 p-4">
              <FileAudio2 className="h-6 w-6 text-neutral-500" />
              <audio controls className="flex-1" src={item.url} />
            </div>
          )}
          {item.kind === 'pdf' && (
            <div className="flex items-center gap-3 rounded-2xl border border-muted/60 bg-white/70 p-4">
              <FileText className="h-6 w-6 text-neutral-500" />
              <span className="text-sm text-neutral-500">PDF ready for download</span>
            </div>
          )}
          {item.transcript && (
            <div className="rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-600">
              <p className="text-xs uppercase tracking-wide text-neutral-400">Transcript</p>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed">{item.transcript}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
