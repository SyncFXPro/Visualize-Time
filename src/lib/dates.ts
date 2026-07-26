import type { CalendarRowItem, DayCellData, DayStatus } from '../types'

export type CalendarParts = {
  year: number
  /** 1–12 */
  month: number
  /** 1–31 */
  day: number
}

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/** Parse a YYYY-MM-DD calendar date without UTC interpretation. */
export function parseISODate(iso: string): CalendarParts {
  const match = ISO_DATE_PATTERN.exec(iso)
  if (!match) {
    throw new Error(`Invalid ISO date: ${iso}`)
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (!isValidCalendarDate(year, month, day)) {
    throw new Error(`Invalid calendar date: ${iso}`)
  }

  return { year, month, day }
}

export function formatISODate(year: number, month: number, day: number): string {
  const y = String(year).padStart(4, '0')
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isValidCalendarDate(
  year: number,
  month: number,
  day: number,
): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false
  }

  const daysInMonth = getDaysInMonth(year, month)
  return day <= daysInMonth
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getDaysInMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30
  }
  return 31
}

/** Compare two YYYY-MM-DD dates. Returns negative, zero, or positive. */
export function compareISODates(a: string, b: string): number {
  if (a === b) return 0
  return a < b ? -1 : 1
}

/** Add (or subtract) whole calendar days from a YYYY-MM-DD date. */
export function addCalendarDays(iso: string, deltaDays: number): string {
  const parts = parseISODate(iso)
  let { year, month, day } = parts
  day += deltaDays

  while (day > getDaysInMonth(year, month)) {
    day -= getDaysInMonth(year, month)
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }

  while (day < 1) {
    month -= 1
    if (month < 1) {
      month = 12
      year -= 1
    }
    day += getDaysInMonth(year, month)
  }

  return formatISODate(year, month, day)
}

/**
 * Dated cells from the day after `startDate` through `targetDate` inclusive.
 * Example: start 2026-07-26, target 2026-09-01 → 2026-07-27 … 2026-09-01 (37 days).
 */
export function generateIntervalDates(
  startDate: string,
  targetDate: string,
): string[] {
  parseISODate(startDate)
  parseISODate(targetDate)

  if (compareISODates(targetDate, startDate) <= 0) {
    return []
  }

  const dates: string[] = []
  let cursor = addCalendarDays(startDate, 1)

  while (compareISODates(cursor, targetDate) <= 0) {
    dates.push(cursor)
    cursor = addCalendarDays(cursor, 1)
  }

  return dates
}

export function getLocalTodayISO(now: Date = new Date()): string {
  return formatISODate(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

export function getDayStatus(date: string, today: string): DayStatus {
  const cmp = compareISODates(date, today)
  if (cmp < 0) return 'passed'
  if (cmp === 0) return 'today'
  return 'remaining'
}

export function buildDayCells(
  startDate: string,
  targetDate: string,
  today: string = getLocalTodayISO(),
): DayCellData[] {
  return generateIntervalDates(startDate, targetDate).map((date) => ({
    date,
    status: getDayStatus(date, today),
    isTarget: date === targetDate,
  }))
}

/**
 * Weekday index with Sunday = 0 … Saturday = 6.
 * Uses Sakamoto's method so results are timezone-independent.
 */
export function getWeekdaySundayZero(iso: string): number {
  const { year, month, day } = parseISODate(iso)
  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
  const y = month < 3 ? year - 1 : year
  return (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + t[month - 1]! + day) % 7
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export function getMonthName(iso: string): string {
  const { month } = parseISODate(iso)
  return MONTH_NAMES[month - 1]!
}

export function formatDisplayDate(iso: string): string {
  const { year, month, day } = parseISODate(iso)
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`
}

export function statusLabel(status: DayStatus): string {
  switch (status) {
    case 'passed':
      return 'passed'
    case 'today':
      return 'today'
    case 'remaining':
      return 'remaining'
  }
}

/** Flat calendar items with leading empties for Sunday-start alignment. */
export function buildCalendarItems(cells: DayCellData[]): CalendarRowItem[] {
  if (cells.length === 0) return []

  const firstWeekday = getWeekdaySundayZero(cells[0]!.date)
  const items: CalendarRowItem[] = []

  for (let i = 0; i < firstWeekday; i += 1) {
    items.push({ kind: 'empty', key: `empty-${i}` })
  }

  for (const cell of cells) {
    items.push({ kind: 'day', key: cell.date, cell })
  }

  return items
}

/** Month label positions for the first day of each month in the interval. */
export function getMonthLabelStarts(cells: DayCellData[]): Map<string, string> {
  const labels = new Map<string, string>()
  let previousMonth: number | null = null

  for (const cell of cells) {
    const { month } = parseISODate(cell.date)
    if (month !== previousMonth) {
      labels.set(cell.date, getMonthName(cell.date))
      previousMonth = month
    }
  }

  return labels
}
