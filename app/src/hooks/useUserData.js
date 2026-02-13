import { useState, useMemo, useCallback } from 'react';
import { INITIAL_PROGRESS } from '../data/shortcuts';

const STORAGE_KEY = 'shortcut_pro_data';
const PROGRESS_KEY = 'shortcut_pro_progress';

// Leitner box intervals (days)
const BOX_INTERVALS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };

function getNextReview(box) {
  const days = BOX_INTERVALS[box] || 0;
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

const getDefaultUserData = () => ({
  xp: 0,
  level: 1,
  streak: 0,
  lastDate: null
});

const getDefaultProgress = () => ({
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  stats: { totalReviews: 0, streak: 0, lastDate: null },
  shortcuts: {}
});

function mergeProgress(local, file) {
  if (!file || !file.shortcuts) return local;
  const merged = { ...local, shortcuts: { ...local.shortcuts } };
  for (const [key, val] of Object.entries(file.shortcuts)) {
    if (!merged.shortcuts[key]) {
      merged.shortcuts[key] = val;
    } else {
      // Keep the one with more attempts (more data)
      if (val.attempts > merged.shortcuts[key].attempts) {
        merged.shortcuts[key] = val;
      }
    }
  }
  // Merge stats
  if (file.stats) {
    merged.stats.totalReviews = Math.max(merged.stats.totalReviews, file.stats.totalReviews || 0);
    if (file.stats.streak > merged.stats.streak) {
      merged.stats.streak = file.stats.streak;
    }
  }
  return merged;
}

export const useUserData = () => {
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : getDefaultUserData();
    } catch {
      return getDefaultUserData();
    }
  });

  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      let local = saved ? JSON.parse(saved) : getDefaultProgress();
      // Merge with file-based progress from Vite plugin
      if (INITIAL_PROGRESS) {
        local = mergeProgress(local, INITIAL_PROGRESS);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(local));
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

  const updateXP = useCallback((gainedXp) => {
    const today = new Date().toDateString();
    setUserData(prev => {
      let newStreak = prev.streak;
      if (prev.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        newStreak = (prev.lastDate === yesterday) ? prev.streak + 1 : 1;
      }
      const newData = {
        ...prev,
        xp: prev.xp + gainedXp,
        streak: newStreak,
        lastDate: today
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const isTodayComplete = useMemo(() => {
    return userData.lastDate === new Date().toDateString();
  }, [userData.lastDate]);

  // Record a shortcut attempt (Leitner box update)
  const recordAttempt = useCallback((shortcutId, categoryId, isCorrect) => {
    setProgress(prev => {
      const key = `${categoryId}:${shortcutId}`;
      const entry = prev.shortcuts[key] || {
        box: 1, correct: 0, attempts: 0, lastReview: null, nextReview: null
      };

      const newBox = isCorrect
        ? Math.min(entry.box + 1, 5)
        : 1;

      const updated = {
        ...prev,
        lastUpdated: new Date().toISOString(),
        stats: {
          ...prev.stats,
          totalReviews: prev.stats.totalReviews + 1,
        },
        shortcuts: {
          ...prev.shortcuts,
          [key]: {
            box: newBox,
            correct: entry.correct + (isCorrect ? 1 : 0),
            attempts: entry.attempts + 1,
            lastReview: new Date().toISOString(),
            nextReview: getNextReview(newBox),
          }
        }
      };

      // Update streak in progress stats
      const today = new Date().toDateString();
      if (updated.stats.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        updated.stats.streak = (updated.stats.lastDate === yesterday)
          ? updated.stats.streak + 1 : 1;
        updated.stats.lastDate = today;
      }

      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Get progress for a specific category
  const getCategoryProgress = useCallback((categoryId) => {
    const entries = Object.entries(progress.shortcuts)
      .filter(([key]) => key.startsWith(`${categoryId}:`));
    const total = entries.length;
    const mastered = entries.filter(([, v]) => v.box >= 4).length;
    return { total, mastered };
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

  // Get mastery stats for profile
  const masteryStats = useMemo(() => {
    const entries = Object.values(progress.shortcuts);
    const total = entries.length;
    const mastered = entries.filter(v => v.box >= 4).length;
    return { total, mastered };
  }, [progress]);

  return {
    userData,
    levelProgress,
    updateXP,
    isTodayComplete,
    // Progress tracking
    recordAttempt,
    getCategoryProgress,
    getProgress,
    exportToFile,
    masteryStats,
    progress,
  };
};
