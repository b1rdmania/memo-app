# Changelog

All notable changes to memo-app are documented here. Format follows [Keep a Changelog](https://keepachangelog.com); the project follows [SemVer](https://semver.org).

## [0.1.0] — 2026-05-14

First public release. Submitted to vibecode.law as an entry building on [Briefly](https://github.com/map107/Briefly-Memo-Distiller).

### Added
- Three audience outputs (Client, Junior lawyer, Senior lawyer) wired to the `memo` skill (`b1rdmania/memo`).
- Pre-baked sample memos: Khan v Acme (20-paragraph employment matter) and TideSync (82-paragraph SPA warranty dispute), with all three audience outputs cached as static JSON.
- Result view with audience switcher in the sidebar — instant swap on samples, re-run prompt on live mode.
- Browser-side parsing: PDF via pdf.js, DOCX via mammoth, plain text passthrough.
- Paragraph auto-numbering — splits on blank lines first, single newlines as fallback, never rejects input.
- BYOK flow: Anthropic SDK runs in the browser, key stored in `localStorage` only, no proxy or backend.
- Privilege acknowledgement before any live run.
- Whitepaper-aesthetic design system: Inter + JetBrains Mono, `#181818` on white, square edges, 10px tracked eyebrows, em-dash bullet lists, generous whitespace.
- About page with scroll-spy sidebar TOC, seven numbered sections, open-collaborators ask.
- iOS Safari compatibility: `overflow-x: clip`, 44px minimum tap targets, `100svh` for sidebar heights, `viewport-fit=cover`, `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`.
- 1200×1200 project thumbnail (HTML + Chrome headless render) in `thumbnail/`.
- Attribution under "Birdmania" across UI, footers and LICENSE.

### Architecture
- No backend, no database, no functions, no logs. Memo and key never leave the browser.
- Deployed on Vercel as a fully static site.

### Known limitations
- Citation accuracy validated on memos up to 82 paragraphs; longer memos not yet evaluated.
- Self-rated confidence labels — useful but unverified against an external rubric.
- Production model is Claude Opus 4.7 only; no Sonnet/Haiku tier yet.

[0.1.0]: https://github.com/b1rdmania/memo-app/releases/tag/v0.1.0
