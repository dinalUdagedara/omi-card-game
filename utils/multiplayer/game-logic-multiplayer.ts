import { Suit, Value, Card, Player, TrumpSuit } from "../types";
import { suits, values } from "../game-logic";
import { cardMultiplayer } from "../types-multiplayer";

let trumpSuit: TrumpSuit = null;
let turnSuit: TrumpSuit = null;

export function createDeck(): Card[] {
  const deck: Card[] = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ suit, value });
    });
  });
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

//divide cards among players
export function dealCards(deck: Card[], numberOfPlayers: number): Player[] {
  const hands: Player[] = Array(numberOfPlayers)
    .fill({ hand: [] })
    .map(() => ({ hand: [] }));
  // const deckLength = deck.length / 4;
  const deckLength = 3;
  for (let i = 0; i < deckLength; i++) {
    hands.forEach((hand) => hand.hand.push(deck.pop() as Card));
  }
  return hands;
}

export function setTrump(suit: Suit | null): void {
  trumpSuit = suit;
}

export function checkIfViolationOccured(
  playedCard: cardMultiplayer,
  cardDeck: { suit: string; value: string }[],
  turnSuit: string
): boolean {
  const hasTurnSuitCards = cardDeck.some((card) => card.suit === turnSuit);
  const sameSuitcard = playedCard.suit === turnSuit;

  if (hasTurnSuitCards && !sameSuitcard) {
    // Player had cards from the turn suit but played something else, reduce 10 XP
    console.log("Player commited Violance: ");
    return true;
  } else {
    return false;
  }
}
