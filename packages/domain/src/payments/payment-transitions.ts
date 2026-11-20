import type { PaymentState } from './payment.js';
export function canTransitionPayment(from: PaymentState, to: PaymentState): boolean {
  const allowed: Record<PaymentState, readonly PaymentState[]> = {
    created: ['checkout_pending','cancelled','failed'], checkout_pending: ['paid','cancelled','failed'],
    paid: ['refund_pending'], refund_pending: ['partially_refunded','refunded'],
    partially_refunded: ['refunded'], refunded: [], cancelled: [], failed: [],
  };
  return allowed[from].includes(to);
}
