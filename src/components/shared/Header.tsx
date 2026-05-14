import { Logo } from './Logo';

interface Props {
  onHome: () => void;
  onAbout: () => void;
  active?: 'home' | 'about';
}

export function Header({ onHome, onAbout, active }: Props) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-paper border-b border-rule">
      <div className="max-w-page mx-auto px-6 h-[64px] sm:h-[80px] flex items-center justify-between">
        <button
          type="button"
          onClick={onHome}
          className="flex items-center gap-2.5 group outline-none"
          aria-label="Memo home"
        >
          <Logo />
          <span className="font-bold text-lg tracking-tight2 text-ink">MEMO</span>
        </button>
        <nav className="flex items-center gap-2 sm:gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={onAbout}
            className={`px-3 py-2 min-h-[44px] transition-colors ${
              active === 'about' ? 'text-ink' : 'text-prose hover:text-ink'
            }`}
          >
            About
          </button>
          <a
            href="https://github.com/b1rdmania/memo"
            target="_blank"
            rel="noreferrer"
            className="bg-ink text-paper px-3 sm:px-4 py-2 min-h-[44px] inline-flex items-center hover:bg-black transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
