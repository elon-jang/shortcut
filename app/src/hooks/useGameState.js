import { useState, useCallback, useMemo } from 'react';
import { SHORTCUT_DATA, CATEGORIES } from '../data/shortcuts';

export const useGameState = () => {
  const [gameState, setGameState] = useState('menu'); // menu, mode_select, playing, result
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentMode, setCurrentMode] = useState('choice');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [options, setOptions] = useState([]);
  const [cardFlipped, setCardFlipped] = useState(false);

  const activeCategory = useMemo(() =>
    CATEGORIES.find(c => c.id === currentCategory),
    [currentCategory]
  );

  const activeQuestions = useMemo(() => {
    if (!currentCategory) return [];
    const all = SHORTCUT_DATA[currentCategory] || [];
    if (gameState === 'playing' && currentMode === 'typing') {
      return all.filter(q => q.typeable !== false);
    }
    return all;
  }, [currentCategory, currentMode, gameState]);

  const generateChoiceOptions = useCallback((idx, questions) => {
    if (!questions || questions.length === 0 || !questions[idx]) return;
    const correct = questions[idx].keys;
    const pool = Object.values(SHORTCUT_DATA).flat().map(q => q.keys);
    const others = pool.filter(k => k !== correct);
    const shuffledOthers = [...new Set(others)].sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([...shuffledOthers, correct].sort(() => 0.5 - Math.random()));
  }, []);

  const selectCategory = useCallback((categoryId) => {
    setCurrentCategory(categoryId);
    setGameState('mode_select');
  }, []);

  const startGame = useCallback((modeId) => {
    if (!activeQuestions || activeQuestions.length === 0) return;
    setCurrentMode(modeId);
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setLives(0);
    setTimer(0);
    setFeedback(null);
    setCardFlipped(false);
    if (modeId === 'choice') generateChoiceOptions(0, activeQuestions);
  }, [activeQuestions, generateChoiceOptions]);

  const resetToMenu = useCallback(() => {
    setGameState('menu');
    setCurrentCategory(null);
    setFeedback(null);
  }, []);

  const goToModeSelect = useCallback(() => {
    setGameState('mode_select');
  }, []);

  const nextQuestion = useCallback(() => {
    setFeedback(null);
    setCardFlipped(false);
    setCurrentIndex(prev => {
      const nextIdx = prev + 1;
      if (nextIdx < activeQuestions.length) {
        if (currentMode === 'choice') {
          generateChoiceOptions(nextIdx, activeQuestions);
        }
        return nextIdx;
      }
      // 마지막 문제 - 결과 화면으로
      setGameState('result');
      return prev;
    });
  }, [activeQuestions, currentMode, generateChoiceOptions]);

  const handleCorrect = useCallback(() => {
    setScore(s => s + 20 + (combo * 5));
    setCombo(c => c + 1);
  }, [combo]);

  const handleWrong = useCallback(() => {
    setLives(l => l + 1);
    setCombo(0);
    return false; // 항상 게임 계속
  }, []);

  const incrementTimer = useCallback(() => {
    setTimer(t => t + 1);
  }, []);

  return {
    // State
    gameState,
    currentCategory,
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

    // Setters
    setSearchQuery,
    setFeedback,
    setCardFlipped,
    setGameState,

    // Actions
    selectCategory,
    startGame,
    resetToMenu,
    goToModeSelect,
    nextQuestion,
    handleCorrect,
    handleWrong,
    incrementTimer,
    generateChoiceOptions,
  };
};
