import { CheckCircle2, RefreshCw, XCircle } from 'lucide-react';

export const FeedbackOverlay = ({ feedback }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      {feedback === 'correct' && (
        <div className="bg-green-500/15 p-20 rounded-full border-4 border-green-500/50 shadow-[0_0_100px_rgba(34,197,94,0.5)] animate-in zoom-in-50 fade-in duration-300">
          <CheckCircle2 size={160} className="text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]" />
        </div>
      )}
      {feedback === 'retry' && (
        <div className="bg-yellow-500/15 p-20 rounded-full border-4 border-yellow-500/50 shadow-[0_0_100px_rgba(234,179,8,0.5)] animate-in zoom-in-50 fade-in duration-300">
          <RefreshCw size={160} className="text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]" />
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="bg-red-500/15 p-20 rounded-full border-4 border-red-500/50 shadow-[0_0_100px_rgba(239,68,68,0.5)] animate-in zoom-in-50 fade-in duration-300">
          <XCircle size={160} className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
        </div>
      )}
    </div>
  );
};
