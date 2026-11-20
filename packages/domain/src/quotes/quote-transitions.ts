import type { QuoteState } from './quote.js';
export function canTransitionQuote(from: QuoteState, to: QuoteState): boolean {
  const allowed: Record<QuoteState, readonly QuoteState[]> = {
    draft: ['submitted'], submitted: ['accepted','rejected','withdrawn','expired','superseded'],
    accepted: [], rejected: [], withdrawn: [], expired: [], superseded: [],
  };
  return allowed[from].includes(to);
}
