const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const db = require("../config/db");
const axios = require("axios");
const notificationService = require("../services/notificationService");

// 1. Create Razorpay Order
exports.createOrder = async (req, res) => {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
        return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency,
        receipt,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        job_id,
        applicant_id, // ── NEW: For shortlist-driven payments ──
        base_amount,
        gst_amount,
        commission_amount,
        total_amount,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder_secret")
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            if (applicant_id) {
                // ── CASE A: Shortlist Payment ──
                await db.promise().query(
                    `UPDATE job_applicants 
                     SET payment_status = 'paid', 
                         razorpay_order_id = ?, 
                         razorpay_payment_id = ?,
                         amount_paid = ?,
                         status = 'accepted'
                     WHERE job_id = ? AND user_id = ?`,
                    [razorpay_order_id, razorpay_payment_id, total_amount, job_id, applicant_id]
                );

                // Mark job as assigned and paid
                await db.promise().query(
                    "UPDATE foundu_jobs SET is_assigned = TRUE, payment_status = 'paid', total_amount = ? WHERE job_id = ?", 
                    [total_amount, job_id]
                );

                // ── NEW: Create initial submission record automatically ──
                const [founderRows] = await db.promise().query("SELECT user_id FROM foundu_jobs WHERE job_id = ?", [job_id]);
                if (founderRows.length) {
                    const founder_id = founderRows[0].user_id;
                    const [subExists] = await db.promise().query(
                        "SELECT id FROM foundu_submissions WHERE job_id = ? AND freelancer_id = ?",
                        [job_id, applicant_id]
                    );
                    if (!subExists.length) {
                        await db.promise().query(
                            `INSERT INTO foundu_submissions (job_id, freelancer_id, founder_id, status)
                             VALUES (?, ?, ?, 'pending_setup')`,
                            [job_id, applicant_id, founder_id]
                        );
                    }
                }

                res.json({ success: true, message: "Applicant paid and shortlisted successfully" });

                // ⚡ Notify freelancer they have been shortlisted
                try {
                    const [jobInfo] = await db.promise().query("SELECT job_title FROM foundu_jobs WHERE job_id = ?", [job_id]);
                    const jobTitle = jobInfo[0]?.job_title || "a job";
                    notificationService.sendNotification(
                        applicant_id,
                        "🎉 You've Been Shortlisted!",
                        `Congratulations! You have been shortlisted for "${jobTitle}". Check your dashboard to get started.`,
                        "payment",
                        "/dashboard"
                    );
                } catch (e) {
                    console.error("Shortlist notify error:", e);
                }
            } else {
                // ── CASE B: Legacy Job Posting Payment ──
                await db.promise().query(
                    `UPDATE foundu_jobs 
                     SET payment_status = 'paid', 
                         razorpay_order_id = ?, 
                         razorpay_payment_id = ?,
                         numeric_budget = ?,
                         gst_amount = ?,
                         commission_amount = ?,
                         total_amount = ?
                     WHERE job_id = ?`,
                    [razorpay_order_id, razorpay_payment_id, base_amount, gst_amount, commission_amount, total_amount, job_id]
                );
                res.json({ success: true, message: "Job payment verified" });

                // ⚡ Notify founder their job payment is confirmed
                try {
                    const [jobInfo] = await db.promise().query("SELECT user_id, job_title FROM foundu_jobs WHERE job_id = ?", [job_id]);
                    if (jobInfo.length) {
                        notificationService.sendNotification(
                            jobInfo[0].user_id,
                            "✅ Payment Confirmed!",
                            `Your payment for "${jobInfo[0].job_title}" has been received. Your job is now live and accepting applicants.`,
                            "payment",
                            "/dashboard"
                        );
                    }
                } catch (e) {
                    console.error("Job payment notify error:", e);
                }
            }
        } catch (error) {
            console.error("Payment Verification DB Error:", error);
            res.status(500).json({ success: false, error: "Payment verified but DB update failed" });
        }
    } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
    }
};

