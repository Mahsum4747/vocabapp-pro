import { useEffect, type ReactNode } from "react";
import { useStudyStore } from "@/lib/store";

export function HydrationGate({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useStudyStore.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
