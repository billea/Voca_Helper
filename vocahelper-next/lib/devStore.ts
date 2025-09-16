import fs from 'node:fs/promises';
import path from 'node:path';

type Draft = { id: string; genre: string; lesson: string; content: string; wordCount: number; durationSec: number; createdAt: string };
type Submission = Draft & { nextStepTarget?: string };

type Data = { drafts: Draft[]; submissions: Submission[] };

const DATA_DIR = path.join(process.cwd(), 'vocahelper-next', '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

async function ensureFile() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch {}
  try { await fs.access(DATA_FILE); } catch { await fs.writeFile(DATA_FILE, JSON.stringify({ drafts: [], submissions: [] } satisfies Data, null, 2)); }
}

async function read(): Promise<Data> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  try { return JSON.parse(raw) as Data; } catch { return { drafts: [], submissions: [] }; }
}

async function write(data: Data) { await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2)); }

export async function addDraft(d: Omit<Draft, 'id' | 'createdAt'>) {
  const data = await read();
  const id = 'draft_' + Math.random().toString(36).slice(2, 10);
  const draft: Draft = { ...d, id, createdAt: new Date().toISOString() };
  data.drafts.unshift(draft);
  await write(data);
  return draft;
}

export async function addSubmission(s: Omit<Submission, 'id' | 'createdAt'>) {
  const data = await read();
  const id = 'sub_' + Math.random().toString(36).slice(2, 10);
  const sub: Submission = { ...s, id, createdAt: new Date().toISOString() };
  data.submissions.unshift(sub);
  await write(data);
  return sub;
}

export async function getAll() { return read(); }

