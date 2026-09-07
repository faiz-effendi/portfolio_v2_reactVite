import data from '../data/portfolio_data.json';

const Experience = () => {
  const { experience, capabilities } = data;

  return (
    <section id="experience" className="section-container">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow">Experience</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-ink md:text-5xl">Work grounded in measurable outcomes.</h2>
        </div>

        <div className="lg:col-span-8">
          {experience.map((item) => (
            <article key={item.id} className="grid gap-4 border-t border-hairline py-8 first:border-t-0 sm:grid-cols-[11rem_1fr]">
              <p className="font-code text-xs text-primary">{item.duration}</p>
              <div>
                <h3 className="text-xl font-semibold text-ink">{item.role}</h3>
                <p className="mt-1 text-sm text-muted">{item.company}</p>
                <p className="mt-4 max-w-2xl leading-relaxed text-body">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div id="capabilities" className="mt-16 border-t border-hairline pt-12">
        <p className="eyebrow mb-6">Capabilities</p>
        <div className="grid overflow-hidden rounded-lg border border-hairline md:grid-cols-3">
          {capabilities.map((group, index) => (
            <div key={group.label} className={`bg-surface-card p-6 md:p-8 ${index < capabilities.length - 1 ? 'border-b border-hairline md:border-b-0 md:border-r' : ''}`}>
              <h3 className="text-lg font-semibold text-ink">{group.label}</h3>
              <ul className="mt-5 space-y-3 font-code text-sm text-muted">
                {group.items.map((item) => <li key={item}><span className="mr-2 text-primary">/</span>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
