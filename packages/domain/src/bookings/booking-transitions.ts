import type { BookingState } from './booking.js';
export function canTransitionBooking(from: BookingState, to: BookingState): boolean {
  const allowed: Record<BookingState, readonly BookingState[]> = {
    pending_payment: ['scheduled','cancelled'], scheduled: ['in_progress','cancelled'],
    in_progress: ['completed','cancelled'], completed: ['disputed'],
    cancelled: [], disputed: [],
  };
  return allowed[from].includes(to);
}
