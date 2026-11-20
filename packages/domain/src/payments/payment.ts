export const PAYMENT_STATES = ['created','checkout_pending','paid','cancelled','failed','refund_pending','partially_refunded','refunded'] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];
