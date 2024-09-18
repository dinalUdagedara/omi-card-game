import { Suit, Card, Player } from "@/utils/types";
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
  roundWinners: number | null;
  selectedSuit: Suit | null;
  isGameOver: boolean;
  dealtHands: Player[];
  roundNumber: number;
  turnNumber: number;

  cardSet: Card[];
  turnSuit: Suit | null;
  generatedCards: Card[] | null;
  lastWinner: number | null;
  team_1_penaltyCards: number;
  team_2_penaltyCards: number;
  trumpSetter: number;
  isUserTurn: boolean;
  gameWinner: 1 | 2 | null, 

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
  setIsSubmitted: (newValue: boolean) => void;
  setRoundWinners: (newValue: number | null) => void;
  setSelectedSuit: (newSuit: Suit | null) => void;
  setIsGameOver: (newValue: boolean) => void;
  setDealtHands: (newValue: Player[]) => void;
  setRoundNumber: (newValue: number) => void;
  setTurnNumber: (newValue: number) => void;
  setCardSet: (newSet: Card[]) => void;
  setTurnSuit: (newSuit: Suit | null) => void;
  setGeneratedCards: (newCards: Card[] | null) => void;
  setLastWinner: (newWinner: number | null) => void;
  setTeam_1_penaltyCards: (newNumber: number) => void;
  setTeam_2_penaltyCards: (newNumber: number) => void;   setTrumpSetter: (newSetter: number) => void;

  setIsUserTurn: (newValue: boolean) => void;
  setGameWinner: (newValue: 1 | 2 | null) => void;
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
  selectedSuit: null,
  isGameOver: false,
  dealtHands: [],
  roundNumber: 1,
  turnNumber: 1,
  cardSet: [],
  turnSuit: null,
  generatedCards: null,
  lastWinner: 0,
  team_1_penaltyCards: 10,
  team_2_penaltyCards: 10,
  trumpSetter: 1,
  isUserTurn: true,
  gameWinner: null,

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
  setIsSubmitted: (newValue: boolean) => set({ isSubmitted: newValue }),
  setRoundWinners: (newValue: number | null) => set({ roundWinners: newValue }),
  setSelectedSuit: (newSuit: Suit | null) => set({ selectedSuit: newSuit }),
  setIsGameOver: (newValue: boolean) => set({ isGameOver: newValue }),
  setDealtHands: (newValue: Player[]) => set({ dealtHands: newValue }),
  setRoundNumber: (newValue: number) => set({ roundNumber: newValue }),
  setTurnNumber: (newValue: number) => set({ turnNumber: newValue }),
  setCardSet: (newSet: Card[]) => set({ cardSet: newSet }),
  setTurnSuit: (newSuit: Suit | null) => set({ turnSuit: newSuit }),
  setGeneratedCards: (newCards: Card[] | null) =>
    set({ generatedCards: newCards }),
  setLastWinner: (newWinner: number | null) => set({ lastWinner: newWinner }),
  setTeam_1_penaltyCards: (newNumber: number) =>
    set({ team_1_penaltyCards: newNumber }),
  setTeam_2_penaltyCards: (newNumber: number) =>
    set({ team_2_penaltyCards: newNumber }),
  setTrumpSetter: (newSetter: number) => set({ trumpSetter: newSetter }),
  setIsUserTurn: (newValue: boolean) => set({ isUserTurn: newValue }),
  setGameWinner: (newValue: 1 | 2 | null) => set({ gameWinner: newValue }),
}));
