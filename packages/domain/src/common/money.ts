// Money is always integer minor units + ISO 4217 currency. No floats.
export interface Money { readonly amountMinor: string; readonly currency: string; }
export function money(amountMinor: string, currency: string): Money {
  return { amountMinor, currency };
}
