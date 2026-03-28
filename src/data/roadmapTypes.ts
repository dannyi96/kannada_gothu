export type TopicInput = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  prerequisites: string[];
  content: string[];
};

export type Topic = TopicInput & {
  /** Short learner-facing summary shown first under Ideas. */
  overview: string[];
};

export type SectionInput = {
  id: string;
  title: string;
  topics: TopicInput[];
};

export type Section = {
  id: string;
  title: string;
  topics: Topic[];
};
