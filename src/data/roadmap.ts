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
    id: "level-1-basics",
    title: "Level 1: Basics (Survival Kannada)",
    topics: [
      {
        id: "greetings",
        title: "Greetings",
        difficulty: "easy",
        prerequisites: [],
        content: [
          "Namaskara -> Hello",
          "Dhanyavaada -> Thank you",
          "Dayavittu -> Please",
          "Shubhodaya -> Good morning",
          "Shubha madhyahna -> Good afternoon",
          "Shubha ratri -> Good night",
        ],
      },
      {
        id: "introducing-yourself",
        title: "Introducing Yourself",
        difficulty: "easy",
        prerequisites: ["greetings"],
        content: [
          "Nanna hesaru ___ -> My name is ___",
          "Naanu ___ -> I am ___",
          "Naanu ___ inda bandiddene -> I am from ___",
        ],
      },
      {
        id: "basic-questions",
        title: "Basic Questions",
        difficulty: "easy",
        prerequisites: ["introducing-yourself"],
        content: [
          "Nimma hesaru enu? -> What is your name?",
          "Neevu elli inda? -> Where are you from?",
          "Idhu enu? -> What is this?",
        ],
      },
      {
        id: "numbers-1-10",
        title: "Numbers (1-10)",
        difficulty: "easy",
        prerequisites: ["greetings"],
        content: [
          "1 -> Ondu",
          "2 -> Eradu",
          "3 -> Mooru",
          "4 -> Naalku",
          "5 -> Aidu",
          "6 -> Aaru",
          "7 -> Yelu",
          "8 -> Entu",
          "9 -> Ombattu",
          "10 -> Hattu",
        ],
      },
    ],
  },
  {
    id: "level-2-foundation",
    title: "Level 2: Sentence Foundation",
    topics: [
      {
        id: "sentence-structure",
        title: "Sentence Structure (SOV)",
        difficulty: "medium",
        prerequisites: ["basic-questions"],
        content: [
          "Kannada follows Subject + Object + Verb (SOV).",
          "Example: I eat food -> Naanu oota tinni",
        ],
      },
      {
        id: "pronouns",
        title: "Pronouns",
        difficulty: "medium",
        prerequisites: ["sentence-structure"],
        content: [
          "1st person: Naanu -> I, Naavu -> We",
          "2nd person: Neenu -> You (informal), Neevu -> You (formal/respect)",
          "3rd person: Avanu -> He, Avalu -> She, Avaru -> They / respectful",
        ],
      },
      {
        id: "verb-basics",
        title: "Verb Basics (Agreement)",
        difficulty: "medium",
        prerequisites: ["pronouns"],
        content: [
          "Verb changes based on subject.",
          "Naanu hogtini -> I go",
          "Neenu hogtiya -> You go",
          "Avaru hogtare -> They go",
        ],
      },
      {
        id: "respect-vs-informal",
        title: "Respect vs Informal",
        difficulty: "easy",
        prerequisites: ["pronouns"],
        content: [
          "Neenu -> informal",
          "Neevu -> respectful",
          "Use respectful form for elders, strangers, and formal situations.",
        ],
      },
    ],
  },
  {
    id: "level-3-grammar",
    title: "Level 3: Grammar Building",
    topics: [
      {
        id: "gender-system",
        title: "Gender System",
        difficulty: "medium",
        prerequisites: ["pronouns"],
        content: [
          "Masculine -> Avanu",
          "Feminine -> Avalu",
          "Neutral -> Adu",
        ],
      },
      {
        id: "plurals",
        title: "Plurals",
        difficulty: "medium",
        prerequisites: ["gender-system"],
        content: [
          "Avanu -> Avaru",
          "Avalu -> Avaru",
        ],
      },
      {
        id: "demonstratives",
        title: "Demonstratives",
        difficulty: "easy",
        prerequisites: ["sentence-structure"],
        content: [
          "Idu -> This",
          "Adu -> That",
        ],
      },
      {
        id: "possessives",
        title: "Possessive Forms",
        difficulty: "medium",
        prerequisites: ["pronouns"],
        content: [
          "Nanna -> My",
          "Nimma -> Your",
          "Avana -> His",
          "Avala -> Her",
        ],
      },
      {
        id: "adjectives",
        title: "Adjectives",
        difficulty: "medium",
        prerequisites: ["sentence-structure"],
        content: [
          "Adjectives usually come before nouns.",
          "Dodda mane -> Big house",
          "Chikka huduga -> Small boy",
        ],
      },
    ],
  },
  {
    id: "level-4-questions-negation",
    title: "Level 4: Questions and Negation",
    topics: [
      {
        id: "question-words",
        title: "Question Words",
        difficulty: "medium",
        prerequisites: ["basic-questions"],
        content: [
          "Yaaru -> Who",
          "Enu -> What",
          "Elli -> Where",
          "Yaake -> Why",
          "Hege -> How",
        ],
      },
      {
        id: "negation",
        title: "Negation",
        difficulty: "hard",
        prerequisites: ["verb-basics"],
        content: [
          "Illa (not/no): Naanu hogalla -> I do not go",
          "Beda (do not want): Nanage beda -> I do not want",
          "Alla (is not): Idhu sari alla -> This is not correct",
        ],
      },
    ],
  },
  {
    id: "level-5-tenses",
    title: "Level 5: Tenses",
    topics: [
      {
        id: "present-tense",
        title: "Present Tense",
        difficulty: "medium",
        prerequisites: ["verb-basics"],
        content: [
          "Naanu hogtini -> I go",
          "Neevu bartira -> You come",
        ],
      },
      {
        id: "past-tense",
        title: "Past Tense",
        difficulty: "hard",
        prerequisites: ["present-tense"],
        content: [
          "Naanu hodde -> I went",
          "Avalu bandlu -> She came",
        ],
      },
      {
        id: "future-tense",
        title: "Future Tense",
        difficulty: "hard",
        prerequisites: ["present-tense"],
        content: [
          "Naanu hogtini -> I will go",
          "Neevu bartira -> You will come",
        ],
      },
      {
        id: "continuous-forms",
        title: "Continuous Forms",
        difficulty: "hard",
        prerequisites: ["present-tense"],
        content: [
          "Naanu hogta iddini -> I am going",
          "Avaru maatadta iddare -> They are speaking",
        ],
      },
    ],
  },
  {
    id: "level-6-location",
    title: "Level 6: Postpositions and Location",
    topics: [
      {
        id: "postpositions-location",
        title: "Postpositions and Location",
        difficulty: "medium",
        prerequisites: ["question-words"],
        content: [
          "Alli -> In / at",
          "Illi -> Here",
          "Alli -> There",
          "Inda -> From",
          "Ge -> To",
          "Mele -> On",
          "Kelage -> Below",
          "Naanu mane alli iddini -> I am at home",
          "Avanu school ge hogtane -> He goes to school",
        ],
      },
    ],
  },
  {
    id: "level-7-conversations",
    title: "Level 7: Real Conversations",
    topics: [
      {
        id: "basic-dialogue",
        title: "Basic Dialogue",
        difficulty: "medium",
        prerequisites: ["question-words", "pronouns"],
        content: [
          "A: Nimma hesaru enu?",
          "B: Nanna hesaru Ravi",
        ],
      },
      {
        id: "shopping",
        title: "Shopping",
        difficulty: "medium",
        prerequisites: ["numbers-1-10", "question-words"],
        content: [
          "Idhu eshtu? -> How much is this?",
          "Swalpa kadime madi -> Reduce the price",
        ],
      },
      {
        id: "travel",
        title: "Travel",
        difficulty: "hard",
        prerequisites: ["postpositions-location", "future-tense"],
        content: [
          "Bus yelli sigutte? -> Where do I get the bus?",
          "Naanu ___ ge hogbeku -> I want to go to ___",
        ],
      },
      {
        id: "office",
        title: "Office",
        difficulty: "hard",
        prerequisites: ["future-tense", "continuous-forms"],
        content: [
          "Meeting yavag ide? -> When is the meeting?",
          "Naanu work madtini -> I work",
        ],
      },
    ],
  },
  {
    id: "bonus-connectors",
    title: "Bonus: Connectors",
    topics: [
      {
        id: "connectors",
        title: "Connectors",
        difficulty: "medium",
        prerequisites: ["sentence-structure"],
        content: [
          "Mattu -> And",
          "Adare -> But",
          "Aadre -> However",
        ],
      },
    ],
  },
];
