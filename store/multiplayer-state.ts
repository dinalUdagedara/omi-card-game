import { Id } from "@/convex/_generated/dataModel";
import { cardMultiplayer } from "@/utils/multiplayer/types-multiplayer";
import { create } from "zustand";

interface MultiplayerState {
  userName: string | null;
  userID: Id<"players"> | null;
  trumpSetter: Id<"players"> | null;
  myCard: cardMultiplayer | null;
  teamMateCard: cardMultiplayer | null;
  opponent1Card: cardMultiplayer | null;
  opponent2Card: cardMultiplayer | null;
  opponentsCard: cardMultiplayer | null;
  winningCard: cardMultiplayer | null;
  roundOver: boolean | null;
  newRound: boolean;
  trumpSetterWon: boolean;
  trumpSetterLose: boolean;
  teamMemberID: Id<"players"> | null;
  opponent_1_ID: Id<"players"> | null;
  opponent_2_ID: Id<"players"> | null;
  gameOver: boolean;
  gameWon: boolean;
  myCardSet: cardMultiplayer[] | null;
  roomName: string | null;
  setUsername: (newName: string | null) => void;
  setUserID: (newUSerID: Id<"players"> | null) => void;
  setteamMemberID: (newUSerID: Id<"players"> | null) => void;
  setopponent_1_ID: (newUSerID: Id<"players"> | null) => void;
  setopponent_2_ID: (newUSerID: Id<"players"> | null) => void;
  setTrumpSetter: (newUSerID: Id<"players"> | null) => void;
  setRoundOver: (newValue: boolean) => void;
  setTrumpSetterWon: (newValue: boolean) => void;
  setTrumpSetterLose: (newValue: boolean) => void;
  setNewRound: (newValue: boolean) => void;
  setGameOver: (newValue: boolean) => void;
  setGameWon: (newValue: boolean) => void;
  setOpponentCard: (newCard: cardMultiplayer | null) => void;

  setRoomName: (newRoom: string | null) => void;
  setMyCard: (newCard: cardMultiplayer | null) => void;
  setTeammateCard: (newCard: cardMultiplayer | null) => void;
  setOpponent1Card: (newCard: cardMultiplayer | null) => void;
  setOpponent2Card: (newCard: cardMultiplayer | null) => void;
  setWinningCard: (newCard: cardMultiplayer | null) => void;
  setMyCardSet: (newCardSet: cardMultiplayer[] | null) => void;
}

export const MultiplayerStateStore = create<MultiplayerState>((set) => ({
  userName: null,
  userID: null,
  teamMemberID: null,
  opponent_1_ID: null,
  opponent_2_ID: null,
  trumpSetter: null,
  opponentsCard: null,
  myCard: null,
  teamMateCard: null,
  opponent1Card: null,
  opponent2Card: null,
  winningCard: null,
  roundOver: null,
  newRound: false,
  trumpSetterWon: false,
  trumpSetterLose: false,
  gameOver: false,
  gameWon: false,
  myCardSet: null,
  roomName: null,
  setTrumpSetterWon: (newvalue: boolean) => set({ trumpSetterWon: newvalue }),
  setTrumpSetterLose: (newvalue: boolean) => set({ trumpSetterLose: newvalue }),

  setUsername: (newName: string | null) => set({ userName: newName }),
  setRoomName: (newRoom: string | null) => set({ roomName: newRoom }),

  setTrumpSetter: (newUSerID: Id<"players"> | null) =>
    set({ trumpSetter: newUSerID }),

  setUserID: (newUserID: Id<"players"> | null) => set({ userID: newUserID }),
  setteamMemberID: (newUserID: Id<"players"> | null) =>
    set({ teamMemberID: newUserID }),
  setopponent_1_ID: (newUserID: Id<"players"> | null) =>
    set({ opponent_1_ID: newUserID }),
  setopponent_2_ID: (newUserID: Id<"players"> | null) =>
    set({ opponent_2_ID: newUserID }),
  setRoundOver: (newvalue: boolean) => set({ roundOver: newvalue }),
  setNewRound: (newvalue: boolean) => set({ newRound: newvalue }),
  setGameOver: (newvalue: boolean) => set({ gameOver: newvalue }),
  setGameWon: (newvalue: boolean) => set({ gameWon: newvalue }),
  setOpponentCard: (newCard: cardMultiplayer | null) =>
    set({ opponentsCard: newCard }),
  setMyCard: (newCard: cardMultiplayer | null) => set({ myCard: newCard }),
  setTeammateCard: (newCard: cardMultiplayer | null) =>
    set({ teamMateCard: newCard }),
  setOpponent1Card: (newCard: cardMultiplayer | null) =>
    set({ opponent1Card: newCard }),
  setOpponent2Card: (newCard: cardMultiplayer | null) =>
    set({ opponent2Card: newCard }),

  setWinningCard: (newCard: cardMultiplayer | null) =>
    set({ winningCard: newCard }),
  setMyCardSet: (newCardSet: cardMultiplayer[] | null) =>
    set({ myCardSet: newCardSet }),
}));