// 3. Get Wallet Balance
exports.getWalletBalance = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [rows] = await db.promise().query(
            "SELECT balance FROM wallets WHERE user_id = ?",
            [user_id]
        );

        if (!rows.length) {
            // Create wallet if it doesn't exist
            await db.promise().query("INSERT INTO wallets (user_id, balance) VALUES (?, 0)", [user_id]);
            return res.json({ success: true, balance: 0 });
        }

        res.json({ success: true, balance: rows[0].balance });
    } catch (error) {
        console.error("Get Wallet Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Get Wallet Transactions
exports.getWalletTransactions = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [walletRows] = await db.promise().query("SELECT id FROM wallets WHERE user_id = ?", [user_id]);
        if (!walletRows.length) return res.json([]);

        const [transactions] = await db.promise().query(
            "SELECT * FROM wallet_transactions WHERE wallet_id = ? ORDER BY created_at DESC",
            [walletRows[0].id]
        );

        res.json(transactions);
    } catch (error) {
        console.error("Get Transactions Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 5. Request Withdrawal (RazorpayX Real Payout)
exports.requestWithdrawal = async (req, res) => {
    const { user_id, amount, upi_id } = req.body;

    try {
        const [userRows] = await db.promise().query("SELECT email, full_name FROM users WHERE id = ?", [user_id]);
        if (!userRows.length) return res.status(404).json({ success: false, message: "User not found" });

        const [walletRows] = await db.promise().query("SELECT id, balance FROM wallets WHERE user_id = ?", [user_id]);
        if (!walletRows.length || walletRows[0].balance < amount) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
        }

        const wallet_id = walletRows[0].id;
        const platformFee = amount * 0.05;
        const netPayout = amount - platformFee;

        // --- RazorpayX Real Payout Logic ---
        const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");

        // 1. Create Contact
        const contactRes = await axios.post("https://api.razorpay.com/v1/contacts", {
            name: userRows[0].full_name,
            email: userRows[0].email,
            type: "vendor",
            reference_id: `user_${user_id}`
        }, { headers: { Authorization: `Basic ${auth}` } });

        const contact_id = contactRes.data.id;

        // 2. Create Fund Account (UPI)
        const fundRes = await axios.post("https://api.razorpay.com/v1/fund_accounts", {
            account_type: "vpa",
            contact_id: contact_id,
            vpa: { address: upi_id }
        }, { headers: { Authorization: `Basic ${auth}` } });

        const fund_account_id = fundRes.data.id;

        // 3. Create Payout
        const payoutRes = await axios.post("https://api.razorpay.com/v1/payouts", {
            account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER,
            fund_account_id: fund_account_id,
            amount: Math.round(netPayout * 100), // in paise
            currency: "INR",
            mode: "UPI",
            purpose: "payout",
            queue_if_low_balance: true,
            reference_id: `withdraw_${Date.now()}`
        }, { headers: { Authorization: `Basic ${auth}` } });

        const payout_id = payoutRes.data.id;

        // --- Database Update ---
        await db.promise().query("START TRANSACTION");

        // Deduct FULL amount from wallet
        await db.promise().query("UPDATE wallets SET balance = balance - ? WHERE id = ?", [amount, wallet_id]);

        // Log Transaction
        await db.promise().query(
            `INSERT INTO wallet_transactions (wallet_id, amount, transaction_type, description, status) 
             VALUES (?, ?, 'debit', ?, 'completed')`,
            [wallet_id, amount, `Withdrawal: Net ₹${netPayout} via RazorpayX (ID: ${payout_id})`]
        );

        await db.promise().query("COMMIT");

        // ⚡ Notify user
        notificationService.sendNotification(
            user_id,
            "💸 Payout Triggered!",
            `₹${netPayout} is being transferred to your UPI ID ${upi_id} via RazorpayX.`,
            "payment",
            "/dashboard"
        ).catch(e => console.error("Withdrawal notify error:", e));

        res.json({
            success: true,
            message: "Payout initiated successfully via RazorpayX!",
            payout_id
        });

    } catch (error) {
        if (db.connection) await db.promise().query("ROLLBACK");
        console.error("RazorpayX Payout Error Details:", error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            message: "RazorpayX Error", 
            error: error.response?.data?.error?.description || error.message 
        });
    }
};
