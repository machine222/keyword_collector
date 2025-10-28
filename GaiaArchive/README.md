# Gaia Archive Studio

가이아 아카이브는 추억을 온체인 자산으로 기록하기 위한 Next.js 기반 멀티모달 에디터입니다. 노션 스타일의 문서 작성, Cloudflare R2/Stream 기반의 미디어 업로드, Whisper 음성 메모, ChatGPT 인사이트를 통해 감정 회고를 지원합니다.

## 주요 기능

- **노션 스타일 에디터**: TipTap 기반으로 헤딩, 목록, 인용 등 풍부한 텍스트 편집을 제공합니다.
- **미디어 업로드**: 이미지/영상/PDF/오디오를 첨부하고, YouTube 링크를 임베드할 수 있습니다.
- **음성 메모**: 브라우저에서 바로 음성을 녹음하거나 파일을 업로드하여 Whisper 전사를 준비합니다.
- **AI 인사이트**: ChatGPT API를 통해 문서 요약, 심리 상태 진단, 추가 제안을 요청할 수 있습니다.
- **선택 영역 정제**: 문단을 선택하고 AI에게 다듬기 요청을 위한 인터랙션이 준비되어 있습니다.

## 시작하기

```bash
pnpm install
pnpm dev
```

> **환경 변수**
>
> - `OPENAI_API_KEY` – ChatGPT 인사이트 생성을 위한 키
> - `CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_R2_BUCKET`, `CLOUDFLARE_R2_ACCESS_KEY`
> - `CLOUDFLARE_STREAM_TOKEN`

## 구조

```
app/
  api/insight/route.ts    # ChatGPT 기반 인사이트 API
  page.tsx                # 에디터와 인사이트 레이아웃
components/
  editor/                 # 에디터 UI 컴포넌트
  layout/providers.tsx    # 전역 테마 설정
lib/
  ai/                     # AI 인터랙션 훅과 타입
  storage/                # 스토리지 및 스트림 헬퍼
styles/
  globals.css             # Tailwind 기반 글로벌 스타일
```

## 차후 확장

- Cloudflare R2/Stream 업로드 API 라우트 연결
- Whisper 전사 서버리스 함수 연동
- NFT 민팅 파이프라인 및 지갑 연결
