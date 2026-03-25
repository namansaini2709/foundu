const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const http = require("http");
const { Server } = require("socket.io");
const notificationService = require("./services/notificationService");
const onboardingReminderService = require("./services/onboardingReminderService");

const app = express();

// Serve static files from the public/uploads directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

/* =========================
   MIDDLEWARES
========================= */
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.set("trust proxy", 1);
const isProduction = process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_NAME;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "foundu_secret",
    resave: false,
    saveUninitialized: true, // Force session to be saved
    name: "foundu_sid", // Custom name to avoid conflicts
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: isProduction ? true : false, // Must be true for cross-site
      sameSite: isProduction ? "none" : "lax", // 'none' for cross-domain
    },
  }),
);

// DEBUG: Log all requests
app.use((req, res, next) => {
  const log = `\n[${new Date().toISOString()}] [REQUEST] ${req.method} ${req.url}\nHeaders: ${JSON.stringify(req.headers)}\n`;
  console.log(log);

  const logsDir = path.join(__dirname, "logs");
  if (!require("fs").existsSync(logsDir)) require("fs").mkdirSync(logsDir);
  require("fs").appendFileSync(path.join(logsDir, "requests.txt"), log);

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
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const postRoutes = require("./routes/postRoutes");
const testEmailRoutes = require("./routes/testEmailRoutes");

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
  notificationRoutes: typeof notificationRoutes,
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
app.use("/api", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", ideaRoutes);
app.use("/api", notificationRoutes);
app.use("/api", postRoutes);
app.use("/api", testEmailRoutes);

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

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

notificationService.setIO(io);
onboardingReminderService.initOnboardingReminders();

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  notificationService.handleSocketConnection(socket);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL_ERROR:", err);
  const fs = require("fs");
  const logsDir = path.join(__dirname, "logs");
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
  fs.appendFileSync(
    path.join(logsDir, "global_error.txt"),
    `\n[${new Date().toISOString()}] ${err.stack}\n`,
  );
  res.status(500).json({ success: false, error: err.message });
});

server.listen(PORT, () => {
  console.log(`🚀 FoundU backend running on ${PORT}`);
});
