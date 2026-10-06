import { unit3Available } from "@/lib/curriculum/unit3-access";
import { createFileRoute, Link } from "@tanstack/react-router";
import { germanA1 } from "@/content/curriculum/german-a1";
import { LessonScreen } from "@/components/learn/lesson-screen";
import { useLearnSession } from "@/components/learn/session-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/learn/$lessonId")({ component: LearnLesson });
function LearnLesson() {
  const { lessonId } = Route.useParams();
  const { sessions, blockedLessons, clearedUnits } = useLearnSession();
  if (blockedLessons.includes(lessonId))
    return (
      <main className="mx-auto max-w-2xl px-page-safe py-12">
        <h1 className="text-2xl font-semibold">Your saved lesson is unavailable.</h1>
        <p className="mt-4 text-muted">
          This lesson has changed or been withdrawn. Your saved progress is kept. A compatible
          replacement is not available yet.
        </p>
        <Button asChild className="mt-5">
          <Link to="/learn">Return to Learn</Link>
        </Button>
      </main>
    );
  const lesson = germanA1.lessons.find((l) => l.id === lessonId);
  if (!lesson || lesson.availability !== "prototype")
    return (
      <main className="mx-auto max-w-2xl px-page-safe py-16">
        <h1 className="text-2xl font-semibold">
          {lesson ? "This lesson is not yet authored" : "Lesson not found"}
        </h1>
        <p className="mt-4 text-muted">
          Twelve lessons are authored across Units 1–3. Unit 4 is not yet authored.
        </p>
        <Button asChild className="mt-6">
          <Link to="/learn">Return to Learn</Link>
        </Button>
      </main>
    );
  if (lesson.unitId === "DE.A1.U03" && !unit3Available(sessions, blockedLessons, clearedUnits))
    return (
      <main className="mx-auto max-w-2xl px-page-safe py-12">
        <h1 className="text-2xl font-semibold">Continue with Unit 2 first</h1>
        <p className="mt-4 text-muted">
          Finish Unit 2’s lessons or clear its challenge before studying Unit 3.
        </p>
        <Button asChild className="mt-5">
          <Link to="/learn/units/$unitId" params={{ unitId: "DE.A1.U02" }}>
            Open Unit 2
          </Link>
        </Button>
      </main>
    );
  return <LessonScreen key={`${germanA1.id}:${lesson.id}`} release={germanA1} lesson={lesson} />;
}
