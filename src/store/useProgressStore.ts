import { create } from "zustand";
import { roadmapSections } from "../data/roadmap";

const STORAGE_KEY = "kannada-roadmap-progress-v3";
const PREV_STORAGE_KEY = "kannada-roadmap-progress-v2";

const VALID_TOPIC_IDS = new Set(roadmapSections.flatMap((s) => s.topics).map((t) => t.id));

/** Map retired topic ids (v2 roadmap) onto the closest v3 topic. */
const V2_TOPIC_TO_V3: Record<string, string> = {
  greetings: "greetings",
  "introducing-yourself": "conversation-hello-introduction",
  "basic-questions": "sentence-structure",
  "numbers-1-10": "numbers-0-through-10",
  "sentence-structure": "sentence-structure",
  pronouns: "pronouns-summary-copula",
  "verb-basics": "verbs-present-continuous",
  "respect-vs-informal": "pronouns-second",
  "gender-system": "gender-number-overview",
  plurals: "plurals-and-exceptions",
  demonstratives: "demonstratives",
  possessives: "possessives-table-recap",
  adjectives: "adjectives-basics",
  "question-words": "interrogatives",
  negation: "negative-illa",
  "present-tense": "verbs-present-continuous",
  "past-tense": "future-and-past-core",
  "future-tense": "future-and-past-core",
  "continuous-forms": "verbs-present-continuous",
  "postpositions-location": "alli-in-at",
  "basic-dialogue": "conversation-hello-introduction",
  shopping: "directions-shopping-eating",
  travel: "travel-phone-office",
  office: "travel-phone-office",
  connectors: "connectors-if-because-when",
};

function normalizeCompletedIds(ids: string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    if (VALID_TOPIC_IDS.has(id)) out.add(id);
    const mapped = V2_TOPIC_TO_V3[id];
    if (mapped && VALID_TOPIC_IDS.has(mapped)) out.add(mapped);
  }
  return Array.from(out);
}

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
    const prev = window.localStorage.getItem(PREV_STORAGE_KEY);
    if (prev) {
      try {
        const p = JSON.parse(prev) as Partial<PersistedShape>;
        const completed = Array.isArray(p.completedTopics) ? p.completedTopics : [];
        const migrated = normalizeCompletedIds(completed);
        const streak = typeof p.streak === "number" ? p.streak : 0;
        const lastActiveDate = typeof p.lastActiveDate === "string" ? p.lastActiveDate : null;
        const xp = migrated.length * XP_PER_TOPIC;
        const payload: PersistedShape = {
          completedTopics: migrated,
          xp,
          streak,
          lastActiveDate,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return payload;
      } catch {
        /* fall through */
      }
    }
    const legacy = window.localStorage.getItem("kannada-roadmap-completed-topics");
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy) as string[];
        const migrated = normalizeCompletedIds(Array.isArray(parsed) ? parsed : []);
        return {
          completedTopics: migrated,
          xp: migrated.length * XP_PER_TOPIC,
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
    const completed = Array.isArray(p.completedTopics) ? normalizeCompletedIds(p.completedTopics) : [];
    const xp = typeof p.xp === "number" ? p.xp : completed.length * XP_PER_TOPIC;
    return {
      completedTopics: completed,
      xp,
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
