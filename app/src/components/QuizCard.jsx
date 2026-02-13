import { Heart, Timer, Info, ArrowLeft } from 'lucide-react';
import { SHORTCUT_DATA } from '../data/shortcuts';
import { ChoiceMode } from './ChoiceMode';
import { TypingMode } from './TypingMode';
import { FlashcardMode } from './FlashcardMode';
import { FeedbackOverlay } from './FeedbackOverlay';

export const QuizCard = ({
  currentMode,
  currentIndex,
  activeQuestions,
  activeCategory,
  lives,
  timer,
  score,
  combo,
  feedback,
  options,
  pressedKeys,
  cardFlipped,
  onAnswer,
  onFlipCard,
  onNextQuestion,
  onBack
}) => {
  const question = activeQuestions[currentIndex];
  if (!question) return null;

  return (
    <div className="max-w-lg md:max-w-xl mx-auto flex flex-col items-center animate-in fade-in duration-300">
      {/* Stats bar */}
      <div className="w-full flex justify-between items-center mb-3 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-slate-600 hover:text-indigo-400 transition-colors mr-1"
            title="모드 선택으로 (Esc)"
          >
            <ArrowLeft size={14} />
          </button>
          {lives > 0 ? (
            <div className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/15 text-[11px] md:text-xs font-bold">
              <Heart size={10} fill="#ef4444" /> MISS {lives}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/15 text-[11px] md:text-xs font-bold">
              <Heart size={10} fill="#22c55e" /> PERFECT
            </div>
          )}
          <div className="flex items-center gap-1 text-[11px] md:text-xs font-bold text-indigo-400 bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-700/50">
            <Timer size={10} /> {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">SCORE</p>
          <p className="text-lg md:text-xl font-black text-indigo-400 leading-none tabular-nums">{score}</p>
        </div>
      </div>

      {/* Typing mode OS shortcut notice */}
      {currentMode === 'typing' && currentIndex === 0 && (() => {
        const all = SHORTCUT_DATA[activeCategory?.id] || [];
        const skipped = all.length - activeQuestions.length;
        if (skipped <= 0) return null;
        return (
          <div className="w-full flex items-center gap-1.5 px-3 py-1.5 mb-2.5 bg-amber-500/8 border border-amber-500/15 rounded-lg text-amber-400 text-[10px] md:text-xs font-medium">
            <Info size={11} className="shrink-0" />
            <span>OS/특수 단축키 {skipped}개 제외</span>
          </div>
        );
      })()}

      {/* Progress bar */}
      <div className="w-full h-1 bg-slate-800/80 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(currentIndex / activeQuestions.length) * 100}%` }}
        />
      </div>

      {/* Main quiz card */}
      <div className={`w-full bg-slate-800/90 border rounded-2xl px-6 py-5 md:px-8 md:py-6 text-center shadow-lg relative transition-all duration-300 ${
        feedback === 'correct' ? 'border-green-500/60 shadow-green-500/10' :
        feedback === 'retry' ? 'border-yellow-500/60 animate-shake' :
        feedback === 'wrong' ? 'border-red-500/60 shadow-red-500/10' : 'border-slate-700/60'
      }`}>
        {/* App badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${activeCategory?.color || 'bg-slate-900'} border border-white/10 rounded-lg text-white mb-3`}>
          <span className="text-sm md:text-base">{activeCategory?.icon}</span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">{activeCategory?.name}</span>
        </div>

        {/* Combo badge */}
        {combo > 1 && (
          <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-lg text-[10px] md:text-xs font-black animate-bounce shadow-md">
            {combo} COMBO
          </div>
        )}

        <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-[0.3em] mb-1.5 opacity-70">
          {currentIndex + 1} / {activeQuestions.length}
        </p>
        <h2 className="text-lg md:text-xl font-black mb-5 md:mb-6 leading-snug tracking-tight text-white break-keep">
          {question.action}
        </h2>

        {/* Wrong answer display */}
        {feedback === 'wrong' && (
          <div className="mb-4 py-2 px-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-[10px] md:text-xs font-bold mb-0.5">정답</p>
            <p className="text-white text-base md:text-lg font-mono font-black">{question.keys}</p>
          </div>
        )}

        {/* Mode-specific UI */}
        {currentMode === 'choice' && (
          <ChoiceMode
            options={options}
            correctAnswer={question.keys}
            feedback={feedback}
            onAnswer={onAnswer}
          />
        )}

        {currentMode === 'typing' && feedback !== 'wrong' && (
          <TypingMode pressedKeys={pressedKeys} />
        )}

        {currentMode === 'flashcard' && (
          <FlashcardMode
            answer={question.keys}
            flipped={cardFlipped}
            feedback={feedback}
            onFlip={onFlipCard}
            onCorrect={() => onAnswer(true)}
            onSkip={onNextQuestion}
          />
        )}
      </div>

      {/* Feedback overlay */}
      <FeedbackOverlay feedback={feedback} />
    </div>
  );
};
