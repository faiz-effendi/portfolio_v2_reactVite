import { ArrowUpRight, Mail } from 'lucide-react';
import data from '../data/portfolio_data.json';

const Footer = () => {
  const { personal } = data;

  return (
    <footer id="contact" className="bg-canvas">
      <div className="section-container">
        <div className="rounded-lg bg-primary p-7 text-on-primary sm:p-10 md:p-14">
          <p className="font-code text-xs font-semibold uppercase tracking-[0.14em]">Start a conversation</p>
          <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl">Have a problem worth building for?</h2>
            <a href={`mailto:${personal.email}`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-on-primary px-5 py-3 text-sm font-semibold text-primary hover:bg-surface-elevated">
              Email me <Mail size={17} />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-6 border-t border-hairline pt-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-code text-sm font-semibold text-ink">Faiz Effendi</p>
            <p className="mt-2 text-sm text-muted">Data scientist & software developer · {personal.location}</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-muted">
            <a href={personal.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-ink">GitHub <ArrowUpRight size={14} /></a>
            <a href={personal.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-ink">LinkedIn <ArrowUpRight size={14} /></a>
            <a href={personal.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-ink">Instagram <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
