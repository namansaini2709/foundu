const db = require("../config/db");
const whatsappService = require("./whatsappService");
const geminiService = require("./geminiService");
const bcrypt = require("bcrypt");
const axios = require("axios");
const isDemoMode = process.env.WHATSAPP_ONBOARDING_DEMO_MODE === "true";

// Validate email address helper
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Define onboarding step questions (complying precisely with requested items)
const QUESTIONS = {
  freelancer: [
    { key: "name", prompt: "Awesome! Let's get you set up as a **Freelancer**. Let's start with your full name:" },
    { key: "email", prompt: "What is your email address?" },
    { key: "portfolio", prompt: "Please share a link to your portfolio or GitHub profile (type 'none' to skip):" },
    { key: "skills", prompt: "What are your core technical or creative skills? (e.g. React, Node.js, Python, Figma - comma separated):" },
    { key: "preferred_tech", prompt: "What are your preferred technologies or tech stack? (e.g. MERN, Web3, iOS):" },
    { key: "domain_expertise", prompt: "What is your domain expertise? (e.g. Edtech, FinTech, E-commerce):" },
    { key: "experience", prompt: "How many years of professional experience do you have? (e.g., 3 years):" },
    { key: "budget", prompt: "What is your expected monthly rate/budget? (e.g., ₹40,000/mo):" },
    { key: "resume", prompt: "Almost done! Please upload your Resume/CV (or type/paste a short summary of your background, key projects, and credentials here):" }
  ],
  cofounder: [
    { key: "name", prompt: "Awesome! Let's get you set up as a **Co-Founder**. Let's start with your full name:" },
    { key: "email", prompt: "What is your email address?" },
    { key: "expertise", prompt: "What is your primary area of expertise? (e.g., Tech Lead, Marketing, Product Management, Growth):" },
    { key: "stage", prompt: "What stage of startup interests you most? (e.g., Idea Stage, MVP, Growth):" },
    { key: "equity", prompt: "What is your expected equity range? (e.g., 5-15%):" },
    { key: "superpowers", prompt: "Please share a brief description of your background and superpowers:" }
  ],
  founder: [
    { key: "name", prompt: "Awesome! Let's get you set up as a **Founder**. Let's start with your full name:" },
    { key: "email", prompt: "What is your email address?" },
    { key: "startupName", prompt: "What is your startup's name? (e.g., Rentoclick):" },
    { key: "startupDesc", prompt: "Please describe your startup idea and solution in a few sentences:" },
    { key: "hiringNeeds", prompt: "What are your immediate hiring requirements? (e.g., need one Frontend developer and one UI designer):" },
    { key: "budget", prompt: "What is your monthly hiring budget range? (e.g., ₹1,00,000/mo):" }
  ]
};

