const db = require("../config/db");

const queryController = {
    submitQuery: async (req, res) => {
        try {
            const { name, email, phone, subject, message } = req.body;

            if (!name || !email || !subject || !message) {
                return res.status(400).json({
                    success: false,
                    error: "Please fill all required fields (Name, Email, Subject, Message)."
                });
            }

            const sql = `
                INSERT INTO queries (name, email, phone, subject, message) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [name, email, phone || null, subject, message];

            await db.promise().execute(sql, params);

            res.status(201).json({
                success: true,
                message: "Thank you! Your query has been submitted successfully."
            });
        } catch (error) {
            console.error("Submit Query Error:", error);
            res.status(500).json({
                success: false,
                error: "Server error while submitting query."
            });
        }
    },

    getAllQueries: async (req, res) => {
        try {
            const [rows] = await db.promise().execute("SELECT * FROM queries ORDER BY created_at DESC");
            res.status(200).json({ success: true, data: rows });
        } catch (error) {
            console.error("Get Queries Error:", error);
            res.status(500).json({ success: false, error: "Server error." });
        }
    }
};

module.exports = queryController;
