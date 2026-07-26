import type { EventConfig, VisualizationMode } from '../types'
import { parseISODate } from './dates'

export const STORAGE_KEY = 'visualize-time-config'

export const DEFAULT_CONFIG: EventConfig = {
  title: 'September 1',
  startDate: '2026-07-26',
  targetDate: '2026-09-01',
  mode: 'calendar',
}

function isVisualizationMode(value: unknown): value is VisualizationMode {
  return value === 'calendar' || value === 'compact'
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

export function loadConfig(): EventConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_CONFIG }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_CONFIG }
    }

    const record = parsed as Record<string, unknown>
    const title =
      typeof record.title === 'string' && record.title.trim().length > 0
        ? record.title
        : DEFAULT_CONFIG.title
    const startDate = isValidISODateString(record.startDate)
      ? record.startDate
      : DEFAULT_CONFIG.startDate
    const targetDate = isValidISODateString(record.targetDate)
      ? record.targetDate
      : DEFAULT_CONFIG.targetDate
    const mode = isVisualizationMode(record.mode)
      ? record.mode
      : DEFAULT_CONFIG.mode

    return { title, startDate, targetDate, mode }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export function saveConfig(config: EventConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}
