import { useMemo, useState } from 'react';
import data from '../data/portfolio_data.json';
import ProjectCard from './ProjectCard';

const filters = [
  { id: 'all', label: 'All work' },
  { id: 'aiml', label: 'AI & ML' },
  { id: 'software_dev', label: 'Software development' },
];

const ProjectSection = ({ onViewDetails }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const projects = useMemo(() => Object.values(data.projects).flat(), []);
  const visibleProjects = activeFilter === 'all' ? projects : data.projects[activeFilter];

  return (
    <section id="projects" className="border-y border-hairline bg-surface-soft">
      <div className="section-container">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-[-0.045em] text-ink md:text-5xl">Systems built to solve real problems.</h2>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter projects">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={activeFilter === filter.id}
                className={`min-h-10 rounded-md px-4 font-code text-xs transition-colors ${activeFilter === filter.id ? 'bg-surface-card text-ink ring-1 ring-hairline-strong' : 'text-muted hover:text-ink'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-6">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={onViewDetails}
              featured
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
