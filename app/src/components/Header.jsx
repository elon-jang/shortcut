import { Rocket, Flame, Home } from 'lucide-react';

export const Header = ({ streak, showHomeButton, onHomeClick }) => {
  return (
    <header className="flex justify-between items-center mb-5">
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={onHomeClick}
      >
        <div className="bg-indigo-600 p-2 rounded-xl shadow-[0_0_12px_rgba(79,70,229,0.3)] group-hover:scale-105 transition-all">
          <Rocket size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black tracking-tighter italic leading-none">
            SHORTCUT PRO
          </h1>
          <p className="text-[9px] md:text-[11px] text-indigo-400 font-bold tracking-[0.25em] uppercase mt-0.5">
            Legend Edition
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-lg">
          <Flame size={14} className="text-orange-500" />
          <span className="text-xs md:text-sm font-bold tracking-wide text-slate-300">{streak}일 연속</span>
        </div>
        {showHomeButton && (
          <button
            onClick={onHomeClick}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all border border-slate-700"
          >
            <Home size={16} className="text-slate-400 hover:text-white transition-colors" />
          </button>
        )}
      </div>
    </header>
  );
};
