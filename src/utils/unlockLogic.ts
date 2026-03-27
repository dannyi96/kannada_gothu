import type { Topic } from "../data/roadmap";

export const isUnlocked = (topic: Topic, completedTopics: Set<string>): boolean => {
  if (topic.prerequisites.length === 0) {
    return true;
  }

  return topic.prerequisites.every((prerequisiteId) => completedTopics.has(prerequisiteId));
};
