export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Value =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

// Map of card values to their ranking
export const valueRanking: { [key in Value]: number } = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14, // Ace is the highest value
};

// Helper function to validate the suit
export function isValidSuit(suit: string): suit is Suit {
  return suits.includes(suit as Suit);
}

export type suitWithLogo = {
  suit: Suit;
  logoUrl: string;
};

export const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

export const suitsWithLogos: suitWithLogo[] = [
  {
    suit: "hearts",
    logoUrl: "/assets/suits/hearts.png",
  },
  {
    suit: "clubs",
    logoUrl: "/assets/suits/clubs.png",
  },
  {
    suit: "spades",
    logoUrl: "/assets/suits/spades.png",
  },
  {
    suit: "diamonds",
    logoUrl: "/assets/suits/diamonds.png",
  },
];

export const exampleCard = {
  suit: "hearts",
  value: "7",
};

export const exampleCardSet: Card[] = [
  { suit: "hearts", value: "7" },
  { suit: "hearts", value: "8" },
  { suit: "hearts", value: "9" },
  { suit: "hearts", value: "10" },
  { suit: "diamonds", value: "J" },
  { suit: "diamonds", value: "Q" },
  { suit: "clubs", value: "K" },
  { suit: "clubs", value: "A" },
  { suit: "spades", value: "7" },
  { suit: "spades", value: "8" },
];


export const roundFinishMessages: RoundFinishMessage[] = [
  {
    value: 1,
    title: "Won Without Calling Trumps",
    message: "Gained 2 tokens",
  },
  {
    value: 2,
    title: "Won Calling Trumps",
    message: "Gained 1 token",
  },
  {
    value: 3,
    title: "Lost Without Calling Trumps",
    message: "Lost 1 token",
  },
  {
    value: 4,
    title: "Lost Calling Trumps",
    message: "Lost 2 tokens",
  },
  {
    value: 5,
    title: "Game Tied",
    message: "",
  },
];

export interface RoundFinishMessage {
  value: number;
  title: string;
  message: string;
}

export interface Card {
  suit: Suit;
  value: Value;
}

export interface Player {
  hand: Card[];
}

export type TrumpSuit = Suit | null;
