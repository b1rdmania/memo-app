export function Logo({ className = 'text-ink' }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="8" width="22" height="3" fill="currentColor" />
      <rect x="6" y="14" width="28" height="3" fill="currentColor" />
      <rect x="6" y="20" width="18" height="3" fill="currentColor" />
      <rect x="6" y="26" width="24" height="3" fill="currentColor" />
      <rect x="6" y="32" width="14" height="3" fill="currentColor" />
    </svg>
  );
}
