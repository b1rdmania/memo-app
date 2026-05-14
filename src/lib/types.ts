export type Audience = 'client' | 'junior' | 'senior';

export type Confidence = 'high' | 'med' | 'low';

export interface Claim {
  claim: string;
  source_paragraphs: number[];
  confidence: Confidence;
}

export interface MemoOutput {
  decision: string;
  rendered: string;
  claims: Claim[];
}
