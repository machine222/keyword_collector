'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEditorStore } from '@/hooks/useEditorStore';
import { transcribeAudio, uploadAudioBlob } from '@/lib/whisper';

export function VoiceConsole() {
  const { voiceDrafts, registerVoiceDraft, updateVoiceDraft } = useEditorStore();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const draftId = registerVoiceDraft({ status: 'transcribing' });
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const audioUrl = await uploadAudioBlob(blob);
      updateVoiceDraft(draftId, { audioUrl });
      try {
        const transcript = await transcribeAudio(audioUrl);
        updateVoiceDraft(draftId, { transcript, status: 'ready' });
      } catch (error) {
        console.error(error);
        updateVoiceDraft(draftId, { status: 'error', error: '음성 인식에 실패했습니다.' });
      }
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">음성 메모</h2>
            <p className="text-sm text-slate-500">Whisper 기반으로 음성 메모를 텍스트화합니다.</p>
          </div>
          <Button type="button" variant={isRecording ? 'secondary' : 'primary'} onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? '녹음 종료' : '녹음 시작'}
          </Button>
        </header>
        <div className="space-y-3">
          {voiceDrafts.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              음성을 녹음하거나 음성 파일을 업로드해보세요.
            </p>
          )}
          {voiceDrafts.map((draft) => (
            <div key={draft.id} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>상태: {draft.status}</span>
                {draft.audioUrl && (
                  <audio controls src={draft.audioUrl} className="h-8" />
                )}
              </div>
              <Textarea
                value={draft.transcript ?? ''}
                placeholder="전사된 음성이 여기에 표시됩니다."
                rows={3}
                onChange={(event) => updateVoiceDraft(draft.id, { transcript: event.target.value })}
              />
              {draft.error && <p className="text-sm text-red-500">{draft.error}</p>}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
