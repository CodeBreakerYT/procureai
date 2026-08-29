# ProcureAI

AI-powered vendor proposal analysis and procurement decision assistant.

ProcureAI helps procurement teams define requirements, upload vendor proposals (PDF/DOCX), automatically extract commercial and technical details, compare vendors side-by-side, surface hidden risks, and get an explainable AI recommendation — guided throughout by **NOVA**, an on-screen AI assistant built as a swappable component so its current animated-orb visual can later be replaced by a full 3D avatar without touching the rest of the app.

## Features

- **Landing page, dashboard, and full procurement workflow**: create project → define requirements → upload proposals → AI analysis → vendor comparison → risk breakdown → recommendation
- **Real LLM extraction pipeline** (Groq / Llama) that reads uploaded PDF/DOCX proposals and extracts price, SLA, support, security, and requirement compliance
- **Deterministic scoring** — every numeric score (price, technical, support, risk, requirement match, overall AI score) is computed in plain TypeScript from the extracted facts, never invented by the LLM. The LLM explains recommendations; it never decides the numbers.
- **Honest handling of missing data** — if a real document never actually states a price or SLA, the UI shows "Not disclosed" instead of a fabricated number
- **NOVA assistant** with distinct idle / listening / thinking / analyzing / speaking states, a persistent chat dock, and a conversational Q&A interface grounded in the real analyzed vendor data for that project
- **Mock-data fallback everywhere** — the app works fully offline with no API key configured; real analysis kicks in automatically once a key is set

## Tech stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4, shadcn/ui-style components, Framer Motion
- Three.js / React Three Fiber (the current NOVA orb placeholder)
- Recharts
- Groq SDK (LLM extraction/chat/recommendation)
- `mammoth` (DOCX text extraction), `pdf-parse` (PDF text extraction)
- Zustand (assistant state)

## Getting started

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local and add a free Groq API key from https://console.groq.com/keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without a `GROQ_API_KEY`, every AI feature gracefully falls back to realistic mock data/responses — the app is fully demoable with zero setup.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | No (falls back to mock data) | Free API key from [console.groq.com](https://console.groq.com/keys) |
| `GROQ_MODEL` | No | Overrides the default model (`openai/gpt-oss-120b`) |

### Test documents

[`demo-documents/for-demo/`](demo-documents/for-demo) contains six realistic vendor proposal documents (PDF and DOCX) ready to upload through the app's Upload Proposals page, across three project categories (ERP, Cloud Infrastructure, Security Monitoring).

## Deploying to Netlify

This repo is pre-configured for Netlify via [`netlify.toml`](netlify.toml) using the official [`@netlify/plugin-nextjs`](https://github.com/netlify/next-runtime) runtime, which supports Next.js API routes as serverless functions automatically.

1. Push this repo to GitHub (already connected to `CodeBreakerYT/procureai`) and import it in Netlify (or run `netlify deploy` via the Netlify CLI).
2. Netlify will detect `netlify.toml` and use `npm run build` with the Next.js plugin — no extra build configuration needed.
3. In the Netlify site's **Environment variables**, add `GROQ_API_KEY` (and optionally `GROQ_MODEL`) if you want real AI analysis in the deployed site. Without it, the deployed site still fully works using mock data.

### Known limitation on serverless deployments

Uploaded/analyzed vendor data is currently persisted to a local JSON file (`.data/store.json`) on the server. This works reliably for local development, but on Netlify's serverless functions the filesystem is not guaranteed to persist or be shared across invocations — uploaded vendor results may not survive between requests in production. For a persistent production deployment, swap [`src/lib/server-store.ts`](src/lib/server-store.ts) for a real database (its function signatures are the only thing the rest of the app depends on, so this is a self-contained change).

Groq's free tier is also rate-limited to 8,000 tokens/minute for the default model — document text sent for extraction is truncated accordingly (see [`src/lib/extraction.ts`](src/lib/extraction.ts)).

## Project structure

```
src/
  app/                     # Next.js App Router pages + API routes
  components/
    assistant/             # NOVA: AIAssistant container + swappable visual (AssistantOrb)
    landing/                # Marketing landing page sections
    layout/                 # App shell (sidebar, topbar)
    procurement/            # Requirements, upload, comparison, risk, recommendation UI
    ui/                     # Design-system primitives (button, card, badge, etc.)
  lib/
    extraction.ts           # LLM-driven document extraction (Groq)
    scoring.ts               # Deterministic scoring formulas
    recommendation.ts        # LLM-written recommendation narrative
    server-store.ts          # File-backed per-project data store
    mock-data.ts              # Seed/fallback data
  store/
    assistant-store.ts       # NOVA's state (Zustand) — decoupled from its visual
```
