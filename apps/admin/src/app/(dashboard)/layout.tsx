import type { ReactNode } from 'react';
export default function DashboardLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <section>{children}</section>;
}
