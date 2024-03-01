import { io } from "socket.io-client";

const socket = io("https://seashell-app-fs86p.ondigitalocean.app/", {
	transports: ["websocket"],
	secure: true,
	rejectUnauthorized: false,
});

// client-side
socket.on("connect", () => {
	console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
	console.log(socket.id); // undefined
});

export default socket;
