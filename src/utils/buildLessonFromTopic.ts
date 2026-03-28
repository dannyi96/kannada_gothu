import type { Topic } from "../data/roadmap";
import type { LessonFlashcard, LessonMcq, LessonPayload, McqTag } from "../types/lesson";
import { parsePairs, type NormalizedPair } from "./exerciseGenerator";

const ARROW = /\s*->\s*/;

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function stableShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const GENERIC_EN = ["Water", "House", "Food", "Morning", "Name", "School", "Book", "Time"];
const GENERIC_KN = ["neeru", "mane", "oota", "beLaggi", "hesaru", "shale", "pustaka", "samaya"];

function uniqueStrings(xs: string[]): string[] {
  return [...new Set(xs.map((x) => x.trim()).filter(Boolean))];
}

function pickWrong<T>(pool: T[], exclude: T, need: number, seed: number): T[] {
  const filtered = pool.filter((x) => x !== exclude);
  const shuffled = stableShuffle(filtered, seed);
  return shuffled.slice(0, need);
}

function makeMcq(params: {
  topicId: string;
  idx: number;
  prompt: string;
  correct: string;
  wrongCandidates: string[];
  explanation: string;
  tag?: McqTag;
}): LessonMcq {
  const { topicId, idx, prompt, correct, wrongCandidates, explanation, tag } = params;
  const seed = hashString(`${topicId}-mcq-${idx}`);
  const wrong = pickWrong(wrongCandidates, correct, 3, seed);
  let i = 0;
  while (wrong.length < 3) {
    wrong.push(GENERIC_EN[i % GENERIC_EN.length]);
    i++;
  }
  const opts = stableShuffle([correct, wrong[0], wrong[1], wrong[2]], seed + 7);
  const options = opts as [string, string, string, string];
  const ci = options.indexOf(correct);
  const correctIndex = (ci >= 0 ? ci : 0) as 0 | 1 | 2 | 3;
  return {
    id: `${topicId}-q-${idx}`,
    prompt,
    options,
    correctIndex,
    explanation,
    tag,
  };
}

function makeMcqKannada(params: {
  topicId: string;
  idx: number;
  prompt: string;
  correct: string;
  wrongCandidates: string[];
  explanation: string;
  tag?: McqTag;
}): LessonMcq {
  const { topicId, idx, prompt, correct, wrongCandidates, explanation, tag } = params;
  const seed = hashString(`${topicId}-kn-${idx}`);
  const wrong = pickWrong(wrongCandidates, correct, 3, seed);
  let i = 0;
  while (wrong.length < 3) {
    wrong.push(GENERIC_KN[i % GENERIC_KN.length]);
    i++;
  }
  const optsKn = stableShuffle([correct, wrong[0], wrong[1], wrong[2]], seed + 11);
  const options = optsKn as [string, string, string, string];
  const ci = options.indexOf(correct);
  const correctIndex = (ci >= 0 ? ci : 0) as 0 | 1 | 2 | 3;
  return {
    id: `${topicId}-kq-${idx}`,
    prompt,
    options,
    correctIndex,
    explanation,
    tag,
  };
}

function conceptOnlyLesson(topic: Topic, overview: string[], keyPoints: string[]): LessonPayload {
  const merged = [...overview, ...keyPoints].filter((s) => s.trim().length > 2);
  const base =
    merged.length > 0
      ? merged
      : overview.length > 0
        ? overview
        : [
            "Study this lesson with your notes and repeat key phrases aloud.",
            "Focus on one pattern at a time.",
            "Prefer full short sentences over isolated words.",
          ];
  const distractors = [
    "Ignore subject–verb agreement in Kannada",
    "Always mirror English word order exactly",
    "Skip polite forms in every situation",
    "Avoid practicing spoken rhythm",
  ];
  const mini: LessonMcq[] = [0, 1, 2].map((i) => {
    const correct = base[i % base.length];
    return makeMcq({
      topicId: topic.id,
      idx: i,
      prompt: "Which line best matches what this lesson is about?",
      correct,
      wrongCandidates: base.filter((_, j) => j !== i % base.length).concat(distractors),
      explanation: "Match the overview and key points at the top of Ideas.",
      tag: "structure",
    });
  });
  const quiz: LessonMcq[] = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const correct = base[i % base.length];
    return makeMcq({
      topicId: topic.id,
      idx: i + 10,
      prompt: `Quiz ${i + 1}/8 — which statement fits this lesson?`,
      correct,
      wrongCandidates: base.filter((_, j) => j !== i % base.length).concat(distractors),
      explanation: "Re-read What you’re learning and Key points before guessing.",
      tag: "structure",
    });
  });
  return {
    topicId: topic.id,
    overview,
    keyPoints,
    examples: [],
    miniPractice: mini,
    quiz,
    flashcards: base.slice(0, 8).map((text, i) => ({
      id: `${topic.id}-fc-concept-${i}`,
      kind: "knToEn" as const,
      front: text.slice(0, 120),
      back: "Recall how this fits into a sentence you can say aloud.",
    })),
  };
}

