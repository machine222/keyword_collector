'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { RichTextEditor, type EditorContentPayload } from '@/components/editor/RichTextEditor';
import { AttachmentGallery } from '@/components/editor/AttachmentGallery';
import { AiInsightsPanel } from '@/components/ai/AiInsightsPanel';
import { AudioRecorder } from '@/components/editor/AudioRecorder';
import { YoutubeEmbedDialog } from '@/components/editor/YoutubeEmbedDialog';
import { RefineSelectionSheet } from '@/components/ai/RefineSelectionSheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Attachment, AttachmentKind } from '@/types/editor';

interface UploadResponse {
  id: string;
  url: string;
}

export default function HomePage() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [content, setContent] = useState<EditorContentPayload>({ json: null, text: '' });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [pendingKind, setPendingKind] = useState<AttachmentKind | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isYoutubeOpen, setYoutubeOpen] = useState(false);
  const [selectionForAi, setSelectionForAi] = useState('');
  const [isRefineOpen, setRefineOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const acceptByKind: Record<AttachmentKind, string> = useMemo(
    () => ({
      image: 'image/*',
      video: 'video/*',
      audio: 'audio/*',
      pdf: 'application/pdf'
    }),
    []
  );

  useEffect(() => {
    if (pendingKind && fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, [pendingKind]);

  const handleEditorContent = useCallback((payload: EditorContentPayload) => {
    setContent(payload);
  }, []);

  const handleSelectionCommand = useCallback((selection: string) => {
    setSelectionForAi(selection);
    setRefineOpen(true);
  }, []);

  const appendAttachment = useCallback(
    (kind: AttachmentKind, url: string, name: string, transcript?: string) => {
      const attachment: Attachment = {
        id: crypto.randomUUID(),
        kind,
        name,
        url,
        createdAt: new Date().toISOString(),
        transcript
      };
      setAttachments((prev) => [attachment, ...prev]);
      if (!editor) return;
      const command = editor.chain().focus();
      switch (kind) {
        case 'image':
          command.setImage({ src: url, alt: name }).run();
          break;
        case 'video':
          command.insertContent(
            `<figure class="gaia-video"><video controls src="${url}" class="w-full rounded-2xl"></video></figure>`
          ).run();
          break;
        case 'audio':
          command.insertContent(
            `<figure class="gaia-audio"><audio controls src="${url}" class="w-full"></audio></figure>`
          ).run();
          break;
        case 'pdf':
          command
            .insertContent(
              `<div class="gaia-pdf">
                <a href="${url}" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 rounded-full border border-muted px-4 py-2 text-sm">
                  View PDF · ${name}
                </a>
              </div>`
            )
            .run();
          break;
      }
    },
    [editor]
  );

  const uploadToServer = useCallback(
    async (file: File, kind: AttachmentKind) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('kind', kind);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const data = (await response.json()) as UploadResponse;
      return data.url;
    },
    []
  );

  const handleFileSelection = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !pendingKind) return;
      try {
        const url = await uploadToServer(file, pendingKind);
        appendAttachment(pendingKind, url, file.name);
      } catch (error) {
        console.error(error);
      } finally {
        setPendingKind(null);
      }
    },
    [appendAttachment, pendingKind, uploadToServer]
  );

  const handleAudioUpload = useCallback(
    async (file: File, transcript?: string) => {
      try {
        const url = await uploadToServer(file, 'audio');
        appendAttachment('audio', url, file.name, transcript);
      } catch (error) {
        console.error(error);
      }
    },
    [appendAttachment, uploadToServer]
  );

  const handleTranscription = useCallback(async (input: Blob) => {
    const formData = new FormData();
    formData.append('file', input);
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('Transcription failed');
    }
    const data = await response.json();
    return data.transcript as string;
  }, []);

  const handleYoutubeEmbed = useCallback(
    (url: string) => {
      if (!editor) return;
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
      setYoutubeOpen(false);
    },
    [editor]
  );

  const handleRefineSubmit = useCallback(
    async ({ selection, stylePrompt }: { selection: string; stylePrompt?: string }) => {
      try {
        const response = await fetch('/api/ai/refine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selection, stylePrompt })
        });
        if (!response.ok) {
          throw new Error('Failed to refine selection');
        }
        const data = await response.json();
        if (editor) {
          editor.commands.insertContent(data.content);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setRefineOpen(false);
      }
    },
    [editor]
  );

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.info('Draft saved', content);
    } finally {
      setIsSaving(false);
    }
  }, [content]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Design your memory capsule</h2>
                <p className="text-sm text-neutral-500">
                  Blend writing, visuals, audio, and video into a singular Gaia Archive moment.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleSaveDraft} disabled={isSaving}>
                  {isSaving ? 'Saving…' : 'Save draft'}
                </Button>
                <Button>Mint preview</Button>
              </div>
            </div>
          </div>
          <RichTextEditor
            onReady={setEditor}
            onContentChange={handleEditorContent}
            onSelectionCommand={handleSelectionCommand}
            onInsertAttachment={(kind) => setPendingKind(kind)}
            onInsertYoutube={() => setYoutubeOpen(true)}
          />
          <AudioRecorder onUpload={handleAudioUpload} onTranscribe={handleTranscription} />
        </div>
        <div className="space-y-6">
          <AiInsightsPanel content={content.text} />
          <Card className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Storage strategy</h3>
              <p className="text-sm text-neutral-500">
                Files are staged through Cloudflare R2 with optional Stream delivery for video. Configure credentials via
                environment variables before deploying.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>Images &amp; PDFs upload to R2 and render instantly in the editor.</li>
              <li>Video files can be proxied through Cloudflare Stream for adaptive playback.</li>
              <li>Audio integrates with Whisper transcription for voice-to-text journaling.</li>
            </ul>
          </Card>
        </div>
      </section>
      <section>
        <AttachmentGallery attachments={attachments} />
      </section>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={pendingKind ? acceptByKind[pendingKind] : undefined}
        onChange={handleFileSelection}
      />
      <YoutubeEmbedDialog
        open={isYoutubeOpen}
        onClose={() => setYoutubeOpen(false)}
        onEmbed={handleYoutubeEmbed}
      />
      <RefineSelectionSheet
        open={isRefineOpen}
        selection={selectionForAi}
        onClose={() => setRefineOpen(false)}
        onSubmit={handleRefineSubmit}
      />
    </div>
  );
}
