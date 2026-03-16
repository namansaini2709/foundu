const badgeService = require("../services/badgeService");
const db = require("../config/db");

/* =========================
   APPLY FOR BLUE TICK
========================= */
exports.applyForBlueTick = (req, res) => {
  const { user_id } = req.body;

  badgeService.isEligibleForBlueTick(user_id, (eligible) => {
    if (!eligible) {
      return res.status(400).json({
        message: "Not eligible for Blue Tick"
      });
    }

    db.query(
      `UPDATE users 
       SET blue_tick_status = 'pending' 
       WHERE id = ?`,
      [user_id],
      () => {
        res.json({
          success: true,
          message: "Blue Tick request submitted"
        });
      }
    );
  });
};

/* =========================
   ADMIN APPROVE BLUE TICK
========================= */
exports.approveBlueTick = (req, res) => {
  const { user_id } = req.body;

  db.query(
    `UPDATE users 
     SET 
       blue_tick_verified = true,
       blue_tick_status = 'approved'
     WHERE id = ?`,
    [user_id],
    () => {
      res.json({
        success: true,
        message: "Blue Tick approved"
      });
    }
  );
};

/* =========================
   ADMIN REJECT BLUE TICK
========================= */
exports.rejectBlueTick = (req, res) => {
  const { user_id } = req.body;

  db.query(
    `UPDATE users 
     SET blue_tick_status = 'rejected'
     WHERE id = ?`,
    [user_id],
    () => {
      res.json({
        success: true,
        message: "Blue Tick rejected"
      });
    }
  );
};

/* =========================
   MANUAL TRIGGER (ADMIN / CRON)
   GREEN + GOLDEN
========================= */
exports.recalculateAutomaticBadges = (req, res) => {
  const { user_id } = req.body;

  badgeService.evaluateGreenTick(user_id);
  badgeService.evaluateGoldenTick(user_id);

  res.json({
    success: true,
    message: "Automatic badge evaluation triggered"
  });
};

/* =========================
   GET GOLDEN TICK STATUS
   Returns login day count + eligibility for frontend progress bar
========================= */
exports.getGoldenTickStatus = (req, res) => {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ message: "user_id required" });

  const REQUIRED_DAYS = 20;

  db.query(
    `SELECT 
      u.blue_tick_verified,
      u.golden_tick_verified,
      u.golden_tick_month,
      DATE_FORMAT(CURDATE(), '%Y-%m') AS current_month,
      COUNT(la.id)                    AS login_days_this_month
     FROM users u
     LEFT JOIN login_audit la
       ON la.user_id = u.id
       AND MONTH(la.login_date) = MONTH(CURDATE())
       AND YEAR(la.login_date)  = YEAR(CURDATE())
     WHERE u.id = ?
     GROUP BY u.id`,
    [user_id],
    (err, rows) => {
      if (err)          return res.status(500).json({ error: err.message });
      if (!rows.length) return res.status(404).json({ message: "User not found" });

      const row                = rows[0];
      const loginDays          = parseInt(row.login_days_this_month) || 0;
      const hasBlueTick        = row.blue_tick_verified == 1;
      const goldenActive       = row.golden_tick_verified == 1 &&
                                 row.golden_tick_month === row.current_month;
      const daysRemaining      = Math.max(0, REQUIRED_DAYS - loginDays);
      const progressPercent    = Math.min(100, Math.round((loginDays / REQUIRED_DAYS) * 100));

      res.json({
        success: true,
        data: {
          has_blue_tick:          hasBlueTick,
          login_days_this_month:  loginDays,
          required_login_days:    REQUIRED_DAYS,
          days_remaining:         daysRemaining,
          progress_percent:       progressPercent,
          golden_tick_active:     goldenActive,
          current_month:          row.current_month
        }
      });
    }
  );
};
