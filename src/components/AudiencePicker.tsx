import type { Audience } from '../lib/types';

const OPTIONS: { value: Audience; label: string; sub: string }[] = [
  { value: 'client', label: 'Client', sub: 'Plain-English email' },
  { value: 'junior', label: 'Junior lawyer', sub: 'Research + drafting brief' },
  { value: 'senior', label: 'Senior lawyer', sub: 'Risk & sign-off note' },
];

interface Props {
  value: Audience;
  onChange: (a: Audience) => void;
}

export function AudiencePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`text-left px-4 py-3 border transition-colors min-h-[64px] ${
            value === opt.value
              ? 'border-ink bg-ink text-paper'
              : 'border-rule bg-paper text-ink hover:border-ink hover:bg-wash'
          }`}
        >
          <div className="font-semibold text-sm">{opt.label}</div>
          <div className={`text-xs mt-1 ${value === opt.value ? 'text-paper/70' : 'text-muted'}`}>
            {opt.sub}
          </div>
        </button>
      ))}
    </div>
  );
}
