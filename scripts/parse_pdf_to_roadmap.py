import json
import re
from pathlib import Path

import pypdfium2 as pdfium
from rapidocr_onnxruntime import RapidOCR

PDF_PATH = Path("/Users/danielisaac/Downloads/kannada_notes.pdf")
RAW_OUTPUT_PATH = Path("src/data/pdfExtract.json")
ROADMAP_OUTPUT_PATH = Path("src/data/roadmap.ts")


TOPIC_RULES = [
    {
        "id": "greetings-basics",
        "title": "Greetings and Basic Expressions",
        "section": "Foundations",
        "difficulty": "easy",
        "keywords": ["namaska", "good", "morning", "night", "day", "hello"],
        "prerequisites": [],
    },
    {
        "id": "pronouns-core",
        "title": "Core Pronouns (I / You / He / She / They)",
        "section": "Foundations",
        "difficulty": "easy",
        "keywords": ["naanu", "neenu", "neevu", "awanu", "awalu", "awaru", "naavu"],
        "prerequisites": ["greetings-basics"],
    },
    {
        "id": "question-words",
        "title": "Question Words and Common Prompts",
        "section": "Foundations",
        "difficulty": "easy",
        "keywords": ["yaaru", "yenu", "how", "what", "where", "heg"],
        "prerequisites": ["pronouns-core"],
    },
    {
        "id": "noun-markers",
        "title": "Nouns and Plural/Case Markers",
        "section": "Grammar Core",
        "difficulty": "medium",
        "keywords": ["galu", "pustaka", "mane", "manege", "kannadadalli"],
        "prerequisites": ["pronouns-core"],
    },
    {
        "id": "present-tense",
        "title": "Present Tense Patterns",
        "section": "Grammar Core",
        "difficulty": "medium",
        "keywords": ["present", "ideeni", "ide", "idaane", "idaa", "maadteeni"],
        "prerequisites": ["pronouns-core"],
    },
    {
        "id": "past-tense",
        "title": "Past Tense Patterns",
        "section": "Grammar Core",
        "difficulty": "medium",
        "keywords": ["past", "ittu", "iddri"],
        "prerequisites": ["present-tense"],
    },
    {
        "id": "future-tense",
        "title": "Future Tense Patterns",
        "section": "Grammar Core",
        "difficulty": "hard",
        "keywords": ["future", "will", "hogalu"],
        "prerequisites": ["present-tense"],
    },
    {
        "id": "verbs-actions",
        "title": "Action Verbs and Conjugation",
        "section": "Verbs and Usage",
        "difficulty": "medium",
        "keywords": ["hog", "hogi", "haadtaale", "haadtaane", "sings", "stem", "ending"],
        "prerequisites": ["present-tense"],
    },
    {
        "id": "daily-conversation",
        "title": "Daily Conversation Phrases",
        "section": "Verbs and Usage",
        "difficulty": "medium",
        "keywords": ["kodi", "heli", "keli", "beda", "bedi", "swalpa", "tagoli"],
        "prerequisites": ["question-words", "verbs-actions"],
    },
    {
        "id": "time-and-routine",
        "title": "Time, Routine, and Everyday Context",
        "section": "Application",
        "difficulty": "hard",
        "keywords": ["gante", "eega", "amele", "now", "bus", "kelasa"],
        "prerequisites": ["daily-conversation", "future-tense"],
    },
]


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def ocr_pages(pdf_path: Path) -> list[list[str]]:
    doc = pdfium.PdfDocument(str(pdf_path))
    ocr = RapidOCR()
    pages: list[list[str]] = []

    for idx in range(len(doc)):
        img = doc[idx].render(scale=1.7).to_numpy()
        result, _ = ocr(img)
        lines = [normalize(r[1]) for r in result] if result else []
        pages.append([line for line in lines if line])
        if (idx + 1) % 10 == 0:
            print(f"processed {idx + 1}/{len(doc)} pages")
    return pages


def derive_topics(page_lines: list[list[str]]) -> dict[str, list[dict]]:
    page_text = [" ".join(lines).lower() for lines in page_lines]
    sections: dict[str, list[dict]] = {}

    for rule in TOPIC_RULES:
        matches: list[str] = []
        for page_idx, text in enumerate(page_text):
            score = sum(1 for kw in rule["keywords"] if kw in text)
            if score > 0:
                sample_lines = page_lines[page_idx][:4]
                if sample_lines:
                    matches.append(f"Page {page_idx + 1}: " + " | ".join(sample_lines))
            if len(matches) >= 6:
                break

        if not matches:
            continue

        topic = {
            "id": rule["id"],
            "title": rule["title"],
            "difficulty": rule["difficulty"],
            "prerequisites": rule["prerequisites"],
            "content": matches,
        }
        sections.setdefault(rule["section"], []).append(topic)

    return sections


def write_roadmap_ts(sections: dict[str, list[dict]]):
    lines = [
        "export type Topic = {",
        "  id: string;",
        "  title: string;",
        '  difficulty: "easy" | "medium" | "hard";',
        "  prerequisites: string[];",
        "  content: string[];",
        "};",
        "",
        "export type Section = {",
        "  id: string;",
        "  title: string;",
        "  topics: Topic[];",
        "};",
        "",
        "export const roadmapSections: Section[] = [",
    ]

    for section_title, topics in sections.items():
        section_id = re.sub(r"[^a-z0-9]+", "-", section_title.lower()).strip("-")
        lines.append("  {")
        lines.append(f'    id: "{section_id}",')
        lines.append(f'    title: "{section_title}",')
        lines.append("    topics: [")
        for topic in topics:
            lines.append("      {")
            lines.append(f'        id: "{topic["id"]}",')
            lines.append(f'        title: "{topic["title"]}",')
            lines.append(f'        difficulty: "{topic["difficulty"]}",')
            prereq_list = ", ".join(f'"{p}"' for p in topic["prerequisites"])
            lines.append(f"        prerequisites: [{prereq_list}],")
            lines.append("        content: [")
            for item in topic["content"]:
                safe = item.replace("\\", "\\\\").replace('"', '\\"')
                lines.append(f'          "{safe}",')
            lines.append("        ],")
            lines.append("      },")
        lines.append("    ],")
        lines.append("  },")

    lines.append("];")
    ROADMAP_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    ROADMAP_OUTPUT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    if not PDF_PATH.exists():
        raise FileNotFoundError(f"PDF not found: {PDF_PATH}")

    pages = ocr_pages(PDF_PATH)
    RAW_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    RAW_OUTPUT_PATH.write_text(
        json.dumps({"pdf": str(PDF_PATH), "pages": pages}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    sections = derive_topics(pages)
    write_roadmap_ts(sections)
    print("wrote:", RAW_OUTPUT_PATH)
    print("wrote:", ROADMAP_OUTPUT_PATH)


if __name__ == "__main__":
    main()
