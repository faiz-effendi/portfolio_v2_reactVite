const API_ORIGIN = 'https://api.uptimerobot.com'
const API_BASE_URL = `${API_ORIGIN}/v3`
const REQUEST_TIMEOUT_MS = 8_000

export class UpstreamError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'UpstreamError'
    this.status = status
  }
}

const unwrap = (payload) => payload?.data ?? payload

export const createUptimeRobotClient = ({ token, fetchImpl = fetch }) => {
  if (!token) throw new Error('UPTIMEROBOT_API_TOKEN is not configured.')

  const request = async (path, searchParams) => {
    const url = new URL(`${API_BASE_URL}${path}`)
    Object.entries(searchParams || {}).forEach(([key, value]) => url.searchParams.set(key, value))
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetchImpl(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new UpstreamError('UptimeRobot request failed.', response.status)
      return unwrap(payload)
    } catch (error) {
      if (error.name === 'AbortError') throw new UpstreamError('UptimeRobot request timed out.', 504)
      throw error
    } finally {
      clearTimeout(timeout)
    }
  }

  return {
    getMonitor: (monitorId) => request(`/monitors/${encodeURIComponent(monitorId)}`),
    getUptime: (monitorId, from, to) => request(`/monitors/${encodeURIComponent(monitorId)}/stats/uptime`, { from, to }),
    getResponseTime: (monitorId, from, to) => request(`/monitors/${encodeURIComponent(monitorId)}/stats/response-time`, {
      from,
      to,
      includeTimeSeries: 'true',
      region: 'all',
    }),
  }
}
