export interface EligibilityInput { readonly verified: boolean; readonly suspended: boolean; }
export function isEligible(input: EligibilityInput): boolean {
  return input.verified && !input.suspended; // detailed rules in Round 2
}
