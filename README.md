# Kannada Gothu - NeetCode-Style Roadmap

Client-side Kannada learning app built with React + TypeScript + Vite.  
The roadmap is derived from OCR parsing of a Kannada notes PDF, then rendered in a NeetCode-style progression UI with prerequisites and local progress tracking.

## Stack

- React + TypeScript (Vite)
- Tailwind CSS
- Zustand (local client state)
- No backend, no external APIs

## Features

- Vertical section roadmap with topic cards
- Topic statuses:
  - Locked (gray)
  - Unlocked (blue)
  - Completed (green)
- Prerequisite-based unlock logic
- Topic details panel with extracted PDF content
- "Mark as Completed" button per unlocked topic
- Progress persisted in `localStorage`
- GitHub Pages compatible via Vite `base` config

## Project Structure

```text
notes/
  kannada_notes_from_pdf.md
src/
  components/
    Section.tsx
    TopicItem.tsx
    TopicPanel.tsx
  data/
    roadmap.ts
    pdfExtract.json
  store/
    useProgressStore.ts
  utils/
    unlockLogic.ts
scripts/
  parse_pdf_to_roadmap.py
```

## PDF -> Roadmap Pipeline

The app uses a one-time parsing script to derive roadmap content from:

- `/Users/danielisaac/Downloads/kannada_notes.pdf`

Script:

- `scripts/parse_pdf_to_roadmap.py`

Outputs:

- `src/data/pdfExtract.json` (raw OCR lines per page)
- `src/data/roadmap.ts` (typed roadmap data used by UI)

### Run the parser

1. Install Python deps:

```bash
python3 -m pip install --user --upgrade --ignore-installed pypdfium2 rapidocr_onnxruntime pillow
```

2. Generate roadmap data:

```bash
python3 scripts/parse_pdf_to_roadmap.py
```

## Development

Install and run:

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

## GitHub Pages

`vite.config.ts` now uses:

```ts
const base = process.env.VITE_BASE_PATH || "/";
```

This supports both:

- User site repo (`<username>.github.io`) -> `/`
- Project repo (`<username>/<repo>`) -> `/<repo>/`

An automated workflow is included at `.github/workflows/deploy.yml` and computes the correct base path before building.

### One-time GitHub setup

1. Push this repo to GitHub.
2. In repo settings -> Pages:
   - Source: **GitHub Actions**
3. Push to `main` (or run workflow manually).

The workflow builds `dist/` and deploys it directly to GitHub Pages.

## Notes

- This project is fully client-side.
- No server routes are used.
- If you replace the PDF, rerun the parsing script to regenerate `roadmap.ts`.
- Human-readable extracted notes are stored in `notes/kannada_notes_from_pdf.md`.
