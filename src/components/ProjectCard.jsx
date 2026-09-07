import { ArrowUpRight, Eye } from 'lucide-react';

const ProjectCard = ({ project, onViewDetails, featured = false }) => {
  const openProjectDetails = () => onViewDetails(project);

  const handleCardKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectDetails();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} case study`}
      onClick={openProjectDetails}
      onKeyDown={handleCardKeyDown}
      className={`group cursor-pointer overflow-hidden rounded-lg border border-hairline bg-surface-card transition-colors hover:border-hairline-strong focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${featured ? 'lg:grid lg:grid-cols-12' : 'flex h-full flex-col'}`}
    >
      <div className={`overflow-hidden border-hairline bg-surface-soft ${featured ? 'min-h-72 border-b lg:col-span-7 lg:border-b-0 lg:border-r' : 'aspect-[16/10] border-b'}`}>
        <img src={project.image} alt={`${project.title} project preview`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
      </div>

      <div className={`flex flex-col ${featured ? 'p-7 sm:p-10 lg:col-span-5' : 'flex-1 p-6'}`}>
        <div className="flex items-center justify-between gap-4">
          <span className="font-code text-xs uppercase tracking-widest text-primary">{featured ? 'Featured case study' : 'Selected project'}</span>
          <span className="font-code text-xs text-muted">0{project.id}</span>
        </div>
        <h3 className={`mt-6 font-bold tracking-[-0.035em] text-ink ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{project.title}</h3>
        <p className="mt-4 flex-1 leading-relaxed text-body">{project.description}</p>
        <div className="mt-7 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-xs border border-hairline-strong px-2.5 py-1.5 font-code text-xs text-muted">{tech}</span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openProjectDetails();
            }}
            className="button-primary"
          >
            View case study <Eye size={16} />
          </button>
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="button-secondary" onClick={(event) => event.stopPropagation()}>
              External link <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
