import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { LessonSession } from "@/lib/curriculum/lesson-session";

const Context = createContext<{
  session: LessonSession | null;
  setSession: Dispatch<SetStateAction<LessonSession | null>>;
} | null>(null);
/** Owned by the Learn route tree, never a module-global learner store. */
export function LearnSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LessonSession | null>(null);
  return <Context.Provider value={{ session, setSession }}>{children}</Context.Provider>;
}
export function useLearnSession() {
  const context = useContext(Context);
  if (!context) throw Error("Learn session provider is missing.");
  return context;
}
