import { useState } from "react";
import type { LessonMcq } from "../types/lesson";

type McqItemBlockProps = {
  item: LessonMcq;
  topicId: string;
};

export function McqItemBlock({ item, topicId }: McqItemBlockProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = submitted && selected === item.correctIndex;
  const name = `${topicId}-${item.id}`;

  const check = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  return (
    <div
      className={`rounded-xl border p-4 transition duration-200 ${
        submitted
          ? correct
            ? "border-emerald-500/50 bg-emerald-950/30"
            : "border-rose-500/40 bg-rose-950/20"
          : "border-slate-700 bg-slate-800/40"
      }`}
    >
      <p className="text-sm font-medium text-slate-200">{item.prompt}</p>
      {item.tag ? (
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{item.tag}</p>
      ) : null}

      <ul className="mt-3 space-y-2">
        {item.options.map((opt, i) => (
          <li key={opt}>
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm transition hover:border-slate-600 ${
                submitted && i === item.correctIndex ? "ring-1 ring-emerald-500/50" : ""
              } ${submitted && selected === i && i !== item.correctIndex ? "ring-1 ring-rose-500/40" : ""}`}
            >
              <input
                type="radio"
                name={name}
                className="accent-sky-500"
                disabled={submitted}
                checked={selected === i}
                onChange={() => setSelected(i)}
              />
              <span>{opt}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={check}
          disabled={selected === null || submitted}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-500 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check answer
        </button>
        {submitted ? (
          <span className={`text-sm font-medium ${correct ? "text-emerald-400" : "text-rose-400"}`}>
            {correct ? "Correct!" : "Not quite."}
          </span>
        ) : null}
      </div>

      {submitted ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-slate-400">Why: </span>
          {item.explanation}
        </p>
      ) : null}
    </div>
  );
}
