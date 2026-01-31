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
