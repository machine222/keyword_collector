# Gaia Archive Editor

A Next.js 13 application that prototypes a minimal, multimodal editor for Gaia Archive — a platform that transforms memories into collectible NFTs. The experience emphasizes a clean, Apple-inspired UI with deep integration for media uploads, AI-assisted reflection, and voice journaling.

## Features

- **Notion-style rich text editor** built on Tiptap with headings, lists, block quotes, and inline formatting.
- **Media ingest pipeline** for images, video, audio, and PDFs with upload stubs targeting Cloudflare R2 and Stream.
- **YouTube embedding** for referencing external videos in-line.
- **Voice memo recorder** powered by the browser MediaRecorder API with optional Whisper transcription through OpenAI.
- **AI reflection panel** backed by ChatGPT APIs to surface summaries, emotional cues, and follow-up prompts.
- **Selection refinement workflow** that lets authors highlight any passage and ask AI to polish it on demand.
- **Responsive layout** tuned for desktop and mobile with Tailwind CSS.

## Getting started

```bash
cd gaia-editor
npm install
npm run dev
```

## Environment variables

Create a `.env.local` file with the following values before running the server in production contexts:

```
OPENAI_API_KEY="..."
OPENAI_SUMMARY_MODEL="gpt-4.1-mini"        # optional override
OPENAI_REWRITE_MODEL="gpt-4.1-mini"        # optional override
OPENAI_WHISPER_MODEL="whisper-1"           # optional override

CLOUDFLARE_ACCOUNT_ID="..."
CLOUDFLARE_ACCESS_KEY_ID="..."
CLOUDFLARE_SECRET_ACCESS_KEY="..."
CLOUDFLARE_BUCKET="gaia-archive"
CLOUDFLARE_PUBLIC_BASE_URL="https://cdn.example.com"  # optional public CDN domain
```

The upload route stores files directly in Cloudflare R2 using the S3-compatible API. Swap the implementation in `lib/storage.ts` if Google Cloud Storage or another provider becomes preferable.

## Architecture notes

- **`app/page.tsx`** orchestrates editor state, attachment management, and AI features.
- **`components/editor/RichTextEditor.tsx`** wraps Tiptap and exposes callbacks for attachments and selection refinement.
- **`components/editor/AudioRecorder.tsx`** handles Whisper-ready audio recording and uploads.
- **`components/ai/*`** contains UI for GPT-driven insights and rewrite flows.
- **API routes** under `app/api/*` proxy uploads and OpenAI interactions server-side.

This scaffold is designed to be extended with authentication, persistence, and NFT minting workflows as the platform evolves.
