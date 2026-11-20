export const DISPUTE_STATES = ['open','under_review','resolved','closed'] as const;
export type DisputeState = (typeof DISPUTE_STATES)[number];
export function canTransitionDispute(from: DisputeState, to: DisputeState): boolean {
  const allowed: Record<DisputeState, readonly DisputeState[]> = {
    open: ['under_review'], under_review: ['resolved'], resolved: ['closed'], closed: [],
  };
  return allowed[from].includes(to);
}
