import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../data/portfolio_data.json';
import ProjectCard from './ProjectCard';
import { Layers } from 'lucide-react';

const ProjectSection = ({ onViewDetails }) => {
  const [activeTab, setActiveTab] = useState('aiml');
  
  const { projects } = data;

  const currentProjects = projects[activeTab];

  return (
    <section id="projects" className="w-full bg-slate-900/30 backdrop-blur-xs border-y border-slate-800/30">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 text-primary mb-2"
          >
            <Layers size={24} />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Projects</h2>
          </motion.div>
          <p className="text-slate-400 text-center max-w-2xl mb-6">A selection of my best work across different domains.</p>

          {/* Custom Toggle */}
          <div className="flex p-1 bg-slate-800/80 rounded-full border border-slate-700/50 backdrop-blur-sm relative">
            <button
              onClick={() => setActiveTab('aiml')}
              className={`relative z-10 flex-1 px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${activeTab === 'aiml' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <span className="sm:hidden">AI / ML</span>
              <span className="hidden sm:inline">AI & Machine Learning</span>
            </button>
            <button
              onClick={() => setActiveTab('software_dev')}
              className={`relative z-10 flex-1 px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${activeTab === 'software_dev' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <span className="sm:hidden">Software Dev</span>
              <span className="hidden sm:inline">Software Development</span>
            </button>

            {/* Animated Highlight Background */}
            <div className="absolute top-1 bottom-1 left-1 right-1 flex pointer-events-none">
              <motion.div
                layout
                className="bg-primary rounded-full w-1/2 h-full shadow-lg"
                initial={false}
                animate={{
                  x: activeTab === 'aiml' ? 0 : '100%'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
        </div>

        <motion.div layout className={`grid gap-8 mx-auto ${currentProjects.length === 1 ? 'grid-cols-1 max-w-md' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl'}`}>
          <AnimatePresence mode='wait'>
            {currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onViewDetails={onViewDetails} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectSection;
