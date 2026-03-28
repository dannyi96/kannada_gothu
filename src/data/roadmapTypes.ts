export type Topic = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  prerequisites: string[];
  content: string[];
};

export type Section = {
  id: string;
  title: string;
  topics: Topic[];
};
