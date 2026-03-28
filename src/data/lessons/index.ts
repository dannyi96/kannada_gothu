import type { LessonFlashcard, LessonPayload } from "../../types/lesson";
import { greetingsLesson } from "./greetings";
import { sentenceStructureLesson } from "./sentenceStructure";

const LESSONS: LessonPayload[] = [greetingsLesson, sentenceStructureLesson];

const byTopicId = new Map<string, LessonPayload>(LESSONS.map((l) => [l.topicId, l]));

export function getLessonForTopic(topicId: string): LessonPayload | undefined {
  return byTopicId.get(topicId);
}

export function getAllAuthoredLessons(): LessonPayload[] {
  return LESSONS;
}

/** All flashcards from authored lessons (for review mode). */
export function getAllLessonFlashcards(): LessonFlashcard[] {
  return LESSONS.flatMap((l) => l.flashcards);
}
