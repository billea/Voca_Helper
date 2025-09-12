# Vocabulary Memory Helper — Project Structure & Workflow

[![Browser Tests](https://github.com/billea/Voca_Helper/actions/workflows/browser-tests.yml/badge.svg)](https://github.com/billea/Voca_Helper/actions/workflows/browser-tests.yml)

This README captures how the app is organised today (single‑file offline web app) and how to extend it (auto‑fill, quiz, Excel/Google Sheets import, picture OCR, and optional Firebase sync). Use it as your source of truth for building, deploying, and running the project.

---

## 1) Product overview
**Goal:** Help children/learners memorise vocabulary efficiently using spaced repetition, clean UI, and easy distribution (one HTML file that runs offline).

**Core principles**
- **Offline‑first**: Everything works without internet (localStorage).  
- **Lightweight distribution**: A single `index.html` is enough to share/host.  
- **Evidence‑based learning**: Spaced repetition (SM‑2‑style), active recall, short sessions.  
- **Import/export friendly**: JSON/CSV today; Excel/Google Sheets & OCR as optional add‑ons.

**Primary users**
- **Learner**: studies daily cards, uses quiz mode (optional).  
- **Parent/Teacher**: curates lists, imports content, monitors progress locally.

---

## 2) Current feature set (implemented in the canvas version)
- Add/edit/delete **cards** with: word, definition, example, morphology, synonyms, antonyms, part‑of‑speech.  
- **Spaced‑repetition study** flow with Again/Hard/Good/Easy.  
- **TTS** (web speech) to pronounce the word.  
- **Import/Export**: JSON and CSV (headers below).  
- **Local persistence** via `localStorage` (no backend required).  
- **Keyboard shortcuts** (Space to reveal; 1–4 to rate).

> File in use: **`index.html`** (contains HTML, CSS, and JS in one file).

---

## 3) Planned extensions (optional modules)
These are additive and can be embedded into the same single file:
- **Auto‑fill for new words** (when typing a word):  
  - Definitions/examples from *dictionaryapi.dev* (no key).  
  - Synonyms/antonyms from *Datamuse* (no key).  
- **Quiz mode**: Multiple‑choice questions for synonyms and antonyms.  
- **Excel import**: via on‑demand SheetJS (`xlsx`) CDN.  
- **Picture import (OCR)**: via on‑demand Tesseract.js CDN.  
- **Firebase sync (optional)**: anonymous auth + Firestore for cross‑device backup.

---

## 4) Data model
### 4.1 Card
```ts
Card = {
  id: string,                // generated uid()
  word: string,
  definition: string,
  example: string,
  morphology: string,        // root/prefix/suffix (optional)
  synonyms: string,          // comma-separated
  antonyms: string,          // comma-separated
  pos: string,               // part of speech
  ef: number,                // SM-2 easiness factor (default 2.5)
  interval: number,          // days until next review
  reps: number,              // successful repetitions
  due: number,               // next due timestamp (ms)
  created: number,           // created timestamp (ms)
  seen: boolean              // has been introduced yet
}
```

### 4.2 Preferences
```ts
Prefs = {
  newPerDay: number,         // default 20
  maxReviews: number,        // default 200 (future use)
  tts: boolean,              // pronounce word on show
  kid: boolean,              // larger font mode
  streak: number,            // day streak
  lastStudy: string          // YYYY-MM-DD
}
```

**Storage keys**  
- Cards: `vocab_cards_v1`  
- Preferences: `vocab_prefs_v1`

---

## 5) Spaced‑repetition algorithm (SM‑2 simplified)
- **Ratings**: 0 (Again), 3 (Hard), 4 (Good), 5 (Easy).  
- **Rules** (summary):
  - If rating < 3: `reps = 0`, `interval = 0`, next due in **10 minutes**.
  - Else:
    - first success: `interval = 1` day
    - second success: `interval = 6` days
    - thereafter: `interval = round(interval * EF)`
    - update `EF = max(1.3, EF + (0.1 - (5 - grade)*(0.08 + (5 - grade)*0.02)))`
- Due date: `Date.now() + interval * 24h`.

---

## 6) Import/Export formats
### 6.1 CSV
**Headers:**
```
word,definition,example,morphology,synonyms,antonyms,pos
```
**Row example:**
```
benevolent,kind and wanting to do good,The benevolent teacher helped everyone.,bene (good),kind,generous,adjective
```

### 6.2 JSON (array)
```json
[
  {
    "word": "benevolent",
    "definition": "kind and wanting to do good",
    "example": "The benevolent teacher helped everyone.",
    "morphology": "bene (good)",
    "synonyms": "kind,generous",
    "antonyms": "unkind,mean",
    "pos": "adjective"
  }
]
```

---

## 7) Application architecture
### 7.1 Single‑file architecture (current)
- `index.html` contains:
  - **UI** (tabs: Study, Manage, Import/Export, Settings)  
  - **Styles**: inline CSS (dark theme)  
  - **Logic**: minimal helpers (`$`, `$$`), state management, CSV parser, SM‑2 scheduler, TTS, IO.

### 7.2 Suggested modular split (optional, same behaviour)
```
/public
  └─ index.html               # thin HTML bootstraps app
/src
  ├─ app.js                   # init, routing/tabs, events
  ├─ ui.js                    # render helpers, toasts, keyboard shortcuts
  ├─ srs.js                   # SM-2 scheduling
  ├─ store.js                 # localStorage + (optional) sync hooks
  ├─ models.js                # Card/Prefs schemas + validators
  ├─ importers
  │   ├─ csv.js               # CSV parse/format
  │   ├─ json.js              # JSON import/export
  │   ├─ excel.js             # (optional) SheetJS wrapper
  │   └─ ocr.js               # (optional) Tesseract wrapper
  ├─ services
  │   ├─ dictionary.js        # dictionaryapi.dev
  │   └─ datamuse.js          # synonyms/antonyms
  └─ quiz.js                  # MCQ generator for syn/ant
```

---

## 8) Workflows
### 8.1 Authoring vocabulary
**Manual input**
1. Go to **Manage**.  
2. Fill Word, Definition, Example, (Synonyms/Antonyms), POS.  
3. Click **Add card**.

**Spreadsheet import (CSV/Excel/Google Sheets)**
1. Prepare columns: `word,definition,example,morphology,synonyms,antonyms,pos`.  
2. Export as **CSV** (works offline today).  
3. Import via **Import/Export → Import**.  
4. *(Optional)* Add Excel support: use SheetJS; then import `.xlsx` directly.

**Picture import (OCR)**
1. Take a clear photo of a word list.  
2. Use **Import Picture (OCR)** (requires one‑time load of Tesseract.js).  
3. Review auto‑extracted words; use Auto‑fill to populate meanings.

**Auto‑fill for new words** *(optional module)*
1. Toggle **Auto‑fill** in Manage.  
2. Type a word → blur: definition/example from dictionaryapi.dev; synonyms/antonyms from Datamuse.

### 8.2 Learner daily routine
1. **Study** tab → Space to hide/reveal → rate 0/3/4/5.  
2. Keep sessions ~10–20 minutes; 10–20 new words/day.  
3. Revisit in the evening for a short second session (better consolidation).

### 8.3 Quiz workflow (syn/ant MCQ)
1. Open **Quiz** tab.  
2. Choose **Synonym** or **Antonym**; set number of questions.  
3. Start → pick from 4 options (1 correct + 3 distractors from your dataset).  
4. Review score; repeat with new set.

### 8.4 Deployment workflow (Netlify)
**Drag‑and‑drop**: Save as `index.html` → Netlify **Deploys** → **Drag & drop** → done.  
**GitHub integration**: push to repo → Netlify “Import from Git” → (no build command, publish dir = root).  
**Custom domain** (optional) via Netlify Domain settings.

### 8.5 Optional Firebase sync workflow
1. Firebase project → enable **Auth (Anonymous)** & **Firestore**.  
2. Add Firebase SDK scripts to `index.html` and expose `window.__fb`.  
3. On init: sign in anonymously → try `cloudLoad()` → merge with local.  
4. On every `saveCards()`: debounce and `cloudSave()` to Firestore.  
5. Rules (minimal): users read/write only their own doc path `users/{uid}/decks/default`.

---

## 9) External services (client‑side)
- **dictionaryapi.dev** → definitions/examples (no key).  
- **Datamuse** → synonyms/antonyms (no key).  
- **SheetJS (xlsx)** → Excel import (CDN, optional).  
- **Tesseract.js** → OCR (CDN, optional).  
> All called from the browser; keep in mind network errors and CORS. Provide clear toasts and graceful fallbacks.

---

## 10) UX rules of thumb
- Keep the daily **new cards** small (10–20), allow unlimited reviews but prioritise due items.  
- Read the **word aloud** (TTS) to encode pronunciation.  
- Encourage learners to write **personal example sentences** (elaboration).  
- Mix topics and difficulties (interleaving).  
- Prefer multiple short sessions to one long session.

---

## 11) QA & testing checklist
- [ ] CSV import: trims/quotes, non‑ASCII characters, blank lines.  
- [ ] JSON import: array shape; unknown fields ignored.  
- [ ] Study loop: ratings update due dates as expected.  
- [ ] TTS: safe to call/cancel repeatedly.  
- [ ] LocalStorage: survives refresh; reset works.  
- [ ] Keyboard shortcuts: Space, 1–4, `?` help.  
- [ ] Optional libs load only when needed (Excel/OCR).  
- [ ] Offline: app loads and functions without network.  
- [ ] Mobile viewport: tap targets big enough.

---

## 12) Roadmap (next)
- ✅ Quiz tab (syn/ant MCQ).  
- ✅ Auto‑fill toggle for new words.  
- ✅ Excel/OCR import (on‑demand libs).  
- ⏩ Firebase sync with conflict‑safe merge (local wins or timestamp‑based).  
- ⏩ Progress export (CSV): history of ratings/dates.  
- ⏩ Typing test mode (type definition/synonym).  
- ⏩ Basic analytics: retention, time‑on‑task, streak trophies.

---

## 13) Security & privacy
- No accounts or tracking by default; data is local.  
- If enabling Firebase: use **Anonymous Auth**, restrict Firestore rules to the user’s UID, avoid storing personally identifiable information.  
- Show a short privacy note in Settings.

---

## 14) Success metrics (lightweight)
- Daily active learners (local streaks).  
- New cards added per week.  
- Review completion rate (due vs completed).  
- Quiz accuracy improvements over time.

---

## 15) Glossary
- **SM‑2**: Spaced repetition algorithm variant used by Anki/SRS systems.  
- **EF (Easiness Factor)**: multiplier that controls interval growth.  
- **Interleaving**: mixing topics to improve transfer.  
- **Dual coding**: mixing words and imagery to strengthen memory traces.

---

### Appendix A — Minimal CSV template
```
word,definition,example,morphology,synonyms,antonyms,pos
benevolent,kind and wanting to do good,The benevolent teacher helped everyone.,bene (good),kind,generous,adjective
reluctant,not wanting to do something,He was reluctant to try the spicy kimchi.,re- (back),unwilling,hesitant,adjective
```

### Appendix B — Netlify deploy quick steps
1. Save the canvas content as `index.html`.  
2. Netlify → Deploys → Drag & drop `index.html`.  
3. Share the URL; optional custom domain.

### Appendix C — Firestore rules (example)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/decks/{deckId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
