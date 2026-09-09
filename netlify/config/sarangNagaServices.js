export const getSarangNagaServices = (env = process.env) => {
  const monitorId = env.UPTIMEROBOT_PORTFOLIO_MONITOR_ID?.trim()
  if (!monitorId || !/^\d+$/.test(monitorId) || Number(monitorId) <= 0) return []

  return [
    {
      id: 'portfolio',
      monitorId,
      name: 'Faiz Effendi Portfolio',
      url: 'https://faizeffendi.online',
    },
  ]
}
