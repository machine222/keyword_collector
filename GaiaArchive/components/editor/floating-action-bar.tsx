'use client';

import { useState } from 'react';
import { Sparkles, Share2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingActionBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative flex w-full justify-center">
      <button
        className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-xl"
        onClick={() => setExpanded((flag) => !flag)}
        type="button"
      >
        <Sparkles className="h-4 w-4" /> AI 도우미 열기
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-14 z-30 w-full max-w-xl rounded-3xl border border-white/40 bg-white/80 p-6 text-sm text-ink shadow-xl backdrop-blur"
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 8 }}
          >
            <h3 className="text-lg font-semibold">AI 활용 시나리오</h3>
            <ul className="mt-4 space-y-3 text-ink-muted">
              <li className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4" /> 특정 문단을 선택해 감정과 메시지를 보완하도록 요청하세요.
              </li>
              <li className="flex items-start gap-3">
                <Share2 className="mt-0.5 h-4 w-4" /> 가족이나 친구와 공유하기 전, 민감한 내용은 비공개 처리할 수 있도록 제안받습니다.
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4" /> 온체인 공개 여부를 AI가 윤리 관점에서 검토해 줍니다.
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
