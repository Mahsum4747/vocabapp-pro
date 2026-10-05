import { createFileRoute, Link } from "@tanstack/react-router";
import { germanA1 } from "@/content/curriculum/german-a1";
import { LessonScreen } from "@/components/learn/lesson-screen";
import { useLearnSession } from "@/components/learn/session-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/learn/$lessonId")({ component: LearnLesson });
function LearnLesson() {
  const { lessonId } = Route.useParams();
  const { blockedLessons } = useLearnSession();
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
          Two German A1 lessons are available in Unit 1. More are being authored.
        </p>
        <Button asChild className="mt-6">
          <Link to="/learn">Return to Learn</Link>
        </Button>
      </main>
    );
  return <LessonScreen key={`${germanA1.id}:${lesson.id}`} release={germanA1} lesson={lesson} />;
}
