const STATUSES = new Set(['up', 'down', 'unknown'])
const OVERALL_STATUSES = new Set(['operational', 'degraded', 'outage', 'unknown'])

const isNumberOrNull = (value) => value === null || (typeof value === 'number' && Number.isFinite(value))

export const validateMonitoringPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return false
  if (payload.schemaVersion !== 1 || !OVERALL_STATUSES.has(payload.overallStatus)) return false
  if (typeof payload.generatedAt !== 'string' || !Array.isArray(payload.services)) return false
  if (!payload.summary || typeof payload.summary.total !== 'number') return false

  return payload.services.every((service) => (
    typeof service.id === 'string'
    && typeof service.name === 'string'
    && typeof service.url === 'string'
    && STATUSES.has(service.status)
    && service.uptime
    && isNumberOrNull(service.uptime.percentage)
    && service.responseTime
    && isNumberOrNull(service.responseTime.latestMs)
    && Array.isArray(service.history?.responseTime)
  ))
}

export const getSafeErrorMessage = (payload) => (
  typeof payload?.error?.message === 'string'
    ? payload.error.message
    : 'Monitoring data is temporarily unavailable.'
)
