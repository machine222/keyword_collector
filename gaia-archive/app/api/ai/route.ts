import { NextResponse } from "next/server";
import type { AIInsightPayload } from "../../../lib/editor-types";

type RequestBody = {
  mode: "full" | "selection";
  document?: string;
  selection?: string;
};

export async function POST(request: Request) {
  const { mode, document, selection } = (await request.json()) as RequestBody;

  const summarySource = mode === "selection" && selection ? selection : document ?? "";
  const response: AIInsightPayload = {
    summary: summarySource
      ? `요약 샘플: ${summarySource.slice(0, 120)}${summarySource.length > 120 ? "…" : ""}`
      : "요약할 내용이 충분하지 않습니다.",
    mood:
      "차분하지만 약간의 설렘이 느껴집니다. 자신을 잘 돌보고 있으며, 소중한 추억을 NFT로 남기려는 의지가 보입니다.",
    suggestions: [
      "오늘 느꼈던 감각이나 냄새 같은 디테일을 추가로 기록해 보세요.",
      "음성 메모를 Whisper로 전사하여 글과 함께 보관해 보세요.",
      "지금의 감정이 미래의 나에게 어떤 메시지를 줄지 한 줄 남겨 보세요."
    ]
  };

  return NextResponse.json(response);
}
