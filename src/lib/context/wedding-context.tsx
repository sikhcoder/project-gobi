"use client";

import { createContext, useContext } from "react";

export interface WeddingContextValue {
  weddingId: string;
  partner1Name: string;
  partner2Name: string;
  date: string | null;
  city: string | null;
  tradition: string | null;
  urlSlug: string | null;
  eventCount: number;
}

const WeddingContext = createContext<WeddingContextValue | null>(null);

export function WeddingProvider({
  value,
  children,
}: {
  value: WeddingContextValue;
  children: React.ReactNode;
}) {
  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}

export function useWedding(): WeddingContextValue {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWedding must be used within WeddingProvider");
  return ctx;
}
