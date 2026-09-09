import { formatMilliseconds, formatPercentage } from '../lib/monitoringFormat'

const SummaryMetrics = ({ summary }) => {
  const metrics = [
    ['Monitored', String(summary.total), `${summary.up} up · ${summary.down} down · ${summary.unknown} unknown`],
    ['Available now', String(summary.up), summary.total ? `${Math.round((summary.up / summary.total) * 100)}% of services` : 'No services'],
    ['30-day uptime', formatPercentage(summary.averageUptime30d), 'Average across services'],
    ['24-hour response', formatMilliseconds(summary.averageResponseTimeMs), 'Average response time'],
  ]

  return (
    <section className="page-container py-10" aria-label="Monitoring summary">
      <div className="grid border-l border-t border-hairline sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value, note]) => (
          <div key={label} className="border-b border-r border-hairline bg-surface-card p-6">
            <p className="font-code text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-ink">{value}</p>
            <p className="mt-2 text-xs text-muted">{note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SummaryMetrics
