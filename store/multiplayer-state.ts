import { Id } from "@/convex/_generated/dataModel";
import { cardMultiplayer } from "@/utils/types-multiplayer";
import { create } from "zustand";

interface MultiplayerState {
  userName: string | null;
  userID: Id<"players"> | null;
  myCard: cardMultiplayer | null;
  opponentsCard: cardMultiplayer | null;
  winningCard: cardMultiplayer | null;
  roundOver: boolean | null;
  newRound: boolean;
  setUsername: (newName: string | null) => void;
  setUserID: (newUSerID: Id<"players"> | null) => void;
  setRoundOver: (newValue: boolean) => void;
  setNewRound: (newValue: boolean) => void;
  setOpponentCard: (newCard: cardMultiplayer | null) => void;

  setMyCard: (newCard: cardMultiplayer | null) => void;
  setWinningCard: (newCard: cardMultiplayer | null) => void;
}

export const MultiplayerStateStore = create<MultiplayerState>((set) => ({
  userName: null,
  userID: null,
  opponentsCard: null,
  myCard: null,
  winningCard: null,
  roundOver: null,
  newRound: false,

  setUsername: (newName: string | null) => set({ userName: newName }),
  setUserID: (newUserID: Id<"players"> | null) => set({ userID: newUserID }),
  setRoundOver: (newvalue: boolean) => set({ roundOver: newvalue }),
  setNewRound: (newvalue: boolean) => set({ newRound: newvalue }),
  setOpponentCard: (newCard: cardMultiplayer | null) =>
    set({ opponentsCard: newCard }),
  setMyCard: (newCard: cardMultiplayer | null) => set({ myCard: newCard }),
  setWinningCard: (newCard: cardMultiplayer | null) =>
    set({ winningCard: newCard }),
}));
