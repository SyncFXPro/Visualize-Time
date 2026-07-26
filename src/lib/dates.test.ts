import { describe, expect, it } from 'vitest'
import {
  addCalendarDays,
  buildDayCells,
  compareISODates,
  generateIntervalDates,
  getDayStatus,
  getDaysInMonth,
  getLocalTodayISO,
  getWeekdaySundayZero,
  isLeapYear,
  parseISODate,
} from './dates'

describe('parseISODate', () => {
  it('parses calendar parts without timezone conversion', () => {
    expect(parseISODate('2026-07-26')).toEqual({
      year: 2026,
      month: 7,
      day: 26,
    })
  })

  it('rejects impossible calendar dates', () => {
    expect(() => parseISODate('2026-02-30')).toThrow()
    expect(() => parseISODate('2025-02-29')).toThrow()
  })
})

describe('generateIntervalDates', () => {
  it('generates July 27 through September 1 inclusive (37 days)', () => {
    const dates = generateIntervalDates('2026-07-26', '2026-09-01')

    expect(dates).toHaveLength(37)
    expect(dates[0]).toBe('2026-07-27')
    expect(dates[dates.length - 1]).toBe('2026-09-01')
    expect(dates).not.toContain('2026-07-26')
  })

  it('includes the target date and excludes the start date', () => {
    const dates = generateIntervalDates('2026-01-01', '2026-01-03')
    expect(dates).toEqual(['2026-01-02', '2026-01-03'])
  })

  it('returns an empty list when target is not after start', () => {
    expect(generateIntervalDates('2026-09-01', '2026-09-01')).toEqual([])
    expect(generateIntervalDates('2026-09-02', '2026-09-01')).toEqual([])
  })

  it('crosses month boundaries safely', () => {
    const dates = generateIntervalDates('2026-01-30', '2026-02-02')
    expect(dates).toEqual(['2026-01-31', '2026-02-01', '2026-02-02'])
  })

  it('handles leap-day intervals', () => {
    expect(isLeapYear(2024)).toBe(true)
    expect(getDaysInMonth(2024, 2)).toBe(29)

    const dates = generateIntervalDates('2024-02-27', '2024-03-01')
    expect(dates).toEqual([
      '2024-02-28',
      '2024-02-29',
      '2024-03-01',
    ])
  })

  it('skips Feb 29 in non-leap years via addCalendarDays', () => {
    expect(isLeapYear(2025)).toBe(false)
    expect(addCalendarDays('2025-02-28', 1)).toBe('2025-03-01')
  })
})

describe('getDayStatus', () => {
  it('marks dates before today as passed', () => {
    expect(getDayStatus('2026-07-25', '2026-07-26')).toBe('passed')
  })

  it('marks the current local calendar date as today', () => {
    expect(getDayStatus('2026-07-26', '2026-07-26')).toBe('today')
  })

  it('marks dates after today as remaining', () => {
    expect(getDayStatus('2026-07-27', '2026-07-26')).toBe('remaining')
  })
})

describe('buildDayCells', () => {
  it('attaches status and target marker', () => {
    const cells = buildDayCells('2026-07-26', '2026-09-01', '2026-07-26')

    expect(cells).toHaveLength(37)
    expect(cells[0]).toEqual({
      date: '2026-07-27',
      status: 'remaining',
      isTarget: false,
    })
    expect(cells[cells.length - 1]).toEqual({
      date: '2026-09-01',
      status: 'remaining',
      isTarget: true,
    })
  })

  it('classifies mixed statuses against a mid-interval today', () => {
    const cells = buildDayCells('2026-07-26', '2026-08-05', '2026-08-01')
    const byDate = Object.fromEntries(cells.map((cell) => [cell.date, cell]))

    expect(byDate['2026-07-31']?.status).toBe('passed')
    expect(byDate['2026-08-01']?.status).toBe('today')
    expect(byDate['2026-08-02']?.status).toBe('remaining')
    expect(byDate['2026-08-05']?.isTarget).toBe(true)
  })
})

describe('calendar-date arithmetic safety', () => {
  it('does not shift ISO date-only strings via Date UTC parsing', () => {
    // Regression guard: Date.parse / new Date('YYYY-MM-DD') is UTC and can
    // shift the calendar day in western timezones. Our helpers must not.
    const iso = '2026-07-26'
    const parts = parseISODate(iso)
    expect(formatRoundTrip(parts)).toBe(iso)
    expect(addCalendarDays(iso, 1)).toBe('2026-07-27')
    expect(compareISODates(iso, '2026-07-27')).toBeLessThan(0)
  })

  it('computes weekday without depending on local Date timezone parsing of ISO strings', () => {
    // 2026-07-26 is a Sunday.
    expect(getWeekdaySundayZero('2026-07-26')).toBe(0)
    // Interval first cell 2026-07-27 is a Monday.
    expect(getWeekdaySundayZero('2026-07-27')).toBe(1)
  })

  it('formats local today from Date getters, not toISOString', () => {
    const sample = new Date(2026, 6, 26, 23, 30, 0)
    expect(getLocalTodayISO(sample)).toBe('2026-07-26')
  })
})

function formatRoundTrip(parts: {
  year: number
  month: number
  day: number
}): string {
  const y = String(parts.year).padStart(4, '0')
  const m = String(parts.month).padStart(2, '0')
  const d = String(parts.day).padStart(2, '0')
  return `${y}-${m}-${d}`
}
