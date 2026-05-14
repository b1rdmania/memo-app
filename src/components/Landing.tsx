import { useState } from 'react';
import { Header } from './shared/Header';
import { AudiencePicker } from './AudiencePicker';
import { SAMPLES, loadSample, type SampleKey } from '../lib/samples';
import { parseFile } from '../lib/parseFile';
import { paragraphize } from '../lib/paragraphize';
import { runMemo } from '../lib/anthropic';
import type { Audience, MemoOutput } from '../lib/types';

interface Props {
  onResult: (memo: string, audience: Audience, output: MemoOutput, source: 'sample' | 'live', sampleKey?: SampleKey) => void;
  onAbout: () => void;
}

const KEY_STORAGE = 'memo-app:anthropic-key';

export function Landing({ onResult, onAbout }: Props) {
  const [audience, setAudience] = useState<Audience>('client');
  const [text, setText] = useState('');
  const [privilegeAck, setPrivilegeAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSample(key: SampleKey) {
    setBusy(true);
    setError(null);
    try {
      const { memo, output } = await loadSample(key, 'client');
      onResult(memo, 'client', output, 'sample', key);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load sample');
    } finally {
      setBusy(false);
    }
  }

  async function runLive() {
    setError(null);
    if (!privilegeAck) {
      setError('Tick the prototype acknowledgement before running on your own memo.');
      return;
    }
    if (!text.trim()) {
      setError('Paste a memo, upload one, or try a sample above.');
      return;
    }
    let key = localStorage.getItem(KEY_STORAGE);
    if (!key) {
      key = prompt(
        'Paste your Anthropic API key.\n\nIt stays in your browser, never touches a server. Get one at console.anthropic.com.',
      );
      if (!key) return;
      localStorage.setItem(KEY_STORAGE, key);
    }
    setBusy(true);
    try {
      const numbered = paragraphize(text);
      const output = await runMemo(key, numbered, audience);
      onResult(numbered, audience, output, 'live');
    } catch (e: any) {
      setError(e.message ?? 'Run failed');
    } finally {
      setBusy(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const t = await parseFile(file);
      setText(t);
    } catch (err: any) {
      setError(err.message ?? 'Could not read that file');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header onHome={() => {}} onAbout={onAbout} active="home" />
      <div className="pt-[64px] sm:pt-[80px]">
        <main className="max-w-4xl mx-auto px-6 py-12 sm:py-20">
          {/* HERO */}
          <div className="mb-20">
            <div className="text-xs font-mono text-muted mb-4">VERSION 0.1 — MAY 2026</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight2 text-ink mb-6 leading-[1.05]">
              Legal memos,<br />reshaped for the reader.
            </h1>
            <p className="text-lg sm:text-xl text-prose leading-relaxed max-w-2xl">
              Three audiences. One output per audience. The tool decides the
              shape. Every claim cites the source paragraph with a confidence
              score.
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-4 mt-10 pb-10 border-b border-rule">
              <div>
                <div className="eyebrow mb-1.5">By</div>
                <a
                  href="https://github.com/b1rdmania"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-ink underline decoration-rule hover:decoration-ink"
                >
                  Birdmania
                </a>
              </div>
              <div>
                <div className="eyebrow mb-1.5">Status</div>
                <div className="text-sm font-semibold text-ink">Prototype</div>
              </div>
              <div>
                <div className="eyebrow mb-1.5">License</div>
                <div className="text-sm font-semibold text-ink">MIT</div>
              </div>
              <div>
                <div className="eyebrow mb-1.5">Skill</div>
                <a
                  href="https://github.com/b1rdmania/memo"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-ink underline decoration-rule hover:decoration-ink"
                >
                  github.com/b1rdmania/memo
                </a>
              </div>
            </div>
          </div>

          {/* 01. SAMPLES */}
          <section className="mb-24">
            <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-3">
              01. Try a sample
            </h2>
            <p className="prose-p">
              Pre-baked outputs. No API key needed. Click any sample to see
              all three audience outputs side by side.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-8">
              {Object.values(SAMPLES).map(s => (
                <button
                  key={s.key}
                  type="button"
                  disabled={busy}
                  onClick={() => runSample(s.key)}
                  className="text-left border border-rule p-5 hover:border-ink hover:bg-wash transition-colors bg-paper disabled:opacity-50 group min-h-[100px]"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <div className="font-semibold text-ink text-sm">{s.label}</div>
                    <div className="text-xs font-mono text-muted group-hover:text-ink">→</div>
                  </div>
                  <div className="text-xs text-prose leading-relaxed">{s.description}</div>
                </button>
              ))}
            </div>
          </section>

          {/* 02. RUN YOUR OWN */}
          <section className="mb-24">
            <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-3">
              02. Or run on your own memo
            </h2>
            <p className="prose-p">
              Paste, drag in a PDF/DOCX, or upload a .txt. The tool numbers
              the paragraphs and sends them to Claude using your own
              Anthropic API key — nothing touches a Memo server.
            </p>

            <label className="flex items-start gap-3 mt-8 mb-6 text-sm text-prose cursor-pointer">
              <input
                type="checkbox"
                checked={privilegeAck}
                onChange={e => setPrivilegeAck(e.target.checked)}
                className="mt-1 w-4 h-4 accent-ink shrink-0"
              />
              <span className="leading-relaxed">
                I understand this is a prototype. I will not paste privileged,
                client-confidential, or sensitive material. Your Anthropic API
                key and memo stay in your browser — nothing is sent to a
                Memo server.
              </span>
            </label>

            <div className="mb-4">
              <div className="eyebrow mb-3">Audience</div>
              <AudiencePicker value={audience} onChange={setAudience} />
            </div>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your memo here."
              rows={10}
              className="w-full border border-rule bg-paper p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-ink resize-y"
            />

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <label className="inline-flex items-center cursor-pointer min-h-[44px]">
                <span className="px-4 py-2.5 border border-rule hover:border-ink transition-colors text-sm">
                  Upload .pdf / .docx / .txt
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={onFile}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                disabled={busy}
                onClick={runLive}
                className="ml-auto bg-ink text-paper px-6 py-2.5 min-h-[44px] hover:bg-black transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {busy ? 'Working…' : 'Distil →'}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-700 border-l-4 border-red-700 bg-red-50 p-4">
                {error}
              </div>
            )}
          </section>

          {/* 03. PITCH */}
          <section className="mb-24">
            <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-3">
              03. The skill is the product
            </h2>
            <p className="prose-p">
              The app you're looking at is a demo. The thing it demos is a
              Claude skill — a portable Markdown file with a prompt and a
              contract. Anyone with Claude can run it without this app.
            </p>
            <div className="bg-wash p-8 border-l-4 border-ink my-10">
              <p className="text-sm font-medium italic m-0 text-prose">
                "We think the unit of legal-tech distribution is a skill, not
                an app. Lawyers won't all ship apps. They will run skills."
              </p>
            </div>
            <p className="prose-p">
              Memo is built on{' '}
              <a
                href="https://github.com/map107/Briefly-Memo-Distiller"
                className="underline decoration-rule hover:decoration-ink"
                target="_blank"
                rel="noreferrer"
              >
                Briefly
              </a>
              {' '}— the 30-minute LinkedIn vibe — but asks: what would a
              lawyer actually trust?{' '}
              <button
                type="button"
                onClick={onAbout}
                className="underline decoration-rule hover:decoration-ink"
              >
                Read more →
              </button>
            </p>
          </section>

          <footer className="mt-32 pt-12 border-t border-rule flex flex-wrap justify-between items-center gap-4 text-xs text-muted uppercase tracking-track2">
            <span>© 2026 Birdmania · MIT</span>
            <div className="flex flex-wrap gap-6">
              <a href="https://github.com/b1rdmania/memo" target="_blank" rel="noreferrer" className="hover:text-ink">Skill</a>
              <a href="https://github.com/b1rdmania/memo-app" target="_blank" rel="noreferrer" className="hover:text-ink">App</a>
              <button onClick={onAbout} className="hover:text-ink uppercase tracking-track2">About</button>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
