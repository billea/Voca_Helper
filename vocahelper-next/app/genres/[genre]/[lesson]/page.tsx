import { getLesson } from '@/content/lessons';
import { StudioLayout } from '@/components/genre/StudioLayout';

type Params = { params: { genre: string; lesson: string } };

export default function GenreLessonPage({ params }: Params) {
  const { genre, lesson } = params;
  const c = getLesson(genre, lesson);
  return (
    <StudioLayout
      breadcrumb={["Home", "Genre Studios", c.genre, c.lesson]}
      title={c.title}
      prompt={c.prompt}
      strongExample={c.strongExample}
      strongPoints={c.strongPoints}
      weakExample={c.weakExample}
      weakPoints={c.weakPoints}
      checklist={c.checklist}
      criteria={c.criteria}
      genre={c.genre}
      lesson={c.lesson}
    />
  );
}

