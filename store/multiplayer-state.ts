import { create } from "zustand";

interface MultiplayerState {
  userName: string | null;

  setUsername: (newName: string | null) => void;
}

export const MultiplayerStateStore = create<MultiplayerState>((set) => ({
  userName: null,

  setUsername: (newName: string | null) => set({ userName: newName }),
}));
