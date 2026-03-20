const db = require("../config/db");

let io = null;

exports.setIO = (socketIoInstance) => {
  io = socketIoInstance;
};

// Map of user_id to socket.id to target specific users securely
const connectedUsers = new Map();

exports.handleSocketConnection = (socket) => {
  socket.on("register", (userId) => {
    connectedUsers.set(userId.toString(), socket.id);
    console.log(`Socket mapped: User ${userId} -> Socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
};

exports.sendNotification = (userId, title, message, type = "general", link = null) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [userId, title, message, type, link], (err, result) => {
      if (err) {
        console.error("Error saving notification to DB:", err);
        return reject(err);
      }

      // Live Emit
      const targetSocketId = connectedUsers.get(userId.toString());
      if (io && targetSocketId) {
        io.to(targetSocketId).emit("new_notification", {
          id: result.insertId,
          user_id: userId,
          title,
          message,
          type,
          link,
          is_read: false,
          created_at: new Date()
        });
      }

      resolve(result);
    });
  });
};
