import { useState } from 'react'
import type { TimeLens, Weekday } from '../types'
import { getLocalTodayISO } from '../lib/dates'
import { createLensId, WEEKDAY_OPTIONS } from '../lib/lenses'
import { DatePicker } from './DatePicker'

type LensEditorProps = {
  lenses: TimeLens[]
  onChange: (lenses: TimeLens[]) => void
}

export function LensEditor({ lenses, onChange }: LensEditorProps) {
  const [draftExclusion, setDraftExclusion] = useState(getLocalTodayISO())

  function updateLens(id: string, patch: Partial<TimeLens>) {
    onChange(
      lenses.map((lens) => (lens.id === id ? { ...lens, ...patch } : lens)),
    )
  }

  function removeLens(id: string) {
    onChange(lenses.filter((lens) => lens.id !== id))
  }

  function addLens() {
    onChange([
      ...lenses,
      {
        id: createLensId(),
        label: 'New lens',
        weekdays: [1],
        exclusions: [],
      },
    ])
  }

  function toggleWeekday(lens: TimeLens, day: Weekday) {
    const has = lens.weekdays.includes(day)
    const weekdays = has
      ? lens.weekdays.filter((value) => value !== day)
      : [...lens.weekdays, day].sort((a, b) => a - b)
    updateLens(lens.id, { weekdays })
  }

  function addExclusion(lens: TimeLens) {
    if (lens.exclusions.includes(draftExclusion)) return
    updateLens(lens.id, {
      exclusions: [...lens.exclusions, draftExclusion].sort(),
    })
  }

  function removeExclusion(lens: TimeLens, date: string) {
    updateLens(lens.id, {
      exclusions: lens.exclusions.filter((item) => item !== date),
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
          Time lenses
        </h3>
        <button
          type="button"
          onClick={addLens}
          className="text-[11px] text-[var(--muted)] hover:text-[var(--text)]"
        >
          + Add lens
        </button>
      </div>

      {lenses.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">
          No lenses yet. Add one to count weekends, gym days, Mondays, and more.
        </p>
      ) : null}

      {lenses.map((lens) => (
        <article
          key={lens.id}
          className="rounded-md border border-[var(--border)] p-2.5"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
              Label
              <input
                type="text"
                value={lens.label}
                onChange={(event) =>
                  updateLens(lens.id, { label: event.target.value })
                }
                className="field-input field-input-subtle"
                placeholder="e.g. gym sessions"
              />
            </label>
            <button
              type="button"
              onClick={() => removeLens(lens.id)}
              className="mt-4 text-[11px] text-[var(--muted)] hover:text-[var(--text)]"
              aria-label={`Remove ${lens.label || 'lens'}`}
            >
              Remove
            </button>
          </div>

          <fieldset>
            <legend className="mb-1 text-[10px] uppercase tracking-wide text-[var(--muted)]">
              Weekdays
            </legend>
            <div className="flex flex-wrap gap-1">
              {WEEKDAY_OPTIONS.map((option) => {
                const active = lens.weekdays.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleWeekday(lens, option.value)}
                    className={`rounded px-2 py-1 text-[11px] ${
                      active
                        ? 'bg-[var(--text)] text-[var(--bg)]'
                        : 'border border-[var(--border)] text-[var(--muted)]'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-2 space-y-1.5">
            <DatePicker
              label="Exclude date"
              value={draftExclusion}
              onChange={setDraftExclusion}
            />
            <button
              type="button"
              onClick={() => addExclusion(lens)}
              className="text-[11px] text-[var(--muted)] hover:text-[var(--text)]"
            >
              Add exclusion
            </button>
            {lens.exclusions.length > 0 ? (
              <ul className="flex flex-wrap gap-1">
                {lens.exclusions.map((date) => (
                  <li key={date}>
                    <button
                      type="button"
                      onClick={() => removeExclusion(lens, date)}
                      className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--muted)] hover:text-[var(--text)]"
                    >
                      {date} ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}
