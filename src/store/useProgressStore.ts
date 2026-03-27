import { create } from "zustand";

const STORAGE_KEY = "kannada-roadmap-progress-v2";

const XP_PER_TOPIC = 10;

type PersistedShape = {
  completedTopics: string[];
  xp: number;
  streak: number;
  lastActiveDate: string | null;
};

type ProgressState = {
  completedTopics: Set<string>;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  markCompleted: (topicId: string) => void;
  resetProgress: () => void;
  recordVisit: () => void;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadPersisted(): PersistedShape {
  if (typeof window === "undefined") {
    return { completedTopics: [], xp: 0, streak: 0, lastActiveDate: null };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const legacy = window.localStorage.getItem("kannada-roadmap-completed-topics");
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy) as string[];
        return {
          completedTopics: Array.isArray(parsed) ? parsed : [],
          xp: 0,
          streak: 0,
          lastActiveDate: null,
        };
      } catch {
        /* fall through */
      }
    }
    return { completedTopics: [], xp: 0, streak: 0, lastActiveDate: null };
  }

  try {
    const p = JSON.parse(raw) as Partial<PersistedShape>;
    return {
      completedTopics: Array.isArray(p.completedTopics) ? p.completedTopics : [],
      xp: typeof p.xp === "number" ? p.xp : 0,
      streak: typeof p.streak === "number" ? p.streak : 0,
      lastActiveDate: typeof p.lastActiveDate === "string" ? p.lastActiveDate : null,
    };
  } catch {
    return { completedTopics: [], xp: 0, streak: 0, lastActiveDate: null };
  }
}

function persist(state: {
  completedTopics: Set<string>;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
}) {
  if (typeof window === "undefined") return;
  const payload: PersistedShape = {
    completedTopics: Array.from(state.completedTopics),
    xp: state.xp,
    streak: state.streak,
    lastActiveDate: state.lastActiveDate,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function computeStreakOnVisit(
  last: string | null,
  streak: number,
  today: string,
): { streak: number; lastActiveDate: string } {
  if (!last) {
    return { streak: 1, lastActiveDate: today };
  }
  if (last === today) {
    return { streak, lastActiveDate: today };
  }
  if (last === yesterdayIso()) {
    return { streak: streak + 1, lastActiveDate: today };
  }
  return { streak: 1, lastActiveDate: today };
}

const initial = loadPersisted();

export const useProgressStore = create<ProgressState>((set) => ({
  completedTopics: new Set(initial.completedTopics),
  xp: initial.xp,
  streak: initial.streak,
  lastActiveDate: initial.lastActiveDate,

  markCompleted: (topicId) =>
    set((state) => {
      if (state.completedTopics.has(topicId)) {
        return state;
      }

      const next = new Set(state.completedTopics);
      next.add(topicId);
      const visit = computeStreakOnVisit(state.lastActiveDate, state.streak, todayIso());
      const newState = {
        completedTopics: next,
        xp: state.xp + XP_PER_TOPIC,
        streak: visit.streak,
        lastActiveDate: visit.lastActiveDate,
      };
      persist(newState);
      return newState;
    }),

  resetProgress: () =>
    set(() => {
      const empty = {
        completedTopics: new Set<string>(),
        xp: 0,
        streak: 0,
        lastActiveDate: null as string | null,
      };
      persist(empty);
      return empty;
    }),

  recordVisit: () =>
    set((state) => {
      const visit = computeStreakOnVisit(state.lastActiveDate, state.streak, todayIso());
      if (visit.streak === state.streak && visit.lastActiveDate === state.lastActiveDate) {
        return state;
      }
      const next = { ...state, streak: visit.streak, lastActiveDate: visit.lastActiveDate };
      persist({
        completedTopics: state.completedTopics,
        xp: state.xp,
        streak: next.streak,
        lastActiveDate: next.lastActiveDate,
      });
      return next;
    }),
}));
