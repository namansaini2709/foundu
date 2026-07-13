const db = require("../config/db");
const crypto = require("crypto");
const notificationService = require("../services/notificationService");
const emailNotificationService = require("../services/emailNotificationService");


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

        const flyer_url = req.file ? req.file.path : null;

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
            `SELECT id, event_name, target_audience, event_date, event_time, location, registration_deadline, registration_link, organizer_name, organizer_number, organizer_email, brief, flyer_url, created_at 
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

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const [events] = await db.promise().query(
            `SELECT id, event_name, target_audience, event_date, event_time, location, registration_deadline, registration_link, organizer_name, organizer_number, organizer_email, brief, flyer_url, created_at 
             FROM promoted_events 
             WHERE id = ?`,
            [id]
        );

        if (events.length === 0) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.json({ success: true, event: events[0] });
    } catch (error) {
        console.error("Fetch Event By ID Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch event details" });
    }
};

exports.createEventRegistration = async (req, res) => {
    try {
        const {
            event_id,
            user_name,
            phone_number,
            email_id,
            role,
            startup_name,
            startup_stage
        } = req.body;
        const user_id = req.user.id;

        if (!event_id || !user_name || !phone_number || !email_id || !role) {
            return res.status(400).json({ success: false, message: "Missing required registration details" });
        }

        // 1. Check if user is already registered for this event
        const [existing] = await db.promise().query(
            "SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ? AND payment_status = 'completed'",
            [event_id, user_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "You are already registered for this event" });
        }

        // 2. Free registration (Razorpay payment logic commented out)
        const amount = 0; 
        const orderId = `free_reg_${event_id}_${user_id}_${Date.now()}`;
        const upi_id = 'FREE'; 

        /*
        const razorpay = require("../utils/razorpay");
        const amount = 200; // Rs. 200
        const options = {
            amount: Math.round(amount * 100), // in paise
            currency: "INR",
            receipt: `event_reg_${event_id}_${user_id}_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        */

        // 3. Create or Update registration details directly as 'completed'
        const query = `
            INSERT INTO event_registrations 
            (event_id, user_id, user_name, phone_number, email_id, role, startup_name, startup_stage, upi_id, amount, razorpay_order_id, razorpay_payment_id, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')
            ON CONFLICT (event_id, user_id) DO UPDATE SET 
                user_name = EXCLUDED.user_name,
                phone_number = EXCLUDED.phone_number,
                email_id = EXCLUDED.email_id,
                role = EXCLUDED.role,
                startup_name = EXCLUDED.startup_name,
                startup_stage = EXCLUDED.startup_stage,
                upi_id = EXCLUDED.upi_id,
                amount = EXCLUDED.amount,
                razorpay_order_id = EXCLUDED.razorpay_order_id,
                razorpay_payment_id = EXCLUDED.razorpay_payment_id,
                payment_status = 'completed'
        `;

        const values = [
            event_id,
            user_id,
            user_name,
            phone_number,
            email_id,
            role,
            startup_name || null,
            startup_stage || null,
            upi_id,
            amount,
            orderId,
            'FREE'
        ];

        await db.promise().query(query, values);

        // Fetch event details for notification and email
        const [eventRows] = await db.promise().query(
            "SELECT event_name, event_date, location FROM promoted_events WHERE id = ?",
            [event_id]
        );
        const eventName = eventRows.length > 0 ? eventRows[0].event_name : "the event";
        const eventDateStr = eventRows.length > 0 && eventRows[0].event_date 
            ? new Date(eventRows[0].event_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : 'TBA';
        const eventLocation = eventRows.length > 0 ? eventRows[0].location : 'TBA';

        // Send in-app notification
        notificationService.sendNotification(
            user_id,
            "Event Registered! 🎟️",
            `Your registration for "${eventName}" is complete.`,
            "/event-detail/" + event_id
        ).catch(err => console.error("Event registration notification error:", err));

        // Send email confirmation
        const baseUrl = process.env.FRONTEND_URL || "https://www.foundu.in";
        emailNotificationService.sendEmailNotification(
            user_id,
            "Event Registration Confirmed! 🎟️",
            `Congratulations! You have successfully registered for the event <b>${eventName}</b>.<br><br><b>Event Details:</b><br>📅 Date: ${eventDateStr}<br>📍 Location: ${eventLocation}<br><br>We look forward to seeing you at the venue. Please keep this email for reference.`,
            "View Event Details",
            `${baseUrl}/event-detail/${event_id}`
        ).catch(err => console.error("Event registration email notification error:", err));

        res.json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {
        console.error("Create Event Registration Error:", error);
        res.status(500).json({ success: false, message: "Failed to process registration" });
    }
};

exports.verifyEventRegistration = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            event_id
        } = req.body;
        const user_id = req.user.id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !event_id) {
            return res.status(400).json({ success: false, message: "Missing verification details" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder_secret")
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // Update database
        const [updateResult] = await db.promise().query(
            `UPDATE event_registrations 
             SET payment_status = 'completed', 
                 razorpay_payment_id = ?
             WHERE razorpay_order_id = ? AND user_id = ? AND event_id = ?`,
            [razorpay_payment_id, razorpay_order_id, user_id, event_id]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Registration record not found or update failed" });
        }

        // Fetch event name for notification
        const [eventRows] = await db.promise().query("SELECT event_name FROM promoted_events WHERE id = ?", [event_id]);
        const eventName = eventRows.length > 0 ? eventRows[0].event_name : "the event";

        // Send in-app notification
        notificationService.sendNotification(
            user_id,
            "Event Registered! 🎟️",
            `Your registration for "${eventName}" is complete. ₹200 refundable deposit received.`,
            "/event-detail/" + event_id
        ).catch(err => console.error("Event registration notification error:", err));

        res.json({ success: true, message: "Registration successful" });

    } catch (error) {
        console.error("Verify Event Registration Error:", error);
        res.status(500).json({ success: false, message: "Internal server error during verification" });
    }
};

exports.getEventRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params; // event_id
        const user_id = req.user.id;

        const [rows] = await db.promise().query(
            "SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ? AND payment_status = 'completed'",
            [id, user_id]
        );

        res.json({
            success: true,
            registered: rows.length > 0
        });
    } catch (error) {
        console.error("Check Registration Status Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch registration status" });
    }
};

exports.getAdminEventRegistrations = async (req, res) => {
    try {
        const query = `
            SELECT 
                er.id,
                er.event_id,
                er.user_id,
                er.user_name,
                er.phone_number,
                er.email_id,
                er.role,
                er.startup_name,
                er.startup_stage,
                er.upi_id,
                er.amount,
                er.razorpay_order_id,
                er.razorpay_payment_id,
                er.payment_status,
                er.created_at,
                pe.event_name,
                pe.event_date
            FROM event_registrations er
            JOIN promoted_events pe ON er.event_id = pe.id
            WHERE er.payment_status = 'completed'
            ORDER BY er.created_at DESC
        `;
        const [rows] = await db.promise().query(query);
        res.json({ success: true, registrations: rows });
    } catch (error) {
        console.error("Get Admin Event Registrations Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch event registrations" });
    }
};

