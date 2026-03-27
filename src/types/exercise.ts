export type TranslationExercise = {
  kind: "translation";
  id: string;
  prompt: string;
  answer: string;
};

export type FillExercise = {
  kind: "fill";
  id: string;
  prompt: string;
  answer: string;
};

export type McqExercise = {
  kind: "mcq";
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type TopicExercise = TranslationExercise | FillExercise | McqExercise;
