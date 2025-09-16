import Link from 'next/link';
import { LESSON_REGISTRY } from '@/content/lessons';

export default function GenresIndexPage() {
  const entries = Object.entries(LESSON_REGISTRY).flatMap(([genre, lessons]) =>
    Object.keys(lessons).map((lesson) => ({ genre, lesson }))
  );
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Genre Studios</h1>
      <p className="text-slate-600">Pick a genre and lesson to begin a focused mini‑lesson and writing prompt.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(({ genre, lesson }) => (
          <Link key={`${genre}/${lesson}`} href={`/genres/${genre}/${lesson}`} className="focus-ring block rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
            <div className="text-sm text-slate-500">{genre}</div>
            <div className="text-lg font-semibold capitalize">{lesson.replace(/-/g, ' ')}</div>
            <div className="mt-2 text-xs text-slate-500">Open lesson</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

