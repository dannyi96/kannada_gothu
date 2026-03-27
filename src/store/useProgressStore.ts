import { create } from "zustand";

const STORAGE_KEY = "kannada-roadmap-completed-topics";

type ProgressState = {
  completedTopics: Set<string>;
  markCompleted: (topicId: string) => void;
  resetProgress: () => void;
};

const loadInitialCompletedTopics = (): Set<string> => {
  if (typeof window === "undefined") {
    return new Set();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return new Set();
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
};

const persist = (completedTopics: Set<string>) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedTopics)));
};

export const useProgressStore = create<ProgressState>((set) => ({
  completedTopics: loadInitialCompletedTopics(),
  markCompleted: (topicId) =>
    set((state) => {
      const next = new Set(state.completedTopics);
      next.add(topicId);
      persist(next);
      return { completedTopics: next };
    }),
  resetProgress: () =>
    set(() => {
      const empty = new Set<string>();
      persist(empty);
      return { completedTopics: empty };
    }),
}));
