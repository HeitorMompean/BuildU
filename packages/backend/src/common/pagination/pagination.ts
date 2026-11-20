export interface Page<T> { readonly items: readonly T[]; readonly nextCursor: string | null; }
export function emptyPage<T>(): Page<T> { return { items: [], nextCursor: null }; }
