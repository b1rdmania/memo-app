import type { Audience, MemoOutput } from './types';

export type SampleKey = 'khan' | 'tidesync';

export interface Sample {
  key: SampleKey;
  label: string;
  description: string;
  memoUrl: string;
  outputs: Record<Audience, string>; // urls to pre-baked JSON
}

export const SAMPLES: Record<SampleKey, Sample> = {
  khan: {
    key: 'khan',
    label: 'Khan v Acme — unfair dismissal advice',
    description: 'Employment tribunal. 20 paragraphs. Short advice note from a solicitor to a client on prospects.',
    memoUrl: '/samples/memo-khan.txt',
    outputs: {
      client: '/samples/memo-khan-client.json',
      junior: '/samples/memo-khan-junior.json',
      senior: '/samples/memo-khan-senior.json',
    },
  },
  tidesync: {
    key: 'tidesync',
    label: 'TideSync — SPA warranty dispute',
    description: 'Commercial dispute. 82 paragraphs. Complex multi-issue post-acquisition memo with cross-references.',
    memoUrl: '/samples/memo-tidesync.txt',
    outputs: {
      client: '/samples/memo-tidesync-client.json',
      junior: '/samples/memo-tidesync-junior.json',
      senior: '/samples/memo-tidesync-senior.json',
    },
  },
};

export async function loadSample(
  key: SampleKey,
  audience: Audience,
): Promise<{ memo: string; output: MemoOutput }> {
  const sample = SAMPLES[key];
  const [memo, output] = await Promise.all([
    fetch(sample.memoUrl).then(r => r.text()),
    fetch(sample.outputs[audience]).then(r => r.json() as Promise<MemoOutput>),
  ]);
  return { memo, output };
}
