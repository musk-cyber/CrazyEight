import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';
import { PlayerType } from '../types';

interface GameOverProps {
  winner: PlayerType;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ winner, onRestart }) => {
  const isPlayer = winner === 'player';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-sm w-full text-center">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isPlayer ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}`}>
          <Trophy size={40} />
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-slate-900">
          {isPlayer ? '你赢了！' : 'AI 赢了！'}
        </h2>
        <p className="text-slate-500 mb-8">
          {isPlayer ? '太棒了！你率先出完了所有的牌。' : '下次再接再厉！AI 的策略更胜一筹。'}
        </p>

        <button
          onClick={onRestart}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={20} />
          再玩一局
        </button>
      </div>
    </motion.div>
  );
};
