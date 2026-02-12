export const ChoiceMode = ({ options, correctAnswer, feedback, onAnswer }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-50">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onAnswer(opt === correctAnswer)}
          disabled={!!feedback}
          className={`p-8 rounded-[2.5rem] border-2 font-mono text-2xl font-black transition-all shadow-xl pointer-events-auto select-none ${
            feedback === 'correct' && opt === correctAnswer
              ? 'bg-green-600 border-green-400 text-white translate-y-[-8px] shadow-green-500/20'
              : feedback === 'retry' && opt !== correctAnswer
              ? 'bg-slate-700/50 border-slate-700 opacity-40'
              : 'bg-[#1e293b] border-slate-700 hover:border-indigo-500 hover:bg-slate-700 hover:translate-y-[-10px] active:scale-95 text-slate-200'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
