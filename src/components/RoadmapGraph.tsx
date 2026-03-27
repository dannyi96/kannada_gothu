import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Section, Topic } from "../data/roadmap";

type TopicStatus = "locked" | "unlocked" | "completed";

type Node = {
  topic: Topic;
  sectionId: string;
  sectionTitle: string;
};

type RoadmapGraphProps = {
  sections: Section[];
  selectedTopicId: string | null;
  getTopicStatus: (topic: Topic) => TopicStatus;
  onSelectTopic: (topicId: string) => void;
};

type Edge = {
  fromId: string;
  toId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const statusClasses: Record<TopicStatus, string> = {
  locked: "border-slate-300 bg-slate-100 text-slate-400",
  unlocked: "border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100",
  completed: "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
};

const difficultyClasses: Record<Topic["difficulty"], string> = {
  easy: "bg-sky-100 text-sky-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

export function RoadmapGraph({
  sections,
  selectedTopicId,
  getTopicStatus,
  onSelectTopic,
}: RoadmapGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [edges, setEdges] = useState<Edge[]>([]);

  const nodes = useMemo<Node[]>(
    () =>
      sections.flatMap((section) =>
        section.topics.map((topic) => ({
          topic,
          sectionId: section.id,
          sectionTitle: section.title,
        })),
      ),
    [sections],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const computeEdges = () => {
      const containerRect = container.getBoundingClientRect();
      const nextEdges: Edge[] = [];

      for (const node of nodes) {
        const toEl = nodeRefs.current[node.topic.id];
        if (!toEl) continue;
        const toRect = toEl.getBoundingClientRect();
        const toX = toRect.left + toRect.width / 2 - containerRect.left + container.scrollLeft;
        const toY = toRect.top - containerRect.top + container.scrollTop;

        for (const prerequisiteId of node.topic.prerequisites) {
          const fromEl = nodeRefs.current[prerequisiteId];
          if (!fromEl) continue;
          const fromRect = fromEl.getBoundingClientRect();
          const fromX = fromRect.left + fromRect.width / 2 - containerRect.left + container.scrollLeft;
          const fromY = fromRect.bottom - containerRect.top + container.scrollTop;
          nextEdges.push({
            fromId: prerequisiteId,
            toId: node.topic.id,
            x1: fromX,
            y1: fromY,
            x2: toX,
            y2: toY,
          });
        }
      }
      setEdges(nextEdges);
    };

    computeEdges();
    const observer = new ResizeObserver(computeEdges);
    observer.observe(container);
    window.addEventListener("resize", computeEdges);
    container.addEventListener("scroll", computeEdges);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", computeEdges);
      container.removeEventListener("scroll", computeEdges);
    };
  }, [nodes, selectedTopicId]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" aria-hidden="true">
        {edges.map((edge) => (
          <path
            key={`${edge.fromId}-${edge.toId}`}
            d={`M ${edge.x1} ${edge.y1} C ${edge.x1} ${(edge.y1 + edge.y2) / 2}, ${edge.x2} ${(edge.y1 + edge.y2) / 2}, ${edge.x2} ${edge.y2}`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            opacity="0.75"
          />
        ))}
      </svg>

      <div className="relative z-10 min-w-[980px] space-y-6 pb-4">
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="mb-3 text-base font-semibold text-slate-900">{section.title}</h2>
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${Math.max(section.topics.length, 2)}, minmax(200px, 1fr))`,
              }}
            >
              {section.topics.map((topic) => {
                const status = getTopicStatus(topic);
                const isSelected = selectedTopicId === topic.id;
                const disabled = status === "locked";

                return (
                  <button
                    key={topic.id}
                    ref={(el) => {
                      nodeRefs.current[topic.id] = el;
                    }}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectTopic(topic.id)}
                    className={`rounded-xl border p-3 text-left transition ${
                      statusClasses[status]
                    } ${isSelected ? "ring-2 ring-slate-500 ring-offset-1" : ""} ${
                      disabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{topic.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyClasses[topic.difficulty]}`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <p className="text-xs opacity-90">
                      {status === "locked" ? "Locked" : status === "completed" ? "Completed" : "Unlocked"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
