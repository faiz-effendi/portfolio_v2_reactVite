import { getSarangNagaServices } from '../config/sarangNagaServices.js'
import { buildPayload, normalizeService } from '../lib/normalizeMonitoring.js'
import { createUptimeRobotClient } from '../lib/uptimeRobotClient.js'

const successHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=30, stale-while-revalidate=30',
  'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=120, stale-while-revalidate=300',
}

const errorHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

const json = (body, status, headers = errorHeaders) => new Response(JSON.stringify(body), { status, headers })

const errorBody = (code, message, generatedAt) => ({
  schemaVersion: 1,
  generatedAt,
  error: { code, message },
})

export const createHandler = ({ fetchImpl = fetch, env = process.env, now = () => new Date() } = {}) => (
  async (request) => {
    const generatedAt = now().toISOString()

    if (request.method !== 'GET') {
      return json(errorBody('METHOD_NOT_ALLOWED', 'Only GET is supported.', generatedAt), 405, {
        ...errorHeaders,
        Allow: 'GET',
      })
    }

    const requestUrl = new URL(request.url)
    if ([...requestUrl.searchParams].length > 0) {
      return json(errorBody('INVALID_QUERY', 'Query parameters are not supported.', generatedAt), 400)
    }

    const token = env.UPTIMEROBOT_API_TOKEN?.trim()
    const configs = getSarangNagaServices(env)
    if (!token || !configs.length) {
      return json(errorBody('SERVER_MISCONFIGURED', 'Monitoring is not configured yet.', generatedAt), 503)
    }

    try {
      const client = createUptimeRobotClient({ token, fetchImpl })
      const to = now()
      const uptimeFrom = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const responseFrom = new Date(to.getTime() - 24 * 60 * 60 * 1000).toISOString()
      const toIso = to.toISOString()
      const services = []
      const warnings = []

      for (const config of configs) {
        const monitor = await client.getMonitor(config.monitorId)
        const [uptimeResult, responseResult] = await Promise.allSettled([
          client.getUptime(config.monitorId, uptimeFrom, toIso),
          client.getResponseTime(config.monitorId, responseFrom, toIso),
        ])
        if (uptimeResult.status === 'rejected') warnings.push({ code: 'UPTIME_UNAVAILABLE', serviceId: config.id })
        if (responseResult.status === 'rejected') warnings.push({ code: 'RESPONSE_TIME_UNAVAILABLE', serviceId: config.id })

        services.push(normalizeService({
          config,
          monitor,
          uptime: uptimeResult.status === 'fulfilled' ? uptimeResult.value : null,
          responseTime: responseResult.status === 'fulfilled' ? responseResult.value : null,
        }))
      }

      return json(buildPayload({ services, warnings, generatedAt }), 200, successHeaders)
    } catch {
      return json(errorBody('UPSTREAM_UNAVAILABLE', 'Monitoring data is temporarily unavailable.', generatedAt), 502)
    }
  }
)

export default createHandler()
