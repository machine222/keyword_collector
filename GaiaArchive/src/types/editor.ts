export type EditorBlockType =
  | 'paragraph'
  | 'heading'
  | 'quote'
  | 'media'
  | 'checklist'
  | 'callout';

export interface EditorBlock {
  id: string;
  type: EditorBlockType;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface MediaAsset {
  id: string;
  kind: 'image' | 'video' | 'audio' | 'pdf';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  durationSeconds?: number;
  sizeBytes?: number;
  provider?: 'cloudflare' | 'google' | 'local' | 'youtube';
  externalId?: string;
}

export interface MemoryDocument {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  blocks: EditorBlock[];
  assets: MediaAsset[];
  youtubeEmbeds: string[];
  aiInsights?: AiInsight;
}

export interface AiInsight {
  summary: string;
  emotionalTone: string;
  recommendations: string[];
  lastUpdated: string;
}

export interface VoiceDraft {
  id: string;
  status: 'idle' | 'recording' | 'transcribing' | 'ready' | 'error';
  transcript?: string;
  audioUrl?: string;
  error?: string;
}

export interface EditorSettings {
  fontSize: 'sm' | 'md' | 'lg';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  enableAiAssist: boolean;
}
