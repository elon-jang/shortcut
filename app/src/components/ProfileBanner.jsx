import { ShieldCheck, Target, Award } from 'lucide-react';

export const ProfileBanner = ({ levelProgress, userData, isTodayComplete, masteryStats }) => {
  const { total, mastered } = masteryStats || { total: 0, mastered: 0 };
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 via-slate-800/80 to-slate-900/80 border border-indigo-500/15 rounded-2xl p-4 md:p-5 mb-5 flex items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-indigo-500/20">
            <ShieldCheck size={24} className="text-indigo-400" />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-slate-800">
            LV.{levelProgress.level}
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base md:text-lg font-black tracking-tight truncate">{levelProgress.title}</h3>
            <span className="text-xs md:text-sm text-slate-500 font-medium shrink-0">{userData.xp} XP</span>
          </div>
          <div className="w-40 md:w-52 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{ width: `${levelProgress.xpInLevel}%` }}
            />
          </div>
          <p className="text-[9px] md:text-[11px] text-slate-600 mt-1 font-medium">
            Next: {100 - levelProgress.xpInLevel} XP
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {mastered > 0 && (
          <div className="bg-slate-900/60 px-3 py-2 rounded-xl text-center border border-emerald-500/20">
            <Award size={14} className="mx-auto mb-0.5 text-emerald-400" />
            <p className="text-[10px] md:text-xs font-black text-emerald-400">{mastered}<span className="text-slate-600">/{total}</span></p>
          </div>
        )}
        <div className="bg-slate-900/60 px-3 py-2 rounded-xl text-center border border-slate-700/50">
          <Target size={14} className={`mx-auto mb-0.5 ${isTodayComplete ? 'text-green-400' : 'text-slate-600'}`} />
          <p className={`text-[10px] md:text-xs font-black ${isTodayComplete ? 'text-green-400' : 'text-slate-500'}`}>
            {isTodayComplete ? 'DONE' : 'READY'}
          </p>
        </div>
      </div>
    </div>
  );
};
