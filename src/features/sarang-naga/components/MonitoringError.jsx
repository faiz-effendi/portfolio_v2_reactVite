import { RefreshCw, TriangleAlert } from 'lucide-react'

const MonitoringError = ({ message, onRetry, isRetrying }) => (
  <section className="page-container py-16" aria-labelledby="monitoring-error-title" role="alert">
    <div className="border border-danger/40 bg-surface-card p-7 sm:p-10">
      <TriangleAlert className="text-danger" size={32} aria-hidden="true" />
      <p className="mt-6 font-code text-xs font-semibold uppercase tracking-[0.14em] text-danger">Monitoring unavailable</p>
      <h2 id="monitoring-error-title" className="mt-3 text-3xl font-bold tracking-[-0.04em] text-ink">We could not verify the services.</h2>
      <p className="mt-3 max-w-2xl text-muted">{message}</p>
      <button type="button" className="button-secondary mt-7" onClick={onRetry} disabled={isRetrying}>
        <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
        {isRetrying ? 'Retrying…' : 'Try again'}
      </button>
    </div>
  </section>
)

export default MonitoringError
