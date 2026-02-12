import { ShieldCheck, Target } from 'lucide-react';

export const ProfileBanner = ({ levelProgress, userData, isTodayComplete }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900/50 via-slate-800 to-slate-900 border border-indigo-500/20 rounded-[2.5rem] p-10 mb-12 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl relative">
      <div className="flex items-center gap-8">
        <div className="relative">
          <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center border-2 border-indigo-500/30 shadow-inner">
            <ShieldCheck size={48} className="text-indigo-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 text-sm font-black px-3.5 py-1.5 rounded-xl shadow-lg border-2 border-slate-800">
            LV.{levelProgress.level}
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-black mb-1.5 tracking-tight">{levelProgress.title}</h3>
          <p className="text-slate-400 font-medium mb-4">{userData.xp} XP 숙련도</p>
          <div className="w-64 h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{ width: `${levelProgress.xpInLevel}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2.5 uppercase font-black tracking-[0.2em]">
            Next Rank: {100 - levelProgress.xpInLevel} XP Left
          </p>
        </div>
      </div>
      <div className="bg-slate-900/80 p-6 rounded-[2rem] text-center min-w-[140px] border border-slate-700 shadow-xl">
        <Target size={28} className="mx-auto text-green-400 mb-2.5" />
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
        <p className={`text-lg font-black ${isTodayComplete ? 'text-green-400' : 'text-slate-500'}`}>
          {isTodayComplete ? 'COMPLETE' : 'READY'}
        </p>
      </div>
    </div>
  );
};
