import { useMemo } from 'react';
import { ArrowLeft, ChevronRight, Zap, Keyboard, BookOpen } from 'lucide-react';
import { MODES, SHORTCUT_DATA } from '../data/shortcuts';

const MODE_ICONS = {
  choice: <Zap size={22} />,
  typing: <Keyboard size={22} />,
  flashcard: <BookOpen size={22} />
};

export const ModeSelector = ({ activeCategory, onBack, onStartGame }) => {
  const hasTypeableShortcuts = useMemo(() => {
    if (!activeCategory) return false;
    const shortcuts = SHORTCUT_DATA[activeCategory.id] || [];
    return shortcuts.some(s => s.typeable !== false);
  }, [activeCategory]);

  return (
    <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2.5 text-slate-500 hover:text-indigo-400 mb-10 font-black text-xs uppercase tracking-[0.2em] transition-colors"
      >
        <ArrowLeft size={18} /> BACK TO MENU
      </button>
      <div className="bg-slate-800 border-2 border-slate-700 rounded-[3.5rem] p-14 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-14">
          <span className="text-8xl block mb-6">{activeCategory?.icon}</span>
          <h2 className="text-4xl font-black italic tracking-tighter mb-2">{activeCategory?.name} 수련</h2>
          <p className="text-slate-400 font-medium">원하는 모드로 단축키를 마스터하세요</p>
        </div>
        <div className="grid gap-6">
          {MODES.map(m => {
            const disabled = m.id === 'typing' && !hasTypeableShortcuts;
            return (
              <button
                key={m.id}
                onClick={() => !disabled && onStartGame(m.id)}
                disabled={disabled}
                className={`flex items-center gap-6 p-8 bg-slate-900/60 border border-slate-700 rounded-[2.2rem] transition-all group shadow-xl ${
                  disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-indigo-600/10 hover:border-indigo-500'
                }`}
              >
                <div className={`bg-slate-800 p-5 rounded-2xl transition-all shadow-lg ${disabled ? 'text-slate-600' : 'text-indigo-400 group-hover:scale-110'}`}>
                  {MODE_ICONS[m.id]}
                </div>
                <div className="text-left">
                  <h5 className={`font-black text-xl transition-colors ${disabled ? 'text-slate-600' : 'group-hover:text-indigo-400'}`}>{m.name}</h5>
                  <p className="text-base text-slate-500 font-medium">
                    {disabled ? '입력 가능한 단축키가 없습니다' : m.desc}
                  </p>
                </div>
                <ChevronRight size={22} className={`ml-auto transition-all ${disabled ? 'text-slate-800' : 'text-slate-700 group-hover:text-indigo-400'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
