import { useState } from 'react';
import { ArrowLeft, Printer, ExternalLink } from 'lucide-react';
import { SHORTCUT_DATA, CATEGORIES } from '../data/shortcuts';

const BOX_STYLES = {
  1: { dot: 'bg-slate-600', label: 'text-slate-500' },
  2: { dot: 'bg-blue-500',  label: 'text-blue-400' },
  3: { dot: 'bg-cyan-500',  label: 'text-cyan-400' },
  4: { dot: 'bg-emerald-500', label: 'text-emerald-400' },
  5: { dot: 'bg-yellow-400', label: 'text-yellow-400' },
};

function ShortcutGrid({ categories, getBox }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-3 print:gap-[6px]">
      {categories.map(cat => {
        const shortcuts = SHORTCUT_DATA[cat.id] || [];
        if (!shortcuts.length) return null;

        const sections = shortcuts.reduce((acc, s) => {
          const key = s.section || '기타';
          if (!acc[key]) acc[key] = [];
          acc[key].push(s);
          return acc;
        }, {});
        const multiSection = Object.keys(sections).length > 1;

        return (
          <div
            key={cat.id}
            className="bg-white dark:bg-slate-800/60 print:bg-gray-50 border border-slate-200 dark:border-slate-700 print:border-gray-300 rounded-xl print:rounded overflow-hidden break-inside-avoid"
          >
            <div className="px-4 py-2.5 print:px-3 print:py-1.5 border-b border-slate-200 dark:border-slate-700 print:border-gray-300 bg-slate-50 dark:bg-slate-900/50 print:bg-gray-100 flex items-center gap-2">
              <span className="text-lg print:text-xs">{cat.icon}</span>
              <h3 className="font-black text-sm print:text-[10px] text-slate-800 dark:text-slate-200 print:text-gray-800">{cat.name}</h3>
              <span className="ml-auto text-[10px] text-slate-500 print:text-gray-400 font-mono">{shortcuts.length}</span>
            </div>

            <div className="p-2 print:p-1.5">
              {Object.entries(sections).map(([section, items]) => (
                <div key={section}>
                  {multiSection && (
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 print:text-gray-400 px-2 pt-1.5 pb-0.5">
                      {section}
                    </p>
                  )}
                  {items.map(s => {
                    const box = getBox ? getBox(cat.id, s.id) : null;
                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-2 px-2 py-1 print:py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700/30 print:hover:bg-transparent"
                      >
                        <span className="text-xs print:text-[8px] text-slate-700 dark:text-slate-300 print:text-gray-700 min-w-0 truncate">
                          {s.action}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {box && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full print:hidden ${BOX_STYLES[box]?.dot || 'bg-slate-600'}`}
                              title={`Box ${box}`}
                            />
                          )}
                          <kbd className="px-1.5 py-0.5 print:px-1 bg-slate-100 dark:bg-slate-900 print:bg-white border border-slate-300 dark:border-slate-600 print:border-gray-400 rounded print:shadow-sm font-mono text-[10px] print:text-[7.5px] font-bold text-indigo-600 dark:text-indigo-300 print:text-gray-800 whitespace-nowrap">
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
        );
      })}
    </div>
  );
}

// ─── 앱 내 뷰 ────────────────────────────────────────────────────────────────

export const CheatSheet = ({ onBack, progress }) => {
  const [activeTab, setActiveTab] = useState('all');

  const getBox = (categoryId, shortcutId) => {
    const key = `${categoryId}:${shortcutId}`;
    return progress?.shortcuts[key]?.box || null;
  };

  const displayCategories = activeTab === 'all'
    ? CATEGORIES
    : CATEGORIES.filter(c => c.id === activeTab);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Screen header */}
      <div className="print:hidden flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 text-xs font-bold transition-colors"
        >
          <ArrowLeft size={14} /> 뒤로
          <span className="ml-1 text-[10px] text-slate-500 dark:text-slate-600 font-mono">Esc</span>
        </button>
        <div className="flex items-center gap-2">
          <a
            href="/cheatsheet.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-bold transition-colors"
          >
            인쇄 전용 페이지 <ExternalLink size={11} />
          </a>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
          >
            <Printer size={13} /> A4 인쇄
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="print:hidden flex gap-1.5 flex-wrap mb-4 max-h-24 overflow-y-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
            activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          전체
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              activeTab === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Leitner legend */}
      <div className="print:hidden flex items-center gap-3 mb-5 text-[10px] text-slate-500">
        <span className="font-bold">Leitner:</span>
        {[1, 2, 3, 4, 5].map(box => (
          <span key={box} className={`flex items-center gap-1 ${BOX_STYLES[box].label}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${BOX_STYLES[box].dot}`} />
            Box {box}
          </span>
        ))}
      </div>

      {/* Print title (hidden on screen) */}
      <div className="hidden print:block text-center mb-4 pb-3 border-b-2 border-black">
        <h1 className="text-2xl font-black">Shortcut Pro — Cheat Sheet</h1>
        <p className="text-xs text-gray-500 mt-1">
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 기준
        </p>
      </div>

      <ShortcutGrid categories={displayCategories} getBox={getBox} />
    </div>
  );
};

// ─── 독립 인쇄 페이지용 ──────────────────────────────────────────────────────

export const CheatSheetStandalone = () => {
  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen p-6 print:p-0">
      {/* Screen header */}
      <div className="print:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-xl font-black text-gray-900">Shortcut Pro — Cheat Sheet</h1>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
        >
          <Printer size={15} /> A4 인쇄
        </button>
      </div>

      {/* Print title */}
      <div className="hidden print:block text-center mb-4 pb-3 border-b-2 border-black">
        <h1 className="text-2xl font-black">Shortcut Pro — Cheat Sheet</h1>
        <p className="text-xs text-gray-500 mt-1">
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 기준
        </p>
      </div>

      <ShortcutGrid categories={CATEGORIES} getBox={null} />
    </div>
  );
};
