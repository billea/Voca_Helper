export type DrillType = 'combining' | 'openers' | 'punctuation' | 'vocab';

export type CombiningItem = { id: string; bases: string[] };
export type OpenersItem = { id: string; base: string };
export type PunctuationItem = { id: string; stem: string; options: { label: string; value: string }[]; answer: string; explanation: string };
export type VocabItem = { id: string; bland: string; bank: string[] };

export const COMBINING_SEED: CombiningItem[] = [
  { id: 'c1', bases: ['It was late.', 'The window creaked.'] },
  { id: 'c2', bases: ['I heard footsteps.', 'I froze.'] },
  { id: 'c3', bases: ['The corridor was silent.', 'A door clicked.'] },
  { id: 'c4', bases: ['The light flickered.', 'The stairs groaned.'] },
  { id: 'c5', bases: ['I reached for the handle.', 'Something moved behind me.'] },
];

export const OPENERS_SEED: OpenersItem[] = [
  { id: 'o1', base: 'I walked down the stairs.' },
  { id: 'o2', base: 'I opened the door.' },
  { id: 'o3', base: 'I stepped into the hall.' },
  { id: 'o4', base: 'I looked into the dark garden.' },
  { id: 'o5', base: 'I ran back to my room.' },
];

export const PUNCTUATION_SEED: PunctuationItem[] = [
  {
    id: 'p1',
    stem: 'The corridor was silent __ I held my breath',
    options: [
      { label: 'semicolon ;', value: ';' },
      { label: 'dash —', value: '—' },
      { label: 'colon :', value: ':' },
    ],
    answer: ';',
    explanation: 'Two related independent clauses → semicolon links closely.'
  },
  {
    id: 'p2',
    stem: 'I reached for the handle __ the door clicked',
    options: [
      { label: 'semicolon ;', value: ';' },
      { label: 'dash —', value: '—' },
      { label: 'colon :', value: ':' },
    ],
    answer: '—',
    explanation: 'Dash adds suddenness/interrupts action.'
  },
  {
    id: 'p3',
    stem: 'One sound kept returning __ the low creak of the stairs',
    options: [
      { label: 'semicolon ;', value: ';' },
      { label: 'dash —', value: '—' },
      { label: 'colon :', value: ':' },
    ],
    answer: ':',
    explanation: 'Colon introduces or explains the previous clause.'
  },
];

export const VOCAB_SEED: VocabItem[] = [
  { id: 'v1', bland: 'It was very dark and very quiet in the corridor.', bank: ['gloomy', 'hushed', 'shadowed', 'silent', 'dim', 'still'] },
  { id: 'v2', bland: 'I walked quickly to my room.', bank: ['hurried', 'darted', 'slipped', 'rushed', 'scurried'] },
  { id: 'v3', bland: 'I was very scared.', bank: ['terrified', 'petrified', 'uneasy', 'unnerved'] },
  { id: 'v4', bland: 'The noise was very loud.', bank: ['piercing', 'shrill', 'thunderous', 'echoing'] },
  { id: 'v5', bland: 'I opened the door slowly.', bank: ['inched', 'eased', 'nudged', 'creaked'] },
];

