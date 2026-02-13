export const ChoiceMode = ({ options, correctAnswer, feedback, onAnswer }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:gap-3 relative z-50">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onAnswer(opt === correctAnswer)}
          disabled={!!feedback}
          className={`px-3 py-3 md:py-3.5 rounded-xl border font-mono text-sm md:text-base font-bold transition-all select-none text-left flex items-center gap-2.5 ${
            feedback === 'correct' && opt === correctAnswer
              ? 'bg-green-600/80 border-green-400 text-white'
              : feedback === 'retry' && opt !== correctAnswer
              ? 'bg-slate-700/30 border-slate-700 opacity-30'
              : 'bg-slate-900/50 border-slate-700/60 hover:border-indigo-500/60 hover:bg-slate-800 active:scale-[0.97] text-slate-200'
          }`}
        >
          <span className={`text-xs md:text-sm font-mono shrink-0 ${
            feedback === 'correct' && opt === correctAnswer
              ? 'text-green-200'
              : 'text-slate-500'
          }`}>
            {i + 1}
          </span>
          <span className="truncate">{opt}</span>
        </button>
      ))}
    </div>
  );
};
