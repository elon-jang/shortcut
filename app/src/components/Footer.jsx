import { ExternalLink } from 'lucide-react';

export const Footer = ({ onHelpClick }) => {
  return (
    <footer className="mt-10 border-t border-slate-800/60 pt-4 pb-6 flex justify-between items-center text-slate-600 text-[10px] font-medium tracking-wider">
      <p>© 2026 Shortcut Pro</p>
      <div className="flex items-center gap-3">
        <button
          onClick={onHelpClick}
          className="hover:text-indigo-400 transition-colors font-mono"
        >
          ? Shortcuts
        </button>
        <a
          href="https://github.com/elon-jang/shortcut"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
        >
          GitHub <ExternalLink size={10} />
        </a>
      </div>
    </footer>
  );
};
