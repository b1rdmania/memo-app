import { useState } from 'react';
import { AudiencePicker } from './AudiencePicker';
import { SAMPLES, loadSample, type SampleKey } from '../lib/samples';
import { parseFile } from '../lib/parseFile';
import { paragraphize } from '../lib/paragraphize';
import { runMemo } from '../lib/anthropic';
import type { Audience, MemoOutput } from '../lib/types';

interface Props {
  onResult: (memo: string, audience: Audience, output: MemoOutput, source: 'sample' | 'live') => void;
}

const KEY_STORAGE = 'memo-app:anthropic-key';

export function Landing({ onResult }: Props) {
  const [audience, setAudience] = useState<Audience>('client');
  const [text, setText] = useState('');
  const [privilegeAck, setPrivilegeAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSample(key: SampleKey) {
    setBusy(true);
    setError(null);
    try {
      const { memo, output } = await loadSample(key, audience);
      onResult(memo, audience, output, 'sample');
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
      setError('Paste a memo, or upload one, or try a sample below.');
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
    <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <header className="mb-10">
        <div className="text-xs uppercase tracking-[0.18em] text-muted font-mono mb-3">
          memo
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] text-ink mb-4">
          Legal memos,<br />reshaped for the reader.
        </h1>
        <p className="text-muted text-lg max-w-2xl leading-relaxed">
          Three audiences. One output per audience. The tool decides the shape.
          Every claim cites the source paragraph with a confidence score.
        </p>
      </header>

      <section className="mb-10">
        <div className="text-xs uppercase tracking-wider text-muted font-mono mb-3">
          Try a sample
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {Object.values(SAMPLES).map(s => (
            <button
              key={s.key}
              type="button"
              disabled={busy}
              onClick={() => runSample(s.key)}
              className="text-left border border-rule p-4 rounded-sm hover:border-ink transition-colors bg-white disabled:opacity-50"
            >
              <div className="font-medium text-ink text-sm mb-1">{s.label}</div>
              <div className="text-xs text-muted leading-relaxed">{s.description}</div>
            </button>
          ))}
        </div>
        <div className="text-xs text-muted mb-3">
          Sample outputs are pre-baked — no API key needed.
        </div>
      </section>

      <section className="mb-10">
        <div className="text-xs uppercase tracking-wider text-muted font-mono mb-3">
          Or run on your own memo
        </div>

        <label className="flex items-start gap-2 mb-4 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={privilegeAck}
            onChange={e => setPrivilegeAck(e.target.checked)}
            className="mt-1"
          />
          <span>
            I understand this is a prototype. I will not paste privileged, client-confidential, or sensitive material.
            Your Anthropic API key and memo stay in your browser — nothing is sent to a Memo server.
          </span>
        </label>

        <div className="mb-3">
          <AudiencePicker value={audience} onChange={setAudience} />
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your memo here. Paragraphs separated by blank lines work best."
          rows={10}
          className="w-full border border-rule bg-white p-4 rounded-sm font-mono text-sm leading-relaxed focus:outline-none focus:border-ink"
        />

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <label className="inline-flex items-center gap-2 text-sm text-muted cursor-pointer">
            <span className="px-3 py-1.5 border border-rule rounded-sm hover:border-ink">
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
            className="ml-auto bg-ink text-paper px-5 py-2 rounded-sm hover:bg-accent transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {busy ? 'Working…' : 'Distil →'}
          </button>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-700 border border-red-200 bg-red-50 p-3 rounded-sm">
            {error}
          </div>
        )}
      </section>

      <footer className="mt-16 pt-8 border-t border-rule text-xs text-muted leading-relaxed">
        <p className="mb-2">
          <strong className="text-ink">Memo is a Claude skill, demoed as a web app.</strong>
          {' '}The skill is the product; the app is the proof. The same skill file{' '}
          <a href="https://github.com/b1rdmania/memo" className="underline">runs anywhere Claude runs</a>.
        </p>
        <p>
          Built on{' '}
          <a href="https://github.com/map107/Briefly-Memo-Distiller" className="underline">Briefly</a>{' '}
          — the 30-minute LinkedIn vibe — but asking: what would a lawyer actually trust?
        </p>
      </footer>
    </div>
  );
}
