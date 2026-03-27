import type { Topic } from "../data/roadmap";

type TopicStatus = "locked" | "unlocked" | "completed";

type TopicItemProps = {
  topic: Topic;
  status: TopicStatus;
  onSelect: (topicId: string) => void;
  isSelected: boolean;
};

const difficultyClasses: Record<Topic["difficulty"], string> = {
  easy: "bg-sky-100 text-sky-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

const statusClasses: Record<TopicStatus, string> = {
  locked: "border-slate-300 bg-slate-100 text-slate-400",
  unlocked: "border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100",
  completed: "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
};

const statusLabel: Record<TopicStatus, string> = {
  locked: "Locked",
  unlocked: "Unlocked",
  completed: "Completed",
};

export function TopicItem({ topic, status, onSelect, isSelected }: TopicItemProps) {
  const disabled = status === "locked";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(topic.id)}
      className={`w-full rounded-xl border p-4 text-left transition ${statusClasses[status]} ${
        isSelected ? "ring-2 ring-offset-1 ring-slate-500" : ""
      } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">{topic.title}</p>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${difficultyClasses[topic.difficulty]}`}>
          {topic.difficulty}
        </span>
      </div>
      <div className="mt-2 text-sm opacity-90">{statusLabel[status]}</div>
    </button>
  );
}