exports.processMessage = async (phone, name, text) => {
  const formattedPhone = phone.replace(/\D/g, "");

  try {
    if (text.trim().toLowerCase() === "reset") {
      await db.promise().query(
        "DELETE FROM whatsapp_onboarding_sessions WHERE phone_number = ?",
        [formattedPhone],
      );
      await whatsappService.sendWhatsAppDirectMessage(
        formattedPhone,
        "Your FoundU onboarding has been reset. Send any message to begin again.",
      );
      return;
    }

    // 1. Fetch active onboarding session
    const [sessions] = await db.promise().query(
      "SELECT * FROM whatsapp_onboarding_sessions WHERE phone_number = ?",
      [formattedPhone]
    );

    // 2. Greeting / No session exists
    if (!sessions.length) {
      await db.promise().query(
        "INSERT INTO whatsapp_onboarding_sessions (phone_number, role, current_step, collected_data) VALUES (?, NULL, 0, ?)",
        [formattedPhone, JSON.stringify({})]
      );

      const welcomeMsg = `Welcome to **FoundU**! 🚀 We are shifting to a WhatsApp-first ecosystem to help you build and match faster.

To get started, please reply with the number of your role:
1. 👤 Freelancer
2. 🤝 Co-Founder
3. 🚀 Founder`;
      
      await whatsappService.sendWhatsAppDirectMessage(formattedPhone, welcomeMsg);
      return;
    }

    const session = sessions[0];
    let role = session.role;
    let step = session.current_step;
    let data = typeof session.collected_data === "string" ? JSON.parse(session.collected_data) : (session.collected_data || {});

    // 3. User is replying to the initial role question (Step 0)
    if (!role) {
      const choice = text.trim();
      if (choice === "1" || choice.toLowerCase().includes("freelancer")) {
        role = "freelancer";
      } else if (choice === "2" || choice.toLowerCase().includes("co-founder") || choice.toLowerCase().includes("cofounder")) {
        role = "cofounder";
      } else if (choice === "3" || choice.toLowerCase().includes("founder")) {
        role = "founder";
      } else {
        await whatsappService.sendWhatsAppDirectMessage(
          formattedPhone,
          "❌ Invalid choice. Please reply with 1 (Freelancer), 2 (Co-Founder), or 3 (Founder)."
        );
        return;
      }

      step = 1;
      await db.promise().query(
        "UPDATE whatsapp_onboarding_sessions SET role = ?, current_step = 1, collected_data = ? WHERE phone_number = ?",
        [role, JSON.stringify({}), formattedPhone]
      );

      const firstQuestion = QUESTIONS[role][0].prompt;
      await whatsappService.sendWhatsAppDirectMessage(formattedPhone, firstQuestion);
      return;
    }

    // 4. Processing active onboarding flow
    const currentQuestions = QUESTIONS[role];
    const prevQuestionIdx = step - 1;
    const prevQuestion = currentQuestions[prevQuestionIdx];

    // Validate email if it was the previous question
    if (prevQuestion.key === "email" && !isValidEmail(text)) {
      await whatsappService.sendWhatsAppDirectMessage(
        formattedPhone,
        "❌ That email address looks invalid. Please enter a valid email address:"
      );
      return;
    }

    // Intercept document/resume upload and parse via Gemini
    if (text.startsWith("[DOCUMENT_UPLOAD] id:")) {
      const match = text.match(/\[DOCUMENT_UPLOAD\] id: (\S+) filename: (.+)$/);
      if (match) {
        const mediaId = match[1];
        const filename = match[2];

        console.log(`[WhatsApp Onboarding] Intercepted document upload. Media ID: ${mediaId}, Filename: ${filename}`);

        let documentUrl = null;
        let resumeSummary = null;

        if (mediaId === "mock_media_id") {
          documentUrl = "https://res.cloudinary.com/demo/image/upload/sample_resume.pdf";
          resumeSummary = "Experienced fullstack developer with 3+ years experience. Core stack includes React, Node.js, Stripe, and PostgreSQL. Professional, proactive, and focused on clean code.";
        } else {
          try {
            const metaAccessToken = process.env.META_ACCESS_TOKEN;
            if (!metaAccessToken) {
              throw new Error("META_ACCESS_TOKEN is missing in environment variables.");
            }

            // Step 1: Get media URL from Meta API
            console.log(`[WhatsApp Onboarding] Requesting media details from Meta for ID: ${mediaId}...`);
            const graphApiVersion = process.env.META_GRAPH_API_VERSION || "v26.0";
            const metaRes = await axios.get(`https://graph.facebook.com/${graphApiVersion}/${mediaId}`, {
              headers: { Authorization: `Bearer ${metaAccessToken}` }
            });
            const downloadUrl = metaRes.data.url;

            // Step 2: Download binary buffer
            console.log(`[WhatsApp Onboarding] Downloading document from Meta lookaside: ${downloadUrl}`);
            const fileRes = await axios.get(downloadUrl, {
              headers: { Authorization: `Bearer ${metaAccessToken}` },
              responseType: "arraybuffer"
            });
            const fileBuffer = Buffer.from(fileRes.data);

            // Step 3: Upload raw document to Cloudinary
            console.log(`[WhatsApp Onboarding] Uploading document to Cloudinary...`);
            const { cloudinary } = require("../config/cloudinary");
            documentUrl = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: "foundu_resumes",
                  resource_type: "raw",
                  public_id: `${Date.now()}_${filename.replace(/\.[^/.]+$/, "")}`
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }
              );
              uploadStream.end(fileBuffer);
            });
            console.log(`[WhatsApp Onboarding] Uploaded to Cloudinary successfully: ${documentUrl}`);

            // Step 4: Parse with Gemini
            console.log(`[WhatsApp Onboarding] Requesting Gemini to parse CV document buffer...`);
            const extractedInfo = await geminiService.extractResumeInfo(
              fileBuffer,
              fileRes.headers["content-type"] || "application/pdf"
            );
            console.log("[WhatsApp Onboarding] Gemini Extracted Info:", JSON.stringify(extractedInfo));

            resumeSummary = extractedInfo.resume || "Resume uploaded.";

            // Merge details into onboarding session data if blank
            if (extractedInfo.skills && (!data.skills || data.skills.toLowerCase() === "none")) {
              data.skills = extractedInfo.skills;
            }
            if (extractedInfo.preferred_tech && (!data.preferred_tech || data.preferred_tech.toLowerCase() === "none")) {
              data.preferred_tech = extractedInfo.preferred_tech;
            }
            if (extractedInfo.domain_expertise && (!data.domain_expertise || data.domain_expertise.toLowerCase() === "none")) {
              data.domain_expertise = extractedInfo.domain_expertise;
            }
            if (extractedInfo.experience && (!data.experience || data.experience.toLowerCase() === "none")) {
              data.experience = extractedInfo.experience;
            }
            if (extractedInfo.budget && (!data.budget || data.budget.toLowerCase() === "none")) {
              data.budget = extractedInfo.budget;
            }
            if (extractedInfo.portfolio && (!data.portfolio || data.portfolio.toLowerCase() === "none")) {
              data.portfolio = extractedInfo.portfolio;
            }
          } catch (err) {
            console.error("[WhatsApp Onboarding Document Process Error]:", err.message);
            resumeSummary = "Resume document uploaded but text extraction failed. Details: " + err.message;
          }
        }

        // Set resume summary as the response to the resume question step
        text = resumeSummary;
        data.resume_url = documentUrl;
        data.resume_summary = resumeSummary;
      }
    }

    // Save answer
    data[prevQuestion.key] = text;

    // Check if we have more questions
    if (step < currentQuestions.length) {
      const nextQuestion = currentQuestions[step].prompt;
      step++;

      await db.promise().query(
        "UPDATE whatsapp_onboarding_sessions SET current_step = ?, collected_data = ? WHERE phone_number = ?",
        [step, JSON.stringify(data), formattedPhone]
      );

      await whatsappService.sendWhatsAppDirectMessage(formattedPhone, nextQuestion);
    } else {
      // Onboarding complete! Save profile to DB and clear session
      await whatsappService.sendWhatsAppDirectMessage(
        formattedPhone,
        "⚙️ Processing onboarding details... Please wait a moment while Ginnie sets up your profile."
      );

      await saveProfileToDatabase(role, formattedPhone, data);

      await db.promise().query("DELETE FROM whatsapp_onboarding_sessions WHERE phone_number = ?", [formattedPhone]);

      // Generate & send initial recommendations
      if (isDemoMode) {
        await whatsappService.sendWhatsAppDirectMessage(
          formattedPhone,
          "🎉 FoundU demo onboarding complete! Your profile was created successfully. AI matching is skipped in demo mode.",
        );
      } else {
        await triggerRecommendationsAndAlerts(role, formattedPhone, data);
      }
    }
  } catch (err) {
    console.error("[WhatsApp Onboarding Error]:", err);
    await whatsappService.sendWhatsAppDirectMessage(
      formattedPhone,
      "❌ An unexpected error occurred. Please type 'reset' to start over."
    );
  }
};

