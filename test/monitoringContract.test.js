import { describe, expect, it } from 'vitest'
import { validateMonitoringPayload } from '../src/features/sarang-naga/lib/monitoringContract.js'

const validPayload = {
  schemaVersion: 1,
  generatedAt: '2026-09-09T00:00:00.000Z',
  overallStatus: 'operational',
  summary: { total: 1 },
  services: [{
    id: 'portfolio',
    name: 'Portfolio',
    url: 'https://example.com',
    status: 'up',
    uptime: { percentage: 100, windowDays: 30 },
    responseTime: { latestMs: 120 },
    history: { responseTime: [] },
  }],
}

describe('browser monitoring contract', () => {
  it('accepts the expected schema', () => {
    expect(validateMonitoringPayload(validPayload)).toBe(true)
  })

  it('rejects unsupported versions and statuses', () => {
    expect(validateMonitoringPayload({ ...validPayload, schemaVersion: 2 })).toBe(false)
    expect(validateMonitoringPayload({ ...validPayload, overallStatus: 'fine' })).toBe(false)
  })
})
