// sockets/socket.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("join-booking", ({ bookingId, role }) => {
      const roomId = String(bookingId);
      socket.join(roomId);
      console.log(`👥 ${role} joined booking room: ${roomId}`);
    });

    socket.on("provider-location", ({ bookingId, payload }) => {
      const roomId = String(bookingId);

      console.log("📦 Location update:", roomId);
      console.log("📢 Emitting to room:", roomId);

      // 🔥 THIS IS THE FIX
      io.to(roomId).emit("provider-location", payload);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};
