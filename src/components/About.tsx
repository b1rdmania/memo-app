import { useEffect, useRef, useState } from 'react';
import { Header } from './shared/Header';

interface Props {
  onHome: () => void;
}

const TOC = [
  { id: 'abstract', label: '01. Abstract' },
  { id: 'why', label: '02. Why we built it' },
  { id: 'skill', label: '03. The skill is the product' },
  { id: 'architecture', label: '04. No backend' },
  { id: 'differentiators', label: "05. What's different" },
  { id: 'open', label: '06. Open to collaborators' },
  { id: 'links', label: '07. Links' },
];

export function About({ onHome }: Props) {
  const [active, setActive] = useState('abstract');
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      let current = TOC[0].id;
      for (const { id } of TOC) {
        const el = refs.current[id];
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTo(id: string) {
    const el = refs.current[id];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function setRef(id: string) {
    return (el: HTMLElement | null) => {
      refs.current[id] = el;
    };
  }

  return (
    <>
      <Header onHome={onHome} onAbout={() => {}} active="about" />
      <div className="pt-[64px] sm:pt-[80px]">
        <div className="max-w-page mx-auto lg:flex">
          {/* SIDEBAR */}
          <aside className="lg:w-80 lg:shrink-0 lg:sticky lg:top-[80px] lg:h-page lg:overflow-y-auto lg:border-r border-rule border-b lg:border-b-0 p-6 lg:p-10">
            <div className="eyebrow mb-6">Contents</div>
            <nav className="flex flex-col">
              {TOC.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`py-2.5 border-l-2 text-sm transition-all pl-4 text-left min-h-[44px] ${
                    active === item.id
                      ? 'border-ink text-ink font-semibold'
                      : 'border-transparent text-prose hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-10 pt-6 border-t border-rule">
              <div className="eyebrow-sm mb-4">Resources</div>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <a
                    href="https://github.com/b1rdmania/memo"
                    target="_blank"
                    rel="noreferrer"
                    className="text-prose hover:text-ink"
                  >
                    Skill repo →
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/b1rdmania/memo-app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-prose hover:text-ink"
                  >
                    App repo →
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/b1rdmania"
                    target="_blank"
                    rel="noreferrer"
                    className="text-prose hover:text-ink"
                  >
                    Profile →
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* MAIN */}
          <main className="flex-1 p-6 sm:p-10 lg:p-16 max-w-4xl">
            <div className="mb-16">
              <div className="text-xs font-mono text-muted mb-4">VERSION 0.1 — MAY 2026</div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight2 text-ink mb-6 leading-[1.05]">
                About Memo
              </h1>
              <p className="text-lg sm:text-xl text-prose leading-relaxed max-w-2xl">
                What Memo is, why it exists, and why it's a skill before
                it's an app.
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
              </div>
            </div>

            <section ref={setRef('abstract')} id="abstract" className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-6">01. Abstract</h2>
              <p className="prose-p">
                Memo turns a legal memo into the right shape for whoever is
                reading it next. Three audiences: client, junior lawyer,
                senior lawyer. One output per audience.
              </p>
              <p className="prose-p">
                Every factual claim cites the source paragraph it draws on,
                with a confidence label. If the tool can't cite something, it
                won't say it.
              </p>
            </section>

            <section ref={setRef('why')} id="why" className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-6">02. Why we built it</h2>
              <p className="prose-p">
                <a
                  href="https://github.com/map107/Briefly-Memo-Distiller"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-rule hover:decoration-ink"
                >
                  Briefly
                </a>{' '}
                was a 30-minute LinkedIn vibe — paste a memo, get a summary.
                Nice shape. We asked: what would a lawyer actually trust?
              </p>
              <p className="prose-p">
                Three things, mainly. Outputs that name a decision. Claims
                that cite paragraph numbers. Confidence labels that are honest
                about what's a fact and what's professional judgment.
              </p>
              <div className="bg-wash p-8 border-l-4 border-ink my-10">
                <p className="text-sm font-medium italic m-0 text-prose">
                  "None of that fits a 30-minute build. It does fit a skill."
                </p>
              </div>
            </section>

            <section ref={setRef('skill')} id="skill" className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-6">03. The skill is the product</h2>
              <p className="prose-p">
                The app you're looking at is a demo. The thing it demos is a
                Claude skill — a portable Markdown file with a prompt and a
                contract. Anyone with Claude can run it without this app.
              </p>
              <p className="prose-p">
                We think the unit of legal-tech distribution is a skill, not
                an app. Lawyers won't all ship apps. They will run skills.
              </p>
            </section>

            <section ref={setRef('architecture')} id="architecture" className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-6">04. No backend</h2>
              <p className="prose-p">
                There is no Memo server. The "Try sample" buttons serve
                pre-baked JSON. When you run on your own memo, your Anthropic
                API key sits in your browser and the call goes direct to
                Anthropic. We never see your memo or your key.
              </p>
              <p className="prose-p">
                That is the right shape for legal content. It is also a
                deliberate signal: this is a tool, not a SaaS pretending to
                be production-ready.
              </p>
              <ul className="list-none space-y-4 text-prose text-sm pl-0 mt-8">
                <li className="flex items-start gap-4">
                  <span className="font-bold text-ink">—</span>
                  <span><strong className="text-ink">Static.</strong> All files served from CDN. No serverless functions.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-ink">—</span>
                  <span><strong className="text-ink">Browser parsing.</strong> PDF and DOCX parsed locally via pdf.js and mammoth.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-ink">—</span>
                  <span><strong className="text-ink">BYOK.</strong> Your Anthropic key, your call. Stored in localStorage only.</span>
                </li>
              </ul>
            </section>

            <section ref={setRef('differentiators')} id="differentiators" className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-6">05. What's different</h2>
              <p className="prose-p">
                Compared with simpler memo-summary tools:
              </p>
              <ul className="list-none space-y-4 text-prose text-sm pl-0 mt-8">
                <li className="flex items-start gap-4">
                  <span className="font-bold text-ink">—</span>
                  <span><strong className="text-ink">Audience-shaped outputs.</strong> Three opinionated audiences. Not five formats to pick from. The tool decides the shape.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-ink">—</span>
                  <span><strong className="text-ink">Paragraph citations.</strong> Every claim maps to the source paragraph it came from. No hallucinated facts.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-ink">—</span>
                  <span><strong className="text-ink">Confidence per claim.</strong> High, medium, low. If we can't cite it, we say so.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-ink">—</span>
                  <span><strong className="text-ink">Decision up top.</strong> Every output starts with the decision being asked. Most memos bury this.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-ink">—</span>
                  <span><strong className="text-ink">Plain English on client output.</strong> No Latin, no case names, no section numbers in the version that goes to clients.</span>
                </li>
              </ul>
            </section>

            <section ref={setRef('open')} id="open" className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-6">06. Open to collaborators</h2>
              <p className="prose-p">
                I build with frontier AI. Currently focused on legal — ripe
                for disruption.
              </p>
              <p className="prose-p">
                Particularly interested in talking to a UK AI law firm with
                regulatory approval (or a clear path to one) paired with a
                tech firm. That is the shape that unlocks the work I want to
                do next.
              </p>
              <p className="prose-p">
                Jamming on a few projects in the open:{' '}
                <a
                  href="https://github.com/b1rdmania"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-rule hover:decoration-ink"
                >
                  github.com/b1rdmania
                </a>
                .
              </p>
            </section>

            <section ref={setRef('links')} id="links" className="mb-20">
              <h2 className="text-2xl font-bold tracking-tight2 text-ink mb-6">07. Links</h2>
              <ul className="list-none space-y-3 text-prose text-sm pl-0">
                <li>
                  <span className="eyebrow-sm inline-block w-24">Skill</span>{' '}
                  <a className="underline decoration-rule hover:decoration-ink text-ink" href="https://github.com/b1rdmania/memo" target="_blank" rel="noreferrer">
                    github.com/b1rdmania/memo
                  </a>
                </li>
                <li>
                  <span className="eyebrow-sm inline-block w-24">App</span>{' '}
                  <a className="underline decoration-rule hover:decoration-ink text-ink" href="https://github.com/b1rdmania/memo-app" target="_blank" rel="noreferrer">
                    github.com/b1rdmania/memo-app
                  </a>
                </li>
                <li>
                  <span className="eyebrow-sm inline-block w-24">Profile</span>{' '}
                  <a className="underline decoration-rule hover:decoration-ink text-ink" href="https://github.com/b1rdmania" target="_blank" rel="noreferrer">
                    github.com/b1rdmania
                  </a>
                </li>
                <li>
                  <span className="eyebrow-sm inline-block w-24">Inspired by</span>{' '}
                  <a className="underline decoration-rule hover:decoration-ink text-ink" href="https://github.com/map107/Briefly-Memo-Distiller" target="_blank" rel="noreferrer">
                    Briefly (map107)
                  </a>
                </li>
              </ul>
              <p className="text-sm text-muted pt-10">
                Prototype. Do not paste privileged or client-confidential material. MIT licensed.
              </p>
            </section>

            <footer className="mt-24 pt-10 border-t border-rule flex flex-wrap justify-between items-center gap-4 text-xs text-muted uppercase tracking-track2">
              <span>© 2026 Birdmania · MIT</span>
              <button onClick={onHome} className="hover:text-ink uppercase tracking-track2">← Home</button>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
