import { useEffect, useMemo, useState } from "react";
import { AppNav } from "./components/AppNav";
import { ProgressHeader } from "./components/ProgressHeader";
import { RoadmapGraph } from "./components/RoadmapGraph";
import { TopicPanel } from "./components/TopicPanel";
import { filterSectionsByNav, firstSectionIdInNav } from "./config/navGroups";
import { roadmapSections, type Topic } from "./data/roadmap";
import { useProgressStore } from "./store/useProgressStore";
import { getRecommendedNextTopicId, getStartHereTopicId } from "./utils/progression";
import { isUnlocked } from "./utils/unlockLogic";

type TopicStatus = "locked" | "unlocked" | "completed";

function App() {
  const completedTopics = useProgressStore((s) => s.completedTopics);
  const markCompleted = useProgressStore((s) => s.markCompleted);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const recordVisit = useProgressStore((s) => s.recordVisit);

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<string | null>(null);

  useEffect(() => {
    recordVisit();
  }, [recordVisit]);

  const allTopics = useMemo(() => roadmapSections.flatMap((section) => section.topics), []);
  const topicById = useMemo(() => new Map(allTopics.map((t) => [t.id, t])), [allTopics]);

  const selectedTopic = allTopics.find((topic) => topic.id === selectedTopicId) ?? null;

  const getTopicStatus = (topic: Topic): TopicStatus => {
    if (completedTopics.has(topic.id)) return "completed";
    if (isUnlocked(topic, completedTopics)) return "unlocked";
    return "locked";
  };

  const selectedStatus = selectedTopic ? getTopicStatus(selectedTopic) : null;
  const completedCount = completedTopics.size;

  const startId = getStartHereTopicId(allTopics);
  const nextId = getRecommendedNextTopicId(allTopics, completedTopics);
  const startTopicTitle = startId ? topicById.get(startId)?.title ?? null : null;
  const nextTopicTitle = nextId ? topicById.get(nextId)?.title ?? null : null;

  const prerequisiteTitles = selectedTopic
    ? selectedTopic.prerequisites.map((id) => topicById.get(id)?.title).filter((x): x is string => Boolean(x))
    : [];

  const visibleSections = useMemo(
    () => filterSectionsByNav(roadmapSections, activeNav),
    [activeNav],
  );

  useEffect(() => {
    if (!activeNav) return;
    const sid = firstSectionIdInNav(activeNav);
    if (!sid) return;
    const id = `roadmap-section-${sid}`;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [activeNav]);

  const continueLearning = () => {
    if (nextId) {
      setSelectedTopicId(nextId);
    }
  };

  return (
    <main className="min-h-svh bg-slate-950">
      <div className="mx-auto max-w-7xl p-4 pb-10 md:p-8">
        <ProgressHeader
          completedCount={completedCount}
          totalTopics={allTopics.length}
          xp={xp}
          streak={streak}
          startTopicTitle={startTopicTitle}
          nextTopicTitle={nextTopicTitle}
          onContinue={continueLearning}
          onReset={resetProgress}
        />

        <AppNav activeNav={activeNav} onSelectNav={setActiveNav} />

        <RoadmapGraph
          sections={visibleSections}
          selectedTopicId={selectedTopicId}
          recommendedTopicId={nextId}
          getTopicStatus={getTopicStatus}
          onSelectTopic={setSelectedTopicId}
        />
      </div>

      <TopicPanel
        key={selectedTopicId ?? "closed"}
        topic={selectedTopic}
        status={selectedStatus}
        prerequisiteTitles={prerequisiteTitles}
        onMarkCompleted={markCompleted}
        onClose={() => setSelectedTopicId(null)}
      />
    </main>
  );
}

export default App;
