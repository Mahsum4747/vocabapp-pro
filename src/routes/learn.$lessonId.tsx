import { createFileRoute, Link } from "@tanstack/react-router";
import { germanA1 } from "@/content/curriculum/german-a1";
import { LessonScreen } from "@/components/learn/lesson-screen";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/learn/$lessonId")({ component: LearnLesson });
function LearnLesson() {
  const { lessonId } = Route.useParams();
  const lesson = germanA1.lessons.find((l) => l.id === lessonId);
  if (!lesson || lesson.availability !== "prototype")
    return (
      <main className="mx-auto max-w-2xl px-page-safe py-16">
        <h1 className="text-2xl font-semibold">
          {lesson ? "This lesson is not yet authored" : "Lesson not found"}
        </h1>
        <p className="mt-4 text-muted">
          Only the first German A1 lesson is available in this prototype.
        </p>
        <Button asChild className="mt-6">
          <Link to="/learn">Return to Learn</Link>
        </Button>
      </main>
    );
  return (
    <LessonScreen key={`${germanA1.id}:${lesson.id}`} releaseId={germanA1.id} lesson={lesson} />
  );
}
