/** Split roadmap content into conceptual notes vs examples / phrase pairs. */
export function splitTopicContent(content: string[]): {
  concepts: string[];
  examples: string[];
} {
  const concepts: string[] = [];
  const examples: string[] = [];

  for (const raw of content) {
    const line = raw.trim();
    if (!line) continue;

    const lower = line.toLowerCase();
    if (lower.startsWith("example:") || /^a:\s/i.test(line) || /^b:\s/i.test(line)) {
      examples.push(line);
      continue;
    }
    if (line.includes("->")) {
      examples.push(line);
      continue;
    }
    concepts.push(line);
  }

  if (concepts.length === 0 && examples.length > 0) {
    return { concepts: examples, examples: [] };
  }

  return { concepts, examples };
}
