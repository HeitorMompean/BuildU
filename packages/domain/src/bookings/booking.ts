export const BOOKING_STATES = ['pending_payment','scheduled','in_progress','completed','cancelled','disputed'] as const;
export type BookingState = (typeof BOOKING_STATES)[number];
export interface Booking { readonly id: string; readonly state: BookingState; readonly version: number; }
