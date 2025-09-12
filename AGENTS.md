# Repository Guidelines

## Project Structure & Module Organization
- Entry point: `index.html` (single-file app: HTML/CSS/JS together).
- Tests: manual pages `browser_test.html`, `test_*.html`; Node runners `test_vocab_app.js`, `validate_functionality.js`, `final_test_validation.js`.
- Data samples: `sample_*.csv`, `sample_vocab*.xlsx`, `vocab_cards.json`.
- Utilities for content prep: `fill_definitions_fast.py`, `fill_syn_ant.py`.
- Config: `netlify.toml` (no build; root publish).

## Build, Test, and Development Commands
- Serve locally: `python -m http.server 8000` → open `http://localhost:8000/`.
- Quick serve (optional): `npx serve .`.
- Automated tests: `node test_vocab_app.js` and `node validate_functionality.js`.
- Final validation: `node final_test_validation.js`.
- Manual checks: open `browser_test.html` or any `test_*.html` in a browser.

## Coding Style & Naming Conventions
- Keep all core logic in `index.html`; separate with clear section comments.
- Indentation 2 spaces; aim for ~100 char lines.
- JavaScript: `camelCase` for vars/functions; constants in `UPPER_SNAKE_CASE`.
- Filenames: kebab-case (e.g., `browser_test.html`, `netlify.toml`).
- Dependencies: prefer vanilla JS/browser APIs; use CDN-only deps if absolutely necessary.

## Testing Guidelines
- Scope: SM-2 study flow, import/export (CSV/JSON), quiz generation, and `localStorage` behavior.
- Naming: HTML tests `test_<feature>.html`; JS runners `test_<feature>.js`.
- How to run: start a local server, then open test pages or run Node scripts above. Keep core flows green before adding features.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (e.g., `feat: add quiz option shuffle`).
- PRs: include a short description, repro steps, and screenshots/gifs for UI changes. Link issues when applicable (e.g., `Closes #123`). Keep diffs focused; avoid unrelated formatting.

## Security & Configuration Tips
- Offline-first: data persists in `localStorage` keys `vocab_cards_v1` and `vocab_prefs_v1`.
- If adding cloud sync (e.g., Supabase), enable RLS and per-user access.
- Netlify: publish root; no build step required.

## Agent-Specific Instructions
- Do not introduce a build system unless requested.
- Keep `index.html` canonical; prefer minimal, surgical edits.
