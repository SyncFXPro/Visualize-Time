import { useEffect, useId, useState } from 'react'
import type { CellShape, EventConfig, VisualizationMode } from '../types'
import { DatePicker } from './DatePicker'

const CONFIG_OPEN_KEY = 'visualize-time-config-open'

type ConfigPanelProps = {
  config: EventConfig
  onChange: (next: EventConfig) => void
}

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  const panelId = useId()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      setOpen(localStorage.getItem(CONFIG_OPEN_KEY) === '1')
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_OPEN_KEY, open ? '1' : '0')
    } catch {
      // ignore
    }
  }, [open])

  function update<K extends keyof EventConfig>(key: K, value: EventConfig[K]) {
    onChange({ ...config, [key]: value })
  }

  return (
    <div className="flex flex-col items-start">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-1.5 rounded border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)] transition-colors hover:border-[var(--muted)] hover:text-[var(--text)]"
      >
        <span aria-hidden="true" className="text-[var(--text-secondary)]">
          {open ? '▾' : '▸'}
        </span>
        Config
      </button>

      {open ? (
        <div
          id={panelId}
          aria-label="Event configuration"
          className="mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-visible rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg shadow-black/40"
        >
          <div className="flex flex-col gap-2.5">
            <label className="flex flex-col gap-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
              Title
              <input
                type="text"
                value={config.title}
                onChange={(event) => update('title', event.target.value)}
                className="field-input field-input-subtle"
              />
            </label>

            <DatePicker
              label="Start"
              value={config.startDate}
              onChange={(next) => update('startDate', next)}
            />

            <DatePicker
              label="Target"
              value={config.targetDate}
              onChange={(next) => update('targetDate', next)}
            />

            <SegmentedControl
              legend="Mode"
              value={config.mode}
              options={
                [
                  ['calendar', 'Calendar'],
                  ['compact', 'Compact'],
                ] as const satisfies ReadonlyArray<
                  readonly [VisualizationMode, string]
                >
              }
              onChange={(value) => update('mode', value)}
            />

            <SegmentedControl
              legend="Shape"
              value={config.shape}
              options={
                [
                  ['square', 'Square'],
                  ['rounded', 'Rounded'],
                  ['circle', 'Circle'],
                ] as const satisfies ReadonlyArray<readonly [CellShape, string]>
              }
              onChange={(value) => update('shape', value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SegmentedControl<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string
  value: T
  options: ReadonlyArray<readonly [T, string]>
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="flex flex-col gap-0.5">
      <legend className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
        {legend}
      </legend>
      <div className="flex h-[2.125rem] items-center gap-1 rounded-md border border-[var(--border)] bg-transparent px-1">
        {options.map(([optionValue, label]) => {
          const active = value === optionValue
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onChange(optionValue)}
              aria-pressed={active}
              className={`rounded px-2 py-1 text-xs transition-colors ${
                active
                  ? 'bg-[var(--text)] text-[var(--bg)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
