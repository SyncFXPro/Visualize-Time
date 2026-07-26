import type {
  CellShape,
  Countdown,
  TimeLens,
  VisualizationMode,
  Weekday,
} from '../types'
import { parseISODate } from './dates'
import { createDefaultLenses, createLensId } from './lenses'

export const STORAGE_KEY = 'visualize-time-state'
const LEGACY_STORAGE_KEY = 'visualize-time-config'

export function createCountdownId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `countdown-${crypto.randomUUID()}`
  }
  return `countdown-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function createCountdown(
  partial?: Partial<Omit<Countdown, 'id' | 'lenses'>> & {
    lenses?: TimeLens[]
  },
): Countdown {
  const lenses = partial?.lenses ?? createDefaultLenses()
  return {
    id: createCountdownId(),
    title: partial?.title ?? 'September 1',
    startDate: partial?.startDate ?? '2026-07-26',
    targetDate: partial?.targetDate ?? '2026-09-01',
    mode: partial?.mode ?? 'calendar',
    shape: partial?.shape ?? 'square',
    showMonths: partial?.showMonths ?? true,
    lenses,
    activeLensId: partial?.activeLensId ?? null,
  }
}

export type AppState = {
  countdowns: Countdown[]
  activeCountdownId: string
}

export function createDefaultState(): AppState {
  const first = createCountdown()
  return {
    countdowns: [first],
    activeCountdownId: first.id,
  }
}

function isVisualizationMode(value: unknown): value is VisualizationMode {
  return value === 'calendar' || value === 'compact'
}

function isCellShape(value: unknown): value is CellShape {
  return value === 'square' || value === 'rounded' || value === 'circle'
}

function isWeekday(value: unknown): value is Weekday {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 6
  )
}

function isValidISODateString(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    parseISODate(value)
    return true
  } catch {
    return false
  }
}

function parseLens(value: unknown): TimeLens | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const label = typeof record.label === 'string' ? record.label : ''
  const weekdays = Array.isArray(record.weekdays)
    ? record.weekdays.filter(isWeekday)
    : []
  const exclusions = Array.isArray(record.exclusions)
    ? record.exclusions.filter(isValidISODateString)
    : []
  const id =
    typeof record.id === 'string' && record.id.length > 0
      ? record.id
      : createLensId()

  return { id, label, weekdays, exclusions }
}

function parseCountdown(value: unknown): Countdown | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>

  const title =
    typeof record.title === 'string' && record.title.trim().length > 0
      ? record.title
      : 'Untitled'
  const startDate = isValidISODateString(record.startDate)
    ? record.startDate
    : '2026-07-26'
  const targetDate = isValidISODateString(record.targetDate)
    ? record.targetDate
    : '2026-09-01'
  const mode = isVisualizationMode(record.mode) ? record.mode : 'calendar'
  const shape = isCellShape(record.shape) ? record.shape : 'square'
  const showMonths =
    typeof record.showMonths === 'boolean' ? record.showMonths : true
  const lenses = Array.isArray(record.lenses)
    ? record.lenses.map(parseLens).filter((lens): lens is TimeLens => lens !== null)
    : createDefaultLenses()
  const id =
    typeof record.id === 'string' && record.id.length > 0
      ? record.id
      : createCountdownId()
  const activeLensId =
    typeof record.activeLensId === 'string' &&
    lenses.some((lens) => lens.id === record.activeLensId)
      ? record.activeLensId
      : (lenses[0]?.id ?? null)

  return {
    id,
    title,
    startDate,
    targetDate,
    mode,
    shape,
    showMonths,
    lenses: lenses.length > 0 ? lenses : createDefaultLenses(),
    activeLensId,
  }
}

function migrateLegacyConfig(): AppState | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    const countdown = parseCountdown(parsed)
    if (!countdown) return null
    return {
      countdowns: [countdown],
      activeCountdownId: countdown.id,
    }
  } catch {
    return null
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return migrateLegacyConfig() ?? createDefaultState()
    }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return createDefaultState()
    }

    const record = parsed as Record<string, unknown>
    const countdowns = Array.isArray(record.countdowns)
      ? record.countdowns
          .map(parseCountdown)
          .filter((item): item is Countdown => item !== null)
      : []

    if (countdowns.length === 0) {
      return createDefaultState()
    }

    const activeCountdownId =
      typeof record.activeCountdownId === 'string' &&
      countdowns.some((item) => item.id === record.activeCountdownId)
        ? record.activeCountdownId
        : countdowns[0]!.id

    return { countdowns, activeCountdownId }
  } catch {
    return createDefaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
