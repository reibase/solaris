import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/",
	plugins: [react()],
	preview: {
		host: "0.0.0.0",
		port: 3000,
		strictPort: true,
	},
	server: {
		proxy: {
			"/api": {
				target:
					process.env.NODE_ENV === "preview"
						? "http://solaris-server-1:3001"
						: "http://localhost:3001",
				changeOrigin: true,
				secure: false,
				ws: true,
			},
		},
	},
});
