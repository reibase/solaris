/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "url('']'"],
	theme: {
		fontFamily: {
			inter: ["Inter"],
			rubik: ["Rubik Glitch Pop"],
		},
		fontWeight: {
			extralight: "100",
			light: "200",
			normal: "300",
			medium: "400",
			semibold: "500",
			bold: "700",
		},
		fontSize: {
			sm: ["12px", "18px"],
			base: ["12px", "24px"],
			lg: ["20px", "28px"],
			xl: ["24px", "32px"],
			"3xl": ["28px", "32px"],
		},
		// colors: {
		// white: "#FFFFF",
		// l1: "#1fb6ff",
		// l2: "#F9F9F9",
		// l3: "#EBEBEB",
		// l4: "#D9D9D9",
		// l5: "#313131",
		// d1: "#8B929F",
		// d2: "#1F232E",
		// d3: "#0C0C0E",
		// d4: "#131723",
		// d5: "#0C0C0E",
		// red: "red-500",
		// green: "green-400",
		// primary: "indigo-400",
		// },
		extend: {},
	},
	plugins: [],
};
