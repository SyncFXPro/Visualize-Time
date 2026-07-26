import { useEffect, useId } from 'react'
import type { CellShape, Countdown, VisualizationMode } from '../types'
import { DatePicker } from './DatePicker'
import { LensEditor } from './LensEditor'

type ConfigDrawerProps = {
  open: boolean
  onClose: () => void
  countdown: Countdown
  countdowns: Countdown[]
  onChangeCountdown: (next: Countdown) => void
  onSelectCountdown: (id: string) => void
  onAddCountdown: () => void
  onDeleteCountdown: (id: string) => void
}

export function ConfigDrawer({
  open,
  onClose,
  countdown,
  countdowns,
  onChangeCountdown,
  onSelectCountdown,
  onAddCountdown,
  onDeleteCountdown,
}: ConfigDrawerProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  function update<K extends keyof Countdown>(key: K, value: Countdown[K]) {
    onChangeCountdown({ ...countdown, [key]: value })
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/55 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 z-[70] flex h-svh w-[min(22rem,100vw)] flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/50 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-labelledby={titleId}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h2
            id={titleId}
            className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]"
          >
            Configuration
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
                Countdowns
              </h3>
              <button
                type="button"
                onClick={onAddCountdown}
                className="text-[11px] text-[var(--muted)] hover:text-[var(--text)]"
              >
                + New
              </button>
            </div>
            <ul className="space-y-1">
              {countdowns.map((item) => {
                const active = item.id === countdown.id
                return (
                  <li key={item.id} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectCountdown(item.id)}
                      className={`min-w-0 flex-1 truncate rounded border px-2 py-1.5 text-left text-xs ${
                        active
                          ? 'border-[var(--text)] bg-[var(--text)] text-[var(--bg)]'
                          : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--muted)]'
                      }`}
                    >
                      {item.title.trim() || 'Untitled'}
                    </button>
                    {countdowns.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => onDeleteCountdown(item.id)}
                        className="px-1 text-[11px] text-[var(--muted)] hover:text-[var(--text)]"
                        aria-label={`Delete ${item.title || 'countdown'}`}
                      >
                        ×
                      </button>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </section>

          <label className="flex flex-col gap-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
            Title
            <input
              type="text"
              value={countdown.title}
              onChange={(event) => update('title', event.target.value)}
              className="field-input field-input-subtle"
            />
          </label>

          <DatePicker
            label="Start"
            value={countdown.startDate}
            onChange={(next) => update('startDate', next)}
          />

          <DatePicker
            label="Target"
            value={countdown.targetDate}
            onChange={(next) => update('targetDate', next)}
          />

          <SegmentedControl
            legend="Mode"
            value={countdown.mode}
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

          {countdown.mode === 'compact' ? (
            <label className="flex items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
              <span>Show months</span>
              <input
                type="checkbox"
                checked={countdown.showMonths}
                onChange={(event) => update('showMonths', event.target.checked)}
                className="h-4 w-4 accent-[var(--text)]"
              />
            </label>
          ) : null}

          <SegmentedControl
            legend="Shape"
            value={countdown.shape}
            options={
              [
                ['square', 'Square'],
                ['rounded', 'Rounded'],
                ['circle', 'Circle'],
              ] as const satisfies ReadonlyArray<readonly [CellShape, string]>
            }
            onChange={(value) => update('shape', value)}
          />

          <LensEditor
            lenses={countdown.lenses}
            onChange={(lenses) => {
              const activeStillExists = lenses.some(
                (lens) => lens.id === countdown.activeLensId,
              )
              onChangeCountdown({
                ...countdown,
                lenses,
                activeLensId: activeStillExists
                  ? countdown.activeLensId
                  : (lenses[0]?.id ?? null),
              })
            }}
          />
        </div>
      </aside>
    </>
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
