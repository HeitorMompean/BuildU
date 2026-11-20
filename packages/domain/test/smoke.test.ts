import { describe, expect, it } from 'vitest';
import { canTransitionJob } from '../src/jobs/job-transitions.js';
import { canTransitionQuote } from '../src/quotes/quote-transitions.js';
import { canTransitionBooking } from '../src/bookings/booking-transitions.js';
import { isBalanced } from '../src/ledger/posting.js';

describe('domain shells', () => {
  it('exposes transition tables', () => {
    expect(canTransitionJob('draft', 'open')).toBe(true);
    expect(canTransitionJob('draft', 'booked')).toBe(false);
    expect(canTransitionQuote('submitted', 'accepted')).toBe(true);
    expect(canTransitionBooking('pending_payment', 'scheduled')).toBe(true);
  });
  it('balances postings', () => {
    expect(isBalanced([{ accountId: 'a', debitMinor: '100', creditMinor: '0' }, { accountId: 'b', debitMinor: '0', creditMinor: '100' }])).toBe(true);
    expect(isBalanced([{ accountId: 'a', debitMinor: '100', creditMinor: '0' }])).toBe(false);
  });
});
