import { create } from "zustand";

const STORAGE_KEY = "kannada-flashcards-srs-v1";
const MAX_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;
const MIN_EASE = 1.3;
const MAX_EASE = 2.5;
const MIN_INTERVAL_MS = 60_000;
const LAPSE_DELAY_MS = 5 * 60_000;

export type CardMeta = {
  ease: number;
  intervalMs: number;
  dueAt: number;
};

type PersistedShape = {
  metaById: Record<string, CardMeta>;
};

type FlashcardStore = {
  metaById: Record<string, CardMeta>;
  rate: (cardId: string, knew: boolean) => void;
  resetCard: (cardId: string) => void;
  resetAll: () => void;
};

function defaultMeta(): CardMeta {
  return { ease: 2.0, intervalMs: MIN_INTERVAL_MS, dueAt: 0 };
}

function loadPersisted(): PersistedShape {
  if (typeof window === "undefined") {
    return { metaById: {} };
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { metaById: {} };
  try {
    const p = JSON.parse(raw) as Partial<PersistedShape>;
    return {
      metaById: p.metaById && typeof p.metaById === "object" ? p.metaById : {},
    };
  } catch {
    return { metaById: {} };
  }
}

function persist(metaById: Record<string, CardMeta>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ metaById }));
}

function scheduleAfterKnown(prev: CardMeta): CardMeta {
  const ease = Math.min(MAX_EASE, prev.ease + 0.05);
  const base = Math.max(prev.intervalMs, MIN_INTERVAL_MS);
  const intervalMs = Math.min(MAX_INTERVAL_MS, base * ease);
  return {
    ease,
    intervalMs,
    dueAt: Date.now() + intervalMs,
  };
}

function scheduleAfterUnknown(prev: CardMeta): CardMeta {
  const ease = Math.max(MIN_EASE, prev.ease - 0.2);
  const intervalMs = Math.max(MIN_INTERVAL_MS, prev.intervalMs * 0.5);
  return {
    ease,
    intervalMs,
    dueAt: Date.now() + LAPSE_DELAY_MS,
  };
}

const initial = loadPersisted();

export const useFlashcardStore = create<FlashcardStore>((set) => ({
  metaById: initial.metaById,

  rate: (cardId, knew) =>
    set((state) => {
      const prev = state.metaById[cardId] ?? defaultMeta();
      const next = knew ? scheduleAfterKnown(prev) : scheduleAfterUnknown(prev);
      const metaById = { ...state.metaById, [cardId]: next };
      persist(metaById);
      return { metaById };
    }),

  resetCard: (cardId) =>
    set((state) => {
      const metaById = { ...state.metaById };
      delete metaById[cardId];
      persist(metaById);
      return { metaById };
    }),

  resetAll: () =>
    set(() => {
      persist({});
      return { metaById: {} };
    }),
}));

export function getMetaDueAt(cardId: string, metaById: Record<string, CardMeta>): number {
  return metaById[cardId]?.dueAt ?? 0;
}

/** Cards that are due now (including never-seen). */
export function buildDueQueue<T extends { id: string }>(cards: T[], metaById: Record<string, CardMeta>, now: number): T[] {
  const due = cards.filter((c) => getMetaDueAt(c.id, metaById) <= now);
  due.sort((a, b) => getMetaDueAt(a.id, metaById) - getMetaDueAt(b.id, metaById));
  return due;
}
