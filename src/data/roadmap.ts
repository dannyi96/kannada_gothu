export type Topic = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  prerequisites: string[];
  content: string[];
};

export type Section = {
  id: string;
  title: string;
  topics: Topic[];
};

export const roadmapSections: Section[] = [
  {
    id: "foundations",
    title: "Foundations",
    topics: [
      {
        id: "greetings-basics",
        title: "Greetings and Basic Expressions",
        difficulty: "easy",
        prerequisites: [],
        content: [
          "Page 1: Kannada- | Siontle avetigt. | namaska>a -hello | dhongavaadagabu-mary thonks",
          "Page 6: Cronoun | Verlr ending | Exoump | ideeni",
          "Page 11: lusesdions | pronon | Dementrative | bomething心.",
          "Page 13: CONVERSA TIONS | HeLlo | A: | naakaa",
          "Page 17: noDi | mnoOu | Ssee I taske oru. | Masat maad.",
          "Page 47: mmnvels | heLi - say | lal u-cny | ouhi - Read",
        ],
      },
      {
        id: "pronouns-core",
        title: "Core Pronouns (I / You / He / She / They)",
        difficulty: "easy",
        prerequisites: ["greetings-basics"],
        content: [
          "Page 3: Eutt lersenCreveun | Singda:Naanu | Maewuwle | llual:",
          "Page 4: Bxomouun | Ending uerb | idiya | noR",
          "Page 5: Karnada | Erish | auranuhuBuga | hejabey",
          "Page 6: Cronoun | Verlr ending | Exoump | ideeni",
          "Page 9: losudive lrenoan | Third lersen | pasossuwe fomm | pionoum",
          "Page 10: InteMogatives | subgect-olgeet-vexlpattum) | Aou rym8ds ronro> oT 一T | Hh sentenee.mik",
        ],
      },
      {
        id: "question-words",
        title: "Question Words and Common Prompts",
        difficulty: "easy",
        prerequisites: ["pronouns-core"],
        content: [
          "Page 1: Kannada- | Siontle avetigt. | namaska>a -hello | dhongavaadagabu-mary thonks",
          "Page 10: InteMogatives | subgect-olgeet-vexlpattum) | Aou rym8ds ronro> oT 一T | Hh sentenee.mik",
          "Page 13: CONVERSA TIONS | HeLlo | A: | naakaa",
          "Page 14: Wkatiy this? | A: adu yvy | B: odhu endw pusteha | B: howdu, idu peonepustaka",
          "Page 15: whae i his? | A: ce caa yaarelhu? | iduawrlna ca | B：",
          "Page 16: ondhu | ruoyd | =g- | chappligalu Cs&ippers)",
        ],
      },
    ],
  },
  {
    id: "grammar-core",
    title: "Grammar Core",
    topics: [
      {
        id: "noun-markers",
        title: "Nouns and Plural/Case Markers",
        difficulty: "medium",
        prerequisites: ["pronouns-core"],
        content: [
          "Page 1: Kannada- | Siontle avetigt. | namaska>a -hello | dhongavaadagabu-mary thonks",
          "Page 3: Eutt lersenCreveun | Singda:Naanu | Maewuwle | llual:",
          "Page 4: Bxomouun | Ending uerb | idiya | noR",
          "Page 5: Karnada | Erish | auranuhuBuga | hejabey",
          "Page 6: Cronoun | Verlr ending | Exoump | ideeni",
          "Page 9: losudive lrenoan | Third lersen | pasossuwe fomm | pionoum",
        ],
      },
      {
        id: "present-tense",
        title: "Present Tense Patterns",
        difficulty: "medium",
        prerequisites: ["pronouns-core"],
        content: [
          "Page 1: Kannada- | Siontle avetigt. | namaska>a -hello | dhongavaadagabu-mary thonks",
          "Page 3: Eutt lersenCreveun | Singda:Naanu | Maewuwle | llual:",
          "Page 4: Bxomouun | Ending uerb | idiya | noR",
          "Page 5: Karnada | Erish | auranuhuBuga | hejabey",
          "Page 6: Cronoun | Verlr ending | Exoump | ideeni",
          "Page 7: Sndedpeun | cbjeets | 2gndes | Jiung mrg",
        ],
      },
      {
        id: "past-tense",
        title: "Past Tense Patterns",
        difficulty: "medium",
        prerequisites: ["present-tense"],
        content: [
          "Page 10: InteMogatives | subgect-olgeet-vexlpattum) | Aou rym8ds ronro> oT 一T | Hh sentenee.mik",
          "Page 17: noDi | mnoOu | Ssee I taske oru. | Masat maad.",
          "Page 19: Ka Lu | → | lation | 折",
          "Page 34: Cneax) | vee+ille'togd-post tenke | PrEsENT | adu Key illa",
          "Page 50: ASTTENSE | wodotendtobed | dominant | 一Post tense of“to be\"",
          "Page 51: Gonteetuods | hoda - preurious. | mundina - Neoct | Confimatoyquestiens",
        ],
      },
      {
        id: "future-tense",
        title: "Future Tense Patterns",
        difficulty: "hard",
        prerequisites: ["present-tense"],
        content: [
          "Page 35: wenk | neenuaeli | hogbeda-(lau)det g.theuu | neeuu mamoge baledi-(You)aot corms hona",
          "Page 36: academit) | illawilla-notatall | yendigu illa - peves | Kamditha illa - alsolntelynot",
          "Page 38: sfay | Hyalu | mF）Sm | willba(Eutuu,olefault)",
          "Page 39: ae=utte | Baue uere | mov | cory\"gathn",
          "Page 40: Haadalu -to Sing | Csing I will sing ) | peurelity | Conjugatie",
          "Page 43: haadugaLu | haadteehi ? | gaawa | A : neeuu",
        ],
      },
    ],
  },
  {
    id: "verbs-and-usage",
    title: "Verbs and Usage",
    topics: [
      {
        id: "verbs-actions",
        title: "Action Verbs and Conjugation",
        difficulty: "medium",
        prerequisites: ["present-tense"],
        content: [
          "Page 4: Bxomouun | Ending uerb | idiya | noR",
          "Page 5: Karnada | Erish | auranuhuBuga | hejabey",
          "Page 6: Cronoun | Verlr ending | Exoump | ideeni",
          "Page 16: ondhu | ruoyd | =g- | chappligalu Cs&ippers)",
          "Page 17: noDi | mnoOu | Ssee I taske oru. | Masat maad.",
          "Page 27: Kontada | -na/-a | y-da | -ya",
        ],
      },
      {
        id: "daily-conversation",
        title: "Daily Conversation Phrases",
        difficulty: "medium",
        prerequisites: ["question-words", "verbs-actions"],
        content: [
          "Page 4: Bxomouun | Ending uerb | idiya | noR",
          "Page 16: ondhu | ruoyd | =g- | chappligalu Cs&ippers)",
          "Page 17: noDi | mnoOu | Ssee I taske oru. | Masat maad.",
          "Page 19: Ka Lu | → | lation | 折",
          "Page 24: Cemmenlyusedadgeeties | Ppaife | Karnaoa | Engltsh",
          "Page 25: Rice | Milkeraducts | haaLu | anna",
        ],
      },
    ],
  },
  {
    id: "application",
    title: "Application",
    topics: [
      {
        id: "time-and-routine",
        title: "Time, Routine, and Everyday Context",
        difficulty: "hard",
        prerequisites: ["daily-conversation", "future-tense"],
        content: [
          "Page 10: InteMogatives | subgect-olgeet-vexlpattum) | Aou rym8ds ronro> oT 一T | Hh sentenee.mik",
          "Page 18: Jelliy theTimx | hann+omdhu | harnondhu | (elwen)",
          "Page 19: Ka Lu | → | lation | 折",
          "Page 28: sn+, ,op, m | e& | Heed | ccdiv",
          "Page 29: aatia | B-ee halepiutaknannadau | pustake chemmagi ide | A",
          "Page 31: conjugated based m > terse | L | neum Jponown | Shaale yalli",
        ],
      },
    ],
  },
];
