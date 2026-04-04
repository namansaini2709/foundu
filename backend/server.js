const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");

dotenv.config();

const http = require("http");
const { Server } = require("socket.io");
const notificationService = require("./services/notificationService");
const onboardingReminderService = require("./services/onboardingReminderService");
const passport = require("passport");
require("./config/passport");

const app = express();

// Serve static files from the public/uploads directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

/* =========================
   MIDDLEWARES
========================= */

// Allowed frontend origins (explicit list for iOS Safari compatibility)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  (process.env.FRONTEND_URL || "").replace(/\/+$/, ""), // strip trailing slash
  "https://rare-dedication-production-f321.up.railway.app",
  "https://foundu.in",
  "https://www.foundu.in",
].filter(Boolean); // Remove undefined entries

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }
      // Also allow any *.up.railway.app subdomain
      if (origin.endsWith(".up.railway.app")) {
        return callback(null, origin);
      }
      console.warn(`[CORS] Blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(cookieParser());
app.use(express.json());

app.set("trust proxy", 1);
const isProduction = process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_NAME;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "foundu_secret",
    resave: false,
    saveUninitialized: false, // Don't create empty sessions
    name: "foundu_sid",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "none" : "lax",
    },
  }),
);

app.use(passport.initialize());

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
const testimonialRoutes = require("./routes/testimonialRoutes");
const postRoutes = require("./routes/postRoutes");
const testEmailRoutes = require("./routes/testEmailRoutes");
const authRoutes = require("./routes/authRoutes");

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
app.use("/api", testimonialRoutes);
app.use("/api", postRoutes);
app.use("/api", testEmailRoutes);
app.use("/api/auth", authRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "FoundU backend running" });
});

/* =========================
   START SERVER
========================= */
// ── DIAGNOSTIC ROUTE (HIDDEN) ──
app.get("/api/debug-auth", async (req, res) => {
  try {
    const [[adminCount]] = await db.promise().query("SELECT COUNT(*) as count FROM admin_users");
    const [[userCount]] = await db.promise().query("SELECT COUNT(*) as count FROM users");
    const [adminCols] = await db.promise().query("DESCRIBE admin_users");
    const [userCols] = await db.promise().query("DESCRIBE users");

    res.json({
      success: true,
      tables: {
        admin_users: { count: adminCount.count, columns: adminCols.map(c => c.Field) },
        users: { count: userCount.count, columns: userCols.map(c => c.Field) }
      },
      env: {
        NODE_ENV: process.env.NODE_ENV,
        FRONTEND_URL: process.env.FRONTEND_URL ? "SET" : "MISSING",
        GOOGLE_ID: process.env.GOOGLE_CLIENT_ID ? "SET" : "MISSING"
      },
      msg: "If YOU SEE THIS, THE NEW CODE IS RUNNING!"
    });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow handshakes with no origin (internal polling)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(o => o === origin) || 
                       origin.endsWith(".up.railway.app") ||
                       origin.includes("localhost");

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[SOCKET] Blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
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
