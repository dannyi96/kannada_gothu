import { useMemo, useState } from "react";
import { Section } from "./components/Section";
import { TopicPanel } from "./components/TopicPanel";
import { roadmapSections, type Topic } from "./data/roadmap";
import { useProgressStore } from "./store/useProgressStore";
import { isUnlocked } from "./utils/unlockLogic";

type TopicStatus = "locked" | "unlocked" | "completed";

function App() {
  const { completedTopics, markCompleted, resetProgress } = useProgressStore();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const allTopics = useMemo(() => roadmapSections.flatMap((section) => section.topics), []);
  const selectedTopic = allTopics.find((topic) => topic.id === selectedTopicId) ?? null;

  const getTopicStatus = (topic: Topic): TopicStatus => {
    if (completedTopics.has(topic.id)) return "completed";
    if (isUnlocked(topic, completedTopics)) return "unlocked";
    return "locked";
  };

  const selectedStatus = selectedTopic ? getTopicStatus(selectedTopic) : null;
  const completedCount = completedTopics.size;

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Kannada Roadmap</h1>
          <p className="mt-1 text-sm text-slate-600">
            Client-side learning path derived from your Kannada notes PDF.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
            Completed: {completedCount}/{allTopics.length}
          </span>
          <button
            type="button"
            onClick={resetProgress}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          {roadmapSections.map((section) => (
            <Section
              key={section.id}
              section={section}
              selectedTopicId={selectedTopicId}
              getTopicStatus={getTopicStatus}
              onSelectTopic={setSelectedTopicId}
            />
          ))}
        </div>
        <TopicPanel topic={selectedTopic} status={selectedStatus} onMarkCompleted={markCompleted} />
      </div>
    </main>
  );
}

export default App;
