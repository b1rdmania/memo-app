// Strip any existing [N] markers and re-number.
// Try blank-line splits first; fall back to single-newline splits;
// fall back to leaving the text as one paragraph.

export function paragraphize(input: string): string {
  const stripped = input.replace(/^\s*\[\d+\]\s*/gm, '').trim();
  if (!stripped) return '';

  let blocks = stripped
    .split(/\n\s*\n/)
    .map(b => b.trim())
    .filter(b => b.length > 0);

  if (blocks.length <= 1) {
    blocks = stripped
      .split(/\n/)
      .map(b => b.trim())
      .filter(b => b.length > 0);
  }

  if (blocks.length === 0) blocks = [stripped];

  return blocks.map((b, i) => `[${i + 1}] ${b}`).join('\n\n');
}

export function getParagraph(numbered: string, n: number): string | null {
  const re = new RegExp(`^\\[${n}\\]\\s+([\\s\\S]*?)(?=\\n\\s*\\n\\[\\d+\\]|$)`, 'm');
  const match = numbered.match(re);
  return match ? match[1].trim() : null;
}
