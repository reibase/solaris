import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
	persist(
		(set, get) => ({
			dark: false,
			user: {
				isLoggedIn: false,
				id: null,
				username: "",
				avatar: "",
				verifiedThru: "",
				email: "",
			},
			currentProject: {},
			toggleDark: () => set({ dark: get().dark === false ? true : false }),
			setUserInfo: (data) => set({ user: data }),
			setCurrentProject: (data) => set({ currentProject: data }),
		}),
		{
			name: "solarisStorage",
		}
	)
);
