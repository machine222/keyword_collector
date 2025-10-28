import { NextResponse } from "next/server";

type TranscribeBody = {
  fileName: string;
};

export async function POST(request: Request) {
  const { fileName } = (await request.json()) as TranscribeBody;

  return NextResponse.json({
    transcript: `${fileName} 파일을 Whisper가 전사한 예시 텍스트입니다. 실제 구현에서는 OpenAI Whisper API를 호출하세요.`
  });
}
