import { Keyboard } from 'lucide-react';

export const TypingMode = ({ pressedKeys }) => {
  const keysArray = Array.from(pressedKeys);

  return (
    <div className="py-14 min-h-[220px] flex flex-col items-center justify-center bg-slate-900/60 rounded-[4rem] border-2 border-slate-700 shadow-inner">
      <div className="flex flex-wrap justify-center gap-6">
        {keysArray.length === 0 ? (
          <div className="flex flex-col items-center gap-6">
            <Keyboard size={70} className="text-slate-700 animate-pulse" />
            <p className="text-slate-500 font-black uppercase text-lg tracking-[0.4em]">직접 단축키를 누르세요</p>
          </div>
        ) : (
          keysArray.map((k, i) => (
            <span key={k} className="flex items-center">
              <kbd className="px-10 py-5 bg-slate-800 border-b-8 border-slate-950 rounded-2xl font-mono text-5xl font-black shadow-2xl text-indigo-400 transform translate-y-[-8px]">
                {k}
              </kbd>
              {i < keysArray.length - 1 && (
                <span className="text-slate-700 text-7xl flex items-center font-black mx-1">+</span>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  );
};
