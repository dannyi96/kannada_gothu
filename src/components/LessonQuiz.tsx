import { useState } from "react";
import type { LessonMcq } from "../types/lesson";

type LessonQuizProps = {
  topicId: string;
  questions: LessonMcq[];
  onFinish?: () => void;
};

export function LessonQuiz({ topicId, questions, onFinish }: LessonQuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];
  const isLast = index >= questions.length - 1;
  const correct = submitted && selected === q.correctIndex;
  const name = `${topicId}-quiz-${q.id}`;

  const check = () => {
    if (selected === null || !q) return;
    setSubmitted(true);
    if (selected === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const next = () => {
    if (!submitted) return;
    if (isLast) {
      setFinished(true);
      onFinish?.();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setSubmitted(false);
  };

  if (questions.length === 0) {
    return (
      <p className="text-sm text-slate-500">No quiz questions for this lesson.</p>
    );
  }

  if (finished) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-center">
        <p className="text-lg font-semibold text-emerald-100">Quiz complete</p>
        <p className="mt-2 text-sm text-slate-300">
          You got <span className="font-bold text-emerald-300">{correctCount}</span> of{" "}
          <span className="font-bold">{questions.length}</span> correct.
        </p>
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setSelected(null);
            setSubmitted(false);
            setCorrectCount(0);
            setFinished(false);
          }}
          className="mt-4 rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          Retry quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <div className="flex gap-1" aria-hidden>
          {questions.map((_, i) => (
            <span
              key={questions[i].id}
              className={`h-1.5 w-6 rounded-full ${i < index ? "bg-emerald-600/80" : i === index ? "bg-sky-500" : "bg-slate-700"}`}
            />
          ))}
        </div>
      </div>

      <div
        className={`rounded-xl border p-4 transition duration-200 ${
          submitted
            ? correct
              ? "border-emerald-500/50 bg-emerald-950/30"
              : "border-rose-500/40 bg-rose-950/20"
            : "border-slate-700 bg-slate-800/40"
        }`}
      >
        <p className="text-sm font-medium text-slate-200">{q.prompt}</p>
        {q.tag ? (
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{q.tag}</p>
        ) : null}

        <ul className="mt-3 space-y-2">
          {q.options.map((opt, i) => (
            <li key={opt}>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm transition hover:border-slate-600 ${
                  submitted && i === q.correctIndex ? "ring-1 ring-emerald-500/50" : ""
                } ${submitted && selected === i && i !== q.correctIndex ? "ring-1 ring-rose-500/40" : ""}`}
              >
                <input
                  type="radio"
                  name={name}
                  className="accent-sky-500"
                  disabled={submitted}
                  checked={selected === i}
                  onChange={() => {
                    setSelected(i);
                  }}
                />
                <span>{opt}</span>
              </label>
            </li>
          ))}
        </ul>

        {submitted ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            <span className="font-semibold text-slate-400">Why: </span>
            {q.explanation}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {!submitted ? (
          <button
            type="button"
            onClick={check}
            disabled={selected === null}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            {isLast ? "See results" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}
