import { Card } from "@/utils/types";
import { create } from "zustand";

interface MultiplayerState {
  userName: string | null;
  opponentsCard: Card | null;
  setUsername: (newName: string | null) => void;
  setOpponentCard: (newCard: Card | null) => void;

}

export const MultiplayerStateStore = create<MultiplayerState>((set) => ({
  userName: null,
  opponentsCard:null,

  setUsername: (newName: string | null) => set({ userName: newName }),
  setOpponentCard: (newCard: Card | null) => set({ opponentsCard: newCard }),
}));
