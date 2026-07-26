import type { CellShape, DayCellData } from '../types'
import {
  formatDisplayDate,
  getDayOfMonth,
  getMonthShort,
  getWeekdayShort,
  statusLabel,
} from '../lib/dates'

type DayCellProps = {
  cell: DayCellData
  shape?: CellShape
  /** Calendar mode shows weekday + date structure; compact is color-only. */
  variant?: 'compact' | 'calendar'
}

const SHAPE_CLASS: Record<CellShape, string> = {
  square: 'rounded-none',
  rounded: 'rounded-md',
  circle: 'rounded-full',
}

export function DayCell({
  cell,
  shape = 'square',
  variant = 'compact',
}: DayCellProps) {
  const status = statusLabel(cell.status)
  const label = `${formatDisplayDate(cell.date)}, ${status}${cell.isTarget ? ', target date' : ''}`

  if (variant === 'calendar') {
    return <CalendarDayCell cell={cell} label={label} shape={shape} />
  }

  return <CompactDayCell cell={cell} label={label} shape={shape} />
}

function CompactDayCell({
  cell,
  label,
  shape,
}: {
  cell: DayCellData
  label: string
  shape: CellShape
}) {
  const statusClasses =
    cell.status === 'passed'
      ? 'border-[var(--cell-passed-border)] bg-[var(--cell-passed)]'
      : cell.status === 'today'
        ? 'border-transparent bg-[var(--cell-today-bg)] shadow-[0_0_0_3px_var(--cell-today-ring)]'
        : 'border-transparent bg-[var(--cell-remaining-bg)]'

  const targetClasses = cell.isTarget
    ? 'shadow-[0_0_0_3px_var(--cell-target-ring)]'
    : ''

  const todayAndTarget =
    cell.status === 'today' && cell.isTarget
      ? 'shadow-[0_0_0_3px_var(--cell-today-ring),0_0_0_6px_var(--cell-target-ring)]'
      : ''

  return (
    <div
      role="gridcell"
      aria-label={label}
      title={label}
      className={`relative aspect-square w-full min-w-0 border ${SHAPE_CLASS[shape]} ${statusClasses} ${todayAndTarget || targetClasses}`}
      data-date={cell.date}
      data-status={cell.status}
    >
      {cell.isTarget ? (
        <span
          aria-hidden="true"
          className={`absolute inset-x-[20%] bottom-[18%] h-1 rounded-full ${
            cell.status === 'passed'
              ? 'bg-[var(--muted)]'
              : 'bg-[var(--cell-target-mark)]'
          }`}
        />
      ) : null}
      {cell.status === 'today' ? (
        <span
          aria-hidden="true"
          className={`absolute inset-[15%] border border-[var(--cell-today-inner)] ${SHAPE_CLASS[shape]}`}
        />
      ) : null}
    </div>
  )
}

function CalendarDayCell({
  cell,
  label,
  shape,
}: {
  cell: DayCellData
  label: string
  shape: CellShape
}) {
  const weekday = getWeekdayShort(cell.date)
  const day = getDayOfMonth(cell.date)
  const month = getMonthShort(cell.date)

  const statusClasses =
    cell.status === 'passed'
      ? 'border-[var(--cell-passed-border)] bg-[var(--cell-passed)] text-[var(--cell-passed-fg)]'
      : cell.status === 'today'
        ? 'border-[var(--cell-today-ring)] bg-[var(--cell-today-bg)] text-[var(--cell-today-fg)] shadow-[0_0_0_2px_var(--cell-today-ring)]'
        : 'border-transparent bg-[var(--cell-remaining-bg)] text-[var(--cell-remaining-fg)]'

  const targetClasses = cell.isTarget
    ? 'ring-2 ring-[var(--cell-target-ring)] ring-offset-2 ring-offset-[var(--bg)]'
    : ''

  return (
    <div
      role="gridcell"
      aria-label={label}
      title={label}
      className={`relative flex min-h-[4.5rem] w-full min-w-0 flex-col items-center justify-between border px-1.5 py-1.5 ${SHAPE_CLASS[shape]} ${statusClasses} ${targetClasses}`}
      data-date={cell.date}
      data-status={cell.status}
    >
      <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
        {weekday}
      </span>
      <span className="text-lg font-semibold leading-none tabular-nums">
        {day}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">
        {month}
      </span>

      {(cell.status === 'today' || cell.isTarget) && (
        <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-1">
          {cell.status === 'today' ? (
            <span className="rounded bg-[var(--cell-today-ring)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--cell-today-badge-fg)]">
              Today
            </span>
          ) : null}
          {cell.isTarget ? (
            <span className="rounded bg-[var(--cell-target-ring)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--cell-target-badge-fg)]">
              End
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}
