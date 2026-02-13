import { X } from 'lucide-react';

const Key = ({ children }) => (
  <kbd className="inline-block bg-slate-700 border border-slate-600 rounded px-1.5 py-0.5 text-[11px] font-mono font-bold text-slate-200 min-w-[22px] text-center">
    {children}
  </kbd>
);

const Row = ({ keys, desc }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex items-center gap-1 shrink-0 w-24 justify-end">
      {keys.map((k, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 && <span className="text-slate-600 text-[10px]">/</span>}
          <Key>{k}</Key>
        </span>
      ))}
    </div>
    <span className="text-slate-400 text-xs">{desc}</span>
  </div>
);

export const KeyboardHelp = ({ gameState, currentMode, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl p-5 md:p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black tracking-tight uppercase text-slate-300">Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Global</p>
            <Row keys={['?']} desc="이 도움말 토글" />
            <Row keys={['Esc']} desc="뒤로 가기" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Menu</p>
            <Row keys={['1~9']} desc="카테고리 선택" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Mode Select</p>
            <Row keys={['1']} desc="객관식 퀴즈" />
            <Row keys={['2']} desc="리얼 키 입력" />
            <Row keys={['3']} desc="플래시카드" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Playing</p>
            <Row keys={['1~4']} desc="객관식 답 선택" />
            <Row keys={['Space']} desc="플래시카드 뒤집기" />
            <Row keys={['\u2192']} desc="외웠어요 (플래시카드)" />
            <Row keys={['\u2190']} desc="다음에 (플래시카드)" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Result</p>
            <Row keys={['Enter']} desc="다시 수련" />
            <Row keys={['Esc']} desc="모드 선택" />
          </div>
        </div>

        <p className="text-[9px] text-slate-600 mt-4 text-center">Press <Key>?</Key> or <Key>Esc</Key> to close</p>
      </div>
    </div>
  );
};
