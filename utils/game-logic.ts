import { Suit, Value, Card, Player, TrumpSuit } from "./types";

export const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
export const values: Value[] = ["7", "8", "9", "10", "J", "Q", "K", "A"];
let trumpSuit: TrumpSuit = null;
let turnSuit: TrumpSuit = null;

let lastWinnerNumber: number | null = null;
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
  const deckLength = deck.length / 4;
  for (let i = 0; i < deckLength; i++) {
    hands.forEach((hand) => hand.hand.push(deck.pop() as Card));
  }
  return hands;
}

export function setTrump(suit: Suit | null): void {
  trumpSuit = suit;
}

export function getTrump(): TrumpSuit {
  return trumpSuit;
}

export function setTurnSuit(suit: Suit | null): void {
  turnSuit = suit;
}

export function getTurnSuit(): TrumpSuit {
  return turnSuit;
}

export function setLastWinner(playerNumber: number): void {
  lastWinnerNumber = playerNumber;
}

export function getLastWinner(): number | null {
  return lastWinnerNumber;
}

export function checkWinnerForTurn(
  usersInput: Card,
  generatedCards: Card[],
  winningCard: Card
): number {
  let returnValue: number | null = 0;

  // Check if the user's input matches the winning card
  if (compareCards(usersInput, winningCard)) {
    return 0;
  }

  // Iterate over the generated cards to find a match
  generatedCards.forEach((card, index) => {
    if (compareCards(winningCard, card)) {
      returnValue = index + 1;
    }
  });
  setLastWinner(returnValue);

  return returnValue;
}

export function determineTrickWinner(cards: Card[]): Card {
  let winningCard = cards[0];

  cards.forEach((card) => {
    //if only one card from the trumpSuit is available
    if (card.suit === trumpSuit && winningCard.suit !== trumpSuit) {
      winningCard = card;
    }
    //if there are more than one card from the trumpsuit is available
    else if (
      card.suit === trumpSuit &&
      winningCard.suit === trumpSuit &&
      getValueRank(card.value) > getValueRank(winningCard.value)
    ) {
      winningCard = card;
    }
    //if there are no cards from the trumpsuit and only one card from the turnsuit
    else if (
      card.suit === turnSuit &&
      winningCard.suit !== turnSuit &&
      winningCard.suit !== trumpSuit
    ) {
      winningCard = card;
    } else if (
      // if there are more than one card from the turnsuit and nothing from trumpsuit
      card.suit === turnSuit &&
      winningCard.suit !== trumpSuit &&
      winningCard.suit === turnSuit &&
      getValueRank(card.value) > getValueRank(winningCard.value)
    ) {
      winningCard = card;
    } else if (
      //if there are no trump suits and turn suits
      card.suit !== turnSuit &&
      winningCard.suit !== trumpSuit &&
      winningCard.suit !== turnSuit &&
      getValueRank(card.value) > getValueRank(winningCard.value)
    ) {
      winningCard = card;
    }
  });

  return winningCard;
}

function getValueRank(value: Value): number {
  return values.indexOf(value);
}

function compareCards(card1: Card, card2: Card): boolean {
  return card1.suit === card2.suit && card1.value === card2.value;
}
