import { ChevronRight, Search } from 'lucide-react';
import { CATEGORIES, SHORTCUT_DATA } from '../data/shortcuts';

export const CategoryCard = ({ searchQuery, setSearchQuery, onSelectCategory, getCategoryProgress }) => {
  const filteredCategories = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center gap-4 mb-4">
        <h2 className="text-lg md:text-xl font-black tracking-tight">
          수련 도구 선택
        </h2>
        <div className="relative w-56 md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm md:text-base focus:ring-1 focus:ring-indigo-500/40 outline-none w-full transition-all"
            placeholder="검색..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:gap-3">
        {filteredCategories.map(cat => {
          const totalShortcuts = (SHORTCUT_DATA[cat.id] || []).length;
          const { mastered } = getCategoryProgress(cat.id);
          const pct = totalShortcuts > 0 ? Math.round((mastered / totalShortcuts) * 100) : 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-slate-800/30 px-4 py-3 md:py-3.5 rounded-xl border border-slate-700/60 hover:border-indigo-500/60 hover:bg-slate-800/60 transition-all text-left flex items-center gap-3"
            >
              <span className="text-2xl md:text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm md:text-base group-hover:text-indigo-300 transition-colors truncate">{cat.name}</h4>
                  {mastered > 0 && (
                    <span className="text-[9px] md:text-[10px] font-bold text-emerald-400/80 shrink-0">
                      {mastered}/{totalShortcuts}
                    </span>
                  )}
                </div>
                <p className="text-[11px] md:text-xs text-slate-500 truncate">{cat.desc}</p>
                {mastered > 0 && (
                  <div className="w-full h-1 bg-slate-700/50 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
              <ChevronRight size={14} className="text-slate-700 group-hover:text-indigo-400 shrink-0 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
