# memo-app

The web app for the [`memo`](https://github.com/b1rdmania/memo) Claude skill. Turns a legal memo into the right shape for whoever's reading it next — client, junior lawyer or senior lawyer. Every claim cites the source paragraph with a confidence label.

**Live:** [memo-app-eta-tawny.vercel.app](https://memo-app-eta-tawny.vercel.app)

## What it is

A fully static, BYOK demo of the `memo` skill.

- **Three audiences** — Client, Junior lawyer, Senior lawyer. One output per audience. No format picker.
- **Paragraph citations** — every factual claim maps to the source paragraph it came from.
- **Confidence per claim** — `high`, `med`, `low`. Honest about what's a fact and what's professional judgment.
- **Plain-English pass** on the client output. No Latin, no case names, no section numbers.
- **Two pre-baked sample memos** — 20-paragraph employment matter, 82-paragraph SPA dispute. Instant load, no key.
- **PDF / DOCX / TXT** parsed in the browser via pdf.js and mammoth.
- **iOS Safari verified** — 44px tap targets, `overflow-x: clip`, `100svh` sidebars, no rubber-band.

## Architecture

```
browser ──► Anthropic API
   │
   └── pre-baked sample JSON (static)
```

There is no backend. No database, no functions, no logs. The Anthropic SDK runs in the user's browser with their own API key, stored in `localStorage` only. The "Try sample" buttons serve pre-baked JSON from `/public/samples`.

This is the right shape for legal content: privileged or confidential text never traverses a third-party server.

## Run locally

```bash
git clone https://github.com/b1rdmania/memo-app
cd memo-app
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Build

```bash
npm run build      # tsc + vite build
npm run preview    # serve the production bundle locally
```

## Deploy

Static hosting anywhere. Production target is Vercel:

```bash
vercel --prod
```

The output in `dist/` is plain HTML + JS + JSON; serve it from any CDN.

## Project structure

```
public/
├── samples/           # pre-baked sample memos + outputs (Khan, TideSync)
└── favicon.svg

src/
├── components/
│   ├── shared/        # Header, Logo
│   ├── Landing.tsx    # paste / upload / sample picker
│   ├── Result.tsx     # output view, sidebar audience switcher
│   ├── About.tsx      # numbered TOC + sections
│   └── AudiencePicker.tsx
├── lib/
│   ├── anthropic.ts   # browser-side SDK call with dangerouslyAllowBrowser
│   ├── skill.ts       # the system prompt (mirrors b1rdmania/memo SKILL.md)
│   ├── samples.ts     # sample memo registry + loader
│   ├── parseFile.ts   # PDF (pdf.js) + DOCX (mammoth) + text parsing
│   ├── paragraphize.ts # adds [N] markers to memo paragraphs
│   └── types.ts
├── App.tsx            # state-based view switching: landing / result / about
└── main.tsx

thumbnail/             # 1200×1200 project thumbnail (HTML → Chrome headless)
```

## Tech stack

| Layer | Choice |
|---|---|
| Build | Vite 8 + TypeScript |
| UI | React 19 + Tailwind 3 |
| AI | `@anthropic-ai/sdk` — Claude Opus 4.7 |
| PDF parsing | pdf.js (`pdfjs-dist`) |
| DOCX parsing | mammoth |
| Hosting | Vercel (static) |

## Status

Prototype. Not for privileged or client-confidential material. See the deployed [About page](https://memo-app-eta-tawny.vercel.app) for the full thesis and the open collaborator ask.

## License

MIT. © 2026 Birdmania.
