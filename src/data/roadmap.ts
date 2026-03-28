import { roadmapSectionsRaw } from "./roadmapSectionsData";
import { TOPIC_OVERVIEWS } from "./topicOverviews";
import type { Section, Topic, TopicInput } from "./roadmapTypes";

export type { Section, Topic, TopicInput } from "./roadmapTypes";

function defaultOverview(t: TopicInput): string[] {
  return [
    `This lesson covers “${t.title}”: patterns and vocabulary from your notes.`,
    "Read the key points below, then use Examples for exact phrases before Practice and Quiz.",
  ];
}

function toTopic(t: TopicInput): Topic {
  return {
    ...t,
    overview: TOPIC_OVERVIEWS[t.id] ?? defaultOverview(t),
  };
}

export const roadmapSections: Section[] = roadmapSectionsRaw.map((s) => ({
  ...s,
  topics: s.topics.map(toTopic),
}));

const allTopicsFlat = roadmapSections.flatMap((s) => s.topics);

export function getTopicById(id: string): Topic | undefined {
  return allTopicsFlat.find((t) => t.id === id);
}
