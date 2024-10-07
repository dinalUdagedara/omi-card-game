import { create } from "zustand";

interface FinishState {
  wonCallingTrumps: boolean | null;
  wonWithoutCallingTrumps: boolean | null;
  lostCallingTrumps: boolean | null;
  lostWithoutCallingTrumps: boolean | null;
  isDialogOpen: boolean;
  isRoundOver: boolean;
  gameTied: boolean;

  setwonCallingTrumps: (newValue: boolean | null) => void;
  setwonWithoutCallingTrumps: (newValue: boolean | null) => void;
  setlostCallingTrumps: (newValue: boolean | null) => void;
  setlostWithoutCallingTrumps: (newValue: boolean | null) => void;
  setAllFalse: (newvalue: boolean) => void;
  setDialogOpen: (newvalue: boolean) => void;
  setRoundOver: (newvalue: boolean) => void;
  setGameTied: (newvalue: boolean) => void;
}

export const FinishStateStore = create<FinishState>((set) => ({
  wonCallingTrumps: null,
  wonWithoutCallingTrumps: null,
  lostCallingTrumps: null,
  lostWithoutCallingTrumps: null,
  isDialogOpen: false,
  isRoundOver:false,
  gameTied:false,

  setwonCallingTrumps: (newValue: boolean | null) =>
    set({ wonCallingTrumps: newValue }),
  setwonWithoutCallingTrumps: (newValue: boolean | null) =>
    set({ wonWithoutCallingTrumps: newValue }),
  setlostCallingTrumps: (newValue: boolean | null) =>
    set({ lostCallingTrumps: newValue }),
  setlostWithoutCallingTrumps: (newValue: boolean | null) =>
    set({ lostWithoutCallingTrumps: newValue }),
  setAllFalse: (newValue: boolean) =>
    set({
      lostWithoutCallingTrumps: newValue,
      wonCallingTrumps: newValue,
      wonWithoutCallingTrumps: newValue,
      lostCallingTrumps: newValue,
    }),
  setDialogOpen: (newValue: boolean) => set({ isDialogOpen: newValue }),
  setRoundOver: (newValue: boolean) => set({ isRoundOver: newValue }),
  setGameTied: (newValue: boolean) => set({ gameTied: newValue }),
}));
