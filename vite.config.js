import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/",
	plugins: [react()],
	preview: {
		port: 3000,
		strictPort: true,
	},
	server: { proxy: { "/api": "http://localhost:3001/" } },
});
