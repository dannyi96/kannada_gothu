import { useEffect } from "react";
import type { Topic } from "../data/roadmap";

type TopicPanelProps = {
  topic: Topic | null;
  status: "locked" | "unlocked" | "completed" | null;
  onMarkCompleted: (topicId: string) => void;
  onClose: () => void;
};

export function TopicPanel({ topic, status, onMarkCompleted, onClose }: TopicPanelProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-2 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-200 shadow-2xl sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              <span className="mr-2">{lessonIcon}</span>
              {topic.title}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Difficulty: <span className="font-medium capitalize">{topic.difficulty}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-700 px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            Close
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Notes and Examples</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-200">
            {topic.content.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        {status === "locked" ? (
          <p className="mt-4 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300">
            This lesson is locked. Complete prerequisites to unlock it.
          </p>
        ) : null}
        <button
          type="button"
          disabled={!canComplete}
          onClick={() => onMarkCompleted(topic.id)}
          className={`mt-5 rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
            canComplete ? "bg-emerald-600 hover:bg-emerald-700" : "cursor-not-allowed bg-slate-600"
          }`}
        >
          {status === "completed" ? "Completed" : "Mark as Completed"}
        </button>
      </aside>
    </div>
  );
}
