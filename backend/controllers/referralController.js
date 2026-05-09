const db = require("../config/db");

// 1. Create a new referral code
exports.createReferralCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || code.trim() === "") {
      return res.status(400).json({ success: false, message: "Code is required" });
    }

    const referralCode = code.trim();

    // Check if code already exists
    const [existing] = await db.promise().query("SELECT id FROM referrals WHERE code = ?", [referralCode]);
    if (existing.length) {
      return res.status(400).json({ success: false, message: "Referral code already exists" });
    }

    await db.promise().query("INSERT INTO referrals (code, is_active) VALUES (?, ?)", [referralCode, true]);

    res.status(201).json({ success: true, message: "Referral code created successfully" });
  } catch (error) {
    console.error("Create referral code error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2. Toggle referral code active/inactive
exports.toggleReferralCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await db.promise().query("UPDATE referrals SET is_active = ? WHERE id = ?", [is_active, id]);

    res.status(200).json({ success: true, message: "Referral status updated" });
  } catch (error) {
    console.error("Toggle referral code error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. Get all referral codes with usage count
exports.getAllReferrals = async (req, res) => {
  try {
    const [referrals] = await db.promise().query(`
      SELECT r.id, r.code, r.is_active, r.created_at, 
             COUNT(u.id) as usage_count
      FROM referrals r
      LEFT JOIN users u ON r.code = u.used_referral_code
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);
    res.status(200).json({ success: true, data: referrals });
  } catch (error) {
    console.error("Get all referrals error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 4. Get details of users who used a specific referral code
exports.getReferralUsers = async (req, res) => {
  try {
    const { code } = req.params;
    const [users] = await db.promise().query(`
      SELECT id, full_name, email, is_profile_complete, user_type, created_at
      FROM users
      WHERE used_referral_code = ?
      ORDER BY created_at DESC
    `, [code]);
    
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Get referral users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
