export const PAYOUT_STATES = ['pending','approved','settled','rejected'] as const;
export type PayoutState = (typeof PAYOUT_STATES)[number];
