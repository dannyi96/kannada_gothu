import type { Topic } from "../data/roadmap";
import { isUnlocked } from "./unlockLogic";

/** First topic with no prerequisites — entry point for new learners. */
export function getStartHereTopicId(topics: Topic[]): string | null {
  const t = topics.find((x) => x.prerequisites.length === 0);
  return t?.id ?? null;
}

/**
 * Recommended next: first topic in roadmap order that is unlocked and not completed.
 * Falls back to first incomplete locked topic’s prerequisite chain (still show first unlocked).
 */
export function getRecommendedNextTopicId(
  topics: Topic[],
  completedTopics: Set<string>,
): string | null {
  for (const topic of topics) {
    if (completedTopics.has(topic.id)) continue;
    if (isUnlocked(topic, completedTopics)) {
      return topic.id;
    }
  }
  return null;
}

export function percentComplete(total: number, completed: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}
