// Role guards for customer/worker areas. Round 4+ enforces with real session.
export function canEnter(_role: string, _area: string): boolean { return true; }
