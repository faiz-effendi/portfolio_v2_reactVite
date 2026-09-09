import { describe, expect, it, vi } from 'vitest'
import { createHandler } from '../netlify/functions/sarang-naga-status.js'

const fixedNow = () => new Date('2026-09-09T12:00:00.000Z')
const env = {
  UPTIMEROBOT_API_TOKEN: 'test-token',
  UPTIMEROBOT_PORTFOLIO_MONITOR_ID: '123',
}

describe('Sarang Naga function', () => {
  it('rejects unsupported methods and query parameters', async () => {
    const handler = createHandler({ env, now: fixedNow, fetchImpl: vi.fn() })
    expect((await handler(new Request('https://example.com/api/sarang-naga/status', { method: 'POST' }))).status).toBe(405)
    expect((await handler(new Request('https://example.com/api/sarang-naga/status?monitor=secret'))).status).toBe(400)
  })

  it('returns a safe configuration error', async () => {
    const handler = createHandler({ env: {}, now: fixedNow, fetchImpl: vi.fn() })
    const response = await handler(new Request('https://example.com/api/sarang-naga/status'))
    const body = await response.json()
    expect(response.status).toBe(503)
    expect(body.error.code).toBe('SERVER_MISCONFIGURED')
  })

  it('normalizes successful upstream responses', async () => {
    const fetchImpl = vi.fn(async (url) => {
      const path = new URL(url).pathname
      if (path.endsWith('/stats/uptime')) return Response.json({ uptime: 99.99 })
      if (path.endsWith('/stats/response-time')) {
        return Response.json({
          summary: { min: 80, max: 180, avg: 110 },
          time_series: [
            { timestamp: '2026-09-09T11:00:00.000Z', value: 105 },
            { timestamp: '2026-09-09T12:00:00.000Z', value: 115 },
          ],
        })
      }
      return Response.json({ id: 123, status: 'UP', url: 'https://faizeffendi.online' })
    })
    const handler = createHandler({ env, now: fixedNow, fetchImpl })
    const response = await handler(new Request('https://example.com/api/sarang-naga/status'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.overallStatus).toBe('operational')
    expect(body.services[0].responseTime.latestMs).toBe(115)
    expect(response.headers.get('Netlify-CDN-Cache-Control')).toContain('s-maxage=120')
  })
})
