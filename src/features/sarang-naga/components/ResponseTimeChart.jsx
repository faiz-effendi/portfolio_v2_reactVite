import { formatMilliseconds } from '../lib/monitoringFormat'

const WIDTH = 720
const HEIGHT = 220
const PADDING = 16

const ResponseTimeChart = ({ points }) => {
  const validPoints = points.filter((point) => Number.isFinite(point.valueMs))

  if (validPoints.length < 2) {
    return (
      <div className="flex h-56 items-center justify-center border border-dashed border-hairline-strong bg-canvas px-5 text-center text-sm text-muted">
        Response-time history is not available yet.
      </div>
    )
  }

  const values = validPoints.map((point) => point.valueMs)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = Math.max(max - min, 1)
  const chartWidth = WIDTH - PADDING * 2
  const chartHeight = HEIGHT - PADDING * 2
  const path = validPoints.map((point, index) => {
    const x = PADDING + (index / (validPoints.length - 1)) * chartWidth
    const y = PADDING + (1 - (point.valueMs - min) / spread) * chartHeight
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')
  const latest = validPoints.at(-1)?.valueMs

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between gap-4">
        <p className="font-code text-xs uppercase tracking-[0.12em] text-muted">Response time · last 24 hours</p>
        <p className="font-code text-xs text-muted">Min {formatMilliseconds(min)} · Max {formatMilliseconds(max)} · Latest {formatMilliseconds(latest)}</p>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-56 w-full border border-hairline bg-canvas"
        role="img"
        aria-label={`Response time over 24 hours. Minimum ${formatMilliseconds(min)}, maximum ${formatMilliseconds(max)}, latest ${formatMilliseconds(latest)}.`}
      >
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line key={ratio} x1="0" x2={WIDTH} y1={HEIGHT * ratio} y2={HEIGHT * ratio} stroke="#2a2a2a" strokeWidth="1" />
        ))}
        <path d={path} fill="none" stroke="#faff69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

export default ResponseTimeChart
