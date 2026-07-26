export type VisualizationMode = 'calendar' | 'compact'

export type CellShape = 'square' | 'rounded' | 'circle'

export type DayStatus = 'passed' | 'today' | 'remaining'

export type EventConfig = {
  title: string
  /** Inclusive calendar start bound; cells begin the day after this date. */
  startDate: string
  /** Inclusive calendar end bound (target date). */
  targetDate: string
  mode: VisualizationMode
  shape: CellShape
}

export type DayCellData = {
  date: string
  status: DayStatus
  isTarget: boolean
}

export type CalendarRowItem =
  | { kind: 'empty'; key: string }
  | { kind: 'day'; key: string; cell: DayCellData }
