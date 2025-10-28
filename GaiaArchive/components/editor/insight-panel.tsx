'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Heart, ListChecks } from 'lucide-react';
import { useChatInsights } from '../../lib/ai/use-chat-insights';

const tabs = [
  { id: 'summary', label: '문서 요약', icon: ListChecks },
  { id: 'state', label: '심리 상태', icon: Heart },
  { id: 'suggest', label: '다른 제안', icon: Brain }
] as const;

type TabId = (typeof tabs)[number]['id'];

export function InsightPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const { data, isLoading, requestInsight } = useChatInsights();

  const handleRefresh = () => {
    requestInsight(activeTab);
  };

  const activeInsight = data?.[activeTab];

  return (
    <aside className="flex h-fit flex-col gap-6 rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-ink-muted">Reflection</span>
          <h2 className="text-xl font-semibold text-ink">AI 인사이트</h2>
        </div>
        <button
          className="flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-xs font-medium text-ink transition hover:bg-canvas-subtle"
          onClick={handleRefresh}
          type="button"
        >
          <Sparkles className="h-3.5 w-3.5" /> 새로 고침
        </button>
      </header>

      <nav className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
                isActive ? 'bg-ink text-white shadow' : 'bg-white text-ink hover:bg-canvas-subtle'
              }`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              <span className="flex items-center justify-center gap-2">
                <Icon className="h-4 w-4" /> {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (activeInsight?.content ?? '')}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-ink/5 bg-white/70 px-5 py-4 text-sm leading-6 text-ink"
            exit={{ opacity: 0, y: 4 }}
            initial={{ opacity: 0, y: 4 }}
          >
            {isLoading ? 'ChatGPT가 내용을 해석하고 있습니다…' : activeInsight?.content ?? '아직 인사이트가 없습니다. 새로 고침을 눌러보세요.'}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
}
