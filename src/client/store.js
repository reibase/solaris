import { create } from "zustand";

const initialState = {
	dark: localStorage.theme === "dark" ? true : false,
	user: {
		isLoggedIn: false,
		info: {
			username: "",
			avatar: "",
			verifiedThru: "",
			email: "",
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
