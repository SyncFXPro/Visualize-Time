import type { CellShape, DayCellData } from '../types'
import { DayCell } from './DayCell'

type CalendarViewProps = {
  cells: DayCellData[]
  shape: CellShape
}

export function CalendarView({ cells, shape }: CalendarViewProps) {
  return (
    <div
      className="w-full"
      role="grid"
      aria-label="Calendar visualization"
    >
      <div className="grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-5 md:grid-cols-7">
        {cells.map((cell) => (
          <DayCell
            key={cell.date}
            cell={cell}
            shape={shape}
            variant="calendar"
          />
        ))}
      </div>
    </div>
  )
}
