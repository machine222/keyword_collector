"use client";

import { useState } from "react";
import { Brain, RefreshCw } from "lucide-react";
import type { AIInsightPayload } from "../lib/editor-types";

interface AIInsightsPanelProps {
  onGenerate: (mode: "full" | "selection") => Promise<AIInsightPayload>;
  initialInsights?: AIInsightPayload;
}

export function AIInsightsPanel({ onGenerate, initialInsights }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsightPayload | undefined>(initialInsights);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"full" | "selection">("full");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await onGenerate(mode);
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="flex h-full flex-col gap-4 rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">AI 인사이트</h2>
          <p className="text-xs text-slate-500">ChatGPT API로 일기를 되돌아보고 마음을 정리하세요.</p>
        </div>
        <Brain className="h-5 w-5 text-midnight" />
      </div>
      <div className="rounded-2xl bg-cloud/60 p-4 text-xs text-slate-600">
        <p>필요할 때만 활성화되는 선택형 기능입니다. 전체 문서를 분석하거나, 선택한 부분만 정제 요청할 수 있어요.</p>
      </div>
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          className={`flex-1 rounded-full border px-3 py-1 ${mode === "full" ? "border-midnight bg-midnight text-white" : "border-mist text-slate-500"}`}
          onClick={() => setMode("full")}
        >
          전체 문서 분석
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full border px-3 py-1 ${mode === "selection" ? "border-midnight bg-midnight text-white" : "border-mist text-slate-500"}`}
          onClick={() => setMode("selection")}
        >
          선택 영역 정리
        </button>
      </div>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-full bg-midnight px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "분석 중" : "AI 인사이트 생성"}
      </button>
      {insights ? (
        <div className="flex flex-col gap-4 overflow-y-auto text-sm text-slate-600">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">요약</h3>
            <p className="mt-1 whitespace-pre-line text-sm">{insights.summary}</p>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">심리 상태</h3>
            <p className="mt-1 whitespace-pre-line text-sm">{insights.mood}</p>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">제안</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {insights.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <p className="text-xs text-slate-400">아직 인사이트가 없습니다. 필요할 때 버튼을 눌러보세요.</p>
      )}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </aside>
  );
}
