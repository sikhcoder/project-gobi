import { ReactNode } from "react";

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-4 gap-3">{children}</div>;
}
