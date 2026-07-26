import type { DayCellData, DayStatus, TimeLens, Weekday } from '../types'
import { getWeekdaySundayZero } from './dates'

export const WEEKDAY_OPTIONS: ReadonlyArray<{ value: Weekday; label: string }> =
  [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ]

export function createLensId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `lens-${crypto.randomUUID()}`
  }
  return `lens-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function createDefaultLenses(): TimeLens[] {
  return [
    {
      id: createLensId(),
      label: 'Weekends',
      weekdays: [0, 6],
      exclusions: [],
    },
    {
      id: createLensId(),
      label: 'Weekdays',
      weekdays: [1, 2, 3, 4, 5],
      exclusions: [],
    },
  ]
}

export function cellMatchesLens(date: string, lens: TimeLens): boolean {
  if (lens.weekdays.length === 0) return false
  if (lens.exclusions.includes(date)) return false
  const weekday = getWeekdaySundayZero(date) as Weekday
  return lens.weekdays.includes(weekday)
}

/** True when the day still counts as a remaining opportunity for the lens. */
export function isLensOpportunity(
  date: string,
  status: DayStatus,
  lens: TimeLens,
): boolean {
  return status !== 'passed' && cellMatchesLens(date, lens)
}

/**
 * Sat+Sun is one continuous weekend unit (2 matching days → 1 weekend).
 * Other lenses (weekdays, Mondays, gym days) count individual days 1:1.
 */
export function getLensUnitSize(lens: TimeLens): number {
  const unique = new Set(lens.weekdays)
  const isWeekendPair = unique.size === 2 && unique.has(0) && unique.has(6)
  return isWeekendPair ? 2 : 1
}

export function countLensLeft(cells: DayCellData[], lens: TimeLens): number {
  const matchingDays = cells.filter((cell) =>
    isLensOpportunity(cell.date, cell.status, lens),
  ).length
  return matchingDays / getLensUnitSize(lens)
}

export function formatLensCount(left: number): string {
  if (Number.isInteger(left)) return String(left)
  const rounded = Math.round(left * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

export function formatLensLeftLabel(lens: TimeLens, left: number): string {
  const name = lens.label.trim() || 'Untitled'
  const display = formatLensCount(left)
  if (display === '1') return `1 ${name} left`
  return `${display} ${name} left`
}
