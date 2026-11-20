export const JOB_STATES = ['draft','open','matching','awaiting_quote_selection','booked','closed','cancelled','expired'] as const;
export type JobState = (typeof JOB_STATES)[number];
export interface Job { readonly id: string; readonly state: JobState; readonly version: number; }
