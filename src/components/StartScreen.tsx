import React from 'react';
import { motion } from 'motion/react';
import { Play, Info, Settings } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a2e1a] p-4 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        <div className="mb-12">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-32 h-32 bg-emerald-500 mx-auto rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-8"
          >
            <span className="text-7xl font-black italic text-white">8</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white mb-4">
            疯狂 8 点
          </h1>
          <p className="text-emerald-400 font-medium tracking-widest uppercase text-sm sm:text-base">
            Musk 精心呈现
          </p>
        </div>

        <div className="space-y-4 max-w-xs mx-auto">
          <button
            onClick={onStart}
            className="w-full py-5 px-8 bg-white text-[#0a2e1a] rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <Play fill="currentColor" size={24} />
            开始游戏
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 px-6 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10">
              <Info size={18} />
              游戏规则
            </button>
            <button className="py-4 px-6 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10">
              <Settings size={18} />
              设置
            </button>
          </div>
        </div>

        <div className="mt-16 flex justify-center gap-8 opacity-40">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">52</span>
            <span className="text-[10px] uppercase tracking-widest font-black">张牌</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">2</span>
            <span className="text-[10px] uppercase tracking-widest font-black">名玩家</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">∞</span>
            <span className="text-[10px] uppercase tracking-widest font-black">乐趣</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
