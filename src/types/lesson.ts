export type McqTag = "vocab" | "structure" | "translation";

export type LessonMcq = {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  tag?: McqTag;
};

export type LessonFlashcardKind = "knToEn" | "enToKn" | "completion";

export type LessonFlashcard = {
  id: string;
  kind: LessonFlashcardKind;
  front: string;
  back: string;
};

export type LessonPayload = {
  topicId: string;
  concepts: string[];
  examples: { kannada: string; english?: string }[];
  miniPractice: LessonMcq[];
  quiz: LessonMcq[];
  flashcards: LessonFlashcard[];
};
