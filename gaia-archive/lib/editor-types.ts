export type BlockKind =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "voice"
  | "pdf"
  | "youtube";

export interface EditorBlockBase {
  id: string;
  kind: BlockKind;
  caption?: string;
}

export interface TextBlock extends EditorBlockBase {
  kind: "text";
  markdown: string;
}

export interface MediaBlock extends EditorBlockBase {
  kind: "image" | "video" | "audio" | "pdf" | "voice";
  src?: string;
  fileName?: string;
  fileSize?: number;
}

export interface YouTubeBlock extends EditorBlockBase {
  kind: "youtube";
  url: string;
}

export type EditorBlock = TextBlock | MediaBlock | YouTubeBlock;

export interface AIInsightPayload {
  summary: string;
  mood: string;
  suggestions: string[];
}
