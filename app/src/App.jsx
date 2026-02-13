import { useState, useEffect, useCallback, useRef } from 'react';
import { Header, ProfileBanner, CategoryCard, ModeSelector, QuizCard, ResultScreen, Footer } from './components';
import { useUserData } from './hooks/useUserData';
import { useGameState } from './hooks/useGameState';
import { useKeyboard } from './hooks/useKeyboard';
import { normalizeKeys } from './utils/keyNormalization';
import { SHORTCUT_DATA } from './data/shortcuts';

function App() {
  const { userData, levelProgress, updateXP, isTodayComplete, recordAttempt, getCategoryProgress, exportToFile, masteryStats, progress } = useUserData();

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

  const [retryCount, setRetryCount] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);

  // Track gameState in ref for setTimeout guards
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  // 다음 문제로 이동
  const advanceToNext = useCallback(() => {
    // Guard: setTimeout이 지연 실행될 때 이미 화면을 벗어났으면 무시
    if (gameStateRef.current !== 'playing') return;

    setFeedback(null);
    setCardFlipped(false);
    setRetryCount(0);

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
  }, [currentIndex, activeQuestions, currentMode, score, combo, setFeedback, setCardFlipped, generateChoiceOptions, nextQuestion, updateXP, setGameState]);

  // 결과 처리
  const processResult = useCallback((isCorrect) => {
    if (feedback) return;

    const question = activeQuestions[currentIndex];
    if (question && activeCategory) {
      // Only record final result (correct on first try, or wrong after retries)
      const isFinalWrong = !isCorrect && retryCount >= 1;
      if (isCorrect || isFinalWrong) {
        const finalCorrect = isCorrect;
        recordAttempt(question.id, activeCategory.id, finalCorrect);

        // Get previous box for delta display
        const key = `${activeCategory.id}:${question.id}`;
        const prevEntry = progress.shortcuts[key];
        const prevBox = prevEntry ? prevEntry.box : 1;
        setSessionResults(prev => [...prev, {
          id: question.id,
          action: question.action,
          keys: question.keys,
          correct: finalCorrect,
          prevBox,
          newBox: finalCorrect ? Math.min(prevBox + 1, 5) : 1,
        }]);
      }
    }

    if (isCorrect) {
      setFeedback('correct');
      handleCorrect();
      setTimeout(advanceToNext, 600);
    } else {
      handleWrong();
      const newRetry = retryCount + 1;
      setRetryCount(newRetry);

      if (newRetry >= 2) {
        setFeedback('wrong');
        setTimeout(advanceToNext, 1500);
      } else {
        setFeedback('retry');
        setTimeout(() => setFeedback(null), 800);
      }
    }
  }, [feedback, retryCount, handleCorrect, handleWrong, setFeedback, advanceToNext, activeQuestions, currentIndex, activeCategory, recordAttempt, progress]);

  // 타이핑 모드 키보드 입력
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

  // Reset session results when starting a new game
  useEffect(() => {
    if (gameState === 'playing' && currentIndex === 0) {
      setSessionResults([]);
    }
  }, [gameState, currentIndex]);

  // 타이머
  useEffect(() => {
    let timerId;
    if (gameState === 'playing') {
      timerId = setInterval(incrementTimer, 1000);
    }
    return () => clearInterval(timerId);
  }, [gameState, incrementTimer]);

  // 플래시카드 스킵
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

  // ===== 네비게이션 단축키 =====
  useEffect(() => {
    const handleNavKey = (e) => {
      // Esc: 한 단계 뒤로
      if (e.key === 'Escape') {
        if (gameState === 'mode_select') {
          e.preventDefault();
          resetToMenu();
        } else if (gameState === 'playing') {
          e.preventDefault();
          goToModeSelect();
        } else if (gameState === 'result') {
          e.preventDefault();
          goToModeSelect();
        }
        return;
      }

      // 타이핑 모드 중에는 다른 단축키 무시
      if (isTypingActive) return;

      // 모드 선택: 1/2/3
      if (gameState === 'mode_select') {
        const modes = ['choice', 'typing', 'flashcard'];
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < modes.length) {
          const modeId = modes[idx];
          if (modeId === 'typing') {
            const all = SHORTCUT_DATA[activeCategory?.id] || [];
            if (!all.some(s => s.typeable !== false)) return;
          }
          e.preventDefault();
          startGame(modeId);
        }
        return;
      }

      // 객관식: 1/2/3/4
      if (gameState === 'playing' && currentMode === 'choice' && !feedback && options.length > 0) {
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < options.length) {
          e.preventDefault();
          processResult(options[idx] === activeQuestions[currentIndex].keys);
        }
        return;
      }

      // 플래시카드: Space/Enter 뒤집기, 화살표로 선택
      if (gameState === 'playing' && currentMode === 'flashcard') {
        if (!cardFlipped && !feedback) {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setCardFlipped(true);
          }
        } else if (cardFlipped && !feedback) {
          if (e.key === 'ArrowRight' || e.key === 'Enter') {
            e.preventDefault();
            processResult(true);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handleFlashcardNext();
          }
        }
        return;
      }

      // 결과: Enter로 재시작
      if (gameState === 'result') {
        if (e.key === 'Enter') {
          e.preventDefault();
          startGame(currentMode);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleNavKey);
    return () => window.removeEventListener('keydown', handleNavKey);
  }, [gameState, currentMode, isTypingActive, feedback, options, activeQuestions, currentIndex, cardFlipped, activeCategory, resetToMenu, goToModeSelect, startGame, processResult, setCardFlipped, handleFlashcardNext]);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100 font-sans overflow-x-hidden">
      <div className="max-w-2xl mx-auto px-4 py-4 md:px-6">
        <Header
          streak={userData.streak}
          showHomeButton={gameState !== 'menu'}
          onHomeClick={resetToMenu}
        />

        <main>
          {gameState === 'menu' && (
            <div className="animate-in fade-in duration-500">
              <ProfileBanner
                levelProgress={levelProgress}
                userData={userData}
                isTodayComplete={isTodayComplete}
                masteryStats={masteryStats}
              />
              <CategoryCard
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectCategory={selectCategory}
                getCategoryProgress={getCategoryProgress}
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
              onBack={goToModeSelect}
            />
          )}

          {gameState === 'result' && (
            <ResultScreen
              activeCategory={activeCategory}
              score={score}
              timer={timer}
              missCount={lives}
              totalQuestions={activeQuestions.length}
              onRestart={() => startGame(currentMode)}
              onModeSelect={goToModeSelect}
              onMenu={resetToMenu}
              sessionResults={sessionResults}
              onExport={exportToFile}
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
