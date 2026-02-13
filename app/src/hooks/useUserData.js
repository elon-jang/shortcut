import { useState, useMemo, useCallback } from 'react';
import { INITIAL_PROGRESS } from '../data/shortcuts';
import {
  getToday, getDefaultProgress, mergeProgress,
  computeAttempt, computeStreak, getMasteryStats, getCategoryProgressFromMap,
} from './leitner';

const STORAGE_KEY = 'shortcut_pro_data';
const PROGRESS_KEY = 'shortcut_pro_progress';

const getDefaultUserData = () => ({ xp: 0 });

export const useUserData = () => {
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { xp: JSON.parse(saved).xp || 0 } : getDefaultUserData();
    } catch {
      return getDefaultUserData();
    }
  });

  const [syncInfo, setSyncInfo] = useState(null);

  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      let local = saved ? JSON.parse(saved) : getDefaultProgress();
      if (INITIAL_PROGRESS) {
        const { merged, syncCount } = mergeProgress(local, INITIAL_PROGRESS);
        local = merged;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(local));
        if (syncCount > 0) {
          setTimeout(() => setSyncInfo({ syncCount }), 0);
        }
      }
      return local;
    } catch {
      return getDefaultProgress();
    }
  });

  const levelProgress = useMemo(() => {
    const xpInLevel = userData.xp % 100;
    const level = Math.floor(userData.xp / 100) + 1;
    const titles = ["입문자", "수련생", "숙련공", "전문가", "마스터", "그랜드마스터", "단축키의 신"];
    return {
      level,
      xpInLevel,
      title: titles[Math.min(Math.floor(level / 5), titles.length - 1)]
    };
  }, [userData.xp]);

  // XP only — streak is managed in progress.stats
  const updateXP = useCallback((gainedXp) => {
    setUserData(prev => {
      const newData = { ...prev, xp: prev.xp + gainedXp };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const isTodayComplete = useMemo(() => {
    return progress.stats.lastDate === getToday();
  }, [progress.stats.lastDate]);

  // Record a shortcut attempt (Leitner box update + streak + history)
  const recordAttempt = useCallback((shortcutId, categoryId, isCorrect) => {
    setProgress(prev => {
      const key = `${categoryId}:${shortcutId}`;
      const entry = prev.shortcuts[key];
      const newEntry = computeAttempt(entry, isCorrect);
      const { streak, lastDate } = computeStreak(prev.stats.streak, prev.stats.lastDate);

      const updated = {
        ...prev,
        lastUpdated: newEntry.lastReview,
        stats: {
          ...prev.stats,
          totalReviews: prev.stats.totalReviews + 1,
          streak,
          lastDate,
        },
        shortcuts: {
          ...prev.shortcuts,
          [key]: newEntry,
        }
      };

      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getCategoryProgress = useCallback((categoryId) => {
    return getCategoryProgressFromMap(progress.shortcuts, categoryId);
  }, [progress]);

  // Get full progress data
  const getProgress = useCallback(() => progress, [progress]);

  // Export progress as progress.json format
  const exportToFile = useCallback(() => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [progress]);

  const masteryStats = useMemo(() => {
    return getMasteryStats(progress.shortcuts);
  }, [progress]);

  const streak = useMemo(() => progress.stats.streak || 0, [progress.stats.streak]);

  return {
    userData,
    levelProgress,
    updateXP,
    isTodayComplete,
    streak,
    syncInfo,
    // Progress tracking
    recordAttempt,
    getCategoryProgress,
    getProgress,
    exportToFile,
    masteryStats,
    progress,
  };
};
