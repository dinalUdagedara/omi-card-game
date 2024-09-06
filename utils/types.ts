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

export interface Card {
  suit: Suit;
  value: Value;
}

export interface Player {
  hand: Card[];
}

export type TrumpSuit = Suit | null;
