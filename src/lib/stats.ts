import type { DayCellData, IntervalStats } from '../types'

/** left = today + remaining; elapsed% = passed / total. */
export function computeIntervalStats(cells: DayCellData[]): IntervalStats {
  let passed = 0
  let left = 0

  for (const cell of cells) {
    if (cell.status === 'passed') {
      passed += 1
    } else {
      left += 1
    }
  }

  const total = cells.length
  const elapsedPercent =
    total === 0 ? 0 : Math.round((passed / total) * 100)

  return { left, passed, total, elapsedPercent }
}

export function formatIntervalSummary(stats: IntervalStats): string {
  if (stats.total === 0) {
    return '0 days left · 0 passed · 0 total · 0% elapsed'
  }

  const leftLabel = stats.left === 1 ? '1 day left' : `${stats.left} days left`
  const passedLabel =
    stats.passed === 1 ? '1 passed' : `${stats.passed} passed`

  return `${leftLabel} · ${passedLabel} · ${stats.total} total · ${stats.elapsedPercent}% elapsed`
}
