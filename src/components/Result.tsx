import { useMemo, useRef, useState, useEffect } from 'react';
import type { Audience, MemoOutput } from '../lib/types';

interface Props {
  memo: string;
  audience: Audience;
  output: MemoOutput;
  source: 'sample' | 'live';
  onBack: () => void;
}

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

export function Result({ memo, audience, output, source, onBack }: Props) {
  const [activeClaim, setActiveClaim] = useState<number | null>(null);
  const memoRef = useRef<HTMLPreElement>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-baseline justify-between mb-6 gap-4 flex-wrap">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-mono text-muted hover:text-ink uppercase tracking-wider mb-2 block"
          >
            ← New memo
          </button>
          <h1 className="font-serif text-3xl text-ink">
            Memo for {AUDIENCE_LABEL[audience]}
          </h1>
          <div className="text-sm text-muted mt-1">{AUDIENCE_SUB[audience]}</div>
        </div>
        {source === 'sample' && (
          <div className="text-xs font-mono uppercase tracking-wider border border-rule px-2 py-1 rounded-sm">
            Pre-baked sample
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <div>
          <div className="border border-accent/40 bg-accent/5 p-4 rounded-sm mb-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-1.5">
              Decision
            </div>
            <div className="text-ink leading-relaxed">{output.decision}</div>
          </div>

          <div className="prose-memo whitespace-pre-wrap text-ink leading-relaxed font-serif text-[17px]">
            {output.rendered}
          </div>

          <div className="mt-10 border-t border-rule pt-6">
            <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">
              Claims ({output.claims.length})
            </div>
            <ol className="space-y-2">
              {output.claims.map((c, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setActiveClaim(i === activeClaim ? null : i)}
                    className={`w-full text-left p-3 border rounded-sm transition-colors ${
                      activeClaim === i
                        ? 'border-ink bg-ink/5'
                        : 'border-rule hover:border-ink/40 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <ConfidenceChip c={c.confidence} />
                      <div className="flex-1">
                        <div className="text-sm text-ink leading-snug">{c.claim}</div>
                        <div className="text-xs text-muted font-mono mt-1">
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
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">
            Source memo
          </div>
          <pre
            ref={memoRef}
            className="text-xs font-mono leading-relaxed whitespace-pre-wrap bg-white border border-rule rounded-sm p-4 overflow-y-auto max-h-[80vh]"
          >
            {paragraphs.map(({ n, text }) => (
              <div
                key={n}
                data-pno={n}
                className={`py-1.5 px-2 -mx-2 rounded-sm transition-colors ${
                  activeParagraphs.has(n) ? 'bg-accent/20 text-ink' : 'text-muted'
                }`}
              >
                <span className="text-accent font-medium">[{n}]</span>{' '}
                <span>{text}</span>
              </div>
            ))}
          </pre>
        </aside>
      </div>
    </div>
  );
}

function ConfidenceChip({ c }: { c: 'high' | 'med' | 'low' }) {
  const cls =
    c === 'high'
      ? 'bg-green-50 text-green-800 border-green-200'
      : c === 'med'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-red-50 text-red-800 border-red-200';
  return (
    <span
      className={`text-[10px] font-mono uppercase tracking-wider border px-1.5 py-0.5 rounded-sm shrink-0 ${cls}`}
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
