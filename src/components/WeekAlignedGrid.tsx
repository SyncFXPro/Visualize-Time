import type { CellShape, DayCellData, TimeLens } from '../types'
import { getWeekdaySundayZero } from '../lib/dates'
import { DayCell } from './DayCell'
import { WeekdayHeader } from './WeekdayHeader'

type WeekAlignedGridProps = {
  cells: DayCellData[]
  shape: CellShape
  variant?: 'compact' | 'calendar'
  activeLens?: TimeLens | null
  /** Shared column gap so the S–S header tracks the dots at every width. */
  gapClassName?: string
}

/**
 * True 7-column Sunday-start grid. Leading empties keep each date under
 * the matching weekday letter; header and cells share one grid template.
 */
export function WeekAlignedGrid({
  cells,
  shape,
  variant = 'compact',
  activeLens = null,
  gapClassName = 'gap-x-2 gap-y-2.5',
}: WeekAlignedGridProps) {
  if (cells.length === 0) return null

  const leading = getWeekdaySundayZero(cells[0]!.date)
  const gridClass = `grid w-full grid-cols-7 ${gapClassName}`

  return (
    <div className="w-full" role="grid">
      <WeekdayHeader className={`mb-1.5 ${gridClass}`} />
      <div className={gridClass} role="rowgroup">
        {Array.from({ length: leading }, (_, index) => (
          <div key={`pad-${index}`} role="presentation" />
        ))}
        {cells.map((cell) => (
          <DayCell
            key={cell.date}
            cell={cell}
            shape={shape}
            variant={variant}
            activeLens={activeLens}
            dimNonMatching
          />
        ))}
      </div>
    </div>
  )
}
