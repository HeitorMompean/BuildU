export interface RankedCandidate { readonly workerId: string; readonly score: number; readonly reasons: readonly string[]; }
export function rankCandidates(candidates: readonly RankedCandidate[]): readonly RankedCandidate[] {
  return [...candidates].sort((a, b) => b.score - a.score);
}
