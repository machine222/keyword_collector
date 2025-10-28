'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Pause, Play, Square, UploadCloud } from 'lucide-react';

type RecorderStatus = 'idle' | 'recording' | 'paused';

interface AudioRecorderProps {
  onUpload: (file: File, transcript?: string) => Promise<void>;
  onTranscribe?: (blob: Blob) => Promise<string>;
}

export function AudioRecorder({ onUpload, onTranscribe }: AudioRecorderProps) {
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const [status, setStatus] = React.useState<RecorderStatus>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const newChunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          newChunks.push(event.data);
        }
      };
      recorder.onstop = async () => {
        const blob = new Blob(newChunks, { type: 'audio/webm' });
        const file = new File([blob], `memory-voice-${Date.now()}.webm`, { type: 'audio/webm' });
        let transcript: string | undefined;
        if (onTranscribe) {
          transcript = await onTranscribe(blob);
        }
        setIsUploading(true);
        try {
          await onUpload(file, transcript);
        } finally {
          setIsUploading(false);
        }
      };
      recorder.start();
      setStatus('recording');
    } catch (err) {
      setError('Microphone access denied. Please enable permissions.');
    }
  };

  const togglePause = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (recorder.state === 'recording') {
      recorder.pause();
      setStatus('paused');
    } else if (recorder.state === 'paused') {
      recorder.resume();
      setStatus('recording');
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    recorder.stop();
    recorder.stream.getTracks().forEach((track) => track.stop());
    setStatus('idle');
  };

  const uploadExisting = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      let transcript: string | undefined;
      if (onTranscribe) {
        transcript = await onTranscribe(file);
      }
      await onUpload(file, transcript);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-muted/60 bg-white/90 p-6 shadow-sm shadow-black/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Whisper voice journal</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Record spontaneous thoughts and we&apos;ll transcribe them with Whisper.
          </p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
        <div className="flex items-center gap-3">
          {status === 'idle' ? (
            <Button onClick={startRecording} disabled={isUploading}>
              <Mic className="mr-2 h-4 w-4" /> Start
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={togglePause}>
                {status === 'recording' ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Resume
                  </>
                )}
              </Button>
              <Button variant="accent" onClick={stopRecording}>
                <Square className="mr-2 h-4 w-4" /> Finish
              </Button>
            </>
          )}
          <label className="cursor-pointer">
            <input type="file" className="hidden" accept="audio/*" onChange={uploadExisting} />
            <span>
              <Button type="button" variant="ghost" disabled={isUploading}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload audio
              </Button>
            </span>
          </label>
        </div>
      </div>
      {isUploading && <p className="mt-4 text-sm text-neutral-400">Processing audio…</p>}
    </div>
  );
}
