export const formatPercentage = (value) => (
  Number.isFinite(value) ? `${value.toFixed(value >= 99 ? 3 : 2)}%` : '—'
)

export const formatMilliseconds = (value) => (
  Number.isFinite(value) ? `${Math.round(value)} ms` : '—'
)

export const formatTimestamp = (value) => {
  if (!value) return 'Unavailable'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unavailable'
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}
