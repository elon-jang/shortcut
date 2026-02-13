// Pure Leitner box logic — extracted for testability

export const BOX_INTERVALS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };
export const MAX_HISTORY = 10;

export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function getYesterday() {
  return new Date(Date.now() - 86400000).toISOString().split('T')[0];
}

export function getNextReview(box) {
  const days = BOX_INTERVALS[box] || 0;
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function getDefaultProgress() {
  return {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    stats: { totalReviews: 0, streak: 0, lastDate: null },
    shortcuts: {}
  };
}

export function mergeProgress(local, file) {
  if (!file || !file.shortcuts) return { merged: local, syncCount: 0 };
  const merged = { ...local, shortcuts: { ...local.shortcuts } };
  let syncCount = 0;

  for (const [key, val] of Object.entries(file.shortcuts)) {
    if (!merged.shortcuts[key]) {
      merged.shortcuts[key] = val;
      syncCount++;
    } else if (val.attempts > merged.shortcuts[key].attempts) {
      merged.shortcuts[key] = val;
      syncCount++;
    }
  }

  if (file.stats) {
    merged.stats.totalReviews = Math.max(merged.stats.totalReviews, file.stats.totalReviews || 0);
    if ((file.stats.streak || 0) > merged.stats.streak) {
      merged.stats.streak = file.stats.streak;
    }
  }

  return { merged, syncCount };
}

/** Compute a new shortcut entry after an attempt */
export function computeAttempt(entry, isCorrect) {
  const prevBox = entry ? entry.box : 1;
  const newBox = isCorrect ? Math.min(prevBox + 1, 5) : 1;
  const now = new Date().toISOString();

  const historyEntry = { ts: now, correct: isCorrect, prevBox, newBox };
  const history = [...(entry?.history || []), historyEntry].slice(-MAX_HISTORY);

  return {
    box: newBox,
    correct: (entry?.correct || 0) + (isCorrect ? 1 : 0),
    attempts: (entry?.attempts || 0) + 1,
    lastReview: now,
    nextReview: getNextReview(newBox),
    history,
  };
}

/** Compute updated streak */
export function computeStreak(currentStreak, lastDate) {
  const today = getToday();
  if (lastDate === today) return { streak: currentStreak, lastDate };
  const streak = (lastDate === getYesterday()) ? currentStreak + 1 : 1;
  return { streak, lastDate: today };
}

/** Get mastery stats from shortcuts map */
export function getMasteryStats(shortcuts) {
  const entries = Object.values(shortcuts);
  return {
    total: entries.length,
    mastered: entries.filter(v => v.box >= 4).length,
  };
}

/** Get category progress from shortcuts map */
export function getCategoryProgressFromMap(shortcuts, categoryId) {
  const entries = Object.entries(shortcuts)
    .filter(([key]) => key.startsWith(`${categoryId}:`));
  return {
    total: entries.length,
    mastered: entries.filter(([, v]) => v.box >= 4).length,
  };
}
