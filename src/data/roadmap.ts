import { roadmapSections } from "./roadmapSectionsData";
import type { Topic } from "./roadmapTypes";

export type { Section, Topic } from "./roadmapTypes";

export { roadmapSections };

const allTopicsFlat = roadmapSections.flatMap((s) => s.topics);

export function getTopicById(id: string): Topic | undefined {
  return allTopicsFlat.find((t) => t.id === id);
}
