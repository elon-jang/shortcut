import { ArrowLeft } from 'lucide-react';
import { SHORTCUT_DATA } from '../data/shortcuts';

const BOX_COLORS = {
  1: 'text-slate-500',
  2: 'text-blue-400',
  3: 'text-cyan-400',
  4: 'text-emerald-400',
  5: 'text-yellow-400',
};

export const ShortcutList = ({ activeCategory, onBack, progress }) => {
  const shortcuts = SHORTCUT_DATA[activeCategory?.id] || [];

  const sections = shortcuts.reduce((acc, s) => {
    const key = s.section || '기타';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const getBox = (shortcutId) => {
    const key = `${activeCategory.id}:${shortcutId}`;
    return progress?.shortcuts[key]?.box || null;
  };

  const showSectionHeaders = Object.keys(sections).length > 1;

  return (
    <div className="max-w-lg md:max-w-xl mx-auto animate-in zoom-in-95 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 mb-5 text-xs md:text-sm font-bold transition-colors"
      >
        <ArrowLeft size={14} /> 뒤로
        <span className="ml-1 text-[10px] text-slate-600 font-mono">Esc</span>
      </button>

      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
          <span className="text-3xl">{activeCategory?.icon}</span>
          <div>
            <h2 className="font-black text-base md:text-lg">{activeCategory?.name}</h2>
            <p className="text-xs text-slate-500">{shortcuts.length}개 단축키</p>
          </div>
        </div>

        <div className="divide-y divide-slate-700/30">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section}>
              {showSectionHeaders && (
                <div className="px-6 py-2 bg-slate-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{section}</p>
                </div>
              )}
              {items.map((s) => {
                const box = getBox(s.id);
                return (
                  <div key={s.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-700/20 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{s.action}</p>
                      {s.tip && (
                        <p className="text-[11px] text-amber-400/70 mt-0.5 truncate">💡 {s.tip}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {box && (
                        <span className={`text-[10px] font-bold font-mono ${BOX_COLORS[box]}`}>B{box}</span>
                      )}
                      <kbd className="px-2.5 py-1 bg-slate-900 border border-slate-600 rounded-lg font-mono text-xs font-bold text-indigo-300 whitespace-nowrap">
                        {s.keys}
                      </kbd>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
