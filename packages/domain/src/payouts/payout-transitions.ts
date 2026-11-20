import type { PayoutState } from './payout.js';
export function canTransitionPayout(from: PayoutState, to: PayoutState): boolean {
  const allowed: Record<PayoutState, readonly PayoutState[]> = {
    pending: ['approved','rejected'], approved: ['settled','rejected'], settled: [], rejected: [],
  };
  return allowed[from].includes(to);
}
