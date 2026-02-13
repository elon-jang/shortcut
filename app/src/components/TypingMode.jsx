import { Keyboard } from 'lucide-react';

export const TypingMode = ({ pressedKeys }) => {
  const keysArray = Array.from(pressedKeys);

  return (
    <div className="py-5 md:py-6 min-h-[80px] md:min-h-[100px] flex flex-col items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700/50">
      <div className="flex flex-wrap justify-center gap-2">
        {keysArray.length === 0 ? (
          <div className="flex flex-col items-center gap-2">
            <Keyboard size={24} className="text-slate-700 animate-pulse" />
            <p className="text-slate-500 font-bold text-[11px] md:text-sm uppercase tracking-[0.2em]">단축키를 누르세요</p>
          </div>
        ) : (
          keysArray.map((k, i) => (
            <span key={k} className="flex items-center">
              <kbd className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-800 border-b-2 border-slate-950 rounded-lg font-mono text-lg md:text-xl font-black text-indigo-400">
                {k}
              </kbd>
              {i < keysArray.length - 1 && (
                <span className="text-slate-700 text-lg font-black mx-0.5">+</span>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  );
};
