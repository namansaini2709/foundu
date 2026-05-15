const db = require("../config/db");
const crypto = require("crypto");
const notificationService = require("../services/notificationService");

exports.createPromotedEvent = async (req, res) => {
    try {
        const {
            user_id,
            plan_name,
            extra_emails,
            extra_whatsapp,
            final_amount,
            event_name,
            target_audience,
            event_date,
            event_time,
            registration_deadline,
            registration_link,
            organizer_name,
            organizer_number,
            organizer_email,
            brief,
            location
        } = req.body;

        const flyer_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!flyer_url) {
            return res.status(400).json({ success: false, message: "Event flyer is required" });
        }

        const query = `
            INSERT INTO promoted_events 
            (user_id, plan_name, extra_emails, extra_whatsapp, final_amount, event_name, target_audience, event_date, event_time, location, registration_deadline, registration_link, organizer_name, organizer_number, organizer_email, brief, flyer_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            user_id,
            plan_name,
            extra_emails || 0,
            extra_whatsapp || 0,
            final_amount,
            event_name,
            target_audience, // This comes as a stringified JSON array from FormData
            event_date,
            event_time,
            location,
            registration_deadline,
            registration_link,
            organizer_name || null,
            organizer_number || null,
            organizer_email || null,
            brief,
            flyer_url
        ];

        const [result] = await db.promise().query(query, values);

        res.json({ success: true, event_id: result.insertId, message: "Event created pending payment" });
    } catch (error) {
        console.error("Create Promoted Event Error:", error);
        res.status(500).json({ success: false, message: "Failed to create event" });
    }
};

exports.verifyEventPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        event_id
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder_secret")
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            await db.promise().query(
                `UPDATE promoted_events 
                 SET payment_status = 'completed', 
                     razorpay_order_id = ?, 
                     razorpay_payment_id = ?
                 WHERE id = ?`,
                [razorpay_order_id, razorpay_payment_id, event_id]
            );

            // Optional: send notification
            const [eventRows] = await db.promise().query("SELECT user_id, event_name FROM promoted_events WHERE id = ?", [event_id]);
            if (eventRows.length) {
                notificationService.sendNotification(
                    eventRows[0].user_id,
                    "Event Promotion Active!",
                    `Your payment was successful. Promotion for ${eventRows[0].event_name} has started.`,
                    "/event-marketplace"
                );
            }

            res.json({ success: true, message: "Payment verified successfully" });
        } catch (error) {
            console.error("Event Payment Verification DB Error:", error);
            res.status(500).json({ success: false, message: "Database error during verification" });
        }
    } else {
        res.status(400).json({ success: false, message: "Invalid Signature" });
    }
};

exports.getLiveEvents = async (req, res) => {
    try {
        const [events] = await db.promise().query(
            `SELECT id, event_name, target_audience, event_date, event_time, location, registration_deadline, registration_link, organizer_name, brief, flyer_url, created_at 
             FROM promoted_events 
             WHERE payment_status = 'completed' 
             ORDER BY created_at DESC`
        );
        res.json({ success: true, events });
    } catch (error) {
        console.error("Fetch Live Events Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
};
