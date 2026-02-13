import { useMemo } from 'react';
import { ArrowLeft, ChevronRight, Zap, Keyboard, BookOpen } from 'lucide-react';
import { MODES, SHORTCUT_DATA } from '../data/shortcuts';

const MODE_ICONS = {
  choice: <Zap size={18} />,
  typing: <Keyboard size={18} />,
  flashcard: <BookOpen size={18} />
};

export const ModeSelector = ({ activeCategory, onBack, onStartGame }) => {
  const typingInfo = useMemo(() => {
    if (!activeCategory) return { total: 0, typeable: 0 };
    const shortcuts = SHORTCUT_DATA[activeCategory.id] || [];
    const typeable = shortcuts.filter(s => s.typeable !== false).length;
    return { total: shortcuts.length, typeable };
  }, [activeCategory]);

  const hasTypeableShortcuts = typingInfo.typeable > 0;
  const hasSkippedShortcuts = typingInfo.typeable < typingInfo.total;

  return (
    <div className="max-w-lg md:max-w-xl mx-auto animate-in zoom-in-95 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 mb-5 text-xs md:text-sm font-bold transition-colors"
      >
        <ArrowLeft size={14} /> 뒤로
        <span className="ml-1 text-[10px] text-slate-600 font-mono">Esc</span>
      </button>
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="text-center mb-6">
          <span className="text-4xl md:text-5xl block mb-2">{activeCategory?.icon}</span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mb-1">{activeCategory?.name}</h2>
          <p className="text-xs md:text-sm text-slate-400">모드를 선택하세요</p>
        </div>
        <div className="grid gap-2.5 md:gap-3">
          {MODES.map((m, i) => {
            const disabled = m.id === 'typing' && !hasTypeableShortcuts;
            return (
              <button
                key={m.id}
                onClick={() => !disabled && onStartGame(m.id)}
                disabled={disabled}
                className={`flex items-center gap-4 px-4 py-3.5 md:py-4 bg-slate-900/50 border border-slate-700/60 rounded-xl transition-all group ${
                  disabled
                    ? 'opacity-35 cursor-not-allowed'
                    : 'hover:bg-indigo-600/10 hover:border-indigo-500/60'
                }`}
              >
                <span className={`text-xs md:text-sm font-mono tabular-nums ${disabled ? 'text-slate-700' : 'text-slate-600 group-hover:text-indigo-400'}`}>
                  {i + 1}
                </span>
                <div className={`p-2.5 rounded-lg transition-all ${disabled ? 'bg-slate-800 text-slate-600' : 'bg-slate-800 text-indigo-400 group-hover:scale-105'}`}>
                  {MODE_ICONS[m.id]}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h5 className={`font-bold text-sm md:text-base transition-colors ${disabled ? 'text-slate-600' : 'group-hover:text-indigo-300'}`}>{m.name}</h5>
                  <p className="text-[11px] md:text-xs text-slate-500 truncate">
                    {disabled
                      ? '입력 가능한 단축키가 없습니다'
                      : m.id === 'typing' && hasSkippedShortcuts
                        ? `${m.desc} (${typingInfo.typeable}/${typingInfo.total}개)`
                        : m.desc}
                  </p>
                </div>
                <ChevronRight size={14} className={`shrink-0 transition-colors ${disabled ? 'text-slate-800' : 'text-slate-700 group-hover:text-indigo-400'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
