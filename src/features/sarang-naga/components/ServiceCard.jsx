import { ExternalLink } from 'lucide-react'
import AvailabilityBar from './AvailabilityBar'
import ResponseTimeChart from './ResponseTimeChart'
import ServiceStatusBadge from './ServiceStatusBadge'
import { formatMilliseconds, formatTimestamp } from '../lib/monitoringFormat'

const ServiceCard = ({ service }) => (
  <article className="border border-hairline bg-surface-card">
    <div className="flex flex-col justify-between gap-5 border-b border-hairline p-6 sm:flex-row sm:items-start md:p-8">
      <div className="min-w-0">
        <p className="font-code text-xs uppercase tracking-[0.12em] text-primary">Public endpoint</p>
        <h3 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-ink">{service.name}</h3>
        <a href={service.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex max-w-full items-center gap-2 break-all font-code text-xs text-muted hover:text-primary">
          {service.url} <ExternalLink className="shrink-0" size={13} />
        </a>
      </div>
      <ServiceStatusBadge status={service.status} />
    </div>

    <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:p-8">
      <div className="space-y-8">
        <AvailabilityBar percentage={service.uptime.percentage} />
        <dl className="grid grid-cols-2 gap-px overflow-hidden border border-hairline bg-hairline">
          <div className="bg-canvas p-4">
            <dt className="font-code text-[11px] uppercase tracking-[0.1em] text-muted">Latest</dt>
            <dd className="mt-2 text-xl font-bold text-ink">{formatMilliseconds(service.responseTime.latestMs)}</dd>
          </div>
          <div className="bg-canvas p-4">
            <dt className="font-code text-[11px] uppercase tracking-[0.1em] text-muted">24h average</dt>
            <dd className="mt-2 text-xl font-bold text-ink">{formatMilliseconds(service.responseTime.average24hMs)}</dd>
          </div>
        </dl>
        <p className="font-code text-xs leading-5 text-muted">Last sample: {formatTimestamp(service.lastResponseSampleAt)}</p>
      </div>
      <ResponseTimeChart points={service.history.responseTime} />
    </div>
  </article>
)

export default ServiceCard
