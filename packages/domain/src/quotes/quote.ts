export const QUOTE_STATES = ['draft','submitted','accepted','rejected','withdrawn','expired','superseded'] as const;
export type QuoteState = (typeof QUOTE_STATES)[number];
export interface Quote { readonly id: string; readonly state: QuoteState; readonly version: number; }
