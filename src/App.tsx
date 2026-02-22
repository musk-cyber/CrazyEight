import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Layers, User, Bot, AlertCircle, Info } from 'lucide-react';
import { Card as CardComp } from './components/Card';
import { SuitSelector } from './components/SuitSelector';
import { GameOver } from './components/GameOver';
import { StartScreen } from './components/StartScreen';
import { Card, Suit, GameStatus, PlayerType, GameState } from './types';
import { createDeck, canPlayCard, getAiMove, getBestSuitForAi, shuffle } from './utils/gameLogic';
import { INITIAL_HAND_SIZE, SUIT_SYMBOLS, SUIT_COLORS } from './constants';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentTurn: 'player',
    gameStatus: 'waiting',
    winner: null,
    wildSuit: null,
  });

  const [message, setMessage] = useState<string>("欢迎来到 Musk 的疯狂 8 点！");
  const aiThinkingRef = useRef<boolean>(false);

  const suitNames: Record<Suit, string> = {
    hearts: '红心',
    diamonds: '方块',
    clubs: '梅花',
    spades: '黑桃',
  };

  // Initialize game
  const initGame = useCallback(() => {
    const fullDeck = createDeck();
    const playerHand = fullDeck.splice(0, INITIAL_HAND_SIZE);
    const aiHand = fullDeck.splice(0, INITIAL_HAND_SIZE);
    
    // Ensure first discard is not an 8
    let discardIndex = 0;
    while (fullDeck[discardIndex].rank === '8') {
      discardIndex++;
    }
    const discardPile = [fullDeck.splice(discardIndex, 1)[0]];
    const deck = fullDeck;

    setGameState({
      deck,
      playerHand,
      aiHand,
      discardPile,
      currentTurn: 'player',
      gameStatus: 'playing',
      winner: null,
      wildSuit: null,
    });
    setMessage("轮到你了！匹配花色或点数。");
  }, []);

  useEffect(() => {
    // Game initialization is now handled by StartScreen
  }, []);

  const checkWin = (hand: Card[], player: PlayerType) => {
    if (hand.length === 0) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'game-over',
        winner: player
      }));
      if (player === 'player') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      return true;
    }
    return false;
  };

  const playCard = (card: Card, player: PlayerType) => {
    const isPlayer = player === 'player';
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];

    if (!canPlayCard(card, topCard, gameState.wildSuit)) return;

    const newHand = (isPlayer ? gameState.playerHand : gameState.aiHand).filter(c => c.id !== card.id);
    const newDiscard = [...gameState.discardPile, card];

    if (card.rank === '8') {
      setGameState(prev => ({
        ...prev,
        [isPlayer ? 'playerHand' : 'aiHand']: newHand,
        discardPile: newDiscard,
        gameStatus: isPlayer ? 'selecting-suit' : prev.gameStatus,
        wildSuit: null, // Reset until selection
      }));
      
      if (!isPlayer) {
        // AI selects suit
        const bestSuit = getBestSuitForAi(newHand);
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            wildSuit: bestSuit,
            currentTurn: 'player'
          }));
          setMessage(`AI 打出了 8 并选择了 ${suitNames[bestSuit]}`);
          checkWin(newHand, 'ai');
        }, 400);
      }
    } else {
      setGameState(prev => ({
        ...prev,
        [isPlayer ? 'playerHand' : 'aiHand']: newHand,
        discardPile: newDiscard,
        currentTurn: isPlayer ? 'ai' : 'player',
        wildSuit: null,
      }));
      setMessage(isPlayer ? "AI 正在思考..." : "轮到你了！");
      checkWin(newHand, player);
    }
  };

  const drawCard = (player: PlayerType) => {
    // 在此模式下，不再摸牌，而是直接跳过回合
    const isPlayer = player === 'player';
    setGameState(prev => ({
      ...prev,
      currentTurn: isPlayer ? 'ai' : 'player'
    }));
    
    setMessage(isPlayer ? "你没有可出的牌，跳过本回合。" : "AI 没有可出的牌，跳过本回合。");
  };

  // AI Logic
  useEffect(() => {
    if (gameState.currentTurn === 'ai' && gameState.gameStatus === 'playing' && !aiThinkingRef.current) {
      aiThinkingRef.current = true;
      const timer = setTimeout(() => {
        const topCard = gameState.discardPile[gameState.discardPile.length - 1];
        const move = getAiMove(gameState.aiHand, topCard, gameState.wildSuit);

        if (move) {
          playCard(move, 'ai');
        } else {
          // AI 无牌可出，直接跳过
          drawCard('ai');
        }
        aiThinkingRef.current = false;
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentTurn, gameState.gameStatus, gameState.aiHand, gameState.discardPile, gameState.wildSuit]);

  const handleSuitSelect = (suit: Suit) => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      wildSuit: suit,
      currentTurn: 'ai'
    }));
    setMessage(`你选择了 ${suitNames[suit]}。轮到 AI。`);
    checkWin(gameState.playerHand, 'player');
  };

  const topCard = gameState.discardPile.length > 0 
    ? gameState.discardPile[gameState.discardPile.length - 1] 
    : null;

  const playerHasMove = topCard ? gameState.playerHand.some(card => canPlayCard(card, topCard, gameState.wildSuit)) : false;

  return (
    <div className="min-h-screen bg-[#0a2e1a] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      {gameState.gameStatus !== 'waiting' && (
        <>
          {/* Header */}
          <header className="p-4 flex justify-between items-center border-b border-white/10 bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-2xl font-black italic">8</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Musk 的疯狂 8 点</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => initGame()}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="重新开始"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </header>

          {/* Game Area */}
          <main className="flex-1 relative flex flex-col items-center justify-between p-4 sm:p-8">
            
            {/* AI Hand */}
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4 px-4 py-1 bg-black/30 rounded-full border border-white/5">
                <Bot size={16} className={gameState.currentTurn === 'ai' ? 'text-emerald-400 animate-pulse' : 'text-slate-400'} />
                <span className="text-sm font-semibold uppercase tracking-widest opacity-70">AI 对手</span>
                <span className="ml-2 px-2 bg-white/10 rounded text-xs">{gameState.aiHand.length} 张牌</span>
              </div>
              <div className="flex justify-center -space-x-12 sm:-space-x-16 h-32 sm:h-40">
                <AnimatePresence>
                  {gameState.aiHand.map((card, index) => (
                    <CardComp 
                      key={card.id} 
                      card={card} 
                      isFaceDown 
                      className="hover:z-10 transition-all"
                      style={{ zIndex: index }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Center Table */}
            <div className="flex flex-col items-center justify-center my-8">
              {/* Discard Pile */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <AnimatePresence mode="popLayout">
                    {topCard && (
                      <CardComp 
                        key={topCard.id} 
                        card={topCard} 
                        className="shadow-2xl"
                      />
                    )}
                  </AnimatePresence>
                  
                  {gameState.wildSuit && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-emerald-500"
                    >
                      <span className={`text-2xl ${SUIT_COLORS[gameState.wildSuit]}`}>
                        {SUIT_SYMBOLS[gameState.wildSuit]}
                      </span>
                    </motion.div>
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-tighter opacity-40">弃牌堆</span>
              </div>
            </div>

            {/* Message Bar */}
            <div className="w-full max-w-lg mb-4 flex flex-col items-center gap-4">
              <motion.div 
                key={message}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl w-full"
              >
                <Info size={18} className="text-emerald-400 shrink-0" />
                <p className="text-sm sm:text-base font-medium text-emerald-50 leading-tight">
                  {message}
                </p>
              </motion.div>

              {/* Skip Button for Player */}
              <AnimatePresence>
                {gameState.currentTurn === 'player' && !playerHasMove && gameState.gameStatus === 'playing' && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={() => drawCard('player')}
                    className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center gap-2"
                  >
                    <AlertCircle size={20} />
                    无牌可出，跳过回合
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Player Hand */}
            <div className="w-full max-w-5xl flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4 px-4 py-1 bg-black/30 rounded-full border border-white/5">
                <User size={16} className={gameState.currentTurn === 'player' ? 'text-emerald-400 animate-pulse' : 'text-slate-400'} />
                <span className="text-sm font-semibold uppercase tracking-widest opacity-70">你的手牌</span>
                <span className="ml-2 px-2 bg-white/10 rounded text-xs">{gameState.playerHand.length} 张牌</span>
              </div>
              
              <div className="flex justify-center flex-wrap gap-2 sm:gap-4 max-w-full px-4 pb-4">
                <AnimatePresence>
                  {gameState.playerHand.map((card) => (
                    <CardComp
                      key={card.id}
                      card={card}
                      isPlayable={gameState.currentTurn === 'player' && gameState.gameStatus === 'playing' && topCard && canPlayCard(card, topCard, gameState.wildSuit)}
                      onClick={() => playCard(card, 'player')}
                      disabled={gameState.currentTurn !== 'player' || gameState.gameStatus !== 'playing'}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </main>
        </>
      )}

      {/* Modals */}
      <AnimatePresence>
        {gameState.gameStatus === 'waiting' && (
          <StartScreen onStart={() => initGame()} />
        )}
        {gameState.gameStatus === 'selecting-suit' && (
          <SuitSelector onSelect={handleSuitSelect} />
        )}
        {gameState.gameStatus === 'game-over' && gameState.winner && (
          <GameOver winner={gameState.winner} onRestart={() => initGame()} />
        )}
      </AnimatePresence>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-20 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}

function RotateCcw({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
