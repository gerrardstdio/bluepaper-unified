import { createContext, useContext, useMemo } from "react";

const WeddingContext = createContext(null);

export function WeddingProvider({ content, children }) {
  const value = useMemo(() => content, [content]);
  if (!value) return null;
  return (
    <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>
  );
}

export function useWedding() {
  const ctx = useContext(WeddingContext);
  if (!ctx) {
    throw new Error("useWedding() harus dipakai di dalam <WeddingProvider>");
  }
  return ctx;
}

export default WeddingContext;
