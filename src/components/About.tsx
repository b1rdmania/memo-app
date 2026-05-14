interface Props {
  onBack: () => void;
}

export function About({ onBack }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-mono text-muted hover:text-ink uppercase tracking-wider mb-8"
      >
        ← Back
      </button>

      <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] text-ink mb-8">
        About Memo
      </h1>

      <div className="space-y-6 text-ink leading-relaxed text-lg">
        <p>
          Memo turns a legal memo into the right shape for whoever's reading it
          next. Three audiences: client, junior lawyer, senior lawyer. One
          output per audience.
        </p>

        <p>
          Every factual claim cites the source paragraph with a confidence
          score. If the tool can't cite something, it won't say it.
        </p>

        <h2 className="font-serif text-2xl text-ink pt-4">
          Why we built it
        </h2>

        <p>
          <a
            href="https://github.com/map107/Briefly-Memo-Distiller"
            className="underline decoration-rule hover:decoration-ink"
          >
            Briefly
          </a>{' '}
          was a 30-minute LinkedIn vibe — paste a memo, get a summary. Nice
          shape. We asked: what would a lawyer actually trust?
        </p>

        <p>
          Three things, mainly. Outputs that name a decision. Claims that cite
          paragraph numbers. Confidence labels that are honest about what's a
          fact and what's professional judgment. None of that fits a 30-minute
          build. It does fit a skill.
        </p>

        <h2 className="font-serif text-2xl text-ink pt-4">
          The skill is the product
        </h2>

        <p>
          The app you're looking at is a demo. The thing it demos is a Claude
          skill — a portable Markdown file with a prompt and a contract.
          Anyone with Claude can run it without this app.
        </p>

        <p>
          We think the unit of legal-tech distribution is a skill, not an app.
          Lawyers won't all ship apps. They will run skills.
        </p>

        <h2 className="font-serif text-2xl text-ink pt-4">
          Your key, your browser, our static UI
        </h2>

        <p>
          There is no backend. The "Try sample" buttons serve pre-baked JSON.
          When you run on your own memo, your Anthropic API key sits in your
          browser and the call goes direct to Anthropic. We never see your
          memo or your key.
        </p>

        <p>
          That is the right shape for legal content. It is also a deliberate
          signal: this is a tool, not a SaaS pretending to be production-ready.
        </p>

        <h2 className="font-serif text-2xl text-ink pt-4">
          Open to collaborators
        </h2>

        <p>
          We build with frontier AI, currently focused on legal. Particularly
          interested in talking to a UK AI law firm with regulatory approval
          (or a clear path to one) paired with a tech firm.
        </p>

        <h2 className="font-serif text-2xl text-ink pt-4">
          Links
        </h2>

        <ul className="space-y-2">
          <li>
            Skill →{' '}
            <a className="underline" href="https://github.com/b1rdmania/memo">
              github.com/b1rdmania/memo
            </a>
          </li>
          <li>
            App →{' '}
            <a className="underline" href="https://github.com/b1rdmania/memo-app">
              github.com/b1rdmania/memo-app
            </a>
          </li>
          <li>
            Profile →{' '}
            <a className="underline" href="https://github.com/b1rdmania">
              github.com/b1rdmania
            </a>
          </li>
        </ul>

        <p className="text-sm text-muted pt-6">
          Prototype. Do not paste privileged or client-confidential material.
          MIT licensed.
        </p>
      </div>
    </div>
  );
}
