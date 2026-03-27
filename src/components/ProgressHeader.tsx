import { percentComplete } from "../utils/progression";

type ProgressHeaderProps = {
  completedCount: number;
  totalTopics: number;
  xp: number;
  streak: number;
  startTopicTitle: string | null;
  nextTopicTitle: string | null;
  onContinue: () => void;
  onReset: () => void;
};

export function ProgressHeader({
  completedCount,
  totalTopics,
  xp,
  streak,
  startTopicTitle,
  nextTopicTitle,
  onContinue,
  onReset,
}: ProgressHeaderProps) {
  const pct = percentComplete(totalTopics, completedCount);

  return (
    <header className="mb-6 space-y-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">Kannada Gothu</h1>
          <p className="mt-1 text-base text-slate-400">
            Structured path from survival phrases to real conversations — like a NeetCode roadmap for Kannada.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-200">
            {xp} XP
          </span>
          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-200">
            {streak} day streak
          </span>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Reset progress
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <span className="font-medium text-slate-300">
            Progress: {completedCount} / {totalTopics} topics
          </span>
          <span className="text-slate-500">{pct}% complete</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {startTopicTitle ? (
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-emerald-400">Start here:</span>{" "}
            <span className="text-slate-200">{startTopicTitle}</span>
            {" — "}
            Beginners should open the first unlocked topic and work downward.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {nextTopicTitle ? (
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:bg-sky-500 active:scale-[0.98]"
            >
              Continue learning → {nextTopicTitle}
            </button>
          ) : completedCount >= totalTopics && totalTopics > 0 ? (
            <p className="text-sm font-medium text-emerald-400">You have completed every topic. ಧನ್ಯವಾದಗಳು!</p>
          ) : null}
        </div>
      </div>

      {nextTopicTitle ? (
        <p className="text-sm text-slate-500">
          <span className="font-medium text-violet-400">Recommended next:</span> {nextTopicTitle}
        </p>
      ) : null}
    </header>
  );
}
