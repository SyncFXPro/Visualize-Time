import type { DayCellData, TimeLens } from '../types'
import { countLensLeft, formatLensLeftLabel } from '../lib/lenses'

type LensBarProps = {
  lenses: TimeLens[]
  activeLensId: string | null
  cells: DayCellData[]
  onSelect: (lensId: string | null) => void
}

export function LensBar({
  lenses,
  activeLensId,
  cells,
  onSelect,
}: LensBarProps) {
  if (lenses.length === 0) return null

  return (
    <section aria-label="Time lenses" className="mb-6">
      <div className="mb-2 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
        Time lenses
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-pressed={activeLensId === null}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
            activeLensId === null
              ? 'border-[var(--text)] bg-[var(--text)] text-[var(--bg)]'
              : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          All days
        </button>
        {lenses.map((lens) => {
          const left = countLensLeft(cells, lens)
          const active = activeLensId === lens.id
          return (
            <button
              key={lens.id}
              type="button"
              onClick={() => onSelect(lens.id)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                active
                  ? 'border-[var(--text)] bg-[var(--text)] text-[var(--bg)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {formatLensLeftLabel(lens, left)}
            </button>
          )
        })}
      </div>
    </section>
  )
}
