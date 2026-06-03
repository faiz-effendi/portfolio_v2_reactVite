import React from 'react';
import { motion } from 'framer-motion';
import data from '../data/portfolio_data.json';
import { Briefcase } from 'lucide-react';

const Experience = () => {
  const { experience } = data;

  return (
    <section id="experience" className="section-container">
      <div className="flex flex-col items-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 text-primary mb-4"
        >
          <Briefcase size={24} />
          <h2 className="text-3xl md:text-4xl font-bold text-white">Work Experience</h2>
        </motion.div>
        <p className="text-slate-400 text-center max-w-2xl">My professional journey and roles I've taken on.</p>
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Timeline Line */}
        <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-800 -translate-x-1/2 rounded-full" />

        {experience.map((exp, index) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col md:flex-row gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Timeline Dot */}
            <div className="absolute left-[27px] md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 mt-6 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
            
            {/* Content Box */}
            <div className="pl-16 md:pl-0 w-full md:w-1/2 md:px-8 group">
              <div className="glass-card rounded-2xl p-6 group-hover:border-primary/30 transition-colors">
                <div className="text-sm font-semibold text-primary mb-2">{exp.duration}</div>
                <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                <h4 className="text-md text-slate-300 font-medium mb-4">{exp.company}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
