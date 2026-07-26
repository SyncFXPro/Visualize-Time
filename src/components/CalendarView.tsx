import type { CalendarRowItem, DayCellData } from '../types'
import { buildCalendarItems, getMonthLabelStarts } from '../lib/dates'
import { DayCell } from './DayCell'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

type CalendarViewProps = {
  cells: DayCellData[]
}

function chunkWeeks(items: CalendarRowItem[]): CalendarRowItem[][] {
  const weeks: CalendarRowItem[][] = []
  for (let i = 0; i < items.length; i += 7) {
    weeks.push(items.slice(i, i + 7))
  }
  return weeks
}

function weekMonthLabel(
  week: CalendarRowItem[],
  monthLabels: Map<string, string>,
): string | null {
  for (const item of week) {
    if (item.kind === 'day') {
      const label = monthLabels.get(item.cell.date)
      if (label) return label
    }
  }
  return null
}

export function CalendarView({ cells }: CalendarViewProps) {
  const items = buildCalendarItems(cells)
  const weeks = chunkWeeks(items)
  const monthLabels = getMonthLabelStarts(cells)

  return (
    <div className="w-full" role="grid" aria-label="Calendar visualization">
      <div
        className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs uppercase tracking-wide text-neutral-500"
        role="row"
      >
        {WEEKDAYS.map((day) => (
          <div key={day} role="columnheader">
            {day}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {weeks.map((week, weekIndex) => {
          const monthLabel = weekMonthLabel(week, monthLabels)

          return (
            <div key={`week-${weekIndex}`}>
              {monthLabel ? (
                <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-600">
                  {monthLabel}
                </div>
              ) : null}
              <div className="grid grid-cols-7 gap-1.5" role="row">
                {week.map((item) =>
                  item.kind === 'empty' ? (
                    <div key={item.key} role="presentation" />
                  ) : (
                    <DayCell key={item.key} cell={item.cell} />
                  ),
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
