import { Suit, Card } from "@/utils/types";
import { create } from "zustand";

interface UseState {
  trumpSuit: Suit | null;
  trumpSelected: boolean | null;
  selectedCardByUser: Card | null;
  isCardsGenerated: boolean;
  roundsWonbyTeam1: number;
  roundsWonbyTeam2: number;
  team1Points: number;
  team2Points: number;
  winningCard: Card | null;
  thisRoundWinner: number | null;
  isSubmitted: boolean;
  roundWinners: number | null,
  selectedSuit : Suit | null,
  isGameOver: boolean,

  setTrumpSuit: (newSuit: Suit | null) => void;
  setTrumpSelected: (selected: boolean) => void;
  setSelectedCardByUser: (card: Card | null) => void;
  setIsCardsGenerated: (newValue: boolean) => void;
  setRoundsWonbyTeam1: (newValue: number) => void;
  setRoundsWonbyTeam2: (newValue: number) => void;
  setTeam1Points: (newValue: number) => void;
  setTeam2Points: (newValue: number) => void;
  setWinningCard: (newCard: Card | null) => void;
  setThisRoundWinner: (newWinner: number | null) => void;
  setIsSubmitted: (newValuw: boolean) => void;
  setRoundWinners: (newvalue: number | null) => void;
  setSelectedSuit: (newSuit: Suit | null) => void;
  setIsGameOver: (newValuw: boolean) => void;
}

export const useStore = create<UseState>((set) => ({
  trumpSuit: null,
  trumpSelected: true,
  selectedCardByUser: null,
  isCardsGenerated: false,
  roundsWonbyTeam1: 0,
  roundsWonbyTeam2: 0,
  team1Points: 0,
  team2Points: 0,
  winningCard: null,
  thisRoundWinner: null,
  isSubmitted: false,
  roundWinners: null,
  selectedSuit : null,
  isGameOver:false,



  setTrumpSuit: (newSuit: Suit | null) => set({ trumpSuit: newSuit }),
  setTrumpSelected: (selected: boolean) => set({ trumpSelected: selected }),
  setSelectedCardByUser: (card: Card | null) =>
    set({ selectedCardByUser: card }),
  setIsCardsGenerated: (newValue: boolean) =>
    set({ isCardsGenerated: newValue }),
  setRoundsWonbyTeam1: (newValue: number) =>
    set({ roundsWonbyTeam1: newValue }),
  setRoundsWonbyTeam2: (newValue: number) =>
    set({ roundsWonbyTeam2: newValue }),

  setTeam1Points: (newValue: number) => set({ team1Points: newValue }),
  setTeam2Points: (newValue: number) => set({ team2Points: newValue }),

  setWinningCard: (newCard: Card | null) => set({ winningCard: newCard }),
  setThisRoundWinner: (newWinner: number | null) =>
    set({ thisRoundWinner: newWinner }),
  setIsSubmitted: (newvalue: boolean) => set({ isSubmitted: newvalue }),
  setRoundWinners: (newValue: number | null) => set({ roundWinners: newValue }),
  setSelectedSuit: (newSuit: Suit | null) => set({ selectedSuit: newSuit }),
  setIsGameOver: (newvalue: boolean) => set({ isGameOver: newvalue })
}));
