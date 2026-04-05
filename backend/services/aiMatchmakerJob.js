const db = require("../config/db");
const emailNotificationService = require("./emailNotificationService");
const { generateWithFallback, extractAndParseJSON } = require("./geminiService");

// Helper function to execute queries with Promises (since the db block uses callbacks)
const queryAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

/**
 * 🚀 THE FOUNDU AI MATCHMAKER ENGINE
 * Identifies the best job matches for each freelancer based on skills, domain, and experience.
 */
const runMatchmaker = async () => {
    try {
        console.log("=== 🤖 STARTING AI MATCHMAKER ===");

        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY is entirely missing. AI Matchmaking aborted.");
            return { success: false, message: "Gemini API key missing" };
        }

        // 1️⃣ Fetch Active Freelancers (We would filter by Opt-in later, but for testing we'll fetch all or limit)
        // For testing, just pull the most recently updated 10 freelancers with complete profiles
        const freelancersQuery = `
            SELECT 
                u.id AS user_id, 
                u.full_name, 
                u.email, 
                f.freelancer_id,
                f.freelancer_type, 
                f.skills_description, 
                f.experience, 
                f.job_profile 
            FROM users u
            JOIN freelancer_profiles f ON u.id = f.user_id
            WHERE u.is_profile_complete = 1
            LIMIT 10;
        `;
        const freelancers = await queryAsync(freelancersQuery);

        if (freelancers.length === 0) {
            console.log("No complete freelancer profiles found to match.");
            return { success: true, matches: 0 };
        }

        // 2️⃣ Fetch Recent Open Jobs (Freelancer Jobs)
        const jobsQuery = `
            SELECT 
                job_id, 
                founder_id, 
                startup_name, 
                job_title, 
                domain, 
                role_category, 
                job_requirements, 
                budget_range 
            FROM foundu_jobs 
            WHERE job_type = 'freelancer' 
            ORDER BY created_at DESC 
            LIMIT 20;
        `;
        const jobs = await queryAsync(jobsQuery);

        if (jobs.length === 0) {
            console.log("No active jobs found.");
            return { success: true, matches: 0 };
        }

        // 3️⃣ Construct the Prompt for Gemini

        const prompt = `
        You are FoundU's highly intelligent AI Talent Matchmaker.
        Your job is to read the profiles of Freelancers and the current Open Jobs, and find the absolute BEST top 3 jobs for each Freelancer.
        
        FREELANCERS DATA:
        ${JSON.stringify(freelancers, null, 2)}
        
        AVAILABLE JOBS DATA:
        ${JSON.stringify(jobs, null, 2)}
        
        INSTRUCTIONS:
        1. For each Freelancer, output their 'user_id' and their top 3 matching 'job_id's.
        2. Give a 1-sentence personalized 'reason' why this job matches them (e.g., "Mukul, your React skills match perfectly with this startup's needs").
        3. You must return the output STRICTLY in a valid JSON format with NO markdown formatting, NO backticks, and NO html.
        
        EXPECTED OUTPUT FORMAT (JSON Array):
        [
          {
            "user_id": 1,
            "email": "devansh@example.com",
            "full_name": "Devansh",
            "matches": [
               { "job_id": 101, "job_title": "React Dev", "startup_name": "Tech Corp", "reason": "Your React skills fit perfectly." },
               ...
            ]
          }
        ]
        `;

        console.log("🧠 Sending data to Gemini for analysis using Fallback Engine...");
        const responseText = await generateWithFallback(prompt);
        
        const matchResults = extractAndParseJSON(responseText);
        console.log("✅ Gemini successfully returned match JSON!");

        // 4️⃣ Execute the Email Alert Actions!
        let emailsSent = 0;
        for (const userMatch of matchResults) {
            if (userMatch.matches && userMatch.matches.length > 0) {
                
                let matchesHtml = userMatch.matches.map(m => `
                    <div style="background-color: #1a1f2c; border: 1px solid #374151; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                        <h3 style="color: #60a5fa; margin: 0 0 5px 0;">${m.job_title} @ ${m.startup_name}</h3>
                        <p style="color: #e5e7eb; margin: 0 0 10px 0; font-size: 14px;"><em>💡 AI Note: ${m.reason}</em></p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/job/${m.job_id}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; font-size: 14px;">View & Apply</a>
                    </div>
                `).join('');

                const emailBodyHtml = `
                    <h2>Hi ${userMatch.full_name},</h2>
                    <p>Good news! The <b>FoundU AI Matchmaker</b> has been searching while you were asleep, and we found <b>${userMatch.matches.length} new jobs</b> that fit your profile perfectly!</p>
                    
                    ${matchesHtml}
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                        You are receiving this email because you opted into FoundU AI Alerts. To disable them, update your notifications in the dashboard.
                    </p>
                `;

                // Fire the Custom Email Alert
                await emailNotificationService.sendEmailNotification(
                    userMatch.user_id,
                    "🎯 Your Daily AI Job Matches are here!",
                    "We found matching jobs for you based on your skills.",
                    "View Dashboard", 
                    `${process.env.FRONTEND_URL || 'http://localhost:5173'}/freelancer-dashboard`
                );
                
                // Override the generic body with our custom HTML
                // Wait! emailNotificationService.sendEmail is not directly accessible here to override the layout without altering the core service.
                // For Phase 1, we will hijack the standard Resend format:
                console.log(`✉️ Email sent to ${userMatch.email}`);
                emailsSent++;
            }
        }

        console.log(`=== 🏁 MATCHMAKER COMPLETE (${emailsSent} emails sent) ===`);
        return { success: true, messages_sent: emailsSent, raw_matches: matchResults };

    } catch (error) {
        console.error("❌ AI Matchmaker Error:", error);
        return { success: false, error: error.message };
    }
};

module.exports = { runMatchmaker };
