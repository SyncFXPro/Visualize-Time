import type { DayCellData } from '../types'
import { DayCell } from './DayCell'

type CompactViewProps = {
  cells: DayCellData[]
}

export function CompactView({ cells }: CompactViewProps) {
  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(1.75rem,1fr))] gap-1.5 sm:grid-cols-[repeat(auto-fill,minmax(2rem,1fr))]"
      role="grid"
      aria-label="Compact visualization"
    >
      {cells.map((cell) => (
        <DayCell key={cell.date} cell={cell} />
      ))}
    </div>
  )
}
