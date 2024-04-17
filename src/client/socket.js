import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
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
