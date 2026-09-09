import { AlertTriangle, CheckCircle2, CircleHelp, Siren } from 'lucide-react'

const states = {
  operational: {
    eyebrow: 'All systems normal',
    title: 'Operational',
    description: 'Every monitored service is responding normally.',
    icon: CheckCircle2,
    accent: 'text-success',
    border: 'border-success/30',
  },
  degraded: {
    eyebrow: 'Partial disruption',
    title: 'Degraded',
    description: 'At least one monitored service is currently unavailable.',
    icon: AlertTriangle,
    accent: 'text-warning',
    border: 'border-warning/30',
  },
  outage: {
    eyebrow: 'Service disruption',
    title: 'Outage',
    description: 'All monitored services are currently unavailable.',
    icon: Siren,
    accent: 'text-danger',
    border: 'border-danger/30',
  },
  unknown: {
    eyebrow: 'Status uncertain',
    title: 'Unknown',
    description: 'Current status cannot be confirmed from the available data.',
    icon: CircleHelp,
    accent: 'text-muted',
    border: 'border-hairline-strong',
  },
}

const OverallStatus = ({ status }) => {
  const state = states[status] || states.unknown
  const Icon = state.icon

  return (
    <section className={`border-y ${state.border} bg-surface-soft`} aria-labelledby="overall-status-title" aria-live="polite">
      <div className="page-container grid gap-5 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:py-8">
        <div>
          <p className={`font-code text-xs font-semibold uppercase tracking-[0.14em] ${state.accent}`}>{state.eyebrow}</p>
          <h2 id="overall-status-title" className="mt-2 text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">{state.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{state.description}</p>
        </div>
        <Icon className={`${state.accent} hidden sm:block`} size={38} strokeWidth={1.5} aria-hidden="true" />
      </div>
    </section>
  )
}

export default OverallStatus
