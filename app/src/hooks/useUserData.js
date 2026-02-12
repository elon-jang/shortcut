import { useState, useMemo, useCallback } from 'react';

const STORAGE_KEY = 'shortcut_pro_data';

const getDefaultUserData = () => ({
  xp: 0,
  level: 1,
  streak: 0,
  lastDate: null
});

export const useUserData = () => {
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : getDefaultUserData();
    } catch {
      return getDefaultUserData();
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

  return {
    userData,
    levelProgress,
    updateXP,
    isTodayComplete
  };
};
