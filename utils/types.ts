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
  {
    suit: "hearts",
    value: "7",
  },
  {
    suit: "hearts",
    value: "7",
  },
  {
    suit: "hearts",
    value: "7",
  },
  {
    suit: "hearts",
    value: "7",
  },
  {
    suit: "hearts",
    value: "7",
  },
  {
    suit: "hearts",
    value: "7",
  },
  {
    suit: "hearts",
    value: "7",
  },
  {
    suit: "hearts",
    value: "7",
  },
  {
    suit: "hearts",
    value: "7",
  },
  {
    suit: "hearts",
    value: "7",
  },
];




export interface Card {
  suit: Suit;
  value: Value;
}

export interface Player {
  hand: Card[];
}

export type TrumpSuit = Suit | null;
