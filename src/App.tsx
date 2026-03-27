import { useMemo, useState } from "react";
import { RoadmapGraph } from "./components/RoadmapGraph";
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
          <h1 className="text-2xl font-bold text-slate-100 md:text-3xl">Kannada Roadmap</h1>
          <p className="mt-1 text-sm text-slate-400">
            Graph roadmap with prerequisite unlocks, inspired by NeetCode.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm font-medium text-slate-300">
            Completed: {completedCount}/{allTopics.length}
          </span>
          <button
            type="button"
            onClick={resetProgress}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            Reset
          </button>
        </div>
      </header>

      <RoadmapGraph
        sections={roadmapSections}
        selectedTopicId={selectedTopicId}
        getTopicStatus={getTopicStatus}
        onSelectTopic={setSelectedTopicId}
      />

      <TopicPanel
        topic={selectedTopic}
        status={selectedStatus}
        onMarkCompleted={markCompleted}
        onClose={() => setSelectedTopicId(null)}
      />
    </main>
  );
}

export default App;
