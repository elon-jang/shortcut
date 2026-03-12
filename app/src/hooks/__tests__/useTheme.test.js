import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

describe('useTheme', () => {
  it('defaults to light when system is light and no localStorage', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('defaults to dark when system prefers dark and no localStorage', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('reads saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe('dark');
  });

  it('toggleTheme switches light → dark', () => {
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useTheme());
    act(() => { result.current[1](); });
    expect(result.current[0]).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggleTheme switches dark → light', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    act(() => { result.current[1](); });
    expect(result.current[0]).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
