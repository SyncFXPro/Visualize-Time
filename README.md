# Visualize Time

A local countdown visualizer that answers a simple question: **how much time do you still have — and in what shapes?**

Instead of only showing “76 days,” it breaks the interval into left / passed / total / % elapsed, and adds **time lenses** so you can count remaining opportunities like weekends, weekdays, Mondays, or gym days.

No backend, accounts, or calendar sync. Everything persists in `localStorage`.

## Features

- **Countdown grid** from the day after the start date through the target date (inclusive)
- **Summary line** — e.g. `37 days left · 39 passed · 76 total · 51% elapsed` plus a progress bar
- **Calendar** and **Compact** visualization modes
- **Cell shapes** — square, rounded, or circle
- **Show months** toggle in compact mode
- **Time lenses** — highlight matching days still ahead and count remaining opportunities  
  - Sat + Sun count as weekend *units* (2 days → 1 weekend)  
  - Other lenses count days 1:1
- **Custom lenses** — label, selected weekdays, date exclusions
- **Multiple saved countdowns**
- **Hidden config drawer** (top-left), live clock (top-right), fullscreen mode
- **Dark monochrome UI** with timezone-safe calendar-date math (no UTC shifting of `YYYY-MM-DD`)

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Vitest + Oxlint

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build    # typecheck + production build
npm run preview  # preview the production build
npm run test     # unit tests
npm run lint     # oxlint
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## How the interval works

Given:

- **Start** `2026-07-26`
- **Target** `2026-09-01`

The grid generates dated cells from **2026-07-27** through **2026-09-01** inclusive (37 days).

Status (local calendar date):

| Status    | Meaning                          | Appearance   |
|-----------|----------------------------------|--------------|
| Passed    | Before today                     | Grayed out   |
| Today     | Matches today’s local date       | Same as left |
| Remaining | After today                      | White        |

Date arithmetic never treats ISO date-only strings as UTC timestamps.

## Time lenses

A lens answers “how many of *these* do I have left?”

1. Pick weekdays (e.g. Sat + Sun, or Mon/Wed/Fri)
2. Optionally exclude specific dates
3. Give it a label

The chip shows remaining opportunities; selecting a lens dims days that are not still-available matches.

## Configuration

Open **Config** (top-left drawer) to edit:

- Countdown title, start, target
- Mode (calendar / compact) and shape
- Show months (compact only)
- Time lenses
- Multiple countdowns (create / switch / delete)

Settings are saved automatically in the browser.

## Project layout

```
src/
  App.tsx                 # App shell, fullscreen, persistence
  types.ts                # Shared TypeScript types
  components/
    CalendarView.tsx      # Calendar mode + month sections
    CompactView.tsx       # Compact grid (± month labels)
    DayCell.tsx           # Day cell rendering + hover details
    DatePicker.tsx        # Custom month/year date picker
    ConfigDrawer.tsx      # Settings drawer
    LensBar.tsx           # Active lens chips
    LensEditor.tsx        # Create / edit lenses
    EventHeader.tsx       # Title + stats summary
    LiveClock.tsx         # Real-time local clock
  lib/
    dates.ts              # Timezone-safe calendar math
    stats.ts              # Left / passed / total / % elapsed
    lenses.ts             # Lens matching + opportunity counts
    storage.ts            # localStorage load / save / migration
```

## Out of scope (for now)

- Recurring calendar events
- Accounts / auth
- External calendar sync
- Sharing / multiplayer
- Deployment pipeline

## License

Private project (`private: true` in `package.json`).
