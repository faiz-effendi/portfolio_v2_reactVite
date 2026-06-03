import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-darker/80 backdrop-blur-md border-b border-slate-800/50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-xl font-bold tracking-tighter">
          <span className="text-primary">Faiz</span> Effendi.
        </a>
        <div className="hidden md:flex gap-8">
          <a href="#about" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">About</a>
          <a href="#experience" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">Experience</a>
          <a href="#projects" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">Projects</a>
          <a href="#contact" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
