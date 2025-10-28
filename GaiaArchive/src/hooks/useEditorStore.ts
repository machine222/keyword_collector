import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  AiInsight,
  EditorBlock,
  EditorSettings,
  MemoryDocument,
  MediaAsset,
  VoiceDraft
} from '@/types/editor';

interface EditorState {
  document: MemoryDocument;
  settings: EditorSettings;
  voiceDrafts: VoiceDraft[];
  selectedBlockId?: string;
  setDocument: (doc: MemoryDocument) => void;
  updateBlock: (block: EditorBlock) => void;
  addBlock: (block: Partial<EditorBlock>) => string;
  removeBlock: (id: string) => void;
  attachMedia: (asset: MediaAsset) => void;
  updateAiInsight: (insight: AiInsight) => void;
  registerVoiceDraft: (draft: Partial<VoiceDraft>) => string;
  updateVoiceDraft: (id: string, patch: Partial<VoiceDraft>) => void;
  setSelectedBlock: (id?: string) => void;
  reset: () => void;
}

const emptyDocument = (): MemoryDocument => ({
  id: nanoid(),
  title: '새로운 추억',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  blocks: [
    {
      id: nanoid(),
      type: 'heading',
      content: '제목을 입력하세요'
    },
    {
      id: nanoid(),
      type: 'paragraph',
      content: '추억을 적어보세요...'
    }
  ],
  assets: [],
  youtubeEmbeds: []
});

export const useEditorStore = create<EditorState>((set, get) => ({
  document: emptyDocument(),
  settings: {
    fontSize: 'md',
    lineHeight: 'normal',
    enableAiAssist: true
  },
  voiceDrafts: [],
  selectedBlockId: undefined,
  setDocument: (doc) =>
    set({
      document: { ...doc, updatedAt: new Date().toISOString() }
    }),
  updateBlock: (block) =>
    set(({ document }) => ({
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        blocks: document.blocks.map((item) => (item.id === block.id ? block : item))
      }
    })),
  addBlock: (block) => {
    const newBlock: EditorBlock = {
      id: nanoid(),
      type: 'paragraph',
      content: '',
      ...block
    } as EditorBlock;
    set(({ document }) => ({
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        blocks: [...document.blocks, newBlock]
      }
    }));
    return newBlock.id;
  },
  removeBlock: (id) =>
    set(({ document }) => ({
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        blocks: document.blocks.filter((block) => block.id !== id)
      }
    })),
  attachMedia: (asset) =>
    set(({ document }) => ({
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        assets: [...document.assets, asset]
      }
    })),
  updateAiInsight: (aiInsights) =>
    set(({ document }) => ({
      document: {
        ...document,
        aiInsights,
        updatedAt: new Date().toISOString()
      }
    })),
  registerVoiceDraft: (draft) => {
    const newDraft: VoiceDraft = {
      id: nanoid(),
      status: 'idle',
      ...draft
    } as VoiceDraft;
    set(({ voiceDrafts }) => ({
      voiceDrafts: [...voiceDrafts, newDraft]
    }));
    return newDraft.id;
  },
  updateVoiceDraft: (id, patch) =>
    set(({ voiceDrafts }) => ({
      voiceDrafts: voiceDrafts.map((draft) =>
        draft.id === id
          ? {
              ...draft,
              ...patch
            }
          : draft
      )
    })),
  setSelectedBlock: (id) => set({ selectedBlockId: id }),
  reset: () =>
    set({
      document: emptyDocument(),
      voiceDrafts: [],
      selectedBlockId: undefined
    })
}));
