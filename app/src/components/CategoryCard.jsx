import { ChevronRight, Search } from 'lucide-react';
import { CATEGORIES } from '../data/shortcuts';

export const CategoryCard = ({ searchQuery, setSearchQuery, onSelectCategory }) => {
  const filteredCategories = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
        <h2 className="text-3xl font-black italic tracking-tight underline decoration-indigo-500 decoration-4 underline-offset-8">
          수련 도구 선택
        </h2>
        <div className="relative w-full sm:w-80">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-14 pr-6 text-base focus:ring-2 focus:ring-indigo-500/40 outline-none w-full transition-all backdrop-blur shadow-lg"
            placeholder="도구를 검색하세요..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {filteredCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group bg-slate-800/40 p-10 rounded-[2.5rem] border border-slate-700 hover:border-indigo-500 hover:bg-slate-800/80 transition-all text-left flex items-center justify-between shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="flex items-center gap-8">
              <span className="text-6xl group-hover:scale-110 transition-all duration-500">{cat.icon}</span>
              <div>
                <h4 className="font-black text-2xl mb-1.5 group-hover:text-indigo-300 transition-colors">{cat.name}</h4>
                <p className="text-base text-slate-500 font-medium">{cat.desc}</p>
              </div>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-2xl group-hover:bg-indigo-600 transition-all shadow-lg">
              <ChevronRight size={24} className="text-slate-500 group-hover:text-white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
