import React from 'react';
import { Mail } from 'lucide-react';
import data from '../data/portfolio_data.json';

const Footer = () => {
  const { personal } = data;

  return (
    <footer id="contact" className="border-t border-slate-800/50 bg-darker/50 backdrop-blur-sm pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Let's Connect</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          I'm currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>

        <a
          href={`mailto:${personal.email}`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-600 text-white font-medium rounded-full transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-8"
        >
          <Mail size={20} />
          Email to Say Hello
        </a>

        <div className="flex justify-center items-center gap-6 text-sm font-medium">
          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-all hover:tracking-wider duration-300"
          >
            GitHub
          </a>
          <span className="text-slate-800">•</span>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-cyan-400 transition-all hover:tracking-wider duration-300"
          >
            LinkedIn
          </a>
          <span className="text-slate-800">•</span>
          <a
            href={`${personal.instagram}`}
            className="text-slate-400 hover:text-cyan-400 transition-all hover:tracking-wider duration-300"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
