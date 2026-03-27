import type { Topic } from "../data/roadmap";

type TopicPanelProps = {
  topic: Topic | null;
  status: "locked" | "unlocked" | "completed" | null;
  onMarkCompleted: (topicId: string) => void;
};

export function TopicPanel({ topic, status, onMarkCompleted }: TopicPanelProps) {
  if (!topic || !status) {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Topic Details</h2>
        <p className="mt-2 text-sm text-slate-600">Select an unlocked topic to view notes from the PDF.</p>
      </aside>
    );
  }

  const canComplete = status === "unlocked";

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{topic.title}</h2>
      <p className="mt-1 text-sm text-slate-600">
        Difficulty: <span className="font-medium capitalize">{topic.difficulty}</span>
      </p>
      <div className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Extracted Notes</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {topic.content.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        disabled={!canComplete}
        onClick={() => onMarkCompleted(topic.id)}
        className={`mt-5 rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
          canComplete ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-400 cursor-not-allowed"
        }`}
      >
        {status === "completed" ? "Completed" : "Mark as Completed"}
      </button>
    </aside>
  );
}
