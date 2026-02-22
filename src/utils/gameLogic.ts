import { Card, Suit, Rank } from '../types';
import { SUITS, RANKS } from '../constants';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({
        suit,
        rank,
        id: `${rank}-${suit}-${Math.random().toString(36).substr(2, 9)}`,
      });
    });
  });
  return shuffle(deck);
};

export const shuffle = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const canPlayCard = (card: Card, topCard: Card, wildSuit: Suit | null): boolean => {
  if (card.rank === '8') return true;
  
  const targetSuit = wildSuit || topCard.suit;
  return card.suit === targetSuit || card.rank === topCard.rank;
};

export const getAiMove = (hand: Card[], topCard: Card, wildSuit: Suit | null): Card | null => {
  // Try to play a normal card first
  const normalMove = hand.find(c => c.rank !== '8' && canPlayCard(c, topCard, wildSuit));
  if (normalMove) return normalMove;

  // If no normal card, try to play an 8
  const eightMove = hand.find(c => c.rank === '8');
  if (eightMove) return eightMove;

  return null;
};

export const getBestSuitForAi = (hand: Card[]): Suit => {
  const counts: Record<Suit, number> = {
    hearts: 0,
    diamonds: 0,
    clubs: 0,
    spades: 0,
  };

  hand.forEach(card => {
    if (card.rank !== '8') {
      counts[card.suit]++;
    }
  });

  return (Object.keys(counts) as Suit[]).reduce((a, b) => counts[a] > counts[b] ? a : b);
};
