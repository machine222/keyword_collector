"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EditorBlock, BlockKind } from "./editor-types";

interface EditorState {
  blocks: EditorBlock[];
  activeBlockId?: string;
  addBlock: (kind: BlockKind) => void;
  updateBlock: (id: string, block: Partial<EditorBlock>) => void;
  removeBlock: (id: string) => void;
  setBlocks: (blocks: EditorBlock[]) => void;
  setActiveBlock: (id?: string) => void;
  reset: () => void;
}

const createBlock = (kind: BlockKind): EditorBlock => {
  const id = crypto.randomUUID();
  switch (kind) {
    case "text":
      return { id, kind, markdown: "" };
    case "youtube":
      return { id, kind, url: "" };
    default:
      return { id, kind, caption: "" } as EditorBlock;
  }
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      blocks: [createBlock("text")],
      activeBlockId: undefined,
      addBlock: (kind) =>
        set((state) => ({ blocks: [...state.blocks, createBlock(kind)], activeBlockId: undefined })),
      updateBlock: (id, block) =>
        set((state) => ({
          blocks: state.blocks.map((item) => (item.id === id ? { ...item, ...block } : item))
        })),
      removeBlock: (id) =>
        set((state) => ({ blocks: state.blocks.filter((item) => item.id !== id) })),
      setBlocks: (blocks) => set({ blocks }),
      setActiveBlock: (id) => set({ activeBlockId: id }),
      reset: () => set({ blocks: [createBlock("text")], activeBlockId: undefined })
    }),
    {
      name: "gaia-archive-editor",
      partialize: (state) => ({ blocks: state.blocks })
    }
  )
);
