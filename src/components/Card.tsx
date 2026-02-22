import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../constants';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isFaceDown?: boolean;
  disabled?: boolean;
  isPlayable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  isFaceDown = false, 
  disabled = false,
  isPlayable = false,
  className = ""
}) => {
  const symbol = SUIT_SYMBOLS[card.suit];
  const color = SUIT_COLORS[card.suit];

  return (
    <motion.div
      layoutId={card.id}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!disabled && isPlayable ? { y: -10, scale: 1.05 } : {}}
      whileTap={!disabled && isPlayable ? { scale: 0.95 } : {}}
      onClick={!disabled && isPlayable ? onClick : undefined}
      className={`
        relative w-24 h-36 sm:w-28 sm:h-40 rounded-xl shadow-lg cursor-pointer transition-all duration-200
        ${isFaceDown ? 'bg-indigo-800 border-4 border-white' : 'bg-white border border-gray-200'}
        ${isPlayable && !disabled ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
        ${disabled ? 'cursor-not-allowed grayscale-[0.5]' : ''}
        ${className}
      `}
    >
      {isFaceDown ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-24 border-2 border-white/20 rounded-lg flex items-center justify-center">
            <div className="text-white/20 text-4xl font-bold">T</div>
          </div>
        </div>
      ) : (
        <div className={`w-full h-full p-2 flex flex-col justify-between ${color}`}>
          <div className="flex flex-col items-start leading-none">
            <span className="text-xl font-bold">{card.rank}</span>
            <span className="text-lg">{symbol}</span>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-7xl">{symbol}</span>
          </div>

          <div className="flex flex-col items-end leading-none rotate-180">
            <span className="text-xl font-bold">{card.rank}</span>
            <span className="text-lg">{symbol}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
