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

type CategoryMeta = {
  icon: string;
  label: string;
  accent: string;
};

const statusClasses: Record<TopicStatus, string> = {
  locked: "border-slate-700 bg-slate-900/90 text-slate-500",
  unlocked:
    "border-blue-500/50 bg-gradient-to-br from-slate-900 to-slate-800 text-blue-200 hover:from-slate-800 hover:to-slate-700",
  completed:
    "border-emerald-500/50 bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-200 hover:from-slate-800 hover:to-slate-700",
};

const difficultyClasses: Record<Topic["difficulty"], string> = {
  easy: "bg-sky-500/20 text-sky-200",
  medium: "bg-amber-500/20 text-amber-200",
  hard: "bg-rose-500/20 text-rose-200",
};

const getCategoryMeta = (sectionTitle: string, topicTitle: string): CategoryMeta => {
  const text = `${sectionTitle} ${topicTitle}`.toLowerCase();
  if (text.includes("conversation") || text.includes("dialogue") || text.includes("shopping") || text.includes("travel") || text.includes("office")) {
    return { icon: "💬", label: "Conversation", accent: "border-l-cyan-400" };
  }
  if (text.includes("tense") || text.includes("continuous")) {
    return { icon: "⏱️", label: "Tense", accent: "border-l-violet-400" };
  }
  if (text.includes("question") || text.includes("negation")) {
    return { icon: "❓", label: "Question", accent: "border-l-pink-400" };
  }
  if (text.includes("location") || text.includes("postposition")) {
    return { icon: "📍", label: "Location", accent: "border-l-emerald-400" };
  }
  if (text.includes("number") || text.includes("greeting") || text.includes("introducing")) {
    return { icon: "🗣️", label: "Basics", accent: "border-l-sky-400" };
  }
  return { icon: "🧠", label: "Grammar", accent: "border-l-amber-400" };
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
      className="relative overflow-auto rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-5 shadow-xl"
    >
      <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" aria-hidden="true">
        {edges.map((edge) => (
          <path
            key={`${edge.fromId}-${edge.toId}`}
            d={`M ${edge.x1} ${edge.y1} C ${edge.x1} ${(edge.y1 + edge.y2) / 2}, ${edge.x2} ${(edge.y1 + edge.y2) / 2}, ${edge.x2} ${edge.y2}`}
            fill="none"
            stroke={selectedTopicId === edge.toId || selectedTopicId === edge.fromId ? "#60a5fa" : "#334155"}
            strokeWidth="2"
            opacity={selectedTopicId === edge.toId || selectedTopicId === edge.fromId ? "0.95" : "0.8"}
          />
        ))}
      </svg>

      <div className="relative z-10 space-y-5 pb-2">
        {sections.map((section) => (
          <section key={section.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <h2 className="mb-3 text-sm font-semibold text-slate-200 md:text-base">{section.title}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {section.topics.map((topic) => {
                const status = getTopicStatus(topic);
                const isSelected = selectedTopicId === topic.id;
                const category = getCategoryMeta(section.title, topic.title);

                return (
                  <button
                    key={topic.id}
                    ref={(el) => {
                      nodeRefs.current[topic.id] = el;
                    }}
                    type="button"
                    onClick={() => onSelectTopic(topic.id)}
                    className={`rounded-xl border border-l-4 p-3 text-left shadow-sm transition duration-150 ${
                      statusClasses[status]
                    } ${category.accent} ${isSelected ? "ring-2 ring-blue-400 ring-offset-0" : "hover:-translate-y-0.5"} cursor-pointer`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-slate-400">{category.icon} {category.label}</p>
                        <p className="text-sm font-semibold">{topic.title}</p>
                      </div>
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
