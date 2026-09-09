import { describe, expect, it } from 'vitest'
import { buildPayload, getOverallStatus, normalizeService, normalizeStatus } from '../netlify/lib/normalizeMonitoring.js'

describe('monitoring normalization', () => {
  it('maps UptimeRobot statuses to the public contract', () => {
    expect(normalizeStatus('UP')).toBe('up')
    expect(normalizeStatus('LOOKS_DOWN')).toBe('down')
    expect(normalizeStatus('STARTED')).toBe('unknown')
    expect(normalizeStatus('PAUSED')).toBe('unknown')
  })

  it('derives the overall state without hiding unknown data', () => {
    expect(getOverallStatus([])).toBe('unknown')
    expect(getOverallStatus([{ status: 'up' }])).toBe('operational')
    expect(getOverallStatus([{ status: 'up' }, { status: 'unknown' }])).toBe('unknown')
    expect(getOverallStatus([{ status: 'up' }, { status: 'down' }])).toBe('degraded')
    expect(getOverallStatus([{ status: 'down' }, { status: 'down' }])).toBe('outage')
  })

  it('normalizes service metrics and computes averages', () => {
    const service = normalizeService({
      config: { id: 'portfolio', name: 'Portfolio', url: 'https://example.com' },
      monitor: { status: 'UP' },
      uptime: { uptime: 99.987 },
      responseTime: {
        summary: { avg: 120, min: 80, max: 220 },
        time_series: [
          { timestamp: '2026-09-08T00:00:00.000Z', value: 100 },
          { timestamp: '2026-09-09T00:00:00.000Z', value: 140 },
        ],
      },
    })
    const payload = buildPayload({ services: [service], warnings: [], generatedAt: '2026-09-09T00:00:00.000Z' })

    expect(service.responseTime.latestMs).toBe(140)
    expect(payload.overallStatus).toBe('operational')
    expect(payload.summary.averageUptime30d).toBe(99.987)
    expect(payload.summary.averageResponseTimeMs).toBe(120)
  })
})
