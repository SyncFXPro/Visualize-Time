import type { IntervalStats } from '../types'
import { formatIntervalSummary } from '../lib/stats'

type EventHeaderProps = {
  title: string
  stats: IntervalStats
}

export function EventHeader({ title, stats }: EventHeaderProps) {
  return (
    <header className="mb-6 text-left">
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
        {title.trim() || 'Untitled event'}
      </h1>
      <p
        className="mt-2 text-sm text-[var(--muted)] sm:text-base"
        aria-live="polite"
      >
        {formatIntervalSummary(stats)}
      </p>
      {stats.total > 0 ? (
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.elapsedPercent}
          aria-label={`${stats.elapsedPercent}% elapsed`}
        >
          <div
            className="h-full rounded-full bg-[var(--text)] transition-[width] duration-300"
            style={{ width: `${stats.elapsedPercent}%` }}
          />
        </div>
      ) : null}
    </header>
  )
}
