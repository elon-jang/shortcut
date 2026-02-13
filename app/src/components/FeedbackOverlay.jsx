import { CheckCircle2, RefreshCw, XCircle } from 'lucide-react';

export const FeedbackOverlay = ({ feedback }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      {feedback === 'correct' && (
        <div className="bg-green-500/10 p-5 md:p-6 rounded-full border-2 border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-in zoom-in-50 fade-in duration-200">
          <CheckCircle2 size={48} className="text-green-500 md:w-16 md:h-16" />
        </div>
      )}
      {feedback === 'retry' && (
        <div className="bg-yellow-500/10 p-5 md:p-6 rounded-full border-2 border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.3)] animate-in zoom-in-50 fade-in duration-200">
          <RefreshCw size={48} className="text-yellow-500 md:w-16 md:h-16" />
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="bg-red-500/10 p-5 md:p-6 rounded-full border-2 border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.3)] animate-in zoom-in-50 fade-in duration-200">
          <XCircle size={48} className="text-red-500 md:w-16 md:h-16" />
        </div>
      )}
    </div>
  );
};
