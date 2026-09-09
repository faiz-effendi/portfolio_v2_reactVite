const MonitoringSkeleton = () => (
  <div className="page-container py-12" aria-busy="true" aria-label="Loading monitoring data">
    <div className="animate-pulse space-y-8">
      <div className="h-36 border border-hairline bg-surface-soft" />
      <div className="grid grid-cols-2 gap-px bg-hairline lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="h-28 bg-surface-card" />)}
      </div>
      <div className="h-80 border border-hairline bg-surface-card" />
    </div>
  </div>
)

export default MonitoringSkeleton
