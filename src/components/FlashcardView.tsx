import { useEffect, useMemo, useState } from "react";
import { getAllLessonFlashcards } from "../data/lessons";
import { buildDueQueue, useFlashcardStore } from "../store/useFlashcardStore";
import type { LessonFlashcardKind } from "../types/lesson";

function kindLabel(kind: LessonFlashcardKind): string {
  switch (kind) {
    case "knToEn":
      return "Kannada → English";
    case "enToKn":
      return "English → Kannada";
    case "completion":
      return "Complete the sentence";
  }
}

export function FlashcardView() {
  const metaById = useFlashcardStore((s) => s.metaById);
  const rate = useFlashcardStore((s) => s.rate);
  const resetAll = useFlashcardStore((s) => s.resetAll);

  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setClock(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const deck = useMemo(() => getAllLessonFlashcards(), []);
  const queue = useMemo(() => buildDueQueue(deck, metaById, clock), [deck, metaById, clock]);

  const [flipped, setFlipped] = useState(false);
  const current = queue[0] ?? null;

  const handleRate = (knew: boolean) => {
    if (!current) return;
    rate(current.id, knew);
    setFlipped(false);
  };

  if (deck.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
        No flashcards yet. Authored lessons will add cards here.
      </div>
    );
  }

  if (!current) {
    const now = clock;
    const futureDue = deck
      .map((c) => metaById[c.id]?.dueAt)
      .filter((t): t is number => typeof t === "number" && t > now);
    const nextDue = futureDue.length > 0 ? Math.min(...futureDue) : null;
    const waitMs = nextDue !== null ? nextDue - now : null;

    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center">
          <p className="text-lg font-semibold text-emerald-100">You&apos;re caught up</p>
          <p className="mt-2 text-sm text-slate-400">
            Nothing is due right now. Come back after intervals increase, or reset progress to practice again.
          </p>
          {waitMs !== null && waitMs > 0 ? (
            <p className="mt-3 text-xs text-slate-500">
              Next card in ~{Math.ceil(waitMs / 60_000)} min (approx.)
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => resetAll()}
          className="w-full rounded-xl border border-slate-600 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
        >
          Reset flashcard progress
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <p className="text-center text-sm text-slate-500">
        {queue.length} card{queue.length === 1 ? "" : "s"} due · Tap the card to flip
      </p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="relative min-h-[200px] w-full rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-left shadow-xl transition hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-400/90">{kindLabel(current.kind)}</p>
        <p className="mt-4 text-lg leading-relaxed text-slate-100">
          {flipped ? current.back : current.front}
        </p>
        <p className="mt-6 text-xs text-slate-500">{flipped ? "Answer" : "Prompt"} · click to flip</p>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleRate(false)}
          className="rounded-xl border border-rose-500/40 bg-rose-950/30 py-3 text-sm font-semibold text-rose-100 hover:bg-rose-950/50"
        >
          I didn&apos;t know this
        </button>
        <button
          type="button"
          onClick={() => handleRate(true)}
          className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-950/50"
        >
          I knew this
        </button>
      </div>

      <p className="text-center text-xs text-slate-600">
        Spaced repetition: correct answers wait longer; slips return sooner. Stored only in your browser.
      </p>
    </div>
  );
}
