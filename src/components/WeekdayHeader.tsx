/** Sunday-first initials — same order as getWeekdaySundayZero. */
const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

type WeekdayHeaderProps = {
  /** Must match the day-cell grid gap so columns line up. */
  className?: string
}

export function WeekdayHeader({
  className = 'mb-1.5 grid grid-cols-7 gap-x-2 gap-y-0',
}: WeekdayHeaderProps) {
  return (
    <div className={className} role="row">
      {WEEKDAY_INITIALS.map((day, index) => (
        <div
          key={`${day}-${index}`}
          className="text-center text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]"
          role="columnheader"
        >
          {day}
        </div>
      ))}
    </div>
  )
}
