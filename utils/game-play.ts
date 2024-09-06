import { Suit, Value, Card, Player, TrumpSuit } from "./types";

export function shuffleDeck(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

//get a random card by adding a hand
export function chooseCard(hand: Card[]): Card {
  const j = Math.floor(Math.random() * hand.length);
  console.log("generated index:", j);
  return hand[j];
}


