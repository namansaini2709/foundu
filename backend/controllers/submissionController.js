const db = require("../config/db");
const notificationService = require("../services/notificationService");

/**
 * setupProject - Founder initializes the collaboration
 */
exports.setupProject = (req, res) => {
    const { job_id, freelancer_id, founder_id, instructions, expectations, deadline, founder_files } = req.body;

    if (!job_id || !freelancer_id || !founder_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    db.query(
        `INSERT INTO foundu_submissions (job_id, freelancer_id, founder_id, instructions, expectations, deadline, founder_files, status, progress) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_setup', 0)
         ON DUPLICATE KEY UPDATE 
         instructions = VALUES(instructions),
         expectations = VALUES(expectations),
         deadline = VALUES(deadline),
         founder_files = VALUES(founder_files)`,
        [job_id, freelancer_id, founder_id, instructions, expectations, deadline, JSON.stringify(founder_files || [])],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Notify Freelancer
            notificationService.sendNotification(
                freelancer_id,
                "Project Setup Initiated",
                `Founder has set up the project details. Please review and start work.`,
                "project",
                "/dashboard"
            );

            res.json({ success: true, message: "Project setup saved successfully", id: result.insertId });
        }
    );
};

/**
 * getSubmission - Get tracking data for a job/applicant pair
 */
exports.getSubmissionByJobAndUser = (req, res) => {
    const { job_id, freelancer_id } = req.params;

    db.query(
        "SELECT * FROM foundu_submissions WHERE job_id = ? AND freelancer_id = ?",
        [job_id, freelancer_id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!rows.length) return res.status(404).json({ message: "No submission record found" });
            res.json(rows[0]);
        }
    );
};

/**
 * startProject - Freelancer accepts and moves to 50%
 */
exports.startProject = (req, res) => {
    const { id } = req.params;

    db.query(
        "UPDATE foundu_submissions SET status = 'in_progress', progress = 50 WHERE id = ?",
        [id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Notify Founder
            db.query("SELECT founder_id, job_id FROM foundu_submissions WHERE id = ?", [id], (err, rows) => {
                if (rows.length) {
                    notificationService.sendNotification(
                        rows[0].founder_id,
                        "Freelancer Started Work",
                        "The freelancer has accepted the instructions and started working.",
                        "project",
                        "/dashboard"
                    );
                }
            });

            res.json({ success: true, message: "Project started!" });
        }
    );
};

/**
 * submitWork - Freelancer uploads work
 */
exports.submitWork = (req, res) => {
    const { id } = req.params;
    const { freelancer_work_desc, freelancer_work_files, freelancer_work_links } = req.body;

    db.query(
        `UPDATE foundu_submissions 
         SET freelancer_work_desc = ?, 
             freelancer_work_files = ?, 
             freelancer_work_links = ?, 
             status = 'submitted', 
             progress = 75 
         WHERE id = ?`,
        [freelancer_work_desc, JSON.stringify(freelancer_work_files || []), JSON.stringify(freelancer_work_links || []), id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Notify Founder
            db.query("SELECT founder_id FROM foundu_submissions WHERE id = ?", [id], (err, rows) => {
                if (rows.length) {
                    notificationService.sendNotification(
                        rows[0].founder_id,
                        "Work Submitted",
                        "Freelancer has submitted their work. Please review and approve payment.",
                        "project",
                        "/dashboard"
                    );
                }
            });

            res.json({ success: true, message: "Work submitted successfully" });
        }
    );
};

/**
 * approveSubmission - Final approval, triggers money transfer
 */
const jobApplicantsController = require("./jobApplicantsController"); // Reuse the credit logic

