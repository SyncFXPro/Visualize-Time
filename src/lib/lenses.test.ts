import { describe, expect, it } from 'vitest'
import {
  cellMatchesLens,
  countLensLeft,
  formatLensLeftLabel,
  isLensOpportunity,
} from './lenses'
import type { DayCellData, TimeLens } from '../types'

const weekends: TimeLens = {
  id: 'w',
  label: 'weekends',
  weekdays: [0, 6],
  exclusions: [],
}

describe('time lenses', () => {
  it('matches selected weekdays and honors exclusions', () => {
    // 2026-08-01 is Saturday, 2026-08-02 is Sunday, 2026-08-03 is Monday
    expect(cellMatchesLens('2026-08-01', weekends)).toBe(true)
    expect(cellMatchesLens('2026-08-02', weekends)).toBe(true)
    expect(cellMatchesLens('2026-08-03', weekends)).toBe(false)

    const withExclusion: TimeLens = {
      ...weekends,
      exclusions: ['2026-08-01'],
    }
    expect(cellMatchesLens('2026-08-01', withExclusion)).toBe(false)
  })

  it('divides matching days by selected weekday count (2 weekend days → units)', () => {
    const cells: DayCellData[] = [
      { date: '2026-08-01', status: 'passed', isTarget: false }, // Sat
      { date: '2026-08-02', status: 'today', isTarget: false }, // Sun
      { date: '2026-08-08', status: 'remaining', isTarget: false }, // Sat
      { date: '2026-08-09', status: 'remaining', isTarget: true }, // Sun
    ]

    // 3 matching days left / 2 selected weekdays = 1.5 weekend units
    expect(countLensLeft(cells, weekends)).toBe(1.5)
    expect(formatLensLeftLabel(weekends, 1.5)).toBe('1.5 weekends left')
  })

  it('keeps weekday lenses as a 1:1 day count (not divided by 5)', () => {
    const weekdays: TimeLens = {
      id: 'wd',
      label: 'weekdays',
      weekdays: [1, 2, 3, 4, 5],
      exclusions: [],
    }
    const cells: DayCellData[] = [
      { date: '2026-08-03', status: 'remaining', isTarget: false }, // Mon
      { date: '2026-08-04', status: 'remaining', isTarget: false }, // Tue
      { date: '2026-08-05', status: 'remaining', isTarget: false }, // Wed
      { date: '2026-08-06', status: 'remaining', isTarget: false }, // Thu
      { date: '2026-08-07', status: 'remaining', isTarget: true }, // Fri
    ]
    expect(countLensLeft(cells, weekdays)).toBe(5)
  })

  it('treats only non-elapsed matching days as lens opportunities', () => {
    expect(isLensOpportunity('2026-08-01', 'passed', weekends)).toBe(false)
    expect(isLensOpportunity('2026-08-02', 'today', weekends)).toBe(true)
    expect(isLensOpportunity('2026-08-08', 'remaining', weekends)).toBe(true)
    expect(isLensOpportunity('2026-08-03', 'remaining', weekends)).toBe(false)
  })
})
