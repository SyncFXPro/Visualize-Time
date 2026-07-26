import { useEffect, useRef, useState } from 'react'
import { CalendarView } from './components/CalendarView'
import { CompactView } from './components/CompactView'
import { ConfigDrawer } from './components/ConfigDrawer'
import { EventHeader } from './components/EventHeader'
import { LensBar } from './components/LensBar'
import { LiveClock } from './components/LiveClock'
import {
  addCalendarDays,
  buildDayCells,
  formatDisplayDate,
  formatLocalTime,
  getLocalTodayISO,
} from './lib/dates'
import {
  createCountdown,
  loadState,
  saveState,
  type AppState,
} from './lib/storage'
import { computeIntervalStats } from './lib/stats'
import type { Countdown } from './types'

function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [hydrated, setHydrated] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark'
    document.documentElement.style.colorScheme = 'dark'
    setState(loadState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveState(state)
  }, [state, hydrated])

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const countdown =
    state.countdowns.find((item) => item.id === state.activeCountdownId) ??
    state.countdowns[0]!

  const today = getLocalTodayISO(now)
  const cells = buildDayCells(
    countdown.startDate,
    countdown.targetDate,
    today,
  )
  const stats = computeIntervalStats(cells)
  const activeLens =
    countdown.lenses.find((lens) => lens.id === countdown.activeLensId) ??
    null

  function updateCountdown(next: Countdown) {
    setState((current) => ({
      ...current,
      countdowns: current.countdowns.map((item) =>
        item.id === next.id ? next : item,
      ),
    }))
  }

  function selectCountdown(id: string) {
    setState((current) => ({ ...current, activeCountdownId: id }))
  }

  function addCountdown() {
    const next = createCountdown({
      title: 'New countdown',
      startDate: today,
      targetDate: addCalendarDays(today, 30),
    })
    setState((current) => ({
      countdowns: [...current.countdowns, next],
      activeCountdownId: next.id,
    }))
  }

  function deleteCountdown(id: string) {
    setState((current) => {
      if (current.countdowns.length <= 1) return current
      const countdowns = current.countdowns.filter((item) => item.id !== id)
      const activeCountdownId =
        current.activeCountdownId === id
          ? countdowns[0]!.id
          : current.activeCountdownId
      return { countdowns, activeCountdownId }
    })
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }
      await stageRef.current?.requestFullscreen()
    } catch {
      // Fullscreen may be blocked by the browser.
    }
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-auto absolute top-3 left-3 sm:top-4 sm:left-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)] transition-colors hover:border-[var(--muted)] hover:text-[var(--text)]"
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
          >
            Config
          </button>
        </div>
        <div className="pointer-events-auto absolute top-3 right-3 flex items-start gap-2 sm:top-4 sm:right-4">
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="rounded border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)] transition-colors hover:border-[var(--muted)] hover:text-[var(--text)]"
            aria-pressed={isFullscreen}
          >
            {isFullscreen ? 'Exit' : 'Full'}
          </button>
          <LiveClock
            time={formatLocalTime(now)}
            dateLabel={formatDisplayDate(today)}
          />
        </div>
      </div>

      <ConfigDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        countdown={countdown}
        countdowns={state.countdowns}
        onChangeCountdown={updateCountdown}
        onSelectCountdown={selectCountdown}
        onAddCountdown={addCountdown}
        onDeleteCountdown={deleteCountdown}
      />

      <div
        ref={stageRef}
        className={`mx-auto flex min-h-svh w-full flex-col bg-[var(--bg)] px-4 py-6 sm:px-6 sm:py-10 ${
          isFullscreen
            ? 'h-svh max-w-none overflow-x-hidden overflow-y-auto'
            : 'max-w-3xl'
        }`}
      >
        <EventHeader title={countdown.title} stats={stats} />

        <LensBar
          lenses={countdown.lenses}
          activeLensId={countdown.activeLensId}
          cells={cells}
          onSelect={(lensId) =>
            updateCountdown({ ...countdown, activeLensId: lensId })
          }
        />

        <main className="flex-1 pb-4">
          {cells.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              Choose a target date after the start date to generate the
              visualization.
            </p>
          ) : countdown.mode === 'calendar' ? (
            <CalendarView
              cells={cells}
              shape={countdown.shape}
              activeLens={activeLens}
            />
          ) : (
            <CompactView
              cells={cells}
              shape={countdown.shape}
              showMonths={countdown.showMonths}
              activeLens={activeLens}
            />
          )}
        </main>
      </div>
    </>
  )
}

export default App
