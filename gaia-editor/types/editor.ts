export type AttachmentKind = 'image' | 'video' | 'audio' | 'pdf';

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  name: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  transcript?: string;
  createdAt: string;
}

export interface EditorInsights {
  summary: string;
  mood: string;
  suggestions: string[];
}
