import type { CellShape, DayCellData } from '../types'
import { DayCell } from './DayCell'

type CompactViewProps = {
  cells: DayCellData[]
  shape: CellShape
}

export function CompactView({ cells, shape }: CompactViewProps) {
  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(1.75rem,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(2rem,1fr))]"
      role="grid"
      aria-label="Compact visualization"
    >
      {cells.map((cell) => (
        <DayCell key={cell.date} cell={cell} shape={shape} />
      ))}
    </div>
  )
}
