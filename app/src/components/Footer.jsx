import { Flame, ExternalLink } from 'lucide-react';

export const Footer = ({ streak }) => {
  return (
    <footer className="mt-48 border-t border-slate-800 pt-20 pb-24 flex flex-col md:flex-row justify-between items-center gap-14 text-slate-600 text-sm font-black uppercase tracking-[0.6em] opacity-80">
      <p className="text-center md:text-left leading-relaxed">
        © 2026 Shortcut Pro. Legend Edition.<br />
        For the masters of keyboard.
      </p>
      <div className="flex items-center gap-16">
        <a
          href="https://github.com/elon-jang/shortcut"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-indigo-400 transition-all flex items-center gap-4 transform hover:translate-y-[-8px]"
        >
          GITHUB <ExternalLink size={24} />
        </a>
        <div className="flex items-center gap-5 bg-slate-800/60 px-10 py-5 rounded-[2.5rem] border border-slate-700 text-indigo-500 shadow-2xl">
          <Flame size={26} fill="currentColor" />
          <span className="text-lg tracking-widest font-black">STREAK: {streak}D</span>
        </div>
      </div>
    </footer>
  );
};
