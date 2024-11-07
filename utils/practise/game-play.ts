import { getTrump } from "../practise/game-logic";
import { Suit, Card, valueRanking } from "./types";

export function shuffleDeck(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

//get a random card by adding a hand
export function chooseCard(hand: Card[], turnSuit: Suit): Card {
  // console.log("hand", hand);
  // Filter the cards that have the same suit as turnSuit
  const turnSuitCards = hand.filter((card) => card.suit === turnSuit);
  // console.log("Turn suit cards: ", turnSuitCards);

  const trumpSuit = getTrump();

  const trumpSuitCards = hand.filter((card) => card.suit === trumpSuit);
  // console.log("Trump Suit cards: ", trumpSuitCards);

  // If there are cards with the turn suit, pick one at random -- change this to get highest value
  if (turnSuitCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * turnSuitCards.length);
    // console.log("Selected turn suit card index: ", randomIndex);
    return turnSuitCards[randomIndex];
  } else if (trumpSuitCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * trumpSuitCards.length);
    // console.log("Selected trump suit card index: ", randomIndex);
    return trumpSuitCards[randomIndex];
  }

  // If no cards with the turn suit and trump suit, pick a random card from the entire hand
  const randomIndex = Math.floor(Math.random() * hand.length);
  // console.log("Selected random card index: ", randomIndex);
  return hand[randomIndex];
}

// Function to choose the card with the highest value from the hand
export function chooseCardWithoutTurnSuit(hand: Card[]): Card {
  if (hand.length === 0) {
    throw new Error("Hand is empty, no cards to choose from.");
  }
  // Assume the first card has the highest value initially
  let highestCard = hand[0];
  // Iterate through the hand to find the card with the highest value
  for (let i = 1; i < hand.length; i++) {
    if (valueRanking[hand[i].value] > valueRanking[highestCard.value]) {
      highestCard = hand[i];
    }
  }
  return highestCard;
}
