import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
	persist(
		(set, get) => ({
			dark: false,
			user: {
				isLoggedIn: false,
				info: {
					id: null,
					username: "",
					avatar: "",
					verifiedThru: "",
					email: "",
				},
			},
			currentProject: {},
			toggleDark: () => set({ dark: get().dark === false ? true : false }),
			setUserInfo: (data) => set({ user: data }),
			setCurrentProject: (data) => set({ currentProject: data }),
		}),
		{
			name: "solarisStorage", // name of the item in the storage (must be unique)
		}
	)
);

//export const useStore = create(
// 	persist((set, get) => ({
// 		...initialState,
// 		toggleDark: () => set({ dark: !state.dark }),
// 		setUserInfo: (newUserInfo) => set({ user: { newUserInfo } }),
// 		setCurrentProject: (newCurrentProject) =>
// 			set({
// 				currentProject: { ...state.currentProject, ...newCurrentProject },
// 			}),
// 	})),
// 	{
// 		name: "solaris-store",
// 		storage: createJSONStorage(() => sessionStorage),
// 	}
// );
