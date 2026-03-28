import type { Topic } from "../data/roadmap";
import type { TopicExercise } from "../types/exercise";

const ARROW = /\s*->\s*/;

export type NormalizedPair = { kannada: string; english: string };

/** Heuristic: most lines are Kannada -> English; numbers are English digit -> Kannada word. */
export function normalizePair(left: string, right: string): NormalizedPair {
  const L = left.trim();
  const R = right.trim();
  if (/^\d+$/.test(L)) {
    return { kannada: R, english: L };
  }
  const englishLooksLike =
    /^(a|b):\s/i.test(R) ||
    /^(hello|thank you|please|good |what |where |who |why |how |when |which |the |i |my |you |is |are |not |this |that )/i.test(R);
  if (englishLooksLike) {
    return { kannada: L, english: R.replace(/^(a|b):\s*/i, "").trim() };
  }
  return { kannada: L, english: R };
}

export function parsePairs(content: string[]): NormalizedPair[] {
  const pairs: NormalizedPair[] = [];
  for (const line of content) {
    const t = line.trim();
    if (!t || !ARROW.test(t)) continue;
    const idx = t.indexOf("->");
    if (idx < 0) continue;
    const left = t.slice(0, idx);
    const right = t.slice(idx + 2);
    const n = normalizePair(left, right);
    if (!n.kannada || !n.english) continue;
    pairs.push(n);
  }
  return pairs;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function stableId(topicId: string, suffix: string): string {
  return `${topicId}-${suffix}`;
}

export function getExercisesForTopic(topic: Topic): TopicExercise[] {
  const pairs = parsePairs(topic.content);
  const exercises: TopicExercise[] = [];

  if (pairs.length > 0) {
    const p0 = pairs[0];
    exercises.push({
      kind: "translation",
      id: stableId(topic.id, "tr0"),
      prompt: `Translate to Kannada: “${p0.english}”`,
      answer: p0.kannada,
    });

    if (pairs.length > 1) {
      const p1 = pairs[1];
      const firstK = p1.kannada.split(/[\s,/]+/)[0] ?? p1.kannada;
      exercises.push({
        kind: "fill",
        id: stableId(topic.id, "fill1"),
        prompt: `Fill in the Kannada: ____ (${p1.english})`,
        answer: firstK,
      });
    }

    const mcqPair = pairs[Math.min(2, pairs.length - 1)];
    const otherEnglish = pairs
      .filter((p) => p.kannada !== mcqPair.kannada)
      .map((p) => p.english);
    const pool = shuffle([...new Set([...otherEnglish, "Water", "House", "Food"])]);
    const options = shuffle([mcqPair.english, ...pool.filter((x) => x !== mcqPair.english)].slice(0, 4));
    const correctIndex = options.indexOf(mcqPair.english);
    if (correctIndex >= 0) {
      exercises.push({
        kind: "mcq",
        id: stableId(topic.id, "mcq0"),
        prompt: `What does “${mcqPair.kannada}” mean?`,
        options,
        correctIndex,
      });
    }
  }

  const notes = topic.content.filter((l) => !ARROW.test(l) && l.trim().length > 3);
  if (exercises.length === 0 && notes.length > 0) {
    const note = notes[0];
    const words = note.trim().split(/\s+/);
    const answer = words[0] ?? note.trim();
    exercises.push({
      kind: "fill",
      id: stableId(topic.id, "note0"),
      prompt: `First word of this concept: “${note.slice(0, 48)}${note.length > 48 ? "…" : ""}”`,
      answer,
    });
  }

  return exercises.slice(0, 4);
}
