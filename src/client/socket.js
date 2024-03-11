import { io } from "socket.io-client";

const socket = io("https://seashell-app-fs86p.ondigitalocean.app", {
	transports: ["websocket"],
});

// client-side
socket.on("connect", () => {
	console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("connect_error", (err) => {
	console.log(`connect_error due to ${err.message}`);
});

socket.on("disconnect", () => {
	console.log(socket.id); // undefined
});

export default socket;
