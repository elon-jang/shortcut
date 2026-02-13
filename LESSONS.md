# Lessons Learned

Project knowledge accumulated across sessions. Each entry is tagged by category and dated.

## Categories

| Tag | Purpose |
|-----|---------|
| `[Error-Fix]` | Bugs encountered and resolved |
| `[Decision]` | Conscious architectural or design choices |
| `[Insight]` | Non-obvious discoveries about tools, libraries, or workflows |
| `[Domain]` | Business logic, domain rules, or learning system knowledge |
| `[Prompt]` | AI interaction patterns that worked well |
| `[Future]` | Ideas for future work or technical debt |

---

## 2026-02-13

- **[Decision]** Unified streak storage to `progress.stats.currentStreak` only — removed redundant `userData.streak`. Single source of truth prevents desync between localStorage keys and simplifies merge logic in `useUserData.js`.

- **[Decision]** Extracted pure Leitner logic to `app/src/hooks/leitner.js` — all date math, box intervals, streak computation, mastery stats are now side-effect-free functions. Enables comprehensive unit testing (27 tests added) and isolates business logic from React state management.

- **[Decision]** Standardized all date handling to ISO YYYY-MM-DD format (`getToday()`, `getYesterday()`) — replaced fragmented Date.now() timestamps. Makes date comparisons reliable across time zones and debugging easier. Applied in `lastAttempt`, `lastReviewDate`, and `nextReviewDate` fields.

- **[Decision]** Merge conflict resolution strategy: higher `attempts` count wins — assumes the device with more practice has fresher data. Implemented in `useUserData.js` `syncInfo` detection. Simple heuristic for cross-device sync without server.

- **[Error-Fix]** YAML plugin crashed on malformed shortcut files — added validation in `app/plugins/yaml-shortcuts-plugin.js` to check for required fields (category, items, name, shortcut). Now logs warnings and skips invalid entries instead of breaking the entire app load.

- **[Insight]** Vitest with `@testing-library/react` requires explicit `jsdom` environment in `vite.config.js` — default is node environment which lacks DOM APIs. Config must include `test: { environment: 'jsdom', globals: true }` for React component testing to work.

- **[Insight]** Testing pure functions (date logic, streak calculation) catches edge cases faster than UI testing — e.g., streak break detection, box interval boundaries, merge logic. Extracting `leitner.js` made these testable without mocking localStorage or React hooks.

- **[Domain]** Leitner Box intervals for Shortcut Pro: Box 1=1 day, Box 2=3 days, Box 3=7 days, Box 4=14 days, Box 5=30 days. Correct answer promotes to next box; wrong answer resets to Box 1. Defined in `BOX_INTERVALS` constant in `leitner.js`.

- **[Domain]** Streak computation: breaks if `lastAttempt` date is before yesterday, otherwise increments. "Perfect day" (all attempts correct) increments `longestStreak`. Logic in `computeStreak()` function.

- **[Domain]** Session retry tracking: each answer records `retries` count (0=first-try correct). Result screen now shows O (perfect), R (retried correct), X (wrong) with summary counts. Helps identify shortcuts that need more practice.

- **[Decision]** Keyboard help overlay (`KeyboardHelp.jsx`) triggered by `?` key — shows context-aware shortcuts for current screen (menu, mode select, playing, results). Dismissed with Esc. Follows progressive disclosure pattern (help available but not intrusive).

- **[Decision]** Sync toast notification shows merge info — "Synced progress (X shortcuts updated, Y new)" when cross-device merge detected on mount. Non-blocking UI feedback for transparent sync. State managed in `App.jsx` `syncInfo`.

- **[Future]** Consider spaced repetition scheduling in background — current system only shows "due today" shortcuts on app load. Could add daily notification or badge count for due reviews to improve retention.

- **[Future]** Retry tracking could feed into adaptive difficulty — shortcuts with high retry counts could appear more frequently or trigger hints. Currently only display feature, no feedback loop to learning algorithm.

- **[Future]** Unit test coverage added for `leitner.js` (27 tests) but no integration tests for React components yet — consider adding tests for `useUserData` hook, game state flows, and localStorage persistence edge cases.

- **[Future]** YAML validation logs warnings to console — could collect these and show a "Data Issues" panel in settings for non-technical users to report malformed shortcut files.
