type LiveClockProps = {
  time: string
  dateLabel: string
}

export function LiveClock({ time, dateLabel }: LiveClockProps) {
  return (
    <div
      className="text-right"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="font-mono text-lg font-medium tabular-nums tracking-tight text-[var(--text-secondary)] sm:text-xl">
        {time}
      </p>
      <p className="mt-0.5 text-[10px] text-[var(--muted)]">{dateLabel}</p>
    </div>
  )
}
