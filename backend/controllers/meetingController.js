const db = require("../config/db");

// 1. Book a Meeting
exports.bookMeeting = async (req, res) => {
    const {
        user_id,
        meeting_type,
        explanation,
        budget,
        selected_date,
        selected_time,
        website_link,
        portal_type,
        other_portal_type,
        business_type,
        is_web,
        is_app
    } = req.body;

    if (!user_id || !meeting_type || !selected_date || !selected_time) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const sql = `
            INSERT INTO meetings (
                user_id, meeting_type, explanation, budget, 
                selected_date, selected_time, website_link, 
                portal_type, other_portal_type, business_type, 
                is_web, is_app
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            user_id, meeting_type, explanation || null, budget || null,
            selected_date, selected_time, website_link || null,
            portal_type || null, other_portal_type || null, business_type || null,
            is_web ? 1 : 0, is_app ? 1 : 0
        ];

        await db.promise().query(sql, values);

        res.status(201).json({
            success: true,
            message: "Meeting booked successfully"
        });
    } catch (error) {
        console.error("Error booking meeting:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 2. Get All Meetings (Admin)
exports.getAllMeetings = async (req, res) => {
    try {
        const sql = `
            SELECT 
                m.*,
                u.full_name as user_name,
                u.email as user_email,
                u.user_type,
                COALESCE(sp.owner_phone, fp.phone_number, cp.reference_contact) as user_phone
            FROM meetings m
            JOIN users u ON m.user_id = u.id
            LEFT JOIN startup_profiles sp ON u.id = sp.user_id
            LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id
            LEFT JOIN cofounder_profiles cp ON u.id = cp.user_id
            ORDER BY m.created_at DESC
        `;

        const [rows] = await db.promise().query(sql);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 3. Delete a Meeting
exports.deleteMeeting = async (req, res) => {
    const { id } = req.params;
    try {
        await db.promise().query("DELETE FROM meetings WHERE id = ?", [id]);
        res.status(200).json({ success: true, message: "Meeting deleted successfully" });
    } catch (error) {
        console.error("Error deleting meeting:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
