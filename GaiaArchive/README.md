# Gaia Archive Editor

React와 Next.js 기반으로 제작된 **Gaia Archive** 에디터입니다. 이 프로젝트는 추억을 다중 미디어 형식으로 기록하고 AI 보조 기능을 활용해 정제할 수 있는 경험을 목표로 합니다.

## 주요 특징

- 📒 노션 스타일의 블록 기반 에디터
- 📷 Cloudflare R2 / Stream 업로드 통합을 고려한 미디어 관리
- 🎙 Whisper 전사와 음성 메모 녹음/업로드 플로우
- ▶️ YouTube 링크 임베드 지원
- 🤖 ChatGPT API를 활용한 문서 요약, 감정 분석, 맞춤 제안
- ✨ 선택 영역을 드래그해 AI에게 정제 요청
- 📱 PC와 모바일에서 모두 사용 가능한 미니멀 디자인

## 프로젝트 구조

```
GaiaArchive/
├── app/
│   ├── api/                  # 업로드, 인사이트, Whisper용 API 라우트 (Edge runtime)
│   ├── globals.css           # Tailwind 기반 글로벌 스타일
│   ├── layout.tsx            # 전체 레이아웃
│   └── page.tsx              # 에디터 진입 페이지
├── components/
│   ├── editor/               # 에디터 UI 컴포넌트
│   └── ui/                   # 버튼/카드 등 공용 컴포넌트
├── lib/                      # Cloudflare, Whisper, AI 인사이트 헬퍼
├── src/hooks/                # Zustand 스토어 등 커스텀 훅
└── src/types/                # 타입 정의
```

## 개발 환경 세팅

1. 패키지 설치

   ```bash
   pnpm install # 또는 npm install / yarn install
   ```

2. 개발 서버 실행

   ```bash
   pnpm dev
   ```

3. 환경 변수

   실제 배포 시 다음과 같은 환경 변수가 필요합니다.

   - `NEXT_PUBLIC_R2_ENDPOINT`
   - `NEXT_PUBLIC_R2_BUCKET`
   - `R2_ACCESS_KEY`
   - `R2_SECRET_KEY`
   - `NEXT_PUBLIC_WHISPER_ENDPOINT`
   - `OPENAI_API_KEY`

   현재는 시뮬레이션용으로 목업이 포함되어 있으므로 개발 단계에서 필수는 아닙니다.

## 향후 통합 고려 사항

- Cloudflare Stream Direct Creator Upload API를 활용한 영상/음성 업로드 파이프라인
- Google Cloud Storage 혹은 Workspace API와의 연동 비교
- Whisper API 호출 시 batching 전략과 비용 관리
- ChatGPT API (responses API) 기반의 대화형 피드백 UI 확장

## 라이선스

사내 혹은 프로젝트 상황에 맞춰 추후 정의하세요.
