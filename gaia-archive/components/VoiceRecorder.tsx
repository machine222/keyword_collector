"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PauseCircle, PlayCircle, Waves } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingReady: (file: File, previewUrl: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onRecordingReady, disabled }: VoiceRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const requestStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `voice-note-${Date.now()}.webm`, { type: blob.type });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecordingReady(file, url);
      };

      mediaRecorderRef.current = recorder;
      return recorder;
    } catch (err) {
      setError("마이크 접근이 거부되었습니다. 브라우저 설정을 확인하세요.");
      throw err;
    }
  }, [onRecordingReady]);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      return;
    }

    setError(null);
    const recorder = mediaRecorderRef.current ?? (await requestStream());
    if (!recorder) return;
    recorder.start();
    setIsRecording(true);
  }, [isRecording, requestStream]);

  return (
    <div className="rounded-2xl border border-mist bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <Waves className="h-6 w-6 text-midnight" />
        <div>
          <p className="text-sm font-semibold">Whisper 음성 메모</p>
          <p className="text-xs text-slate-500">일상을 말로 남기면 자동으로 텍스트로 정리할 준비가 됩니다.</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled}
          className="inline-flex items-center gap-2 self-start rounded-full bg-midnight px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRecording ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
          {isRecording ? "녹음 중지" : "녹음 시작"}
        </button>
        {audioUrl ? (
          <audio controls src={audioUrl} className="w-full" />
        ) : (
          <p className="text-xs text-slate-400">녹음하면 여기에서 바로 재생할 수 있어요.</p>
        )}
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}
