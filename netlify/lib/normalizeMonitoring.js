const numberOrNull = (value) => {
  const number = Number(value)
  return value !== null && value !== undefined && Number.isFinite(number) ? number : null
}

export const normalizeStatus = (status) => {
  const value = String(status || '').toUpperCase()
  if (value === 'UP') return 'up'
  if (['DOWN', 'LOOKS_DOWN'].includes(value)) return 'down'
  return 'unknown'
}

export const getOverallStatus = (services) => {
  if (!services.length) return 'unknown'
  const down = services.filter((service) => service.status === 'down').length
  const unknown = services.filter((service) => service.status === 'unknown').length
  if (down === services.length) return 'outage'
  if (down > 0) return 'degraded'
  if (unknown > 0) return 'unknown'
  return 'operational'
}

const average = (values) => {
  const valid = values.filter(Number.isFinite)
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null
}

const round = (value, precision = 0) => {
  if (!Number.isFinite(value)) return null
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

const normalizePoint = (point) => ({
  timestamp: point.timestamp ?? point.datetime ?? point.time,
  valueMs: numberOrNull(point.value ?? point.valueMs ?? point.response_time),
})

export const normalizeService = ({ config, monitor, uptime, responseTime }) => {
  const pointsByTimestamp = new Map((responseTime?.time_series ?? responseTime?.timeSeries ?? [])
    .map(normalizePoint)
    .filter((point) => typeof point.timestamp === 'string' && Number.isFinite(point.valueMs))
    .map((point) => [point.timestamp, point]))
  const points = [...pointsByTimestamp.values()]
    .sort((left, right) => new Date(left.timestamp) - new Date(right.timestamp))
    .slice(-96)
  const latestPoint = points.at(-1)
  const summary = responseTime?.summary ?? {}

  return {
    id: config.id,
    name: config.name || monitor?.friendlyName || monitor?.friendly_name || 'Monitored service',
    url: config.url || monitor?.url || '',
    status: normalizeStatus(monitor?.status),
    uptime: {
      percentage: round(numberOrNull(uptime?.uptime), 3),
      windowDays: 30,
    },
    responseTime: {
      latestMs: round(latestPoint?.valueMs),
      average24hMs: round(numberOrNull(summary.avg)),
      min24hMs: round(numberOrNull(summary.min)),
      max24hMs: round(numberOrNull(summary.max)),
    },
    lastResponseSampleAt: latestPoint?.timestamp ?? null,
    history: { responseTime: points },
  }
}

export const buildPayload = ({ services, warnings, generatedAt }) => {
  const counts = services.reduce((result, service) => {
    result[service.status] += 1
    return result
  }, { up: 0, down: 0, unknown: 0 })

  return {
    schemaVersion: 1,
    generatedAt,
    overallStatus: getOverallStatus(services),
    summary: {
      total: services.length,
      ...counts,
      averageUptime30d: round(average(services.map((service) => service.uptime.percentage)), 3),
      averageResponseTimeMs: round(average(services.map((service) => service.responseTime.average24hMs))),
    },
    services,
    warnings,
  }
}
