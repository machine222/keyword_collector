'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Square, Loader2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadAsset } from './upload-panel';

export type VoiceMemoComposerProps = {
  onAssetReady: (asset: UploadAsset) => void;
};

type RecordingState = 'idle' | 'recording' | 'processing';

export function VoiceMemoComposer({ onAssetReady }: VoiceMemoComposerProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (recordingState === 'recording') {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      setTimer(0);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recordingState]);

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    recorder.onstop = async () => {
      setRecordingState('processing');
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const file = new File([blob], `voice-${Date.now()}.webm`, { type: blob.type });
      const remoteUrl = `/uploads/${file.name}`;
      const asset: UploadAsset = {
        id: `audio-${crypto.randomUUID()}`,
        type: 'audio',
        label: file.name,
        previewUrl: URL.createObjectURL(blob),
        remoteUrl
      };
      onAssetReady(asset);
      setRecordingState('idle');
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecordingState('recording');
  }, [onAssetReady]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const asset: UploadAsset = {
        id: `audio-${crypto.randomUUID()}`,
        type: 'audio',
        label: file.name,
        previewUrl: URL.createObjectURL(file),
        remoteUrl: `/uploads/${file.name}`
      };
      onAssetReady(asset);
    },
    [onAssetReady]
  );

  const seconds = timer % 60;
  const minutes = Math.floor(timer / 60);
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 px-5 py-6">
      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-ink-muted">Voice memo</span>
        <h3 className="text-lg font-semibold text-ink">Whisper 음성 메모</h3>
        <p className="text-sm text-ink-muted">
          순간의 목소리를 녹음하고 Whisper로 전사해 텍스트에 추가하거나, 이미 녹음한 파일을 업로드하세요.
        </p>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait" initial={false}>
            {recordingState === 'recording' ? (
              <motion.button
                key="stop"
                animate={{ scale: 1 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg"
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                onClick={stopRecording}
                type="button"
                whileTap={{ scale: 0.95 }}
              >
                <Square className="h-5 w-5" />
              </motion.button>
            ) : (
              <motion.button
                key="start"
                animate={{ scale: 1 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg"
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                onClick={startRecording}
                type="button"
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
          <div className="text-sm text-ink-muted">
            {recordingState === 'recording' ? '녹음 중… ' : '대기 중'}
            <span className="ml-2 font-mono text-base text-ink">{formattedTimer}</span>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm text-ink transition hover:bg-canvas-subtle">
          <Upload className="h-4 w-4" /> 음성 파일 업로드
          <input accept="audio/*" className="sr-only" onChange={handleFileUpload} type="file" />
        </label>
      </div>

      <AnimatePresence>
        {recordingState === 'processing' && (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 rounded-2xl bg-canvas-subtle px-4 py-3 text-sm text-ink"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <Loader2 className="h-4 w-4 animate-spin" /> Whisper로 전사 중…
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
