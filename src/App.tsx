import { useEffect, useState } from 'react'
import { CalendarView } from './components/CalendarView'
import { CompactView } from './components/CompactView'
import { ConfigPanel } from './components/ConfigPanel'
import { EventHeader } from './components/EventHeader'
import { LiveClock } from './components/LiveClock'
import {
  buildDayCells,
  formatDisplayDate,
  formatLocalTime,
  getLocalTodayISO,
} from './lib/dates'
import { DEFAULT_CONFIG, loadConfig, saveConfig } from './lib/storage'
import type { EventConfig } from './types'

function App() {
  const [config, setConfig] = useState<EventConfig>(DEFAULT_CONFIG)
  const [hydrated, setHydrated] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark'
    document.documentElement.style.colorScheme = 'dark'
    setConfig(loadConfig())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveConfig(config)
  }, [config, hydrated])

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const today = getLocalTodayISO(now)
  const cells = buildDayCells(config.startDate, config.targetDate, today)

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-auto absolute top-3 left-3 sm:top-4 sm:left-4">
          <ConfigPanel config={config} onChange={setConfig} />
        </div>
        <div className="pointer-events-auto absolute top-3 right-3 sm:top-4 sm:right-4">
          <LiveClock
            time={formatLocalTime(now)}
            dateLabel={formatDisplayDate(today)}
          />
        </div>
      </div>

      <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <EventHeader title={config.title} dayCount={cells.length} />

        <main className="flex-1 pb-4">
          {cells.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              Choose a target date after the start date to generate the
              visualization.
            </p>
          ) : config.mode === 'calendar' ? (
            <CalendarView cells={cells} shape={config.shape} />
          ) : (
            <CompactView cells={cells} shape={config.shape} />
          )}
        </main>
      </div>
    </>
  )
}

export default App
