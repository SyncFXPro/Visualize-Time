import type { CellShape, DayCellData, TimeLens } from '../types'
import { getMonthName, parseISODate } from '../lib/dates'
import { DayCell } from './DayCell'

type CompactViewProps = {
  cells: DayCellData[]
  shape: CellShape
  showMonths?: boolean
  activeLens?: TimeLens | null
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

  return (
    <div
      className="flex flex-wrap gap-2.5"
      role="grid"
      aria-label="Compact visualization"
    >
      {cells.map((cell, index) => {
        const prev = cells[index - 1]
        const showMonthBoundary =
          !prev ||
          parseISODate(prev.date).month !== parseISODate(cell.date).month ||
          parseISODate(prev.date).year !== parseISODate(cell.date).year

        return (
          <div key={cell.date} className="contents">
            {showMonthBoundary ? (
              <div
                className="basis-full border-t border-[var(--border)] pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)] first:border-t-0 first:pt-0"
                role="presentation"
              >
                {getMonthName(cell.date)} {parseISODate(cell.date).year}
              </div>
            ) : null}
            <div className="w-7 sm:w-8">
              <DayCell
                cell={cell}
                shape={shape}
                activeLens={activeLens}
                dimNonMatching
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
