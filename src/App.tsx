import { useEffect, useState } from 'react'
import { CalendarView } from './components/CalendarView'
import { CompactView } from './components/CompactView'
import { ConfigPanel } from './components/ConfigPanel'
import { EventHeader } from './components/EventHeader'
import { buildDayCells } from './lib/dates'
import { DEFAULT_CONFIG, loadConfig, saveConfig } from './lib/storage'
import type { EventConfig } from './types'

function App() {
  const [config, setConfig] = useState<EventConfig>(DEFAULT_CONFIG)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setConfig(loadConfig())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveConfig(config)
  }, [config, hydrated])

  const cells = buildDayCells(config.startDate, config.targetDate)

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-12">
      <EventHeader title={config.title} dayCount={cells.length} />

      <div className="mb-8">
        <ConfigPanel config={config} onChange={setConfig} />
      </div>

      <main className="flex-1">
        {cells.length === 0 ? (
          <p className="text-sm text-neutral-600">
            Choose a target date after the start date to generate the
            visualization.
          </p>
        ) : config.mode === 'calendar' ? (
          <CalendarView cells={cells} />
        ) : (
          <CompactView cells={cells} />
        )}
      </main>
    </div>
  )
}

export default App
