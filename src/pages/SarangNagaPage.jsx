import { RefreshCw } from 'lucide-react'
import MonitoringError from '../features/sarang-naga/components/MonitoringError'
import MonitoringSkeleton from '../features/sarang-naga/components/MonitoringSkeleton'
import OverallStatus from '../features/sarang-naga/components/OverallStatus'
import ServiceCard from '../features/sarang-naga/components/ServiceCard'
import SummaryMetrics from '../features/sarang-naga/components/SummaryMetrics'
import { useMonitoring } from '../features/sarang-naga/hooks/useMonitoring'
import { formatTimestamp } from '../features/sarang-naga/lib/monitoringFormat'

const SarangNagaPage = () => {
  const { data, error, isInitialLoading, isRefreshing, isStale, refresh } = useMonitoring()

  if (isInitialLoading) {
    return (
      <main className="min-h-screen pt-16">
        <MonitoringSkeleton />
      </main>
    )
  }

  if (!data) {
    return (
      <main className="min-h-screen pt-16">
        <MonitoringError message={error} onRetry={refresh} isRetrying={isRefreshing} />
      </main>
    )
  }

  const visibleStatus = isStale ? 'unknown' : data.overallStatus

  return (
    <main className="min-h-screen pt-16">
      <h1 className="sr-only">Sarang Naga monitoring</h1>

      {(isStale || data.warnings?.length > 0) && (
        <div className="border-y border-warning/30 bg-warning/5">
          <div className="page-container py-4 font-code text-xs leading-5 text-warning" role="status">
            {isStale
              ? 'Live refresh failed or the snapshot is stale. Status is shown as unknown until fresh data arrives.'
              : `${data.warnings.length} metric request${data.warnings.length === 1 ? '' : 's'} could not be completed. Available values are still shown.`}
          </div>
        </div>
      )}

      <OverallStatus status={visibleStatus} />
      <SummaryMetrics summary={data.summary} />

      <section className="page-container pb-20 sm:pb-24" aria-labelledby="monitored-services-title">
        <div className="mb-7 flex flex-col justify-between gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Live checks</p>
            <h2 id="monitored-services-title" className="mt-3 text-3xl font-bold tracking-[-0.04em] text-ink">Monitored services</h2>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="font-code text-xs text-muted">Updated {formatTimestamp(data.generatedAt)} · WIB</p>
            <button type="button" className="button-secondary" onClick={refresh} disabled={isRefreshing}>
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing…' : 'Refresh status'}
            </button>
          </div>
        </div>

        {data.services.length ? (
          <div className="space-y-6">
            {data.services.map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
        ) : (
          <div className="border border-dashed border-hairline-strong bg-surface-card p-8 text-center text-muted">No public services are configured yet.</div>
        )}
      </section>
    </main>
  )
}

export default SarangNagaPage
