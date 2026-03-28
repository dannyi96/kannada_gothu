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
    label: "Level 1 · Basics",
    sectionIds: ["level-1-basics"],
  },
  {
    id: "core",
    label: "Level 2 · Core",
    sectionIds: ["level-2-core"],
  },
  {
    id: "verbs-place",
    label: "Level 3 · Place & verbs",
    sectionIds: ["level-3-place-verbs"],
  },
  {
    id: "fluency",
    label: "Level 4 · Fluency",
    sectionIds: ["level-4-fluency"],
  },
  {
    id: "situations",
    label: "Level 5 · Situations",
    sectionIds: ["level-5-situations"],
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
