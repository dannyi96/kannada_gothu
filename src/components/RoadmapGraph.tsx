import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Section, Topic } from "../data/roadmap";
import { CollapsibleRoadmapSection } from "./CollapsibleRoadmapSection";

type TopicStatus = "locked" | "unlocked" | "completed";

type Node = {
  topic: Topic;
  sectionId: string;
  sectionTitle: string;
};

type RoadmapGraphProps = {
  sections: Section[];
  selectedTopicId: string | null;
  recommendedTopicId: string | null;
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
  locked:
    "border-slate-700/90 bg-slate-950/90 text-slate-500 hover:bg-slate-900/95 cursor-pointer opacity-[0.92]",
  unlocked:
    "border-blue-500/55 bg-gradient-to-br from-slate-900 to-slate-800 text-blue-100 hover:from-slate-800 hover:to-slate-700 hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
  completed:
    "border-emerald-500/55 bg-gradient-to-br from-slate-900 to-emerald-950/30 text-emerald-100 hover:from-slate-800 hover:to-emerald-950/40 hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
};

const difficultyClasses: Record<Topic["difficulty"], string> = {
  easy: "bg-sky-500/25 text-sky-100 ring-1 ring-sky-500/30",
  medium: "bg-amber-500/25 text-amber-100 ring-1 ring-amber-500/30",
  hard: "bg-rose-500/25 text-rose-100 ring-1 ring-rose-500/30",
};

const getCategoryMeta = (sectionTitle: string, topicTitle: string): CategoryMeta => {
  const text = `${sectionTitle} ${topicTitle}`.toLowerCase();
  if (
    text.includes("conversation") ||
    text.includes("dialogue") ||
    text.includes("shopping") ||
    text.includes("travel") ||
    text.includes("office")
  ) {
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
  recommendedTopicId,
  getTopicStatus,
  onSelectTopic,
}: RoadmapGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({});

  const effectiveSectionOpen = useMemo(() => {
    const out: Record<string, boolean> = {};
    for (const s of sections) {
      out[s.id] = sectionOpen[s.id] ?? true;
    }
    return out;
  }, [sections, sectionOpen]);

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
        if (effectiveSectionOpen[node.sectionId] === false) continue;

        const toEl = nodeRefs.current[node.topic.id];
        if (!toEl) continue;
        const toRect = toEl.getBoundingClientRect();
        if (toRect.height < 4) continue;
        const toX = toRect.left + toRect.width / 2 - containerRect.left + container.scrollLeft;
        const toY = toRect.top - containerRect.top + container.scrollTop;

        for (const prerequisiteId of node.topic.prerequisites) {
          const fromNode = nodes.find((n) => n.topic.id === prerequisiteId);
          if (fromNode && effectiveSectionOpen[fromNode.sectionId] === false) continue;

          const fromEl = nodeRefs.current[prerequisiteId];
          if (!fromEl) continue;
          const fromRect = fromEl.getBoundingClientRect();
          if (fromRect.height < 4) continue;
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
  }, [nodes, selectedTopicId, effectiveSectionOpen]);

  const toggleSection = (id: string) => {
    setSectionOpen((prev) => {
      const current = prev[id] ?? true;
      return { ...prev, [id]: !current };
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 p-4 shadow-xl md:p-6"
    >
      <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" aria-hidden="true">
        {edges.map((edge) => (
          <path
            key={`${edge.fromId}-${edge.toId}`}
            d={`M ${edge.x1} ${edge.y1} C ${edge.x1} ${(edge.y1 + edge.y2) / 2}, ${edge.x2} ${(edge.y1 + edge.y2) / 2}, ${edge.x2} ${edge.y2}`}
            fill="none"
            stroke={selectedTopicId === edge.toId || selectedTopicId === edge.fromId ? "#38bdf8" : "#475569"}
            strokeWidth="2"
            opacity={selectedTopicId === edge.toId || selectedTopicId === edge.fromId ? "0.95" : "0.65"}
            className="transition-colors duration-300"
          />
        ))}
      </svg>

      <div className="relative z-10 space-y-5 pb-2">
        {sections.map((section) => {
          const open = effectiveSectionOpen[section.id] !== false;

          return (
            <CollapsibleRoadmapSection
              key={section.id}
              id={`roadmap-section-${section.id}`}
              title={section.title}
              open={open}
              onToggle={() => toggleSection(section.id)}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {section.topics.map((topic) => {
                  const status = getTopicStatus(topic);
                  const isSelected = selectedTopicId === topic.id;
                  const isRecommended = recommendedTopicId === topic.id && status !== "completed";
                  const category = getCategoryMeta(section.title, topic.title);

                  return (
                    <button
                      key={topic.id}
                      ref={(el) => {
                        nodeRefs.current[topic.id] = el;
                      }}
                      type="button"
                      onClick={() => onSelectTopic(topic.id)}
                      className={`rounded-xl border border-l-4 p-4 text-left shadow-md transition duration-200 ${
                        statusClasses[status]
                      } ${category.accent} ${
                        isSelected ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950" : ""
                      } ${
                        isRecommended && !isSelected
                          ? "ring-2 ring-violet-500/80 ring-offset-2 ring-offset-slate-950"
                          : ""
                      } active:scale-[0.99]`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">
                            {category.icon} {category.label}
                          </p>
                          <p className="text-base font-semibold leading-snug text-slate-50">{topic.title}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          {isRecommended ? (
                            <span className="rounded-full bg-violet-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-200 ring-1 ring-violet-400/40">
                              Next
                            </span>
                          ) : null}
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${difficultyClasses[topic.difficulty]}`}
                          >
                            {topic.difficulty}
                          </span>
                          {status === "completed" ? (
                            <span className="text-emerald-400" aria-hidden title="Completed">
                              ✓
                            </span>
                          ) : status === "locked" ? (
                            <span className="text-slate-600" aria-hidden title="Locked">
                              🔒
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-xs font-medium tracking-wide text-slate-400/90">
                        {status === "locked"
                          ? "Locked — tap to see prerequisites"
                          : status === "completed"
                            ? "Completed"
                            : "Ready to learn"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CollapsibleRoadmapSection>
          );
        })}
      </div>
    </div>
  );
}
