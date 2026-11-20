import type { JobState } from './job.js';
// R01-M shell: transition table only. Round 2 implements guards.
export const JOB_TRANSITIONS: Record<JobState, readonly JobState[]> = {
  draft: ['open', 'cancelled'], open: ['matching', 'cancelled', 'expired'],
  matching: ['awaiting_quote_selection', 'cancelled', 'expired'],
  awaiting_quote_selection: ['booked', 'cancelled', 'expired'],
  booked: ['closed'], closed: [], cancelled: [], expired: [],
};
export function canTransitionJob(from: JobState, to: JobState): boolean {
  return JOB_TRANSITIONS[from].includes(to);
}
