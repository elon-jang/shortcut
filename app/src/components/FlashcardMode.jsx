import { Star } from 'lucide-react';

export const FlashcardMode = ({ answer, flipped, feedback, onFlip, onCorrect, onSkip }) => {
  return (
    <div className="perspective-2000 mt-10 relative z-50 min-h-[300px]">
      <div className={`relative w-full h-full min-h-[300px] transition-all duration-700 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* 앞면 - 정답 확인 버튼 */}
        <div
          onClick={() => !feedback && onFlip()}
          className={`absolute inset-0 backface-hidden bg-slate-900/90 rounded-[4rem] border-4 border-dashed border-slate-700 flex flex-col items-center justify-center gap-10 cursor-pointer hover:border-indigo-500 hover:bg-slate-900 transition-all group shadow-2xl z-20 ${flipped ? 'pointer-events-none invisible' : 'pointer-events-auto visible'}`}
        >
          <div className="bg-slate-800 p-10 rounded-full group-hover:bg-indigo-600/20 transition-all shadow-2xl border-2 border-slate-700">
            <Star size={64} className="text-slate-600 group-hover:text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-slate-500 uppercase tracking-[0.5em] group-hover:text-slate-300">정답 확인하기</span>
        </div>

        {/* 뒷면 - 정답 표시 */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-[#151a30] rounded-[4rem] border-4 border-indigo-500 flex flex-col items-center justify-center gap-14 shadow-[0_0_80px_rgba(99,102,241,0.4)] z-30 ${!flipped ? 'pointer-events-none invisible' : 'pointer-events-auto visible'}`}>
          <span className="text-7xl font-mono font-black text-indigo-400 drop-shadow-[0_0_20px_rgba(99,102,241,0.7)] tracking-tighter">
            {answer}
          </span>
          <div className="flex gap-10">
            <button
              onClick={(e) => { e.stopPropagation(); onCorrect(); }}
              className="px-16 py-6 bg-green-600 hover:bg-green-500 rounded-[2.5rem] text-2xl font-black shadow-[0_20px_50px_rgba(34,197,94,0.5)] transform hover:scale-110 active:scale-95 transition-all text-white border-b-8 border-green-800"
            >
              외웠어요!
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onSkip(); }}
              className="px-16 py-6 bg-slate-800 hover:bg-slate-700 rounded-[2.5rem] text-2xl font-black border-4 border-slate-700 transform hover:scale-110 active:scale-95 transition-all text-slate-300 shadow-2xl"
            >
              다음에 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
