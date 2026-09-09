const statusStyles = {
  up: 'border-success/40 bg-success/10 text-success',
  down: 'border-danger/40 bg-danger/10 text-danger',
  unknown: 'border-hairline-strong bg-surface-elevated text-muted',
}

const ServiceStatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-code text-xs font-semibold uppercase tracking-[0.12em] ${statusStyles[status] || statusStyles.unknown}`}>
    <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
    {status || 'unknown'}
  </span>
)

export default ServiceStatusBadge