function buildFlashcards(topicId: string, pairs: NormalizedPair[]): LessonFlashcard[] {
  if (pairs.length === 0) return [];
  const cards: LessonFlashcard[] = [];
  let n = 0;
  for (const p of pairs.slice(0, 10)) {
    cards.push({
      id: `${topicId}-fc-${n++}`,
      kind: "knToEn",
      front: p.kannada,
      back: p.english,
    });
  }
  for (let i = 1; i < Math.min(pairs.length, 8); i += 2) {
    const p = pairs[i];
    cards.push({
      id: `${topicId}-fc-en-${i}`,
      kind: "enToKn",
      front: p.english.slice(0, 140),
      back: p.kannada,
    });
  }
  const long = pairs.find((p) => p.kannada.split(/\s+/).filter(Boolean).length >= 3);
  if (long) {
    cards.push({
      id: `${topicId}-fc-comp`,
      kind: "completion",
      front: `Complete (meaning: ${long.english.slice(0, 56)}${long.english.length > 56 ? "…" : ""})`,
      back: long.kannada,
    });
  }
  return cards;
}

export function buildLessonFromTopic(topic: Topic): LessonPayload {
  const overview = topic.overview;
  const keyPoints = topic.content
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && !ARROW.test(l));
  const pairs = parsePairs(topic.content);

  if (pairs.length === 0) {
    return conceptOnlyLesson(topic, overview, keyPoints);
  }

  const enPool = uniqueStrings(pairs.map((p) => p.english));
  const knPool = uniqueStrings(pairs.map((p) => p.kannada));
  const structureCues =
    keyPoints.length > 0 ? keyPoints : overview.length > 0 ? overview : ["Use SOV and natural Kannada rhythm."];

  const mini: LessonMcq[] = [];
  const p0 = pairs[0];
  const p1 = pairs[1] ?? p0;
  const p2 = pairs[2] ?? p0;

  mini.push(
    makeMcq({
      topicId: topic.id,
      idx: 0,
      prompt: `What does “${p0.kannada.slice(0, 80)}” mean?`,
      correct: p0.english,
      wrongCandidates: enPool,
      explanation: `“${p0.kannada}” corresponds to: ${p0.english}.`,
      tag: "vocab",
    }),
  );
  mini.push(
    makeMcqKannada({
      topicId: topic.id,
      idx: 1,
      prompt: `Choose the Kannada for: “${p1.english.slice(0, 100)}”`,
      correct: p1.kannada,
      wrongCandidates: knPool,
      explanation: `Use: ${p1.kannada}.`,
      tag: "translation",
    }),
  );
  mini.push(
    makeMcq({
      topicId: topic.id,
      idx: 2,
      prompt: `What does “${p2.kannada.slice(0, 80)}” mean?`,
      correct: p2.english,
      wrongCandidates: enPool,
      explanation: `“${p2.kannada}” → ${p2.english}.`,
      tag: "vocab",
    }),
  );

  const quiz: LessonMcq[] = [];
  const quizCount = Math.min(10, Math.max(6, pairs.length));
  for (let i = 0; i < quizCount; i++) {
    const p = pairs[i % pairs.length];
    const flip = i % 3;
    if (flip === 0) {
      quiz.push(
        makeMcq({
          topicId: topic.id,
          idx: 100 + i,
          prompt: `What does “${p.kannada.slice(0, 90)}” mean?`,
          correct: p.english,
          wrongCandidates: enPool,
          explanation: `Literal/closest gloss: ${p.english}.`,
          tag: "vocab",
        }),
      );
    } else if (flip === 1) {
      quiz.push(
        makeMcqKannada({
          topicId: topic.id,
          idx: 100 + i,
          prompt: `Translate to Kannada: “${p.english.slice(0, 100)}”`,
          correct: p.kannada,
          wrongCandidates: knPool,
          explanation: `Pattern from this lesson: ${p.kannada}.`,
          tag: "translation",
        }),
      );
    } else {
      const cue = structureCues[i % structureCues.length];
      quiz.push(
        makeMcq({
          topicId: topic.id,
          idx: 100 + i,
          prompt: `Structure check: ${cue.slice(0, 140)} — which example best matches the lesson?`,
          correct: p.english,
          wrongCandidates: enPool,
          explanation: `Compare with: ${p.kannada} → ${p.english}.`,
          tag: "structure",
        }),
      );
    }
  }

  const examples = pairs.map((p) => ({ kannada: p.kannada, english: p.english }));

  return {
    topicId: topic.id,
    overview,
    keyPoints,
    examples,
    miniPractice: mini,
    quiz,
    flashcards: buildFlashcards(topic.id, pairs),
  };
}
