const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 HOURS SESSION
    }
  })
);

app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/reviewRoutes"));
app.use("/api/freelancer-profiles", require("./routes/freelancerProfileRoutes"));
app.use("/api/cofounder-profiles", require("./routes/cofounderProfileRoutes"));
app.use("/api/startup-profiles", require("./routes/startupProfileRoutes"));
app.use("/api", require("./routes/jobRoutes"));
app.use("/api", require("./routes/usersSocialsRoutes"));
app.use("/api", require("./routes/badgeRoutes"));
app.use("/api", require("./routes/jobApplicantsRoutes"));




app.listen(process.env.PORT, () =>
  console.log(`🚀 FoundU backend running on ${process.env.PORT}`)
);
