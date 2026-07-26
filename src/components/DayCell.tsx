import type { DayCellData } from '../types'
import { formatDisplayDate, statusLabel } from '../lib/dates'

type DayCellProps = {
  cell: DayCellData
}

export function DayCell({ cell }: DayCellProps) {
  const status = statusLabel(cell.status)
  const label = `${formatDisplayDate(cell.date)}, ${status}${cell.isTarget ? ', target date' : ''}`
  const tooltip = label

  const statusClasses =
    cell.status === 'passed'
      ? 'border-transparent bg-black'
      : cell.status === 'today'
        ? 'border-transparent bg-white outline outline-2 outline-offset-1 outline-black'
        : 'border-neutral-400 bg-white'

  return (
    <div
      role="gridcell"
      aria-label={label}
      title={tooltip}
      className={`relative aspect-square w-full min-w-0 rounded-sm border ${statusClasses}`}
      data-date={cell.date}
      data-status={cell.status}
    >
      {cell.isTarget ? (
        <span
          aria-hidden="true"
          className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
            cell.status === 'passed' ? 'bg-white' : 'bg-black'
          }`}
        />
      ) : null}
    </div>
  )
}
