import { create, useState } from "zustand";

const initialState = {
  dark: false,
  user: {
    access: false,
    isLoggedIn: false,
    info: {
      avatar: "",
    },
  },
};

export const useStore = create((set) => ({
  ...initialState,

  // State setters (actions):
  toggleDark: () => set((state) => ({ dark: !state.dark })),
  setUserInfo: (newUserInfo) =>
    set((state) => ({ user: { ...state.user, ...newUserInfo } })),
}));
