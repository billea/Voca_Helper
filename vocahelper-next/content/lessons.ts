export type LessonContent = {
  genre: string;
  lesson: string;
  title: string;
  prompt: string;
  strongExample: string;
  strongPoints: string[];
  weakExample: string;
  weakPoints: string[];
  checklist: string[];
  criteria: string[];
};

type Registry = Record<string, Record<string, LessonContent>>;

/**
 * LESSON_REGISTRY defines content by genre/lesson.
 */
export const LESSON_REGISTRY: Registry = {
  narrative: {
    suspense: {
      genre: 'narrative',
      lesson: 'suspense',
      title: 'Suspense Writing — Opening a Story',
      prompt:
        'It is late. A strange noise wakes you. You step onto the landing and the house feels different tonight…',
      strongExample:
        'The corridor holds its breath. A click from the landing. Then—silence. I press my ear to the wood: footsteps, close.',
      strongPoints: [
        'Specific sound imagery (click, footsteps)',
        'Short sentences to build tension',
        'Dash/colon for emphasis and control',
      ],
      weakExample:
        'It was dark and scary and I was walking down a long corridor and there were many doors and I was very worried and nervous.',
      weakPoints: [
        'Run‑on sentence — weak control',
        'Vague adjectives (dark, scary, worried)',
        'No precise images or rhythm change',
      ],
      checklist: [
        'At least 2 short sentences for tension',
        'Sensory detail (sound/feel/sight)',
        'End with hook (question/ellipsis/cliffhanger)',
      ],
      criteria: [
        'Control of sentence length & punctuation',
        'Precise vocabulary; avoid vague fillers',
        'Cohesion across sentences',
        'Tone fits suspense',
      ],
    },
  },
  descriptive: {
    setting: {
      genre: 'descriptive',
      lesson: 'setting',
      title: 'Descriptive — Setting Snapshot',
      prompt:
        'Describe a place that suddenly feels different at night. Focus on atmosphere and detail.',
      strongExample:
        'Moonlight pooled on the tiles. Curtains breathed in and out. In the hallway, the clock chewed seconds, louder than before.',
      strongPoints: [
        'Concrete images and personification',
        'Sound detail to shape mood',
        'Precise noun phrases',
      ],
      weakExample:
        'It was very dark and quiet and everything was different and I felt scared in the house.',
      weakPoints: [
        'Abstract, repetitive language',
        'Tells mood instead of showing it',
        'No specific images',
      ],
      checklist: [
        'Use three precise nouns',
        'Add one personification',
        'Vary sentence length (one <6 words)',
      ],
      criteria: [
        'Imagery and specificity',
        'Cohesion and viewpoint',
        'Punctuation for flow',
      ],
    },
  },
  persuasive: {
    letter: {
      genre: 'persuasive',
      lesson: 'letter',
      title: 'Persuasive — Formal Letter',
      prompt:
        'Write a letter persuading your headteacher to support a school eco-project.',
      strongExample:
        'Dear Headteacher, Our school can lead the change. With student teams, we can cut waste by half this term—starting with paper.',
      strongPoints: [
        'Clear purpose and audience address',
        'Concrete plan and metrics',
        'Confident, polite tone',
      ],
      weakExample:
        'I think we should do something. It would be nice if everyone helped because the planet needs it a lot.',
      weakPoints: [
        'Vague claims with no plan',
        'Weak tone (“nice”, “something”)',
        'No audience awareness',
      ],
      checklist: [
        'State purpose in the opening',
        'Include two specific reasons',
        'Add a clear call to action',
      ],
      criteria: [
        'Clarity of argument',
        'Evidence and examples',
        'Formal register and structure',
      ],
    },
  },
};

export function getLesson(genre: string, lesson: string): LessonContent {
  const g = LESSON_REGISTRY[genre];
  if (g && g[lesson]) return g[lesson];
  // fallback to narrative/suspense
  return LESSON_REGISTRY.narrative.suspense;
}
