import { useEffect, useCallback } from 'react';
import { Header, ProfileBanner, CategoryCard, ModeSelector, QuizCard, ResultScreen, Footer } from './components';
import { useUserData } from './hooks/useUserData';
import { useGameState } from './hooks/useGameState';
import { useKeyboard } from './hooks/useKeyboard';
import { normalizeKeys } from './utils/keyNormalization';

function App() {
  const { userData, levelProgress, updateXP, isTodayComplete } = useUserData();

  const {
    gameState,
    currentMode,
    searchQuery,
    currentIndex,
    score,
    combo,
    lives,
    timer,
    feedback,
    options,
    cardFlipped,
    activeCategory,
    activeQuestions,
    setSearchQuery,
    setFeedback,
    setCardFlipped,
    setGameState,
    selectCategory,
    startGame,
    resetToMenu,
    goToModeSelect,
    nextQuestion,
    handleCorrect,
    handleWrong,
    incrementTimer,
    generateChoiceOptions,
  } = useGameState();

  // 결과 처리 로직
  const processResult = useCallback((isCorrect) => {
    if (feedback) return;

    if (isCorrect) {
      setFeedback('correct');
      handleCorrect();
      setTimeout(() => {
        setFeedback(null);
        setCardFlipped(false);

        if (currentIndex + 1 < activeQuestions.length) {
          const nextIdx = currentIndex + 1;
          if (currentMode === 'choice') {
            generateChoiceOptions(nextIdx, activeQuestions);
          }
          nextQuestion();
        } else {
          const gainedXp = score + 20 + (combo * 5);
          updateXP(gainedXp);
          setGameState('result');
        }
      }, 600);
    } else {
      const gameOver = handleWrong();
      if (gameOver) {
        setFeedback('wrong');
        setTimeout(() => {
          setGameState('result');
          setFeedback(null);
        }, 1000);
      } else {
        setFeedback('retry');
        setTimeout(() => setFeedback(null), 1000);
      }
    }
  }, [feedback, currentIndex, activeQuestions, currentMode, score, combo, handleCorrect, handleWrong, setFeedback, setCardFlipped, setGameState, generateChoiceOptions, nextQuestion, updateXP]);

  // 타이핑 모드 키보드 입력 처리
  const handleKeyCombo = useCallback((pressedKeys) => {
    if (!activeQuestions[currentIndex] || feedback) return;

    const correctArr = normalizeKeys(activeQuestions[currentIndex].keys);
    const isCorrect = correctArr.every(k => pressedKeys.has(k)) && pressedKeys.size === correctArr.length;

    if (isCorrect) {
      processResult(true);
    } else if (pressedKeys.size >= correctArr.length) {
      processResult(false);
    }
  }, [activeQuestions, currentIndex, feedback, processResult]);

  const isTypingActive = gameState === 'playing' && currentMode === 'typing' && !feedback;
  const { pressedKeys } = useKeyboard(isTypingActive, handleKeyCombo);

  // 타이머
  useEffect(() => {
    let timerId;
    if (gameState === 'playing') {
      timerId = setInterval(incrementTimer, 1000);
    }
    return () => clearInterval(timerId);
  }, [gameState, incrementTimer]);

  // 플래시카드 다음 문제 (스킵)
  const handleFlashcardNext = useCallback(() => {
    setFeedback(null);
    setCardFlipped(false);

    if (currentIndex + 1 < activeQuestions.length) {
      nextQuestion();
    } else {
      updateXP(score);
      setGameState('result');
    }
  }, [currentIndex, activeQuestions.length, nextQuestion, setFeedback, setCardFlipped, setGameState, score, updateXP]);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <Header
          streak={userData.streak}
          showHomeButton={gameState !== 'menu'}
          onHomeClick={resetToMenu}
        />

        <main className="relative">
          {gameState === 'menu' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <ProfileBanner
                levelProgress={levelProgress}
                userData={userData}
                isTodayComplete={isTodayComplete}
              />
              <CategoryCard
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectCategory={selectCategory}
              />
            </div>
          )}

          {gameState === 'mode_select' && (
            <ModeSelector
              activeCategory={activeCategory}
              onBack={resetToMenu}
              onStartGame={startGame}
            />
          )}

          {gameState === 'playing' && activeQuestions[currentIndex] && (
            <QuizCard
              currentMode={currentMode}
              currentIndex={currentIndex}
              activeQuestions={activeQuestions}
              activeCategory={activeCategory}
              lives={lives}
              timer={timer}
              score={score}
              combo={combo}
              feedback={feedback}
              options={options}
              pressedKeys={pressedKeys}
              cardFlipped={cardFlipped}
              onAnswer={processResult}
              onFlipCard={() => setCardFlipped(true)}
              onNextQuestion={handleFlashcardNext}
            />
          )}

          {gameState === 'result' && (
            <ResultScreen
              activeCategory={activeCategory}
              score={score}
              timer={timer}
              onRestart={() => startGame(currentMode)}
              onMenu={resetToMenu}
            />
          )}
        </main>

        <Footer streak={userData.streak} />
      </div>
    </div>
  );
}

export default App;
