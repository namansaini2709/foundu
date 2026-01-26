const bcrypt = require("bcrypt");
const db = require("../config/db");
const transporter = require("../config/mail");
const { generateToken } = require("../utils/token");

const resetTokens = {}; // temporary in-memory (can move to DB later)

/* SIGNUP */
exports.signup = async (req, res) => {
  const { full_name, email, password, user_type } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (full_name, email, password_hash, user_type) VALUES (?, ?, ?, ?)",
    [full_name, email, hash, user_type],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, message: "User registered" });
    }
  );
};

/* LOGIN */
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, rows) => {
    if (!rows || rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    req.session.user = {
      id: user.id,
      email: user.email,
      user_type: user.user_type
    };

    res.json({ success: true, message: "Logged in", user });
  });
};

/* LOGOUT */
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};

/* FORGOT PASSWORD */
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const token = generateToken();

  resetTokens[token] = email;

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  transporter.sendMail({
    to: email,
    subject: "Reset Password - FoundU",
    text: `Reset your password using this link:\n${resetLink}`
  });

  res.json({ success: true, message: "Reset link sent to email" });
};


/* RESET PASSWORD */
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const email = resetTokens[token];
  if (!email) return res.status(400).json({ message: "Invalid token" });

  const hash = await bcrypt.hash(newPassword, 10);

  db.query(
    "UPDATE users SET password_hash=? WHERE email=?",
    [hash, email],
    () => {
      delete resetTokens[token];
      res.json({ message: "Password updated" });
    }
  );
};

/* GET ALL USERS */
exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    res.json(rows);
  });
};

/* GET USER BY ID */
exports.getUserById = (req, res) => {
  db.query(
    "SELECT * FROM users WHERE id=?",
    [req.params.id],
    (err, rows) => {
      if (!rows.length) return res.status(404).json({ message: "Not found" });
      res.json(rows[0]);
    }
  );
};

/* DELETE USER */
exports.deleteUser = (req, res) => {
  db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    () => res.json({ message: "User deleted" })
  );
};
