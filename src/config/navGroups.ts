import type { Section } from "../data/roadmap";

export type NavGroup = {
  id: string;
  label: string;
  /** Section ids from roadmap that belong under this nav tab */
  sectionIds: string[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "basics",
    label: "Basics",
    sectionIds: ["level-1-basics"],
  },
  {
    id: "grammar",
    label: "Grammar",
    sectionIds: [
      "level-2-foundation",
      "level-3-grammar",
      "level-4-questions-negation",
      "bonus-connectors",
    ],
  },
  {
    id: "tenses",
    label: "Tenses",
    sectionIds: ["level-5-tenses"],
  },
  {
    id: "conversations",
    label: "Conversations",
    sectionIds: ["level-6-location", "level-7-conversations"],
  },
];

export function sectionIdsForNav(navId: string): string[] {
  return NAV_GROUPS.find((g) => g.id === navId)?.sectionIds ?? [];
}

export function firstSectionIdInNav(navId: string): string | undefined {
  return sectionIdsForNav(navId)[0];
}

export function navIdForSection(sectionId: string): string | undefined {
  return NAV_GROUPS.find((g) => g.sectionIds.includes(sectionId))?.id;
}

export function filterSectionsByNav(sections: Section[], navId: string | null): Section[] {
  if (!navId) return sections;
  const ids = new Set(sectionIdsForNav(navId));
  return sections.filter((s) => ids.has(s.id));
}
