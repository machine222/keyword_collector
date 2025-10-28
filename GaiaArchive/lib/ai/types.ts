export type InsightTopic = 'summary' | 'state' | 'suggest';

export type Insight = {
  topic: InsightTopic;
  content: string;
};

export type InsightResponse = Partial<Record<InsightTopic, Insight>>;
