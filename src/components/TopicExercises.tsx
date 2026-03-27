import { useState } from "react";
import type { TopicExercise } from "../types/exercise";

function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:]+$/g, "");
}

function answersMatch(user: string, expected: string): boolean {
  const a = normalizeAnswer(user);
  const b = normalizeAnswer(expected);
  if (!a || !b) return false;
  if (a === b) return true;
  return b.startsWith(a) || a.startsWith(b);
}

type TopicExercisesProps = {
  topicId: string;
  exercises: TopicExercise[];
};

export function TopicExercises({ topicId, exercises }: TopicExercisesProps) {
  if (exercises.length === 0) {
    return (
      <p className="rounded-xl border border-slate-700/80 bg-slate-800/40 p-4 text-sm text-slate-500">
        No auto-generated exercises for this topic yet. Use the notes above and come back after more content is added.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((ex) => (
        <ExerciseBlock key={ex.id} topicId={topicId} exercise={ex} />
      ))}
    </div>
  );
}

function ExerciseBlock({ topicId, exercise }: { topicId: string; exercise: TopicExercise }) {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const resetKey = `${topicId}-${exercise.id}`;

  const check = () => {
    if (exercise.kind === "mcq") {
      if (selected === null) return;
      setSubmitted(true);
      setCorrect(selected === exercise.correctIndex);
      return;
    }
    const v = value;
    setSubmitted(true);
    setCorrect(answersMatch(v, exercise.answer));
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
      <p className="text-sm font-medium text-slate-200">{exercise.prompt}</p>

      {exercise.kind === "mcq" ? (
        <ul className="mt-3 space-y-2">
          {exercise.options.map((opt, i) => (
            <li key={opt}>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm transition hover:border-slate-600">
                <input
                  type="radio"
                  name={resetKey}
                  className="accent-sky-500"
                  checked={selected === i}
                  onChange={() => {
                    setSelected(i);
                    setSubmitted(false);
                    setCorrect(null);
                  }}
                />
                <span>{opt}</span>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSubmitted(false);
            setCorrect(null);
          }}
          placeholder="Your answer"
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={check}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-500 active:scale-[0.98]"
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
        <p className="mt-2 text-sm text-slate-400">
          Correct answer:{" "}
          <span className="font-medium text-slate-200">
            {exercise.kind === "mcq" ? exercise.options[exercise.correctIndex] : exercise.answer}
          </span>
        </p>
      ) : null}
    </div>
  );
}