// Complete Profile DB Committer
async function saveProfileToDatabase(role, phone, data) {
  const dummyPassword = await bcrypt.hash("foundu_onboard_dummy_123", 10);
  const emailPrefix = data.email.split("@")[0];

  // Determine standard role ID increments
  let freelancer_id = null;
  let founder_id = null;
  let cofounder_id = null;
  let userType = "freelancer";

  if (role === "freelancer") {
    const [r] = await db.promise().query("SELECT COALESCE(MAX(freelancer_id), 0) + 1 AS next_id FROM users WHERE user_type = 'freelancer'");
    freelancer_id = r[0].next_id || 1;
    userType = "freelancer";
  } else if (role === "founder") {
    const [r] = await db.promise().query("SELECT COALESCE(MAX(founder_id), 0) + 1 AS next_id FROM users WHERE user_type = 'founder'");
    founder_id = r[0].next_id || 1;
    userType = "founder";
  } else if (role === "cofounder") {
    const [r] = await db.promise().query("SELECT COALESCE(MAX(cofounder_id), 0) + 1 AS next_id FROM users WHERE user_type = 'cofounder'");
    cofounder_id = r[0].next_id || 1;
    userType = "cofounder";
  }

  // Insert base user
  const [userResult] = await db.promise().query(
    `INSERT INTO users (
      full_name, email, password_hash, user_type, 
      freelancer_id, founder_id, cofounder_id, 
      is_profile_complete, whatsapp_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    [data.name, data.email, dummyPassword, userType, freelancer_id, founder_id, cofounder_id, phone]
  );

  // Retrieve user ID
  const [userRows] = await db.promise().query("SELECT id FROM users WHERE email = ?", [data.email]);
  const userId = userRows[0].id;
  // Insert profile details mapping to actual database schema columns
  if (role === "freelancer") {
    const firstName = data.name.split(" ")[0];
    const lastName = data.name.split(" ").slice(1).join(" ") || "";
    
    // Generate profile embedding
    const profileText = `Name: ${data.name} | Skills: ${data.skills} | Stack: ${data.preferred_tech} | Expertise: ${data.domain_expertise} | Experience: ${data.experience} | Budget: ${data.budget} | Resume Summary: ${data.resume_summary || data.resume}`;
    const embedding = isDemoMode ? null : await geminiService.generateEmbedding(profileText);
    
    await db.promise().query(
      `INSERT INTO freelancer_profiles (
        user_id, freelancer_id, first_name, last_name, email, phone_number,
        skills_description, experience, stipend_expectations, github, other_links, freelancer_type, describe_best, embedding, resume_url, resume_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, freelancer_id, firstName, lastName, data.email, phone,
        data.skills, data.experience, data.budget, data.portfolio, data.resume_url || data.resume, data.domain_expertise, data.preferred_tech,
        embedding ? JSON.stringify(embedding) : null,
        data.resume_url || null,
        data.resume_summary || null
      ]
    );
  } else if (role === "founder") {
    // Generate profile embedding
    const profileText = `Name: ${data.name} | Startup: ${data.startupName} | Description: ${data.startupDesc} | Needs: ${data.hiringNeeds} | Budget: ${data.budget}`;
    const embedding = isDemoMode ? null : await geminiService.generateEmbedding(profileText);

    await db.promise().query(
      `INSERT INTO startup_profiles (
        user_id, founder_id, startup_name, current_stage, current_need, monthly_investment, solution_building, embedding
      ) VALUES (?, ?, ?, 'Idea Stage', ?, ?, ?, ?)`,
      [userId, founder_id, data.startupName, data.hiringNeeds, data.budget, data.startupDesc, embedding ? JSON.stringify(embedding) : null]
    );
  } else if (role === "cofounder") {
    const superpowerText = `${data.superpowers} (Preferred Stage: ${data.stage})`;
    
    // Generate profile embedding
    const profileText = `Name: ${data.name} | Expertise: ${data.expertise} | Stage: ${data.stage} | Equity: ${data.equity} | Superpowers: ${data.superpowers}`;
    const embedding = isDemoMode ? null : await geminiService.generateEmbedding(profileText);

    await db.promise().query(
      `INSERT INTO cofounder_profiles (
        user_id, cofounder_id, full_legal_name, primary_identity, anti_portfolio, equity_minimum, embedding
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, cofounder_id, data.name, data.expertise, superpowerText, data.equity, embedding ? JSON.stringify(embedding) : null]
    );
  }
}

// Dynamic recommendations notifier
async function triggerRecommendationsAndAlerts(role, phone, data) {
  try {
    let matches = [];
    let title = "";

    if (role === "freelancer") {
      title = "👤 Matching Opportunities for Freelancer";
      const [jobs] = await db.promise().query(
        "SELECT job_id, startup_name, job_title, job_requirements, full_job_description, budget_range FROM foundu_jobs WHERE job_type = 'freelancer' LIMIT 15"
      );

      if (jobs.length > 0) {
        matches = await geminiService.getSemanticJobRecommendations(data, jobs);
      }
    } else if (role === "cofounder") {
      title = "🤝 Matching Startups for Co-Founder";
      const [startups] = await db.promise().query(
        "SELECT id, startup_name, solution_building AS startup_idea, current_need, monthly_investment FROM startup_profiles LIMIT 15"
      );

      if (startups.length > 0) {
        matches = await geminiService.getSemanticStartupRecommendations(data, startups);
      }
    } else if (role === "founder") {
      title = "🚀 Talent Suggestions for Founder";
      const [talents] = await db.promise().query(
        `SELECT u.id, u.full_name, u.user_type, fp.skills_description, fp.experience, fp.stipend_expectations 
         FROM users u 
         LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id 
         WHERE u.user_type != 'founder' LIMIT 15`
      );

      // Re-map freelancer database expectations column names
      const normalizedTalents = talents.map(t => ({
        id: t.id,
        full_name: t.full_name,
        user_type: t.user_type,
        skills_description: t.skills_description || "",
        years_experience: t.experience || "",
        hourly_rate: t.stipend_expectations || ""
      }));

      if (normalizedTalents.length > 0) {
        matches = await geminiService.getSemanticTalentRecommendations(data, normalizedTalents);
      }
    }

    if (matches && matches.length > 0) {
      let recsMsg = `🎉 **FoundU Profile Setup Complete!**\n\nHere are your top matches calculated using Ginnie's semantic AI matcher:\n\n`;
      matches.forEach((m, idx) => {
        recsMsg += `*${idx + 1}. ${m.title}*\n🎯 **Match Score:** ${m.score}%\n💡 **Reason:** ${m.reason}\n🔗 [View and Apply](${m.link})\n\n`;
      });
      recsMsg += `Click the links to log in or register on the FoundU portal to proceed with your matches!`;

      await whatsappService.sendWhatsAppDirectMessage(phone, recsMsg);
    } else {
      await whatsappService.sendWhatsAppDirectMessage(
        phone,
        "🎉 **FoundU Profile Setup Complete!**\n\nThere are no active matching opportunities right now. We will alert you on WhatsApp as soon as matching postings become available!"
      );
    }
  } catch (recErr) {
    console.error("[Recommendations Trigger Error]:", recErr);
    await whatsappService.sendWhatsAppDirectMessage(
      phone,
      "🎉 **FoundU Profile Setup Complete!**\n\nVisit the website to view dashboard recommendations."
    );
  }
}
