import { io } from "socket.io-client";

const socket = io("https://domestic-gap-backend.onrender.com", {
  transports: ["websocket"],
});

export default socket;