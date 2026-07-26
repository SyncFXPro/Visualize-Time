import type { EventConfig, VisualizationMode } from '../types'

type ConfigPanelProps = {
  config: EventConfig
  onChange: (next: EventConfig) => void
}

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  function update<K extends keyof EventConfig>(key: K, value: EventConfig[K]) {
    onChange({ ...config, [key]: value })
  }

  return (
    <section
      aria-label="Event configuration"
      className="rounded border border-neutral-300 bg-white p-4 text-left"
    >
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
        Configuration
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-neutral-700 sm:col-span-2">
          Title
          <input
            type="text"
            value={config.title}
            onChange={(event) => update('title', event.target.value)}
            className="rounded border border-neutral-300 px-2 py-1.5 text-neutral-900 outline-none focus:border-black"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Start date
          <input
            type="date"
            value={config.startDate}
            onChange={(event) => update('startDate', event.target.value)}
            className="rounded border border-neutral-300 px-2 py-1.5 text-neutral-900 outline-none focus:border-black"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Target date
          <input
            type="date"
            value={config.targetDate}
            onChange={(event) => update('targetDate', event.target.value)}
            className="rounded border border-neutral-300 px-2 py-1.5 text-neutral-900 outline-none focus:border-black"
          />
        </label>

        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-sm text-neutral-700">
            Visualization mode
          </legend>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-900">
            {(
              [
                ['calendar', 'Calendar'],
                ['compact', 'Compact'],
              ] as const satisfies ReadonlyArray<readonly [VisualizationMode, string]>
            ).map(([value, label]) => (
              <label key={value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="visualization-mode"
                  value={value}
                  checked={config.mode === value}
                  onChange={() => update('mode', value)}
                  className="accent-black"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  )
}
