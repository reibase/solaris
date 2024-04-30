import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState = localStorage.solarisStorage
	? JSON.parse(localStorage.solarisStorage)
	: {
			dark: false,
			user: {
				isLoggedIn: false,
				access: false,
				info: {
					id: null,
					username: "",
					avatar: "",
					verifiedThru: "",
					email: "",
				},
			},
			currentProject: {},
			currentIssue: {},
	  };

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
			currentIssue: {},
			toggleDark: () => set({ dark: get().dark === false ? true : false }),
			setUserInfo: (data) => set({ user: data }),
			setCurrentProject: (data) => set({ currentProject: data }),
			setCurrentIssue: (data) => set({ currentIssue: data }),
		}),
		{
			name: "solarisStorage", // name of the item in the storage (must be unique)
			// storage: createJSONStorage(() => sessionStorage), (optional) by default, 'localStorage' is used
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
