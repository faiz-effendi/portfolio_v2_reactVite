import { ArrowDownRight, Download, MapPin } from 'lucide-react';
import data from '../data/portfolio_data.json';
import cvFile from '../data/NandisyaFaiz_CV.pdf';

const Hero = () => {
  const { personal, stats, capabilities } = data;

  return (
    <section id="about" className="border-b border-hairline pt-16">
      <div className="page-container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6">{personal.role}</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-ink sm:text-6xl lg:text-7xl">
            Faiz Effendi<span className="text-primary">.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-body md:text-xl">{personal.tagline}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="button-primary">Explore selected work <ArrowDownRight size={17} /></a>
            <a href={cvFile} download="CV_FaizEffendi.pdf" className="button-secondary">Download résumé <Download size={17} /></a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-code text-xs text-muted">
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-success" />{personal.availability}</span>
            <span className="flex items-center gap-2"><MapPin size={14} />{personal.location}</span>
          </div>
        </div>

        <aside className="overflow-hidden rounded-lg border border-hairline bg-surface-card lg:col-span-5" aria-label="Selected outcomes">
          <div className="flex items-center gap-2 border-b border-hairline px-5 py-4 font-code text-xs text-muted">
            <span className="size-2 rounded-full bg-primary" /> evidence.json
          </div>
          <div className="grid grid-cols-2">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`p-5 sm:p-6 ${index % 2 === 0 ? 'border-r border-hairline' : ''} ${index < 2 ? 'border-b border-hairline' : ''}`}>
                <strong className="block text-3xl font-bold tracking-[-0.04em] text-primary sm:text-4xl">{stat.value}</strong>
                <span className="mt-2 block text-sm leading-snug text-muted">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-hairline p-5 sm:p-6">
            <p className="mb-4 font-code text-xs uppercase tracking-widest text-muted">Working across</p>
            <div className="flex flex-wrap gap-2">
              {capabilities.flatMap((group) => group.items).slice(0, 7).map((item) => (
                <span key={item} className="rounded-xs border border-hairline-strong bg-surface-elevated px-2.5 py-1.5 font-code text-xs text-body">{item}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Hero;
