import type { ReactNode } from "react";

type CollapsibleRoadmapSectionProps = {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function CollapsibleRoadmapSection({
  id,
  title,
  open,
  onToggle,
  children,
}: CollapsibleRoadmapSectionProps) {
  return (
    <section
      id={id}
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg transition-shadow duration-300 hover:shadow-xl"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-slate-800/40 md:p-5"
        aria-expanded={open}
      >
        <h2 className="text-lg font-semibold tracking-tight text-slate-100 md:text-xl">{title}</h2>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-400 transition-transform duration-300 ease-out ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {open ? (
        <div className="topic-section-enter border-t border-slate-800/80 p-4 pt-3 md:p-5 md:pt-4">
          {children}
        </div>
      ) : null}
    </section>
  );
}
