import type { CellShape, DayCellData, TimeLens } from '../types'
import { getMonthName, parseISODate } from '../lib/dates'
import { DayCell } from './DayCell'
import { WeekAlignedGrid } from './WeekAlignedGrid'

type CompactViewProps = {
  cells: DayCellData[]
  shape: CellShape
  showMonths?: boolean
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

export function CompactView({
  cells,
  shape,
  showMonths = true,
  activeLens = null,
}: CompactViewProps) {
  if (!showMonths) {
    return (
      <div
        className="grid grid-cols-[repeat(auto-fill,minmax(1.75rem,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(2rem,1fr))]"
        role="grid"
        aria-label="Compact visualization"
      >
        {cells.map((cell) => (
          <DayCell
            key={cell.date}
            cell={cell}
            shape={shape}
            activeLens={activeLens}
            dimNonMatching
          />
        ))}
      </div>
    )
  }

  const sections = groupByMonth(cells)

  return (
    <div className="w-full space-y-6" aria-label="Compact visualization">
      {sections.map((section) => (
        <section key={section.key} aria-label={section.label}>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            {section.label}
          </div>
          <WeekAlignedGrid
            cells={section.cells}
            shape={shape}
            variant="compact"
            activeLens={activeLens}
            gapClassName="gap-x-2 gap-y-2.5"
          />
        </section>
      ))}
    </div>
  )
}
