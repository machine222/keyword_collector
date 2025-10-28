"use client";

import { useState } from "react";
import { BlockEditor } from "./BlockEditor";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { useEditorStore } from "../lib/editor-store";
import type { AIInsightPayload } from "../lib/editor-types";

async function requestAIInsights(payload: Record<string, unknown>): Promise<AIInsightPayload> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("AI 분석을 불러오지 못했습니다.");
  }

  const data = (await response.json()) as AIInsightPayload;
  return data;
}

export function EditorWorkspace() {
  const { blocks } = useEditorStore();
  const [selectionContext, setSelectionContext] = useState<string>("");

  const getDocumentMarkdown = () =>
    blocks
      .map((block) => {
        switch (block.kind) {
          case "text":
            return block.markdown;
          case "youtube":
            return `YouTube: ${block.url}`;
          default:
            return `${block.kind.toUpperCase()} :: ${block.caption ?? ""}`;
        }
      })
      .join("\n\n");

  const handleGenerate = async (mode: "full" | "selection") => {
    if (mode === "selection" && !selectionContext) {
      throw new Error("먼저 텍스트를 선택하거나 AI 다듬기를 실행하세요.");
    }
    const document = getDocumentMarkdown();
    const payload = {
      mode,
      document,
      selection: selectionContext || undefined
    };
    const insights = await requestAIInsights(payload);
    return insights;
  };

  const handlePolish = async (selectedText: string) => {
    setSelectionContext(selectedText);
    try {
      const result = await requestAIInsights({
        mode: "selection",
        document: getDocumentMarkdown(),
        selection: selectedText
      });
      alert(`AI 제안\n\n${result.summary}`);
    } catch (error) {
      alert("AI 제안을 가져오지 못했습니다. 잠시 후 다시 시도하세요.");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400">Gaia Archive Studio</p>
          <h1 className="text-3xl font-semibold">추억을 위한 미니멀 에디터</h1>
          <p className="text-sm text-slate-500">
            사진, 영상, 음성, 문서를 한 곳에 정리하고 AI와 함께 감정의 결을 되돌아봅니다. Cloudflare R2, Stream,
            Whisper, Google Workspace 연동을 염두에 둔 구조로 설계되었습니다.
          </p>
        </header>
        <BlockEditor onPolish={handlePolish} />
      </div>
      <AIInsightsPanel onGenerate={handleGenerate} />
    </div>
  );
}
