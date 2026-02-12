import { Rocket, Flame, Home } from 'lucide-react';

export const Header = ({ streak, showHomeButton, onHomeClick }) => {
  return (
    <header className="flex justify-between items-center mb-12">
      <div 
        className="flex items-center gap-4 cursor-pointer group" 
        onClick={onHomeClick}
      >
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-105 transition-all">
          <Rocket size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter italic leading-none">
            SHORTCUT PRO
          </h1>
          <p className="text-[11px] text-indigo-400 font-bold tracking-[0.3em] uppercase mt-1.5">
            Legend Edition
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 bg-slate-800/80 backdrop-blur-md border border-slate-700 px-5 py-2.5 rounded-2xl shadow-lg">
          <Flame size={18} className="text-orange-500 animate-pulse" />
          <span className="text-sm font-black tracking-wide">{streak}일 연속 학습</span>
        </div>
        {showHomeButton && (
          <button 
            onClick={onHomeClick} 
            className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 shadow-xl group"
          >
            <Home size={22} className="group-hover:scale-110 transition-all" />
          </button>
        )}
      </div>
    </header>
  );
};
