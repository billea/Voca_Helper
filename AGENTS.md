# Repository Guidelines

## Project Structure & Module Organization
- Entry point: `index.html` (single-file app with HTML/CSS/JS).
- Test artifacts: `test_*.html`, `browser_test.html` for manual checks.
- Automation: `test_vocab_app.js`, `validate_functionality.js`, `final_test_validation.js`.
- Data samples: `sample_*.csv`, `sample_vocab*.xlsx`, `vocab_cards.json`.
- Utilities: `fill_definitions_fast.py`, `fill_syn_ant.py` for content prep.

## Build, Test, and Development Commands
- Run locally (no build): `python -m http.server 8000` → visit `http://localhost:8000/`.
- Node-based quick serve: `npx serve .` (optional).
- Automated tests: `node test_vocab_app.js` and `node validate_functionality.js`.
- Manual tests: open `browser_test.html` or `test_*.html` in a browser.

## Coding Style & Naming Conventions
- HTML/JS in a single file; keep modules logically grouped with clear section comments.
- Indentation: 2 spaces; line length ~100 chars.
- JavaScript: `camelCase` for variables/functions; `UPPER_SNAKE_CASE` for constants.
- File names: `kebab-case` (e.g., `netlify.toml`, `browser_test.html`).
- Prefer vanilla JS and browser APIs; use CDN-only deps if absolutely necessary.

## Testing Guidelines
- Scope: study flow (SM-2), import/export (CSV/JSON), quiz generation, localStorage.
- Conventions: name html tests as `test_<feature>.html`; JS runners as `test_<feature>.js`.
- How to run: start a local server, then open the test page or run Node scripts.
- Aim to keep core flows green before adding features.

## Commit & Pull Request Guidelines
- Messages: Conventional Commit style (e.g., `feat: add quiz option shuffle`).
- PRs: include a short description, repro steps, and screenshots/gifs when UI changes.
- Link issues with `Closes #123` when applicable.
- Keep diffs focused; avoid unrelated formatting.

## Security & Configuration Tips
- Offline-first: data persists in `localStorage` (`vocab_cards_v1`, `vocab_prefs_v1`).
- If enabling cloud sync (e.g., Supabase), use RLS and per-user access.
- For Netlify: root publish, no build; `netlify.toml` provided.

## Agent-Specific Instructions
- Do not introduce a build system unless requested.
- Keep `index.html` as the canonical entry; prefer minimal, surgical edits.
