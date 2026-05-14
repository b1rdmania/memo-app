import { useMemo, useRef, useState, useEffect } from 'react';
import type { Audience, MemoOutput } from '../lib/types';
import { loadSample, type SampleKey } from '../lib/samples';
import { runMemo } from '../lib/anthropic';
import { Header } from './shared/Header';

interface Props {
  memo: string;
  audience: Audience;
  output: MemoOutput;
  source: 'sample' | 'live';
  sampleKey?: SampleKey;
  onBack: () => void;
  onAbout: () => void;
  onSwap: (audience: Audience, output: MemoOutput) => void;
}

const KEY_STORAGE = 'memo-app:anthropic-key';

const AUDIENCE_LABEL: Record<Audience, string> = {
  client: 'Client',
  junior: 'Junior lawyer',
  senior: 'Senior lawyer',
};

const AUDIENCE_SUB: Record<Audience, string> = {
  client: 'Plain-English email',
  junior: 'Research + drafting brief',
  senior: 'Risk & sign-off note',
};

const AUDIENCES: Audience[] = ['client', 'junior', 'senior'];

export function Result({ memo, audience, output, source, sampleKey, onBack, onAbout, onSwap }: Props) {
  const [activeClaim, setActiveClaim] = useState<number | null>(null);
  const [swapping, setSwapping] = useState<Audience | null>(null);
  const memoRef = useRef<HTMLDivElement>(null);

  const paragraphs = useMemo(() => splitMemo(memo), [memo]);
  const activeParagraphs = useMemo(() => {
    if (activeClaim === null) return new Set<number>();
    return new Set(output.claims[activeClaim]?.source_paragraphs ?? []);
  }, [activeClaim, output.claims]);

  useEffect(() => {
    if (activeClaim === null || !memoRef.current) return;
    const first = output.claims[activeClaim]?.source_paragraphs[0];
    if (first === undefined) return;
    const target = memoRef.current.querySelector(`[data-pno="${first}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeClaim, output.claims]);

  async function switchAudience(next: Audience) {
    if (next === audience || swapping) return;
    setSwapping(next);
    try {
      if (source === 'sample' && sampleKey) {
        const { output: nextOutput } = await loadSample(sampleKey, next);
        onSwap(next, nextOutput);
      } else if (source === 'live') {
        if (!confirm(`Re-run for ${AUDIENCE_LABEL[next]}? This uses your Anthropic API key.`)) return;
        const key = localStorage.getItem(KEY_STORAGE);
        if (!key) {
          alert('No API key in localStorage. Go back to the home page to re-enter.');
          return;
        }
        const nextOutput = await runMemo(key, memo, next);
        onSwap(next, nextOutput);
      }
    } catch (e: any) {
      alert(e.message ?? 'Failed to switch audience');
    } finally {
      setSwapping(null);
      setActiveClaim(null);
    }
  }

  return (
    <>
      <Header onHome={onBack} onAbout={onAbout} />
      <div className="pt-[64px] sm:pt-[80px]">
        <div className="max-w-page mx-auto lg:flex">
          {/* SIDEBAR */}
          <aside className="lg:w-80 lg:shrink-0 lg:sticky lg:top-[80px] lg:h-page lg:overflow-y-auto lg:border-r border-rule border-b lg:border-b-0 p-6 lg:p-10">
            <button
              type="button"
              onClick={onBack}
              className="eyebrow hover:text-ink mb-6 inline-flex items-center gap-2 min-h-[44px]"
            >
              ← New memo
            </button>

            <div className="eyebrow mb-4">Audience</div>
            <nav className="flex flex-col gap-0 mb-10">
              {AUDIENCES.map((a, i) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => switchAudience(a)}
                  disabled={!!swapping}
                  className={`py-3 border-l-2 text-sm transition-all pl-4 text-left min-h-[44px] disabled:opacity-50 ${
                    a === audience
                      ? 'border-ink text-ink font-semibold'
                      : 'border-transparent text-prose hover:text-ink'
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono text-muted">0{i + 1}.</span>
                    <span>{swapping === a ? 'Loading…' : AUDIENCE_LABEL[a]}</span>
                  </div>
                  <div className="text-xs text-muted pl-6 mt-0.5 font-normal">
                    {AUDIENCE_SUB[a]}
                  </div>
                </button>
              ))}
            </nav>

            <div className="border-t border-rule pt-6">
              <div className="eyebrow-sm mb-3">Status</div>
              {source === 'sample' ? (
                <div className="text-xs text-prose">Pre-baked sample. Audience swaps are free.</div>
              ) : (
                <div className="text-xs text-prose">Live run. Swapping audience uses your API key.</div>
              )}
            </div>
          </aside>

          {/* MAIN */}
          <main className="flex-1 p-6 sm:p-10 lg:p-16 max-w-4xl">
            <div className="mb-12">
              <div className="eyebrow mb-3">Memo for</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight2 text-ink mb-3 leading-[1.1]">
                {AUDIENCE_LABEL[audience]}
              </h1>
              <div className="text-base text-muted">{AUDIENCE_SUB[audience]}</div>
            </div>

            {/* DECISION CALLOUT */}
            <div className="bg-wash p-8 border-l-4 border-ink mb-12">
              <div className="eyebrow-sm mb-3">Decision</div>
              <div className="text-ink leading-relaxed text-base sm:text-lg">{output.decision}</div>
            </div>

            {/* RENDERED */}
            <section className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-6">
                01. The brief
              </h2>
              <div className="whitespace-pre-wrap text-ink leading-[1.7] text-[16px] sm:text-[17px] prose-p-block">
                {output.rendered}
              </div>
            </section>

            {/* CLAIMS */}
            <section className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-3">
                02. Claims & sources
              </h2>
              <p className="prose-p text-sm">
                Every claim is mapped to the source paragraph(s) it draws on,
                with a confidence label. Tap a claim to highlight its source
                below.
              </p>
              <ol className="space-y-2 mt-8">
                {output.claims.map((c, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setActiveClaim(i === activeClaim ? null : i)}
                      className={`w-full text-left p-4 border transition-colors min-h-[44px] ${
                        activeClaim === i
                          ? 'border-ink bg-wash'
                          : 'border-rule hover:border-ink bg-paper'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <ConfidenceChip c={c.confidence} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-ink leading-snug">{c.claim}</div>
                          <div className="text-xs text-muted font-mono mt-1.5">
                            {c.source_paragraphs.length === 0
                              ? '— no source (professional judgment)'
                              : `¶ ${c.source_paragraphs.join(', ')}`}
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ol>
            </section>

            {/* SOURCE MEMO */}
            <section className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-3">
                03. Source memo
              </h2>
              <p className="prose-p text-sm">
                The paragraph-numbered input. Highlighted paragraphs are the
                source for the claim selected above.
              </p>
              <div
                ref={memoRef}
                className="text-xs sm:text-sm font-mono leading-[1.7] bg-paper border border-rule p-4 sm:p-6 mt-8 overflow-y-auto max-h-[70vh]"
              >
                {paragraphs.map(({ n, text }) => (
                  <div
                    key={n}
                    data-pno={n}
                    className={`py-1.5 px-2 -mx-2 transition-colors ${
                      activeParagraphs.has(n) ? 'bg-yellow-100 text-ink' : 'text-prose'
                    }`}
                  >
                    <span className="text-ink font-semibold">[{n}]</span>{' '}
                    <span className="whitespace-pre-wrap">{text}</span>
                  </div>
                ))}
              </div>
            </section>

            <footer className="mt-24 pt-10 border-t border-rule flex flex-wrap justify-between items-center gap-4 text-xs text-muted uppercase tracking-track2">
              <span>© 2026 Birdmania · MIT</span>
              <div className="flex gap-6">
                <a href="https://github.com/b1rdmania/memo" target="_blank" rel="noreferrer" className="hover:text-ink">Skill</a>
                <button onClick={onAbout} className="hover:text-ink uppercase tracking-track2">About</button>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}

function ConfidenceChip({ c }: { c: 'high' | 'med' | 'low' }) {
  return (
    <span
      className={`text-[10px] font-mono uppercase tracking-track1 border px-2 py-0.5 shrink-0 conf-${c}`}
    >
      {c}
    </span>
  );
}

function splitMemo(memo: string): { n: number; text: string }[] {
  const out: { n: number; text: string }[] = [];
  const re = /\[(\d+)\]\s+([\s\S]*?)(?=\n\s*\n\[\d+\]|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(memo)) !== null) {
    out.push({ n: parseInt(m[1], 10), text: m[2].trim() });
  }
  return out;
}
