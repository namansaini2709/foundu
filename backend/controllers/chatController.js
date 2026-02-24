const db = require("../config/db");

// Get all chats for the current user
exports.getMyChats = (req, res) => {
  console.log("Session User:", req.session.user);
  console.log("Cookies:", req.headers.cookie);
  const userId = req.session.user ? req.session.user.id : null;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = `
    SELECT 
      c.id AS chat_id,
      c.updated_at,
      u.id AS other_user_id,
      u.full_name,
      u.user_type,
      (SELECT content FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
      (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message_time,
      (SELECT COUNT(*) FROM messages WHERE chat_id = c.id AND is_seen = 0 AND sender_id != ?) AS unread_count
    FROM chats c
    JOIN chat_participants cp1 ON c.id = cp1.chat_id
    JOIN chat_participants cp2 ON c.id = cp2.chat_id
    JOIN users u ON cp2.user_id = u.id
    WHERE cp1.user_id = ? AND cp2.user_id != ?
    ORDER BY c.updated_at DESC
  `;

  db.query(query, [userId, userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching chats:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// Get messages for a specific chat
exports.getMessages = (req, res) => {
  const userId = req.session.user ? req.session.user.id : null;
  const chatId = req.params.chatId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify participation
  db.query(
    "SELECT * FROM chat_participants WHERE chat_id = ? AND user_id = ?",
    [chatId, userId],
    (err, results) => {
        if (err || results.length === 0) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Fetch messages
        db.query(
            `SELECT m.*, u.full_name as sender_name 
             FROM messages m 
             JOIN users u ON m.sender_id = u.id 
             WHERE m.chat_id = ? 
             ORDER BY m.created_at ASC`,
            [chatId],
            (err, messages) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(messages);
            }
        );
    }
  );
};

// Send a message
exports.sendMessage = (req, res) => {
    const senderId = req.session.user ? req.session.user.id : null;
    const { chatId, content } = req.body;

    if (!senderId) return res.status(401).json({ message: "Unauthorized" });

    // Verify participation first
    db.query(
        "SELECT * FROM chat_participants WHERE chat_id = ? AND user_id = ?",
        [chatId, senderId],
        (err, results) => {
            if (err || results.length === 0) return res.status(403).json({ message: "Access denied" });

            db.query(
                "INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)",
                [chatId, senderId, content],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    
                    // Update chat timestamp
                    db.query("UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", [chatId]);

                    res.json({ success: true, messageId: result.insertId });
                }
            );
        }
    );
};

// Create a chat (if not exists)
exports.createChat = (req, res) => {
    const myId = req.session.user ? req.session.user.id : null;
    const { otherUserId } = req.body;

    if (!myId) return res.status(401).json({ message: "Unauthorized" });

    // Check if chat already exists
    // A bit complex in SQL: Find a chat_id where both users are participants
    const checkQuery = `
        SELECT c.id 
        FROM chats c
        JOIN chat_participants cp1 ON c.id = cp1.chat_id
        JOIN chat_participants cp2 ON c.id = cp2.chat_id
        WHERE cp1.user_id = ? AND cp2.user_id = ?
        LIMIT 1
    `;

    db.query(checkQuery, [myId, otherUserId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.json({ chatId: results[0].id, alreadyExists: true });
        }

        // Create new chat
        db.query("INSERT INTO chats () VALUES ()", (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const newChatId = result.insertId;
            
            // Add participants
            const values = [
                [newChatId, myId],
                [newChatId, otherUserId]
            ];
            db.query("INSERT INTO chat_participants (chat_id, user_id) VALUES ?", [values], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ chatId: newChatId, alreadyExists: false });
            });
        });
    });
};
