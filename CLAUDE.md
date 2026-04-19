# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

A static **Games Hub** deployed to GitHub Pages at `https://locktix.github.io/games/`. There is **no build system, no bundler, no package manager, no tests** — every game is plain HTML/CSS/JS served as-is. Each game lives in its own top-level folder with the same triplet: `index.html` + `styles.css` + `script.js` (Shady uses `app.js`). The root [index.html](index.html) is the hub that links into each game folder.

## Running locally

Must be served over HTTP (not `file://`) because Firebase + ES module resolution need a real origin. Typical options:

- VS Code Live Server on the repo root
- `npx serve .` from the repo root

Open `http://localhost:<port>/` for the hub, or `http://localhost:<port>/<GameFolder>/` for a single game.

## Deployment

GitHub Pages serves the repo root on push to `main`. No CI, no build step — whatever is committed is what ships. `index.html` at the root and each `<Game>/index.html` are the public entry points.

## Shared Firebase layer

[firebase-shared.js](firebase-shared.js) is the single source of truth for Firestore access across all games **except Shady** (which initializes its own Firebase inside [Shady/app.js](Shady/app.js) for auth + realtime rooms). Games load the compat SDK from `gstatic.com` plus `../firebase-shared.js` via `<script>` tags in their `index.html`.

Key invariants when adding a new game or event:

- The Firebase config (apiKey, projectId `games-ba575`, etc.) lives inline in [firebase-shared.js](firebase-shared.js). It is a public web config — not a secret — but still the canonical copy; don't fork it per game.
- Supported game names are whitelisted in the `SUPPORTED_GAMES` array and in `normalizeGameName()` (handles casing + French accent variants like `actionvérité` → `ActionVerite`). **Adding a new game requires editing both.**
- Firestore layout is **per-game-rooted**: `{GameName}/meta` is the root doc, and subcollections live under it (e.g. `PianoTiles/meta/scores`, `<Game>/meta/gameEvents`). The legacy flat `gameEvents` collection exists and is migrated from — see [AdminStats/migrate-firestore.js](AdminStats/migrate-firestore.js). New writes should always go through `gameCollectionRef(game, name)` or `trackEvent()`, never the legacy paths.
- `trackEvent(game, eventType, payload)` sanitizes every payload field to a string/number/boolean and truncates strings to 180 chars. Don't bypass it.

## Game-specific notes

- **Shady** ([Shady/app.js](Shady/app.js)) is the odd one out: it uses Firebase **Auth + Firestore `onSnapshot`** for realtime multiplayer rooms (`rooms/{roomId}`, `.../players`, `.../game/state`). Its Firestore rules and schema are documented in [Shady/README.md](Shady/README.md). It does not route through `firebase-shared.js`.
- **RPG** ([RPG/index.html](RPG/index.html)) loads **Phaser 3.60** from a CDN and uses assets under [RPG/Assets/](RPG/Assets/). All other games are DOM-based, no canvas/engine.
- **AdminStats** ([AdminStats/](AdminStats/)) is an internal dashboard, not listed on the hub. It reads events from Firestore via `GamesFirebase.getDb()` and also contains the one-off legacy-data migration in `migrate-firestore.js`.
- **PianoTiles, ActionVerite, TestPurete, TuPrefere, WhoAmI, CheckListDeLaVie** are all single-player DOM games following the same pattern: load `../firebase-shared.js`, call `GamesFirebase.trackEvent(...)` for analytics, optionally read/write a small per-game Firestore subcollection (scores, stats).

## Adding a new game (the pattern)

1. Create `<NewGame>/index.html` + `styles.css` + `script.js`.
2. In `index.html`, load Firebase compat app + firestore scripts **and** `../firebase-shared.js` **before** `script.js`. Optionally include `../shared.css` for the common reset/helpers (see below).
3. Register the folder name in `SUPPORTED_GAMES` and `normalizeGameName()` in [firebase-shared.js](firebase-shared.js).
4. Add a JSON entry to [games.json](games.json) — the root hub renders its cards from this file, no HTML edit required.
5. Use `window.GamesFirebase.trackEvent("<NewGame>", "event_type", {...})` for analytics; use `GamesFirebase.getGameCollectionRef("<NewGame>", "scores")` for per-game data.

## Shared primitives

[shared.css](shared.css) exposes universally-safe rules: `*, html, body` reset, Inter font-family default, `.is-hidden` / `.visually-hidden` / `.safe-area` helpers, and a `prefers-reduced-motion` guard. It is included by the root [index.html](index.html) and is **opt-in for each game** — games can adopt it incrementally with `<link rel="stylesheet" href="../shared.css" />` before their own `styles.css`. It intentionally does **not** define colors or layout, so each game keeps its own palette.

## Language / UI convention

The hub and most games are in **French**. User-facing copy, labels, and new game descriptions should stay in French unless the game itself is already English (RPG).
