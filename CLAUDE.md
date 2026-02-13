# Shortcut Pro Project

Keyboard shortcut learning system with YAML-based data management, React web app, CLI tools, and printable cheat sheets.

## Project Structure

```
shortcuts/                  YAML data files (Single Source of Truth)
  ├── macos.yaml           macOS system shortcuts
  ├── chrome.yaml          Chrome browser shortcuts
  ├── vscode.yaml          VS Code editor shortcuts
  ├── notion.yaml          Notion workspace shortcuts
  └── [14 apps total]      128 shortcuts total

app/                        React + Vite web app (Shortcut Pro)
  ├── plugins/             Vite plugins
  │   └── yaml-shortcuts-plugin.js  YAML → virtual module converter
  ├── src/
  │   ├── components/      12 React components (Header, Footer, ModeSelector, etc.)
  │   ├── hooks/           React hooks + pure logic
  │   │   ├── useUserData.js        LocalStorage + Leitner progress
  │   │   ├── useGameState.js       Quiz session state
  │   │   ├── useKeyboard.js        Keyboard event handler
  │   │   └── leitner.js            Pure Leitner box logic (testable)
  │   ├── utils/           Utility functions
  │   │   └── keyNormalization.js   Key name normalization
  │   └── App.jsx          Main app component
  └── vite.config.js       Vite + vitest configuration

progress.json               Leitner box progress data (.gitignore'd)
cheatsheet.html             A4 printable cheat sheet
cheatsheet-checklist.html   Interactive checklist (standalone localStorage)
```

## Architecture

### Data Flow

**Single Source of Truth**: `shortcuts/*.yaml`

**Virtual Module Pipeline**: YAML files → Vite plugin → `virtual:shortcuts` → React components

**Progress Sync**: `progress.json` ↔ localStorage ↔ Web App ↔ CLI tools

### YAML Schema

```yaml
app: "Application Name"
shortcuts:
  - section: "Section Name"
    items:
      - shortcut: "Cmd+K"
        description: "Action description"
```

### Vite Virtual Module

`yaml-shortcuts-plugin.js` exposes three exports:
- `SHORTCUT_DATA`: Object mapping category IDs to shortcut arrays
- `CATEGORIES`: Array of category metadata (icon, color, description)
- `INITIAL_PROGRESS`: Progress data from `progress.json` (null if missing)

The plugin watches both `shortcuts/*.yaml` and `progress.json` for changes and triggers full reload.

## Dependencies

### Production
- `react` 19.2.0 - UI framework
- `react-dom` 19.2.0 - React renderer
- `lucide-react` 0.563.0 - Icon library

### Development
- `vite` 7.2.4 - Build tool and dev server
- `@vitejs/plugin-react` 5.1.1 - React support for Vite
- `vitest` 4.0.18 - Unit testing framework
- `@testing-library/react` 16.3.2 - React component testing
- `@testing-library/jest-dom` 6.9.1 - DOM matchers
- `jsdom` 27.0.1 - DOM environment for tests
- `js-yaml` 4.1.1 - YAML parser (used in Vite plugin)
- `tailwindcss` 3.4.19 - Utility-first CSS framework
- `eslint` 9.39.1 - Linting

## Code Conventions

### Pure Logic Extraction

Pure functions are extracted to separate files for testability:
- `app/src/hooks/leitner.js` - All Leitner box logic (no React, no side effects)
- React hooks import and use these pure functions

### Date Format

ISO 8601 date strings: `YYYY-MM-DD` for dates, full ISO string for timestamps

### Leitner Box System

5-level spaced repetition:
- Box 1: immediate (0 days)
- Box 2: 1 day
- Box 3: 3 days
- Box 4: 7 days
- Box 5: 14 days

Correct answer: box + 1 (max 5)
Wrong answer: reset to box 1

Mastery threshold: box >= 4

### Progress Data Structure

```javascript
{
  version: "1.0.0",
  lastUpdated: "2026-02-13T...",
  stats: {
    totalReviews: 42,
    streak: 3,
    lastDate: "2026-02-13"
  },
  shortcuts: {
    "chrome-0": {
      box: 2,
      correct: 5,
      attempts: 7,
      lastReview: "2026-02-13T...",
      nextReview: "2026-02-14T...",
      history: [
        { ts: "...", correct: true, prevBox: 1, newBox: 2 }
      ]
    }
  }
}
```

### Streak Logic

Unified streak tracking in `progress.stats.streak` only (removed from `userData`):
- Same day: keep current streak
- Yesterday: increment streak
- Older: reset to 1

### History Tracking

Each shortcut keeps last 10 attempts in `history[]` array with timestamp, result, and box transitions.

### Retry Count Display

ResultScreen shows retry counts: O (first try), R (retry), X (multiple retries)

### Session Results

Session results persist retry counts to show performance detail per shortcut.

### YAML Validation

`yaml-shortcuts-plugin.js` validates:
- Per-file: `app` and `shortcuts` array must exist
- Per-item: `description` and `shortcut` must exist
- Warnings logged to console, invalid items skipped

### Key Formatting

Vite plugin formats shortcuts: `Cmd+Shift+P` → `Cmd + Shift + P` (spaces around +)

Handles special cases:
- Last + is the key itself: `Cmd++` → `Cmd + +`
- Parentheses stripped: `Delete (⌫)` → `Delete`

### Typeable Detection

Plugin marks shortcuts as typeable/non-typeable:
- Non-typeable: ranges (`~`), alternatives (`/`), mouse actions, Fn keys, OS-level shortcuts
- Used to determine if "Real Key" mode is available

