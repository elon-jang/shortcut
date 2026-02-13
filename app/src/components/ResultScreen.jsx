import { Trophy, RotateCcw, Layers, Home, Download, ArrowUp, ArrowDown } from 'lucide-react';

export const ResultScreen = ({ activeCategory, score, timer, missCount = 0, totalQuestions = 0, onRestart, onModeSelect, onMenu, sessionResults = [], onExport }) => {
  const accuracy = totalQuestions > 0 ? Math.round(((totalQuestions - missCount) / totalQuestions) * 100) : 100;
  const correctCount = sessionResults.filter(r => r.correct).length;
  const wrongCount = sessionResults.filter(r => !r.correct).length;

  return (
    <div className="max-w-md md:max-w-lg mx-auto bg-slate-800/90 border border-slate-700 rounded-2xl p-6 md:p-8 text-center animate-in zoom-in-95 duration-500 shadow-xl">
      <div className="inline-flex p-4 bg-yellow-500/10 rounded-2xl mb-4 border border-yellow-500/15 text-yellow-500">
        <Trophy size={36} />
      </div>
      <h2 className="text-2xl md:text-3xl font-black mb-1 tracking-tight text-white">수련 완료</h2>
      <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-5">{activeCategory?.name}</p>

      <div className="grid grid-cols-3 gap-2.5 md:gap-3 mb-5">
        <div className="bg-slate-900/60 p-3 md:p-4 rounded-xl border border-slate-700/50">
          <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">XP</p>
          <p className="text-xl md:text-2xl font-mono font-black text-indigo-400 tabular-nums">+{score}</p>
        </div>
        <div className="bg-slate-900/60 p-3 md:p-4 rounded-xl border border-slate-700/50">
          <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">TIME</p>
          <p className="text-xl md:text-2xl font-mono font-black text-emerald-400 tabular-nums">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </p>
        </div>
        <div className="bg-slate-900/60 p-3 md:p-4 rounded-xl border border-slate-700/50">
          <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">ACCURACY</p>
          <p className={`text-xl md:text-2xl font-mono font-black tabular-nums ${missCount === 0 ? 'text-yellow-400' : 'text-red-400'}`}>{accuracy}%</p>
        </div>
      </div>

      {/* Session shortcut results */}
      {sessionResults.length > 0 && (
        <div className="mb-5 text-left">
          <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 text-center">단축키별 결과</p>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {sessionResults.map((r, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm ${
                r.correct ? 'bg-green-500/8 border border-green-500/15' : 'bg-red-500/8 border border-red-500/15'
              }`}>
                <span className={`shrink-0 text-[10px] font-bold ${r.correct ? 'text-green-400' : 'text-red-400'}`}>
                  {r.correct ? 'O' : 'X'}
                </span>
                <span className="truncate flex-1 text-slate-300">{r.action}</span>
                <span className="font-mono text-slate-400 shrink-0 text-[11px]">{r.keys}</span>
                {r.newBox !== r.prevBox && (
                  <span className={`shrink-0 flex items-center gap-0.5 text-[10px] font-bold ${
                    r.newBox > r.prevBox ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {r.newBox > r.prevBox ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                    Box {r.newBox}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cross nudge */}
      <div className="mb-4 px-3 py-2 bg-indigo-500/8 border border-indigo-500/15 rounded-lg">
        <p className="text-[10px] md:text-xs text-indigo-300/70">
          터미널에서 <span className="font-mono text-indigo-400">/shortcut-learn</span>으로 복습하면 장기 기억으로 정착됩니다
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={onRestart}
          className="w-full py-2.5 md:py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
        >
          <RotateCcw size={14} /> 다시 수련
          <span className="text-[10px] text-indigo-300/40 font-mono ml-1">Enter</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={onModeSelect}
            className="flex-1 py-2.5 md:py-3 bg-slate-700/80 hover:bg-slate-600 rounded-xl font-bold text-sm md:text-base border border-slate-600/50 transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
          >
            <Layers size={14} /> 모드 선택
            <span className="text-[10px] text-slate-500 font-mono ml-0.5">Esc</span>
          </button>
          <button
            onClick={onMenu}
            className="flex-1 py-2.5 md:py-3 bg-slate-800/80 hover:bg-slate-700 rounded-xl font-bold text-sm md:text-base border border-slate-700/50 transition-all flex items-center justify-center gap-2 active:scale-[0.97] text-slate-400"
          >
            <Home size={14} /> 메뉴
          </button>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="w-full py-2 bg-slate-900/60 hover:bg-slate-800 rounded-xl text-xs md:text-sm font-bold border border-slate-700/50 transition-all flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 active:scale-[0.97]"
          >
            <Download size={12} /> Export Progress
          </button>
        )}
      </div>
    </div>
  );
};
