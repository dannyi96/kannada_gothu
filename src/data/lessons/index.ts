import { getTopicById, roadmapSections } from "../roadmap";
import type { LessonFlashcard, LessonPayload } from "../../types/lesson";
import { buildLessonFromTopic } from "../../utils/buildLessonFromTopic";

export function getLessonForTopic(topicId: string): LessonPayload | undefined {
  const topic = getTopicById(topicId);
  if (!topic) return undefined;
  return buildLessonFromTopic(topic);
}

export function getAllAuthoredLessons(): LessonPayload[] {
  return roadmapSections.flatMap((s) => s.topics).map((t) => buildLessonFromTopic(t));
}

export function getAllLessonFlashcards(): LessonFlashcard[] {
  return getAllAuthoredLessons().flatMap((l) => l.flashcards);
}
