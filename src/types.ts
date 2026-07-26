export type VisualizationMode = 'calendar' | 'compact'

export type CellShape = 'square' | 'rounded' | 'circle'

export type DayStatus = 'passed' | 'today' | 'remaining'

/** Sunday = 0 … Saturday = 6 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type TimeLens = {
  id: string
  label: string
  weekdays: Weekday[]
  /** ISO dates excluded from this lens. */
  exclusions: string[]
}

export type Countdown = {
  id: string
  title: string
  /** Inclusive calendar start bound; cells begin the day after this date. */
  startDate: string
  /** Inclusive calendar end bound (target date). */
  targetDate: string
  mode: VisualizationMode
  shape: CellShape
  /** When compact mode: show month labels / boundaries. */
  showMonths: boolean
  lenses: TimeLens[]
  activeLensId: string | null
}

/** @deprecated Prefer Countdown — kept for migration typing. */
export type EventConfig = Omit<Countdown, 'id' | 'lenses' | 'activeLensId'>

export type DayCellData = {
  date: string
  status: DayStatus
  isTarget: boolean
}

export type IntervalStats = {
  left: number
  passed: number
  total: number
  elapsedPercent: number
}

export type CalendarRowItem =
  | { kind: 'empty'; key: string }
  | { kind: 'day'; key: string; cell: DayCellData }
