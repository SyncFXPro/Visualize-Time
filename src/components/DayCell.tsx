import type { CellShape, DayCellData, TimeLens } from '../types'
import {
  formatDisplayDate,
  getDayOfMonth,
  getMonthShort,
  getWeekdayShort,
  statusLabel,
} from '../lib/dates'
import { isLensOpportunity } from '../lib/lenses'

type DayCellProps = {
  cell: DayCellData
  shape?: CellShape
  variant?: 'compact' | 'calendar'
  activeLens?: TimeLens | null
  dimNonMatching?: boolean
}

const SHAPE_CLASS: Record<CellShape, string> = {
  square: 'rounded-none',
  rounded: 'rounded-md',
  circle: 'rounded-full',
}

function buildHoverDetails(
  cell: DayCellData,
  activeLens?: TimeLens | null,
): string {
  const parts = [
    formatDisplayDate(cell.date),
    getWeekdayShort(cell.date),
    statusLabel(cell.status),
  ]
  if (cell.isTarget) parts.push('target date')
  if (
    activeLens &&
    isLensOpportunity(cell.date, cell.status, activeLens)
  ) {
    parts.push(`matches “${activeLens.label.trim() || 'lens'}”`)
  } else if (activeLens) {
    parts.push('outside active lens')
  }
  return parts.join(' · ')
}

/** Today counts as remaining visually; only passed is grayed out. */
function fillClasses(status: DayCellData['status'], variant: 'compact' | 'calendar') {
  if (status === 'passed') {
    return variant === 'calendar'
      ? 'border-transparent bg-[var(--cell-passed)] text-[var(--cell-passed-fg)]'
      : 'border-transparent bg-[var(--cell-passed)]'
  }

  return variant === 'calendar'
    ? 'border-transparent bg-[var(--cell-remaining-bg)] text-[var(--cell-remaining-fg)]'
    : 'border-transparent bg-[var(--cell-remaining-bg)]'
}

export function DayCell({
  cell,
  shape = 'square',
  variant = 'compact',
  activeLens = null,
  dimNonMatching = false,
}: DayCellProps) {
  const isOpportunity = Boolean(
    activeLens && isLensOpportunity(cell.date, cell.status, activeLens),
  )
  const dimmed = Boolean(activeLens && dimNonMatching && !isOpportunity)
  const details = buildHoverDetails(cell, activeLens)

  if (variant === 'calendar') {
    return (
      <CalendarDayCell
        cell={cell}
        label={details}
        shape={shape}
        dimmed={dimmed}
      />
    )
  }

  return (
    <CompactDayCell
      cell={cell}
      label={details}
      shape={shape}
      dimmed={dimmed}
    />
  )
}

function CompactDayCell({
  cell,
  label,
  shape,
  dimmed,
}: {
  cell: DayCellData
  label: string
  shape: CellShape
  dimmed: boolean
}) {
  return (
    <div
      role="gridcell"
      aria-label={label}
      title={label}
      className={`group relative aspect-square w-full min-w-0 border ${SHAPE_CLASS[shape]} ${fillClasses(cell.status, 'compact')} ${
        dimmed ? 'opacity-20' : ''
      }`}
      data-date={cell.date}
      data-status={cell.status}
    >
      <HoverTip text={label} />
    </div>
  )
}

function CalendarDayCell({
  cell,
  label,
  shape,
  dimmed,
}: {
  cell: DayCellData
  label: string
  shape: CellShape
  dimmed: boolean
}) {
  const weekday = getWeekdayShort(cell.date)
  const day = getDayOfMonth(cell.date)
  const month = getMonthShort(cell.date)

  return (
    <div
      role="gridcell"
      aria-label={label}
      title={label}
      className={`group relative flex min-h-[4.5rem] w-full min-w-0 flex-col items-center justify-between border px-1.5 py-1.5 ${SHAPE_CLASS[shape]} ${fillClasses(cell.status, 'calendar')} ${
        dimmed ? 'opacity-20' : ''
      }`}
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

      <HoverTip text={label} />
    </div>
  )
}

function HoverTip({ text }: { text: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-[calc(100%+0.4rem)] left-1/2 z-40 hidden w-max max-w-[12rem] -translate-x-1/2 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-left text-[10px] leading-snug text-[var(--text-secondary)] opacity-0 shadow-lg shadow-black/40 group-hover:block group-hover:opacity-100 group-focus-within:block group-focus-within:opacity-100"
    >
      {text}
    </span>
  )
}
