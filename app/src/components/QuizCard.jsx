import { Heart, Timer } from 'lucide-react';
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
  onNextQuestion
}) => {
  const question = activeQuestions[currentIndex];
  if (!question) return null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center animate-in fade-in duration-500">
      {/* 상단 스탯 */}
      <div className="w-full flex justify-between items-center mb-10 px-4">
        <div className="flex items-center gap-6">
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                size={24}
                fill={i < lives ? "#ef4444" : "transparent"}
                className={i < lives ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-slate-700"}
              />
            ))}
          </div>
          <div className="h-8 w-[2px] bg-slate-800 mx-1" />
          <div className="flex items-center gap-3 text-base font-black text-indigo-400 bg-slate-800/60 px-5 py-2.5 rounded-2xl border border-slate-700 shadow-xl">
            <Timer size={20} /> {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">SCORE</p>
          <p className="text-3xl font-black text-indigo-400 leading-none tabular-nums">{score}</p>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="w-full h-3 bg-slate-800/80 rounded-full mb-16 overflow-hidden border border-slate-700/50 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-600 transition-all duration-700 shadow-[0_0_25px_rgba(99,102,241,0.6)]"
          style={{ width: `${(currentIndex / activeQuestions.length) * 100}%` }}
        />
      </div>

      {/* 퀴즈 메인 카드 */}
      <div className={`w-full bg-slate-800 border-2 rounded-[4.5rem] p-14 md:p-20 text-center shadow-2xl relative transition-all duration-500 ${
        feedback === 'correct' ? 'border-green-500 shadow-green-500/30 scale-[1.03]' :
        feedback === 'retry' ? 'border-yellow-500 shadow-yellow-500/20 animate-shake' :
        feedback === 'wrong' ? 'border-red-500 shadow-red-500/30' : 'border-slate-700'
      }`}>
        {/* 도구 배지 */}
        <div className={`absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-12 py-5 ${activeCategory?.color || 'bg-slate-900'} border-4 border-white/20 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] backdrop-blur-md`}>
          <span className="text-4xl drop-shadow-lg">{activeCategory?.icon}</span>
          <span className="text-2xl font-black text-white uppercase tracking-[0.6em] leading-none drop-shadow-2xl">{activeCategory?.name}</span>
        </div>

        {/* 콤보 뱃지 */}
        {combo > 1 && (
          <div className="absolute -top-7 right-16 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-2xl text-lg font-black animate-bounce shadow-2xl border-2 border-white/20">
            {combo} COMBO 🔥
          </div>
        )}

        <div className="mt-24 mb-10">
          <p className="text-indigo-400 font-black text-base uppercase tracking-[0.6em] opacity-80">
            MISSION {currentIndex + 1} / {activeQuestions.length}
          </p>
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-24 leading-tight tracking-tighter text-white drop-shadow-2xl break-keep">
          {question.action}
        </h2>

        {/* 모드별 UI */}
        {currentMode === 'choice' && (
          <ChoiceMode
            options={options}
            correctAnswer={question.keys}
            feedback={feedback}
            onAnswer={onAnswer}
          />
        )}

        {currentMode === 'typing' && (
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

      {/* 피드백 오버레이 */}
      <FeedbackOverlay feedback={feedback} />
    </div>
  );
};
