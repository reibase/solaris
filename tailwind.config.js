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
		extend: {
			colors: {
				"off-white": "#F9F9F9",
				"powder-blue": "#E7F0FF",
				"light-gray": "#DDDCDC",
				"slate-gray": "#8B929F",
				"mid-gray": "#1F232E",
				"dark-gray": "#373D47",
				charcoal: "#313131",
				midnight: "#131723",
			},
		},
	},
	plugins: [],
};
