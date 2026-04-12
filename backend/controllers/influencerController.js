const db = require("../config/db");
const bcrypt = require("bcrypt");
const mailService = require("../services/mailService");

/**
 * apply - Handle influencer application submission
 */
exports.apply = (req, res) => {
    const {
        category,
        other_category,
        full_name,
        instagram_url,
        followers_count,
        last_month_reach,
        email,
        phone_number,
        budget_range,
        reel_url,
        is_barter
    } = req.body;

    const photo_url = req.files && req.files['photo'] ? `/uploads/${req.files['photo'][0].filename}` : null;
    const banner_url = req.files && req.files['banner'] ? `/uploads/${req.files['banner'][0].filename}` : null;

    if (!category || !full_name || !instagram_url || !followers_count || !last_month_reach || !email || !phone_number || !budget_range || !reel_url) {
        return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    const finalCategory = category === 'other' ? other_category : category;
    const isBarterBool = is_barter === 'yes' ? 1 : 0;

    db.query(
        `INSERT INTO influencer_applications (
            category, other_category, full_name, instagram_url, followers_count, last_month_reach, 
            email, phone_number, budget_range, photo_url, banner_url, reel_url, is_barter
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [finalCategory, other_category || null, full_name, instagram_url, followers_count, last_month_reach, email, phone_number, budget_range, photo_url, banner_url, reel_url, isBarterBool],
        (err, result) => {
            if (err) {
                console.error("Database error during influencer application:", err);
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true, message: "Application submitted successfully! We will review and get back to you.", id: result.insertId });
        }
    );
};

/**
 * getAllApplications - Get all applications (Admin use)
 */
exports.getAllApplications = (req, res) => {
    db.query("SELECT * FROM influencer_applications ORDER BY created_at DESC", (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: rows });
    });
};

/**
 * updateStatus - Accept or Reject an application
 */
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status." });
    }

    try {
        // 1. Fetch application details
        const [apps] = await db.promise().query("SELECT * FROM influencer_applications WHERE id = ?", [id]);
        if (!apps.length) return res.status(404).json({ success: false, message: "Application not found." });

        const app = apps[0];

        if (status === 'rejected') {
            // Send rejection email
            const subject = "Update on your Influencer Application - FoundU";
            const text = `Hi ${app.full_name},\n\nThank you for applying to the FoundU Influencer Marketplace. Unfortunately, after reviewing your promotion reel, we've decided not to move forward at this time as it didn't quite meet our current expectations.\n\nYou are welcome to resubmit your application anytime with a new reel!\n\nBest regards,\nFoundU Team`;
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">Influencer Application Update</h2>
                    <p>Hi <strong>${app.full_name}</strong>,</p>
                    <p>Thank you for your interest in joining the FoundU Influencer Marketplace.</p>
                    <p>After careful review of your application and promotion reel, we've decided not to move forward at this time. We're looking for content that aligns very specifically with our brand's current direction.</p>
                    <p><strong>Don't worry!</strong> You can resubmit your application at any time with a new reel. We'd love to see more of your creativity.</p>
                    <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #777; font-size: 12px;">
                        Best regards,<br>The FoundU Team
                    </div>
                </div>
            `;
            await mailService.sendEmail(app.email, subject, text, html);

            // Delete application
            await db.promise().query("DELETE FROM influencer_applications WHERE id = ?", [id]);
            return res.json({ success: true, message: "Application rejected and email sent." });
        }

        if (status === 'accepted') {
            const randomCode = Math.floor(100000 + Math.random() * 900000);
            const rawPassword = `Krish${randomCode}`;
            const hashedPassword = await bcrypt.hash(rawPassword, 10);

            // 1. Database Operations (Atomic-ish)
            try {
                const [existing] = await db.promise().query("SELECT id FROM users WHERE email = ?", [app.email]);

                if (existing.length > 0) {
                    // Update existing - Try 'influencer' first, fallback to 'freelancer'
                    try {
                        await db.promise().query(
                            "UPDATE users SET user_type = 'influencer', password_hash = ?, is_profile_complete = 1 WHERE email = ?",
                            [hashedPassword, app.email]
                        );
                    } catch (err) {
                        await db.promise().query(
                            "UPDATE users SET user_type = 'freelancer', password_hash = ?, is_profile_complete = 1 WHERE email = ?",
                            [hashedPassword, app.email]
                        );
                    }
                } else {
                    // Create new - Try 'influencer' first, fallback to 'freelancer'
                    try {
                        await db.promise().query(
                            `INSERT INTO users (full_name, email, password_hash, user_type, is_profile_complete) 
                             VALUES (?, ?, ?, 'influencer', 1)`,
                            [app.full_name, app.email, hashedPassword]
                        );
                    } catch (err) {
                        await db.promise().query(
                            `INSERT INTO users (full_name, email, password_hash, user_type, is_profile_complete) 
                             VALUES (?, ?, ?, 'freelancer', 1)`,
                            [app.full_name, app.email, hashedPassword]
                        );
                    }
                }
            } catch (dbErr) {
                console.error("Critical DB Error:", dbErr);
                return res.status(500).json({ success: false, message: "Database failure: " + dbErr.message });
            }

            // 2. Non-blocking Email
            try {
                const subject = "Welcome to the FoundU Influencer Marketplace! 🚀";
                const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
                const text = `Hi ${app.full_name},\n\nApproved! Login with:\nEmail: ${app.email}\nPassword: ${rawPassword}`;
                const html = `<h2>Welcome to FoundU!</h2><p>Credentials:<br>Email: ${app.email}<br>Password: ${rawPassword}</p><a href='${loginUrl}'>Login Here</a>`;
                await mailService.sendEmail(app.email, subject, text, html);
            } catch (mailErr) {
                console.warn("[Admin] Account created but email failed:", mailErr.message);
            }

            // 3. Finalize
            await db.promise().query("UPDATE influencer_applications SET status = ? WHERE id = ?", ['accepted', id]);

            return res.json({ 
                success: true, 
                message: "Influencer accepted and account ready!",
                creds: { email: app.email, password: rawPassword }
            });
        }

    } catch (err) {
        console.error("Error in updateStatus (Influencer):", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * getMarketplaceInfluencers - Get all accepted influencers
 */
exports.getMarketplaceInfluencers = (req, res) => {
    const query = `
        SELECT ia.*, u.id as user_id 
        FROM influencer_applications ia
        LEFT JOIN users u ON ia.email = u.email
        WHERE ia.status = 'accepted' 
        ORDER BY ia.created_at DESC
    `;
    db.query(query, (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: rows });
    });
};