exports.approveSubmission = (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM foundu_submissions WHERE id = ?",
        [id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!rows.length) return res.status(404).json({ message: "Record not found" });

            const submission = rows[0];

            db.query(
                "UPDATE foundu_submissions SET status = 'completed', progress = 100 WHERE id = ?",
                [id],
                async (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // 🔥 TRIGGER PAYMENT RELEASE
                    try {
                        // Using the helper we defined in jobApplicantsController
                        // Wait, I need to make sure handleJobCompletionCredit is exported/accessible
                        // For now, I'll replicate or call if it's exported.
                        // Actually, let's update job_applicants table status too.
                        await db.promise().query(
                            "UPDATE job_applicants SET status = 'completed' WHERE job_id = ? AND user_id = ?",
                            [submission.job_id, submission.freelancer_id]
                        );

                        // Reusing the logic (I'll extract it to a service if needed, but for now I'll call it)
                        // Actually, let's just implement the logic here for reliability
                        const [jobRows] = await db.promise().query(
                            "SELECT numeric_budget, job_title, budget_range, total_amount FROM foundu_jobs WHERE job_id = ?",
                            [submission.job_id]
                        );

                        // The freelancer gets the BASE budget only (excluding 18% GST + 3% platform fee)
                        // Priority: budget_range (original base) > reverse-calc from total_amount > reverse-calc from amount_paid
                        let amountToCredit = 0;
                        const jobData = jobRows[0];

                        if (jobData?.budget_range) {
                            // Parse "₹10,000" or "10000" etc.
                            const parsed = parseFloat(String(jobData.budget_range).replace(/[^\d.]/g, ''));
                            if (!isNaN(parsed) && parsed > 0) {
                                amountToCredit = parsed;
                            }
                        }

                        if (!amountToCredit && jobData?.total_amount) {
                            // total_amount = base * 1.21, reverse it
                            amountToCredit = Math.round(parseFloat(jobData.total_amount) / 1.21);
                        }

                        if (!amountToCredit) {
                            const [appRows] = await db.promise().query(
                                "SELECT amount_paid FROM job_applicants WHERE job_id = ? AND user_id = ?",
                                [submission.job_id, submission.freelancer_id]
                            );
                            amountToCredit = Math.round(parseFloat(appRows[0]?.amount_paid || 0) / 1.21);
                        }

                        // Add to Freelancer Wallet
                        const [walletRows] = await db.promise().query("SELECT id, balance FROM wallets WHERE user_id = ?", [submission.freelancer_id]);
                        let wallet_id;
                        if (!walletRows.length) {
                            const [wRes] = await db.promise().query("INSERT INTO wallets (user_id, balance) VALUES (?, ?)", [submission.freelancer_id, amountToCredit]);
                            wallet_id = wRes.insertId;
                        } else {
                            wallet_id = walletRows[0].id;
                            await db.promise().query("UPDATE wallets SET balance = balance + ? WHERE id = ?", [amountToCredit, wallet_id]);
                        }

                        await db.promise().query(
                            "INSERT INTO wallet_transactions (wallet_id, amount, transaction_type, description) VALUES (?, ?, 'credit', ?)",
                            [wallet_id, amountToCredit, `Final Payment: ${jobData?.job_title || 'Project'}`]
                        );

                        // Notify
                        notificationService.sendNotification(
                            submission.freelancer_id,
                            "Payment Released! 💰",
                            `Founder approved your work. ₹${amountToCredit} credited to your wallet.`,
                            "success",
                            "/dashboard"
                        );

                        res.json({ success: true, message: "Project completed and payment released!" });

                    } catch (e) {
                        console.error("Payment Release Error:", e);
                        res.status(500).json({ error: "Failed to release payment", details: e.message });
                    }
                }
            );
        }
    );
};

/**
 * requestChanges
 */
exports.requestChanges = (req, res) => {
    const { id } = req.params;
    const { feedback } = req.body;

    db.query(
        "UPDATE foundu_submissions SET status = 'changes_requested', progress = 50, feedback = ? WHERE id = ?",
        [feedback, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Notify Freelancer
            db.query("SELECT freelancer_id FROM foundu_submissions WHERE id = ?", [id], (err, rows) => {
                if (rows.length) {
                    notificationService.sendNotification(
                        rows[0].freelancer_id,
                        "Changes Requested",
                        `Founder has requested changes: ${feedback}`,
                        "project",
                        "/dashboard"
                    );
                }
            });

            res.json({ success: true, message: "Feedback sent to freelancer" });
        }
    );
};
