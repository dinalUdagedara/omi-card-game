import { cardMultiplayer } from "@/utils/types-multiplayer";
import { create } from "zustand";

interface MultiplayerState {
  userName: string | null;
  myCard: cardMultiplayer | null;
  opponentsCard: cardMultiplayer | null;
  winningCard: cardMultiplayer | null;
  setUsername: (newName: string | null) => void;
  setOpponentCard: (newCard: cardMultiplayer | null) => void;

  setMyCard: (newCard: cardMultiplayer | null) => void;
  setWinningCard: (newCard: cardMultiplayer | null) => void;
}

export const MultiplayerStateStore = create<MultiplayerState>((set) => ({
  userName: null,
  opponentsCard: null,
  myCard: null,
  winningCard: null,

  setUsername: (newName: string | null) => set({ userName: newName }),
  setOpponentCard: (newCard: cardMultiplayer | null) =>
    set({ opponentsCard: newCard }),
  setMyCard: (newCard: cardMultiplayer | null) => set({ myCard: newCard }),
  setWinningCard: (newCard: cardMultiplayer | null) =>
    set({ winningCard: newCard }),
}));
