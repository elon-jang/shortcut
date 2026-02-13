import { Eye } from 'lucide-react';

export const FlashcardMode = ({ answer, flipped, feedback, onFlip, onCorrect, onSkip }) => {
  return (
    <div className="perspective-2000 relative z-50 min-h-[140px] md:min-h-[160px]">
      <div className={`relative w-full h-full min-h-[140px] md:min-h-[160px] transition-all duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front - reveal button */}
        <div
          onClick={() => !feedback && onFlip()}
          className={`absolute inset-0 backface-hidden bg-slate-900/60 rounded-xl border-2 border-dashed border-slate-700/60 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-500/50 transition-all group z-20 ${flipped ? 'pointer-events-none invisible' : 'pointer-events-auto visible'}`}
        >
          <div className="bg-slate-800 p-4 rounded-full group-hover:bg-indigo-600/15 transition-all border border-slate-700/50">
            <Eye size={28} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
          </div>
          <span className="text-sm md:text-base font-bold text-slate-500 group-hover:text-slate-300 transition-colors">정답 확인</span>
          <span className="text-[11px] text-slate-600 font-mono">Space</span>
        </div>

        {/* Back - answer */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-slate-900/90 rounded-xl border-2 border-indigo-500/50 flex flex-col items-center justify-center gap-4 shadow-[0_0_30px_rgba(99,102,241,0.15)] z-30 ${!flipped ? 'pointer-events-none invisible' : 'pointer-events-auto visible'}`}>
          <span className="text-2xl md:text-3xl font-mono font-black text-indigo-400 tracking-tight">
            {answer}
          </span>
          <div className="flex gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onSkip(); }}
              className="px-5 py-2 md:px-6 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm md:text-base font-bold border border-slate-700 transition-all text-slate-300 active:scale-95 flex items-center gap-2"
            >
              <span className="text-[10px] text-slate-500 font-mono">&larr;</span>
              다음에
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onCorrect(); }}
              className="px-5 py-2 md:px-6 bg-green-600 hover:bg-green-500 rounded-xl text-sm md:text-base font-bold transition-all text-white active:scale-95 flex items-center gap-2"
            >
              외웠어요
              <span className="text-[10px] text-green-300/50 font-mono">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
