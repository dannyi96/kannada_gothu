import type { Section as SectionType, Topic } from "../data/roadmap";
import { TopicItem } from "./TopicItem";

type TopicStatus = "locked" | "unlocked" | "completed";

type SectionProps = {
  section: SectionType;
  selectedTopicId: string | null;
  getTopicStatus: (topic: Topic) => TopicStatus;
  onSelectTopic: (topicId: string) => void;
};

export function Section({ section, selectedTopicId, getTopicStatus, onSelectTopic }: SectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{section.title}</h2>
      <div className="space-y-3">
        {section.topics.map((topic) => {
          const status = getTopicStatus(topic);
          return (
            <TopicItem
              key={topic.id}
              topic={topic}
              status={status}
              isSelected={selectedTopicId === topic.id}
              onSelect={onSelectTopic}
            />
          );
        })}
      </div>
    </section>
  );
}