## Development

### Commands

```bash
cd app
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
```

### Testing

Tests located in `app/src/hooks/__tests__/leitner.test.js` (27 tests covering all pure Leitner functions)

Run with vitest using jsdom environment.

### Hot Reload

Dev server watches:
- `shortcuts/*.yaml` - Auto-reload on changes
- `progress.json` - Auto-reload on changes
- React components - Fast Refresh

### Learning Modes

1. **Choice Mode** - 4-choice quiz for quick judgment practice
2. **Typing Mode** - Real keyboard input for muscle memory (typeable shortcuts only)
3. **Flashcard Mode** - Self-directed repetition practice

### Keyboard Shortcuts

`?` key toggles keyboard help overlay (`KeyboardHelp.jsx`)

Footer shows "? Shortcuts" link

### Progress Sync

Web App → File: "Export Progress" button downloads `progress.json`

File → Web App: Dev server auto-reloads when `progress.json` changes

Merge strategy: Higher `attempts` wins per shortcut

### Sync Toast

Toast notification shows sync info on merge (e.g., "Synced 5 shortcuts from file")

## Important Rules

- Never commit `progress.json` (in .gitignore)
- YAML files are the single source of truth for shortcuts
- All Leitner logic must remain pure and testable
- Date strings must use ISO 8601 format
- Streak tracking only in `progress.stats.streak` (not in `userData`)
- History array max length: 10 items
- Test coverage required for pure logic functions

## CLI Integration

Claude Code plugin provides:
- `/shortcut:shortcut-learn [category] [--all]` - Practice due shortcuts
- `/shortcut:shortcut-stats` - View learning statistics
- `/shortcut:shortcut-cheatsheet [--mode progress]` - Generate cheat sheet

CLI updates `progress.json`, which syncs to web app on file change.

## Standalone Tools

### Cheat Sheet (cheatsheet.html)

A4 printable reference. Generated via CLI or standalone HTML.

### Interactive Checklist (cheatsheet-checklist.html)

Standalone web page with:
- Check/uncheck shortcuts
- Memory tips
- Pattern analysis
- Independent localStorage (not part of Learning Loop sync)

<!-- SNAPKIN:SESSION_CONTEXT_START -->
## Session Context

> Current state snapshot. Fully rewritten each session sync by the auditor agent.

### Last Sync

- **Date**: 2026-02-13
- **Session**: Hardened Learning Loop system - unified streak tracking, session history persistence, retry count tracking, YAML validation, keyboard help overlay, sync toast, and 27 unit tests

### Active Work

The Learning Loop system is complete and production-ready:
- Leitner box logic extracted to pure functions (`leitner.js`)
- 27 unit tests covering all core logic (computeAttempt, computeStreak, mergeProgress, etc.)
- YAML validation with warnings for invalid files/items
- Keyboard help overlay (`KeyboardHelp.jsx`) triggered by `?` key
- Sync toast notifications on progress merge
- Retry count indicators in ResultScreen (O/R/X)
- Session history tracking (last 10 attempts per shortcut)
- Unified streak tracking in `progress.stats` only

### Blockers

No blockers.

### Next Entry Point

- **[P2]** Add component tests for UI interactions - `app/src/components/__tests__/` (test ChoiceMode, TypingMode, ResultScreen with @testing-library/react)
- **[P2]** Add integration test for progress sync flow - verify localStorage ↔ progress.json merge logic
- **[P3]** Improve accessibility - add ARIA labels to quiz buttons, keyboard navigation hints
- **[P3]** Add box distribution chart to ProfileBanner - visualize how many shortcuts are in each box level

### Recent Changes

- `app/src/hooks/leitner.js` - NEW: Extracted pure Leitner functions (computeAttempt, computeStreak, mergeProgress, getMasteryStats, etc.)
- `app/src/hooks/__tests__/leitner.test.js` - NEW: 27 vitest unit tests for Leitner logic
- `app/src/hooks/useUserData.js` - Refactored to use leitner.js functions, removed streak from userData, unified to progress.stats
- `app/src/components/KeyboardHelp.jsx` - NEW: Keyboard shortcuts help overlay
- `app/src/components/ResultScreen.jsx` - Added O/R/X retry indicators, summary counts
- `app/src/components/Footer.jsx` - Added "? Shortcuts" link
- `app/src/App.jsx` - Added syncInfo/toast/showHelp state, ? key handler, sync toast, retry counts in sessionResults
- `app/plugins/yaml-shortcuts-plugin.js` - Added per-file and per-item YAML validation with console warnings
- `app/package.json` - Added vitest, @testing-library/react, @testing-library/jest-dom, jsdom
- `app/vite.config.js` - Added vitest config (environment: jsdom, globals: true)
- `README.md` - Added Learning Loop documentation (Leitner system, CLI commands, sync workflow, keyboard shortcuts)

### Key Files

```
app/src/hooks/leitner.js                    Pure Leitner box logic (testable)
app/src/hooks/__tests__/leitner.test.js     27 unit tests
app/src/hooks/useUserData.js                Progress state management
app/src/components/KeyboardHelp.jsx         Help overlay
app/src/components/ResultScreen.jsx         Session results display
app/plugins/yaml-shortcuts-plugin.js        YAML → virtual module with validation
app/vite.config.js                          Vite + vitest config
progress.json                               Learning progress data
```
<!-- SNAPKIN:SESSION_CONTEXT_END -->
