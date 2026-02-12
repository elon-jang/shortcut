import { Trophy, RefreshCw } from 'lucide-react';

export const ResultScreen = ({ activeCategory, score, timer, onRestart, onMenu }) => {
  return (
    <div className="max-w-3xl mx-auto bg-slate-800 border-2 border-slate-700 rounded-[6rem] p-24 text-center animate-in zoom-in-95 duration-700 shadow-[0_40px_120px_rgba(0,0,0,0.8)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600" />
      <div className="inline-block p-14 bg-yellow-500/10 rounded-[4rem] mb-14 border-4 border-yellow-500/20 text-yellow-500 shadow-2xl animate-pulse">
        <Trophy size={140} />
      </div>
      <h2 className="text-8xl font-black mb-6 tracking-tighter italic drop-shadow-2xl text-white">LEGENDARY</h2>
      <p className="text-slate-400 mb-20 font-black uppercase tracking-[0.6em] text-xl">{activeCategory?.name} 수련 완수</p>

      <div className="grid grid-cols-2 gap-10 mb-20">
        <div className="bg-slate-900/90 p-14 rounded-[4rem] border-4 border-slate-700 shadow-inner group hover:border-indigo-500 transition-all">
          <p className="text-base text-slate-500 font-black uppercase tracking-[0.4em] mb-4 group-hover:text-indigo-400">EARNED XP</p>
          <p className="text-7xl font-mono font-black text-indigo-400 tabular-nums">+{score}</p>
        </div>
        <div className="bg-slate-900/90 p-14 rounded-[4rem] border-4 border-slate-700 shadow-inner group hover:border-emerald-500 transition-all">
          <p className="text-base text-slate-500 font-black uppercase tracking-[0.4em] mb-4 group-hover:text-emerald-400">TIME</p>
          <p className="text-7xl font-mono font-black text-emerald-400 tabular-nums">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <button
          onClick={onRestart}
          className="py-8 bg-indigo-600 hover:bg-indigo-500 rounded-[3rem] font-black transition-all flex items-center justify-center gap-6 shadow-[0_30px_80px_rgba(79,70,229,0.5)] transform hover:scale-105 active:scale-95 text-3xl border-b-8 border-indigo-900"
        >
          <RefreshCw size={40} /> 다시 수련하기
        </button>
        <button
          onClick={onMenu}
          className="py-8 bg-slate-700 hover:bg-slate-600 rounded-[3rem] font-black border-4 border-slate-600 transform hover:scale-105 active:scale-95 text-3xl shadow-2xl"
        >
          메인 메뉴
        </button>
      </div>
    </div>
  );
};
