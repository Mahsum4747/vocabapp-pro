import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { LessonSessions } from "@/lib/curriculum/lesson-session";

const Context = createContext<{
  sessions: LessonSessions;
  setSessions: Dispatch<SetStateAction<LessonSessions>>;
} | null>(null);
/** Owned by the Learn route tree, never a module-global learner store. */
export function LearnSessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<LessonSessions>({});
  return <Context.Provider value={{ sessions, setSessions }}>{children}</Context.Provider>;
}
export function useLearnSession() {
  const context = useContext(Context);
  if (!context) throw Error("Learn session provider is missing.");
  return context;
}
