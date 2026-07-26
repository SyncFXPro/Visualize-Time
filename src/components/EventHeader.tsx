type EventHeaderProps = {
  title: string
  dayCount: number
}

export function EventHeader({ title, dayCount }: EventHeaderProps) {
  const summary = dayCount === 1 ? '1 day' : `${dayCount} days`

  return (
    <header className="mb-8 text-left">
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
        {title.trim() || 'Untitled event'}
      </h1>
      <p className="mt-2 text-lg text-[var(--muted)]" aria-live="polite">
        {summary}
      </p>
    </header>
  )
}
