import type { CellShape, DayCellData, TimeLens } from '../types'
import { getMonthName, parseISODate } from '../lib/dates'
import { DayCell } from './DayCell'

type CalendarViewProps = {
  cells: DayCellData[]
  shape: CellShape
  activeLens?: TimeLens | null
}

type MonthSection = {
  key: string
  label: string
  cells: DayCellData[]
}

function groupByMonth(cells: DayCellData[]): MonthSection[] {
  const sections: MonthSection[] = []

  for (const cell of cells) {
    const { year, month } = parseISODate(cell.date)
    const key = `${year}-${month}`
    const last = sections[sections.length - 1]
    if (!last || last.key !== key) {
      sections.push({
        key,
        label: `${getMonthName(cell.date)} ${year}`,
        cells: [cell],
      })
    } else {
      last.cells.push(cell)
    }
  }

  return sections
}

export function CalendarView({
  cells,
  shape,
  activeLens = null,
}: CalendarViewProps) {
  const sections = groupByMonth(cells)

  return (
    <div className="w-full space-y-8" aria-label="Calendar visualization">
      {sections.map((section) => (
        <section key={section.key} aria-label={section.label}>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              {section.label}
            </h2>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div
            className="grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-5 md:grid-cols-7"
            role="grid"
          >
            {section.cells.map((cell) => (
              <DayCell
                key={cell.date}
                cell={cell}
                shape={shape}
                variant="calendar"
                activeLens={activeLens}
                dimNonMatching
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
