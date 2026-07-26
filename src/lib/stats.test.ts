import { describe, expect, it } from 'vitest'
import { computeIntervalStats, formatIntervalSummary } from './stats'
import type { DayCellData } from '../types'

describe('computeIntervalStats', () => {
  it('counts left as today + remaining and computes elapsed percent', () => {
    const cells: DayCellData[] = [
      { date: '2026-07-27', status: 'passed', isTarget: false },
      { date: '2026-07-28', status: 'passed', isTarget: false },
      { date: '2026-07-29', status: 'today', isTarget: false },
      { date: '2026-07-30', status: 'remaining', isTarget: false },
      { date: '2026-07-31', status: 'remaining', isTarget: true },
    ]

    expect(computeIntervalStats(cells)).toEqual({
      left: 3,
      passed: 2,
      total: 5,
      elapsedPercent: 40,
    })
  })

  it('formats the product summary line', () => {
    expect(
      formatIntervalSummary({
        left: 37,
        passed: 39,
        total: 76,
        elapsedPercent: 51,
      }),
    ).toBe('37 days left · 39 passed · 76 total · 51% elapsed')
  })
})
