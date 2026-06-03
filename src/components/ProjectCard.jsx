import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10" />
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-slate-400 text-sm mb-6 flex-grow">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech, idx) => (
            <span key={idx} className="px-2.5 py-1 text-xs font-medium text-primary bg-primary/10 rounded-md border border-primary/20">
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-primary transition-colors mt-auto"
        >
          View Project <ExternalLink size={16} />
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
