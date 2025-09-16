import { NextResponse } from 'next/server';

type Req = {
  writingDraft: string;
  quizAnswers: { qid: string; answer: string | string[] }[];
  durationSec: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Req;
  const text = (body.writingDraft || '').trim();
  const words = (text.match(/\b\w+\b/g) || []).length;
  const sentences = (text.match(/[.!?]+\s|\n/g) || []).length + (text ? 1 : 0);
  const unique = new Set((text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])).size;
  const varietyScore = Math.min(1, sentences / Math.max(1, words / 12));
  const punctCount = (text.match(/[;:—–,]/g) || []).length;

  // Simple deterministic focus areas
  const focusAreas: string[] = [];
  if (varietyScore < 0.6) focusAreas.push('Sentence variety');
  if (punctCount < Math.ceil(sentences * 0.2)) focusAreas.push('Punctuation for control');
  if (words < 120) focusAreas.push('Development (add detail)');
  if (focusAreas.length === 0) focusAreas.push('Editing for precision');

  const strengths: string[] = [];
  if (unique / Math.max(1, words) > 0.6) strengths.push('Vocabulary');
  if (sentences >= 6) strengths.push('Ideas');
  if (strengths.length === 0) strengths.push('Effort');

  return NextResponse.json({
    words,
    sentences,
    durationSec: body.durationSec,
    strengths,
    focusAreas
  });
}

