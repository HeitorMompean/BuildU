export interface Posting { readonly accountId: string; readonly debitMinor: string; readonly creditMinor: string; }
export function isBalanced(postings: readonly Posting[]): boolean {
  const sum = (pick: (p: Posting) => string): bigint => postings.reduce((acc, p) => acc + BigInt(pick(p)), 0n);
  return sum((p) => p.debitMinor) === sum((p) => p.creditMinor);
}
