import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../constants';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
}

export const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect }) => {
  const suits: { id: Suit; name: string }[] = [
    { id: 'hearts', name: '红心' },
    { id: 'diamonds', name: '方块' },
    { id: 'clubs', name: '梅花' },
    { id: 'spades', name: '黑桃' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">请选择一个新花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => (
            <button
              key={suit.id}
              onClick={() => onSelect(suit.id)}
              className={`
                flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-100
                hover:border-indigo-500 hover:bg-indigo-50 transition-all group
                ${SUIT_COLORS[suit.id]}
              `}
            >
              <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                {SUIT_SYMBOLS[suit.id]}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider opacity-60">
                {suit.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
