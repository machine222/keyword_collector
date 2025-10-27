# Gaia Archive Studio

미니멀한 감성의 멀티미디어 일기 편집기 프로토타입입니다. Next.js 13(App Router) 기반으로 제작되었으며, 사진·영상·음성·문서를 정리하고 ChatGPT / Whisper와 같은 AI 도구와 연동하기 위한 구조를 제공합니다.

## 주요 특징

- **블록 기반 편집기**: 노션처럼 텍스트, 이미지, 비디오, 음성, PDF, YouTube 임베드 블록을 조합합니다.
- **Cloudflare 친화 설계**: 이미지/영상은 R2 및 Stream 업로드를 상정하여 미리보기와 메타데이터를 관리합니다.
- **음성 메모 녹음**: 브라우저에서 녹음하여 Whisper API 호출을 준비하고, 기존 음성 파일 업로드도 지원합니다.
- **AI 인사이트 패널**: ChatGPT API로 요약, 심리 상태, 제안 등을 받아보는 선택형 기능입니다.
- **선택 영역 정리**: 텍스트 블록에서 드래그한 구간을 AI에게 정리 요청할 수 있습니다.

## 기술 스택

- [Next.js 13](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (애플 감성의 미니멀 UI)
- [Zustand](https://zustand-demo.pmnd.rs/) (클라이언트 상태 관리)
- [Lucide Icons](https://lucide.dev/) (경량 아이콘)

## 실행 방법

```bash
pnpm install
pnpm dev
```

> npm 또는 yarn도 사용 가능합니다. Next.js dev 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 향후 연동 가이드

- **Cloudflare R2 / Stream**: `MediaBlockCard`에서 선택된 파일 메타데이터를 활용해 업로드 요청을 보내도록 확장합니다.
- **Whisper API**: `VoiceRecorder` 또는 음성 블록 업로드 시 `/api/transcribe` 라우트를 수정하여 실제 Whisper API를 호출합니다.
- **ChatGPT API**: `/api/ai` 라우트에 OpenAI API 호출을 연결하고, 요약/심리/제안을 실제 응답으로 반환합니다.
- **Google Workspace / Cloud**: 추가 캘린더, 드라이브 연동을 위한 API 클라이언트를 `lib/` 디렉터리에 배치하여 통합합니다.

## 디자인 노트

- 애플 및 macOS에서 영감을 받은 파스텔 톤, 라운드 코너, soft shadow를 Tailwind 테마에 정의했습니다.
- 다크 모드, 반응형 레이아웃 확장은 `tailwind.config.ts` 및 컴포넌트 클래스에서 쉽게 적용할 수 있도록 구성되어 있습니다.

## 테스트 데이터

현재 API 라우트는 목업 응답을 반환합니다. 실제 환경에서는 환경 변수와 보안 설정을 추가하고, S3 호환 스토리지 업로드/서명 로직을 구현하세요.
