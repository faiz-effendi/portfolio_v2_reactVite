import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Download } from 'lucide-react';
import { SiReact, SiPython, SiTensorflow, SiTailwindcss, SiNodedotjs } from 'react-icons/si';
import data from '../data/portfolio_data.json';
import cvFile from '../data/NandisyaFaiz_CV.pdf';

const iconMap = {
  Code: <SiReact size={24} color="#61DAFB" />,
  Terminal: <SiPython size={24} color="#3776AB" />,
  Cpu: <SiTensorflow size={24} color="#FF6F00" />,
  Palette: <SiTailwindcss size={24} color="#06B6D4" />,
  Server: <SiNodedotjs size={24} color="#339933" />
};

const Hero = () => {
  const { personal, skills } = data;

  return (
    <section id="about" className="min-h-screen flex items-center justify-center section-container pt-36 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm font-medium mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            {personal.role}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold font-sans tracking-normal mb-6"
        >
          Hi, I'm <span className="font-montserrat text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">{personal.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10"
        >
          {personal.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-14"
        >
          <a href="#projects" className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2 group">
            View My Work
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={cvFile}
            download="CV_FaizEffendi.pdf"
            className="px-8 py-3 rounded-full bg-slate-800 text-white font-medium hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            Download Resume
            <Download size={18} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full"
        >
          <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-wider">Tech Stack</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/50 transition-all duration-300">
                  {iconMap[skill.icon] || <Code size={24} />}
                </div>
                <span className="text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
