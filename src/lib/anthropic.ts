import Anthropic from '@anthropic-ai/sdk';
import { SKILL_SYSTEM } from './skill';
import type { Audience, MemoOutput } from './types';

const MODEL = 'claude-opus-4-7';

export async function runMemo(
  apiKey: string,
  numberedMemo: string,
  audience: Audience,
): Promise<MemoOutput> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const userPrompt = `AUDIENCE: ${audience.toUpperCase()}

MEMO:

${numberedMemo}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SKILL_SYSTEM,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text returned from model');
  }

  const raw = textBlock.text.trim();
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Model did not return JSON');
  }
  const json = raw.slice(jsonStart, jsonEnd + 1);
  const parsed = JSON.parse(json) as MemoOutput;
  return parsed;
}
