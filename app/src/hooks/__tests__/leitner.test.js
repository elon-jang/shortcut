// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  BOX_INTERVALS,
  getToday,
  getYesterday,
  getNextReview,
  getDefaultProgress,
  mergeProgress,
  computeAttempt,
  computeStreak,
  getMasteryStats,
  getCategoryProgressFromMap,
} from '../leitner';

describe('BOX_INTERVALS', () => {
  it('has 5 boxes with increasing intervals', () => {
    expect(BOX_INTERVALS[1]).toBe(0);
    expect(BOX_INTERVALS[2]).toBe(1);
    expect(BOX_INTERVALS[3]).toBe(3);
    expect(BOX_INTERVALS[4]).toBe(7);
    expect(BOX_INTERVALS[5]).toBe(14);
  });
});

describe('getToday / getYesterday', () => {
  it('returns ISO date strings', () => {
    expect(getToday()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(getYesterday()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('yesterday is one day before today', () => {
    const today = new Date(getToday());
    const yesterday = new Date(getYesterday());
    expect(today - yesterday).toBe(86400000);
  });
});

describe('getNextReview', () => {
  it('box 1 returns today (midnight)', () => {
    const result = new Date(getNextReview(1));
    const now = new Date();
    expect(result.getFullYear()).toBe(now.getFullYear());
    expect(result.getMonth()).toBe(now.getMonth());
    expect(result.getDate()).toBe(now.getDate());
    expect(result.getHours()).toBe(0);
  });

  it('box 2 returns tomorrow', () => {
    const result = new Date(getNextReview(2));
    const expected = new Date();
    expected.setDate(expected.getDate() + 1);
    expect(result.getDate()).toBe(expected.getDate());
  });

  it('box 5 returns 14 days later', () => {
    const result = new Date(getNextReview(5));
    const expected = new Date();
    expected.setDate(expected.getDate() + 14);
    expect(result.getDate()).toBe(expected.getDate());
  });
});

describe('getDefaultProgress', () => {
  it('returns initial structure', () => {
    const p = getDefaultProgress();
    expect(p.version).toBe('1.0.0');
    expect(p.stats.totalReviews).toBe(0);
    expect(p.stats.streak).toBe(0);
    expect(p.stats.lastDate).toBeNull();
    expect(p.shortcuts).toEqual({});
  });
});

describe('mergeProgress', () => {
  it('returns local unchanged when file is null', () => {
    const local = getDefaultProgress();
    const { merged, syncCount } = mergeProgress(local, null);
    expect(merged).toEqual(local);
    expect(syncCount).toBe(0);
  });

  it('adds new shortcuts from file', () => {
    const local = getDefaultProgress();
    const file = {
      stats: { totalReviews: 3, streak: 2 },
      shortcuts: {
        'chrome:chrome-0': { box: 3, correct: 2, attempts: 3 }
      }
    };
    const { merged, syncCount } = mergeProgress(local, file);
    expect(syncCount).toBe(1);
    expect(merged.shortcuts['chrome:chrome-0'].box).toBe(3);
  });

  it('keeps local entry when local has more attempts', () => {
    const local = {
      ...getDefaultProgress(),
      shortcuts: {
        'chrome:chrome-0': { box: 2, correct: 3, attempts: 5 }
      }
    };
    const file = {
      shortcuts: {
        'chrome:chrome-0': { box: 1, correct: 1, attempts: 2 }
      }
    };
    const { merged, syncCount } = mergeProgress(local, file);
    expect(syncCount).toBe(0);
    expect(merged.shortcuts['chrome:chrome-0'].box).toBe(2);
  });

  it('replaces with file entry when file has more attempts', () => {
    const local = {
      ...getDefaultProgress(),
      shortcuts: {
        'chrome:chrome-0': { box: 2, correct: 1, attempts: 2 }
      }
    };
    const file = {
      shortcuts: {
        'chrome:chrome-0': { box: 4, correct: 5, attempts: 6 }
      }
    };
    const { merged, syncCount } = mergeProgress(local, file);
    expect(syncCount).toBe(1);
    expect(merged.shortcuts['chrome:chrome-0'].box).toBe(4);
  });

  it('merges stats (takes max values)', () => {
    const local = {
      ...getDefaultProgress(),
      stats: { totalReviews: 10, streak: 3, lastDate: '2026-02-12' }
    };
    const file = {
      stats: { totalReviews: 5, streak: 7 },
      shortcuts: {}
    };
    const { merged } = mergeProgress(local, file);
    expect(merged.stats.totalReviews).toBe(10); // max(10, 5)
    expect(merged.stats.streak).toBe(7); // max(3, 7)
  });
});

describe('computeAttempt', () => {
  it('advances box on correct (new entry)', () => {
    const result = computeAttempt(null, true);
    expect(result.box).toBe(2); // 1 → 2
    expect(result.correct).toBe(1);
    expect(result.attempts).toBe(1);
    expect(result.history).toHaveLength(1);
    expect(result.history[0].correct).toBe(true);
  });

  it('resets to box 1 on wrong (new entry)', () => {
    const result = computeAttempt(null, false);
    expect(result.box).toBe(1);
    expect(result.correct).toBe(0);
    expect(result.attempts).toBe(1);
  });

  it('advances box from existing entry', () => {
    const entry = { box: 3, correct: 5, attempts: 7, history: [] };
    const result = computeAttempt(entry, true);
    expect(result.box).toBe(4);
    expect(result.correct).toBe(6);
    expect(result.attempts).toBe(8);
  });

  it('resets to box 1 on wrong from any box', () => {
    for (const box of [2, 3, 4, 5]) {
      const entry = { box, correct: 3, attempts: 5, history: [] };
      const result = computeAttempt(entry, false);
      expect(result.box).toBe(1);
    }
  });

  it('caps at box 5', () => {
    const entry = { box: 5, correct: 10, attempts: 12, history: [] };
    const result = computeAttempt(entry, true);
    expect(result.box).toBe(5);
  });

  it('limits history to MAX_HISTORY entries', () => {
    const history = Array.from({ length: 15 }, (_, i) => ({
      ts: `2026-01-${i + 1}`, correct: true, prevBox: 1, newBox: 2
    }));
    const entry = { box: 2, correct: 10, attempts: 15, history };
    const result = computeAttempt(entry, true);
    expect(result.history).toHaveLength(10); // MAX_HISTORY
    // Should keep the most recent entries
    expect(result.history[result.history.length - 1].correct).toBe(true);
  });

  it('sets nextReview based on new box', () => {
    const entry = { box: 2, correct: 2, attempts: 3, history: [] };
    const result = computeAttempt(entry, true);
    // box 2→3, interval = 3 days
    const reviewDate = new Date(result.nextReview);
    const expected = new Date();
    expected.setDate(expected.getDate() + 3);
    expect(reviewDate.getDate()).toBe(expected.getDate());
  });

  it('records prevBox and newBox in history', () => {
    const entry = { box: 3, correct: 3, attempts: 4, history: [] };
    const result = computeAttempt(entry, false);
    expect(result.history[0].prevBox).toBe(3);
    expect(result.history[0].newBox).toBe(1);
  });
});

describe('computeStreak', () => {
  it('starts streak at 1 when no previous date', () => {
    const { streak, lastDate } = computeStreak(0, null);
    expect(streak).toBe(1);
    expect(lastDate).toBe(getToday());
  });

  it('increments streak when last date was yesterday', () => {
    const { streak } = computeStreak(5, getYesterday());
    expect(streak).toBe(6);
  });

  it('resets streak when last date was not yesterday', () => {
    const { streak } = computeStreak(10, '2020-01-01');
    expect(streak).toBe(1);
  });

  it('keeps streak same if already practiced today', () => {
    const { streak } = computeStreak(3, getToday());
    expect(streak).toBe(3);
  });
});

describe('getMasteryStats', () => {
  it('returns zeros for empty shortcuts', () => {
    expect(getMasteryStats({})).toEqual({ total: 0, mastered: 0 });
  });

  it('counts mastered as box >= 4', () => {
    const shortcuts = {
      a: { box: 1 },
      b: { box: 3 },
      c: { box: 4 },
      d: { box: 5 },
      e: { box: 2 },
    };
    expect(getMasteryStats(shortcuts)).toEqual({ total: 5, mastered: 2 });
  });
});

describe('getCategoryProgressFromMap', () => {
  it('filters by category prefix', () => {
    const shortcuts = {
      'chrome:chrome-0': { box: 4 },
      'chrome:chrome-1': { box: 2 },
      'vscode:vscode-0': { box: 5 },
    };
    expect(getCategoryProgressFromMap(shortcuts, 'chrome')).toEqual({ total: 2, mastered: 1 });
    expect(getCategoryProgressFromMap(shortcuts, 'vscode')).toEqual({ total: 1, mastered: 1 });
    expect(getCategoryProgressFromMap(shortcuts, 'slack')).toEqual({ total: 0, mastered: 0 });
  });
});
