import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  buildMonthPickerCells,
  formatDisplayDate,
  getLocalTodayISO,
  listPickerYears,
  MONTH_LABELS,
  parseISODate,
  shiftMonth,
  WEEKDAY_LABELS_SHORT,
} from '../lib/dates'

type DatePickerProps = {
  label: string
  value: string
  onChange: (next: string) => void
}

export function DatePicker({ label, value, onChange }: DatePickerProps) {
  const buttonId = useId()
  const popoverId = useId()
  const monthSelectId = useId()
  const yearSelectId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selected = parseISODate(value)
  const [viewYear, setViewYear] = useState(selected.year)
  const [viewMonth, setViewMonth] = useState(selected.month)

  useEffect(() => {
    if (!open) return
    const parts = parseISODate(value)
    setViewYear(parts.year)
    setViewMonth(parts.month)
  }, [open, value])

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const today = getLocalTodayISO()
  const todayYear = parseISODate(today).year
  const years = useMemo(
    () => listPickerYears(viewYear, todayYear),
    [viewYear, todayYear],
  )
  const cells = buildMonthPickerCells(viewYear, viewMonth)

  function goMonth(delta: number) {
    const next = shiftMonth(viewYear, viewMonth, delta)
    setViewYear(next.year)
    setViewMonth(next.month)
  }

  function selectDate(iso: string) {
    onChange(iso)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-[var(--muted)]">
        {label}
      </span>
      <button
        id={buttonId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((current) => !current)}
        className="date-picker-trigger field-input field-input-subtle flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="truncate text-[var(--text)]">
          {formatDisplayDate(value)}
        </span>
        <span aria-hidden="true" className="date-picker-icon">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect
              x="1.5"
              y="2.5"
              width="13"
              height="12"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M1.5 6h13M5 1v3M11 1v3"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          id={popoverId}
          role="dialog"
          aria-label={`Choose ${label.toLowerCase()} date`}
          className="date-picker-popover absolute left-0 top-[calc(100%+0.35rem)] z-30 w-[17.5rem] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl shadow-black/50"
        >
          <div className="mb-3 flex items-center gap-1.5">
            <button
              type="button"
              className="date-picker-nav shrink-0"
              aria-label="Previous month"
              onClick={() => goMonth(-1)}
            >
              ‹
            </button>

            <div className="flex min-w-0 flex-1 gap-1">
              <label className="sr-only" htmlFor={monthSelectId}>
                Month
              </label>
              <select
                id={monthSelectId}
                className="date-picker-select date-picker-select-month"
                value={viewMonth}
                onChange={(event) => setViewMonth(Number(event.target.value))}
              >
                {MONTH_LABELS.map((monthLabel, index) => (
                  <option key={monthLabel} value={index + 1}>
                    {monthLabel}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor={yearSelectId}>
                Year
              </label>
              <select
                id={yearSelectId}
                className="date-picker-select date-picker-select-year"
                value={viewYear}
                onChange={(event) => setViewYear(Number(event.target.value))}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="date-picker-nav shrink-0"
              aria-label="Next month"
              onClick={() => goMonth(1)}
            >
              ›
            </button>
          </div>

          <div className="mb-1.5 grid grid-cols-7 gap-0.5 text-center text-[10px] uppercase tracking-wide text-[var(--muted)]">
            {WEEKDAY_LABELS_SHORT.map((day) => (
              <div key={day} className="py-1">
                {day.slice(0, 2)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((iso, index) => {
              if (!iso) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const isSelected = iso === value
              const isToday = iso === today
              const dayNumber = parseISODate(iso).day

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => selectDate(iso)}
                  aria-label={formatDisplayDate(iso)}
                  aria-current={isToday ? 'date' : undefined}
                  aria-pressed={isSelected}
                  className={`date-picker-day ${
                    isSelected
                      ? 'date-picker-day-selected'
                      : isToday
                        ? 'date-picker-day-today'
                        : ''
                  }`}
                >
                  {dayNumber}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-2">
            <button
              type="button"
              className="text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              onClick={() => {
                const parts = parseISODate(today)
                setViewYear(parts.year)
                setViewMonth(parts.month)
                selectDate(today)
              }}
            >
              Today
            </button>
            <button
              type="button"
              className="text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
