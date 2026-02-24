const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "foundu_secret",
    resave: false,
    saveUninitialized: true, // Force session to be saved
    name: "foundu_sid", // Custom name to avoid conflicts
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
      secure: false, // Must be false for localhost HTTP
      sameSite: 'lax' 
    },
  }),
);

// DEBUG: Log all requests
app.use((req, res, next) => {
  console.log(`\n[REQUEST] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Session:", req.session);
  next();
});

/* =========================
   ROUTES (IMPORT)
========================= */
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const freelancerProfileRoutes = require("./routes/freelancerProfileRoutes");
const cofounderProfileRoutes = require("./routes/cofounderProfileRoutes");
const startupProfileRoutes = require("./routes/startupProfileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const usersSocialsRoutes = require("./routes/usersSocialsRoutes");
const badgeRoutes = require("./routes/badgeRoutes");
const jobApplicantsRoutes = require("./routes/jobApplicantsRoutes");
const chatRoutes = require("./routes/chatRoutes");

/* =========================
   ROUTES DEBUG (DO NOT REMOVE)
========================= */
console.log("ROUTES TYPE CHECK 👉", {
  userRoutes: typeof userRoutes,
  reviewRoutes: typeof reviewRoutes,
  freelancerProfileRoutes: typeof freelancerProfileRoutes,
  cofounderProfileRoutes: typeof cofounderProfileRoutes,
  startupProfileRoutes: typeof startupProfileRoutes,
  jobRoutes: typeof jobRoutes,
  usersSocialsRoutes: typeof usersSocialsRoutes,
  badgeRoutes: typeof badgeRoutes,
  jobApplicantsRoutes: typeof jobApplicantsRoutes,
});

/* =========================
   ROUTE REGISTRATION
========================= */
app.use("/api", userRoutes);
app.use("/api", reviewRoutes);

app.use("/api/freelancer-profiles", freelancerProfileRoutes);
app.use("/api/cofounder-profiles", cofounderProfileRoutes);
app.use("/api/startup-profiles", startupProfileRoutes);

app.use("/api", jobRoutes);
app.use("/api", usersSocialsRoutes);
app.use("/api", badgeRoutes);
app.use("/api", jobApplicantsRoutes);
app.use("/api/chat", chatRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "FoundU backend running" });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 FoundU backend running on ${PORT}`);
});
