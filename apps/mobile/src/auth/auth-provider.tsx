import { createContext, useContext, type ReactNode } from 'react';
const Ctx = createContext<{ token: string | null }>({ token: null });
export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  return <Ctx.Provider value={{ token: null }}>{children}</Ctx.Provider>;
}
export function useAuth(): { token: string | null } { return useContext(Ctx); }
