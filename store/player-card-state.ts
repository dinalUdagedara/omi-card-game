import { Suit, Card } from "@/utils/practise/types";
import { create } from "zustand";

interface CardState {
  trumpSuit: Suit | null;
  player_1_card: Card | null;
  player_2_card: Card | null;
  player_3_card: Card | null;
  player_4_card: Card | null;

  setPlayer_1_card: (newCard: Card | null) => void;
  setPlayer_2_card: (newCard: Card | null) => void;
  setPlayer_3_card: (newCard: Card | null) => void;
  setPlayer_4_card: (newCard: Card | null) => void;
}

export const CardStore = create<CardState>((set) => ({
  trumpSuit: null,
  player_1_card: null,
  player_2_card: null,
  player_3_card: null,
  player_4_card: null,

  setPlayer_1_card: (newCard: Card | null) => set({ player_1_card: newCard }),
  setPlayer_2_card: (newCard: Card | null) => set({ player_2_card: newCard }),
  setPlayer_3_card: (newCard: Card | null) => set({ player_3_card: newCard }),
  setPlayer_4_card: (newCard: Card | null) => set({ player_4_card: newCard }),
}));
