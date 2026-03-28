import { useEffect, useState } from "react";
import type { Topic } from "../data/roadmap";
import { getLessonForTopic } from "../data/lessons";
import { LessonQuiz } from "./LessonQuiz";
import { McqItemBlock } from "./McqItemBlock";

type LessonStep = "concepts" | "examples" | "mini" | "quiz" | "done";

const STEP_ORDER: LessonStep[] = ["concepts", "examples", "mini", "quiz", "done"];

type TopicPanelProps = {
  topic: Topic | null;
  status: "locked" | "unlocked" | "completed" | null;
  prerequisiteTitles: string[];
  onMarkCompleted: (topicId: string) => void;
  onClose: () => void;
  nextTopicId: string | null;
  nextTopicTitle: string | null;
  onGoToTopic: (topicId: string) => void;
};

export function TopicPanel({
  topic,
  status,
  prerequisiteTitles,
  onMarkCompleted,
  onClose,
  nextTopicId,
  nextTopicTitle,
  onGoToTopic,
}: TopicPanelProps) {
  const [celebrate, setCelebrate] = useState(false);
  const [step, setStep] = useState<LessonStep>("concepts");

  const lesson = topic ? getLessonForTopic(topic.id) : undefined;

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
  const markDisabled = status === "locked" || status === "completed";
  const topicLower = topic.title.toLowerCase();
  const lessonIcon =
    topicLower.includes("conversation") || topicLower.includes("dialogue")
      ? "💬"
      : topicLower.includes("tense") || topicLower.includes("continuous")
        ? "⏱️"
        : topicLower.includes("question") || topicLower.includes("negation") || topicLower.includes("negative")
          ? "❓"
          : topicLower.includes("location") || topicLower.includes("postposition") || topicLower.includes("place")
            ? "📍"
            : topicLower.includes("greeting") || topicLower.includes("number")
              ? "🗣️"
              : "🧠";

  const difficultyStyle =
    topic.difficulty === "easy"
      ? "bg-sky-500/20 text-sky-200 ring-sky-500/40"
      : topic.difficulty === "medium"
        ? "bg-amber-500/20 text-amber-200 ring-amber-500/40"
        : "bg-rose-500/20 text-rose-200 ring-rose-500/40";

  const handleComplete = () => {
    if (!canComplete) return;
    onMarkCompleted(topic.id);
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 700);
  };

  const stepIndex = STEP_ORDER.indexOf(step);
  const goBack = () => {
    if (stepIndex <= 0) return;
    setStep(STEP_ORDER[stepIndex - 1]);
  };
  const goNext = () => {
    if (stepIndex >= STEP_ORDER.length - 1) return;
    setStep(STEP_ORDER[stepIndex + 1]);
  };

  const showNextLessonCta =
    step === "done" && nextTopicId && nextTopicId !== topic.id && status !== "locked";

  const stepDot = (s: LessonStep, label: string) => {
    const i = STEP_ORDER.indexOf(s);
    const active = step === s;
    const past = stepIndex > i;
    return (
      <button
        key={s}
        type="button"
        onClick={() => {
          if (status === "locked") return;
          if (past || active) setStep(s);
        }}
        className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-center transition ${
          active ? "bg-slate-800 text-sky-200" : past ? "text-slate-300 hover:bg-slate-800/60" : "text-slate-600"
        } ${status !== "locked" && (past || active) ? "cursor-pointer" : "cursor-default"}`}
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
            active ? "bg-sky-600 text-white" : past ? "bg-emerald-600/80 text-white" : "bg-slate-800 text-slate-500"
          }`}
        >
          {i + 1}
        </span>
        <span className="hidden text-[10px] font-medium uppercase tracking-wide sm:block">{label}</span>
      </button>
    );
  };

  const showFlow = status !== "locked" && lesson;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 p-2 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-slate-800 p-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-50 md:text-2xl">
                <span className="mr-2">{lessonIcon}</span>
                {topic.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${difficultyStyle}`}>
                  {topic.difficulty}
                </span>
                <span className="text-sm text-slate-500">
                  {status === "completed" ? "Completed" : status === "locked" ? "Locked" : "In progress"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Close
            </button>
          </div>
          {showFlow ? (
            <nav className="mt-4 flex border-t border-slate-800 pt-4" aria-label="Lesson steps">
              {stepDot("concepts", "Ideas")}
              {stepDot("examples", "Examples")}
              {stepDot("mini", "Practice")}
              {stepDot("quiz", "Quiz")}
              {stepDot("done", "Done")}
            </nav>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {status === "locked" ? (
            <div
              className="rounded-xl border border-amber-500/40 bg-amber-950/40 p-4 text-amber-100"
              role="alert"
            >
              <p className="font-semibold text-amber-50">Complete prerequisites first</p>
              <p className="mt-1 text-sm text-amber-200/90">
                Finish the topics below before this lesson unlocks.
              </p>
              {prerequisiteTitles.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-100/90">
                  {prerequisiteTitles.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {status !== "locked" && !lesson ? (
            <p className="text-sm text-rose-300">Lesson content is missing for this topic. Please report this bug.</p>
          ) : null}

          {showFlow && lesson ? (
            <>
              {step === "concepts" ? (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Ideas</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-200">
                    {lesson.concepts.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {step === "examples" ? (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Examples</h3>
                  {lesson.examples.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">
                      No vocabulary pairs in this lesson — the Ideas above carry the content. Continue to Practice and
                      Quiz.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2 rounded-xl border border-slate-700/80 bg-slate-800/50 p-4 text-sm leading-relaxed text-slate-100 shadow-inner">
                      {lesson.examples.map((ex) => (
                        <li key={`${ex.kannada}-${ex.english ?? ""}`} className="border-l-2 border-sky-500/50 pl-3">
                          <span className="font-mono text-sky-100">{ex.kannada}</span>
                          {ex.english ? (
                            <>
                              <span className="text-slate-500"> → </span>
                              <span className="text-slate-300">{ex.english}</span>
                            </>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ) : null}

              {step === "mini" ? (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Practice</h3>
                  <p className="mt-1 text-sm text-slate-500">Quick checks — immediate feedback after each answer.</p>
                  <div className="mt-4 space-y-4">
                    {lesson.miniPractice.map((item) => (
                      <McqItemBlock key={item.id} topicId={topic.id} item={item} />
                    ))}
                  </div>
                </section>
              ) : null}

              {step === "quiz" ? (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Quiz</h3>
                  <p className="mt-1 text-sm text-slate-500">Multiple choice — check each answer before moving on.</p>
                  <div className="mt-4">
                    <LessonQuiz topicId={topic.id} questions={lesson.quiz} />
                  </div>
                </section>
              ) : null}

              {step === "done" ? (
                <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5 text-center">
                  <h3 className="text-lg font-semibold text-slate-100">Nice work</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    You&apos;ve gone through this lesson. Mark it complete to track progress, or open Flashcards in the
                    top nav to review.
                  </p>
                  {showNextLessonCta ? (
                    <button
                      type="button"
                      onClick={() => {
                        onGoToTopic(nextTopicId);
                        setStep("concepts");
                      }}
                      className="mt-5 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500"
                    >
                      Next: {nextTopicTitle ?? "lesson"}
                    </button>
                  ) : null}
                </section>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={stepIndex >= STEP_ORDER.length - 1}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-slate-800 bg-slate-900/95 p-4 backdrop-blur">
          <button
            type="button"
            disabled={markDisabled}
            onClick={handleComplete}
            className={`w-full rounded-xl px-4 py-3.5 text-base font-semibold shadow-lg transition duration-200 ${
              celebrate ? "scale-[1.02] bg-emerald-500 text-white shadow-emerald-900/50" : ""
            } ${
              status === "completed"
                ? "cursor-default bg-emerald-900/80 text-emerald-200 ring-1 ring-emerald-500/40"
                : canComplete
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98]"
                  : "cursor-not-allowed bg-slate-600 text-slate-300 opacity-90"
            }`}
          >
            {status === "completed" ? "Completed ✓" : "Mark as Completed"}
          </button>
          {status === "locked" ? (
            <p className="mt-2 text-center text-xs text-slate-500">Unlock this topic to mark it complete.</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
