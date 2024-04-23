import { create } from "zustand";

const initialState = {
	dark: localStorage.theme === "dark" ? true : false,
	user: localStorage.user
		? JSON.parse(localStorage.user)
		: {
				isLoggedIn: false,
				access: false,
				info: {
					id: null,
					username: "",
					avatar: "",
					verifiedThru: "",
					email: "",
					plan: "n/a",
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
