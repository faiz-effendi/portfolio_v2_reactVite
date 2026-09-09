import { formatPercentage } from '../lib/monitoringFormat'

const AvailabilityBar = ({ percentage }) => {
  const safePercentage = Number.isFinite(percentage) ? Math.min(100, Math.max(0, percentage)) : 0

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="font-code text-xs uppercase tracking-[0.12em] text-muted">30-day availability</p>
        <p className="font-code text-sm font-semibold text-ink">{formatPercentage(percentage)}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-elevated" role="img" aria-label={`30-day availability: ${formatPercentage(percentage)}`}>
        <div className="h-full rounded-full bg-success" style={{ width: `${safePercentage}%` }} />
      </div>
    </div>
  )
}

export default AvailabilityBar
