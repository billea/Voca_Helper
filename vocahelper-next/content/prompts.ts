export type GenreKey = 'narrative' | 'descriptive' | 'persuasive' | 'letters';

export const PROMPTS: Record<GenreKey, string[]> = {
  narrative: [
    'It is late. A strange noise wakes you. You step onto the landing and the house feels different tonight…',
    'A package arrives with no return address. Write the opening of the story.',
    'You find a key that opens a door that should not exist. Begin the story.',
  ],
  descriptive: [
    'Describe a familiar place at night so it feels subtly different.',
    'Describe a sudden storm arriving over your town.',
    'Describe the school corridor just before the bell.',
  ],
  persuasive: [
    'Write a speech persuading students to join a kindness campaign.',
    'Write an article persuading your city to plant more trees.',
    'Write a leaflet persuading people to visit a local museum.',
  ],
  letters: [
    'Write a formal letter to your headteacher persuading them to support a school eco‑project.',
    'Write a letter to a local company asking for sponsorship for a charity run.',
    'Write a letter to the council about improving a nearby park.',
  ],
};

export function randomPrompt(genre: GenreKey) {
  const arr = PROMPTS[genre];
  return arr[Math.floor(Math.random() * arr.length)];
}

