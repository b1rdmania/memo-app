// Strip any existing [N] markers, split into paragraphs, re-number.
// Paragraphs split on blank lines; single newlines within a paragraph are preserved.

export function paragraphize(input: string): string {
  const stripped = input.replace(/^\s*\[\d+\]\s*/gm, '');
  const blocks = stripped
    .split(/\n\s*\n/)
    .map(b => b.trim())
    .filter(b => b.length > 0);
  return blocks.map((b, i) => `[${i + 1}] ${b}`).join('\n\n');
}

// Return the source paragraph text for a given number, or null.
export function getParagraph(numbered: string, n: number): string | null {
  const re = new RegExp(`^\\[${n}\\]\\s+([\\s\\S]*?)(?=\\n\\s*\\n\\[\\d+\\]|$)`, 'm');
  const match = numbered.match(re);
  return match ? match[1].trim() : null;
}
