import { useEffect, useState } from "react";
import type { Topic } from "../data/roadmap";
import { getExercisesForTopic } from "../utils/exerciseGenerator";
import { splitTopicContent } from "../utils/topicContent";
import { TopicExercises } from "./TopicExercises";

type TopicPanelProps = {
  topic: Topic | null;
  status: "locked" | "unlocked" | "completed" | null;
  prerequisiteTitles: string[];
  onMarkCompleted: (topicId: string) => void;
  onClose: () => void;
};

export function TopicPanel({
  topic,
  status,
  prerequisiteTitles,
  onMarkCompleted,
  onClose,
}: TopicPanelProps) {
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (!topic) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [topic, onClose]);

  if (!topic || !status) {
    return null;
  }

  const canComplete = status === "unlocked";
  const markDisabled = status === "locked" || status === "completed";
  const topicLower = topic.title.toLowerCase();
  const lessonIcon =
    topicLower.includes("conversation") || topicLower.includes("dialogue")
      ? "💬"
      : topicLower.includes("tense") || topicLower.includes("continuous")
        ? "⏱️"
        : topicLower.includes("question") || topicLower.includes("negation")
          ? "❓"
          : topicLower.includes("location") || topicLower.includes("postposition")
            ? "📍"
            : topicLower.includes("greeting") || topicLower.includes("number")
              ? "🗣️"
              : "🧠";

  const { concepts, examples } = splitTopicContent(topic.content);
  const exercises = getExercisesForTopic(topic);

  const difficultyStyle =
    topic.difficulty === "easy"
      ? "bg-sky-500/20 text-sky-200 ring-sky-500/40"
      : topic.difficulty === "medium"
        ? "bg-amber-500/20 text-amber-200 ring-amber-500/40"
        : "bg-rose-500/20 text-rose-200 ring-rose-500/40";

  const handleComplete = () => {
    if (!canComplete) return;
    onMarkCompleted(topic.id);
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 p-2 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-slate-800 p-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-50 md:text-2xl">
                <span className="mr-2">{lessonIcon}</span>
                {topic.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${difficultyStyle}`}>
                  {topic.difficulty}
                </span>
                <span className="text-sm text-slate-500">
                  {status === "completed" ? "Completed" : status === "locked" ? "Locked" : "In progress"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {status === "locked" ? (
            <div
              className="rounded-xl border border-amber-500/40 bg-amber-950/40 p-4 text-amber-100"
              role="alert"
            >
              <p className="font-semibold text-amber-50">Complete prerequisites first</p>
              <p className="mt-1 text-sm text-amber-200/90">
                Finish the topics below before this lesson unlocks.
              </p>
              {prerequisiteTitles.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-100/90">
                  {prerequisiteTitles.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {status !== "locked" ? (
            <>
              <section className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Concepts</h3>
                {concepts.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-200">
                    {concepts.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No separate concept notes — see examples below.</p>
                )}
              </section>

              <div className="my-6 border-t border-slate-800" />

              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Examples & phrases</h3>
                {examples.length > 0 ? (
                  <ul className="mt-3 space-y-2 rounded-xl border border-slate-700/80 bg-slate-800/50 p-4 font-mono text-sm leading-relaxed text-slate-100 shadow-inner">
                    {examples.map((line) => (
                      <li key={line} className="border-l-2 border-sky-500/50 pl-3">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No phrase pairs listed for this topic.</p>
                )}
              </section>

              <div className="my-6 border-t border-slate-800" />

              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Practice</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Short exercises — answer client-side; no data leaves your browser.
                </p>
                <div className="mt-4">
                  <TopicExercises topicId={topic.id} exercises={exercises} />
                </div>
              </section>
            </>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-slate-800 bg-slate-900/95 p-4 backdrop-blur">
          <button
            type="button"
            disabled={markDisabled}
            onClick={handleComplete}
            className={`w-full rounded-xl px-4 py-3.5 text-base font-semibold shadow-lg transition duration-200 ${
              celebrate ? "scale-[1.02] bg-emerald-500 text-white shadow-emerald-900/50" : ""
            } ${
              status === "completed"
                ? "cursor-default bg-emerald-900/80 text-emerald-200 ring-1 ring-emerald-500/40"
                : canComplete
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98]"
                  : "cursor-not-allowed bg-slate-600 text-slate-300 opacity-90"
            }`}
          >
            {status === "completed" ? "Completed ✓" : "Mark as Completed"}
          </button>
          {status === "locked" ? (
            <p className="mt-2 text-center text-xs text-slate-500">Unlock this topic to mark it complete.</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
