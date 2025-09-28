# Repository Guidelines

## Project Structure & Module Organization
Keep the single-page app inside `index.html`, grouping HTML, CSS, and JS beneath their section headers. Companion assets (`practice-arena.css`, `practice-arena.js`) sit beside the entry point and load directly, while manual fixtures (`browser_test.html`, `test_*.html`) and Node runners (`test_vocab_app.js`, `validate_functionality.js`, `final_test_validation.js`) remain in the repo root. Reuse provided datasets such as `sample_vocab_cards.xlsx` and `vocab_cards.json` for exercises.

## Build, Test, and Development Commands
Serve the app locally with `python -m http.server 8000` (browse `http://localhost:8000/index.html`) or fall back to `npx serve .`. Run `node test_vocab_app.js` and `node validate_functionality.js` to cover SM-2 scheduling, import/export, and persistence; execute `node final_test_validation.js` before release. Optional UI smoke lives in Playwright: `npx playwright test tests/smoke.spec.ts`.

## Coding Style & Naming Conventions
Use two-space indentation and keep lines near 100 characters. Stick to vanilla browser APIs and inline styles/scripts inside `index.html` unless mirroring the Practice Arena pattern. Name variables and functions in `camelCase`, constants in `UPPER_SNAKE_CASE`, and files in kebab-case.

## Testing Guidelines
Prioritise SM-2 spacing accuracy, quiz generation, and LocalStorage writes to `vocab_cards_v1`, `vocab_prefs_v1`, and `vocahelper:practice:*`. Verify imports with the sample CSV/XLSX fixtures. Keep browser fixtures named `test_<feature>.html` and Node scripts `test_<feature>.js` for consistency.

## Commit & Pull Request Guidelines
Follow Conventional Commits (e.g., `feat:`/`fix:`) with focused diffs. Pull requests should summarise the change, list commands run, link issues via `Closes #<id>`, and include screenshots for UI updates. Call out any fixtures or helpers you modify so others can retest quickly.

## Security & Configuration Tips
Treat the app as offline-first. Limit persistence to the approved LocalStorage namespaces and keep `netlify.toml` minimal so Netlify serves straight from the repository root.

## Agent-Specific Instructions
Favour surgical edits to `index.html`; document workflow changes in `readme.md` and avoid introducing new helper assets unless they match the Practice Arena approach. When adding guidance for future agents, update this file alongside any new tooling.
