const db = require("../config/db");
const emailNotificationService = require("./emailNotificationService");
const whatsappService = require("./whatsappService");
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
 * 🚀 THE FOUNDU AI MATCHMAKER ENGINE (V2 - TRIPLE MATCH)
 * 1. Matches Freelancers to Freelance Jobs.
 * 2. Matches Co-founders to Equity/Cofounder Roles.
 * 3. Matches Founders to the BEST Candidates (Freelance + Cofounder) for their active job postings.
 */
const runMatchmaker = async () => {
    try {
        console.log("=== 🤖 STARTING AI MULTI-MATCHMAKER ===");

        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY missing. AI Matchmaking aborted.");
            return { success: false, message: "Gemini API key missing" };
        }

        // ---------------------------------------------------------
        // 1️⃣ DATA GATHERING (FETCH ALL 3 TALENT POOLS & ALL JOBS)
        // ---------------------------------------------------------

        // A. Fetch Freelancer Talent
        const freelancers = await queryAsync(`
            SELECT u.id AS NOTIFY_ID, u.full_name, u.email, u.whatsapp_number, u.whatsapp_opt_in, u.user_type,
                   f.freelancer_type, f.skills_description, f.experience, f.job_profile 
            FROM users u LEFT JOIN freelancer_profiles f ON u.id = f.user_id WHERE u.is_profile_complete = 1 AND u.user_type = 'freelancer'
        `);

        // B. Fetch Co-founder Talent
        const cofounders = await queryAsync(`
            SELECT u.id AS NOTIFY_ID, u.full_name, u.email, u.whatsapp_number, u.whatsapp_opt_in, u.user_type,
                   c.primary_identity, c.superpower1, c.superpower2, c.superpower3, c.domain_iq
            FROM users u LEFT JOIN cofounder_profiles c ON u.id = c.user_id WHERE u.is_profile_complete = 1 AND u.user_type = 'cofounder'
        `);

        // C. Fetch Founders (to suggest talent to them)
        const founders = await queryAsync(`
            SELECT id AS NOTIFY_ID, founder_id, full_name, email, whatsapp_number, whatsapp_opt_in, user_type FROM users WHERE user_type = 'founder'
        `);

        // D. Fetch ALL Open Jobs & MAP founder_id TO NOTIFY_ID (user_id)
        const rawJobs = await queryAsync(`
            SELECT job_id, founder_id, startup_name, job_title, domain, role_category, job_requirements, budget_range, job_type
            FROM foundu_jobs ORDER BY created_at DESC
        `);

        // 🔗 MAP IDs: Change founder_id in jobs to the ACTUAL NOTIFY_ID (user_id) of the founder
        const allJobs = rawJobs.map(job => {
             const founder = founders.find(f => Number(f.founder_id) === Number(job.founder_id));
             return {
                 ...job,
                 NOTIFY_ID: founder ? founder.NOTIFY_ID : null // Explicitly link the job to the real User ID
             };
        });

        if (allJobs.length === 0) {
            console.log("No active jobs found.");
            return { success: true, message: "No jobs to match" };
        }

        // ---------------------------------------------------------
        // 2️⃣ THE BRAIN: Gemini Analysis
        // ---------------------------------------------------------

        const prompt = `
        You are FoundU's highly intelligent AI Talent Matchmaker. 

        CRITICAL INSTRUCTION: You must use the 'NOTIFY_ID' provided in the lists for your final output.

        CONTEXT:
        - Freelancers/Cofounders: Find matching Jobs from 'ALL OPEN JOBS'.
        - Founders: Scan 'ALL OPEN JOBS' for jobs where 'NOTIFY_ID' matches their own. Then find top Candidates from TALENT pools for those jobs.

        DATA:
        - TALENT (Freelancers): ${JSON.stringify(freelancers)}
        - TALENT (Co-founders): ${JSON.stringify(cofounders)}
        - ALL OPEN JOBS: ${JSON.stringify(allJobs)}
        - FOUNDERS: ${JSON.stringify(founders)}

        GOALS:
        1. For each Freelancer/Co-founder (NOTIFY_ID), find their top 3 matching Jobs.
        2. For each Founder (NOTIFY_ID), find top 3 Candidates from TALENT pools for the jobs they own.

        OUTPUT FORMAT: 
        A single JSON array of objects.
        [
          {
            "NOTIFY_ID": 25,
            "user_type": "freelancer",
            "matches": [
               { "job_id": 1, "job_title": "React Dev", "startup_name": "T-Corp", "reason": "Reason" }
            ]
          },
          {
            "NOTIFY_ID": 24,
            "user_type": "founder",
            "matches": [
               { "candidate_id": 25, "candidate_name": "Hardick", "role": "Dev", "reason": "Reason" }
            ]
          }
        ]

        STRICT RULES: Valid JSON only. Do NOT use founder_id. Use NOTIFY_ID.
        `;

        console.log("🧠 Sending Triple-Match context to Gemini...");
        const responseText = await generateWithFallback(prompt);
        const matchResults = extractAndParseJSON(responseText);
        
        // ---------------------------------------------------------
        // 3️⃣ NOTIFICATION ENGINE (EMAIL + WHATSAPP)
        // ---------------------------------------------------------
        
        let totalAlerts = 0;
        const notifiedUsers = []; // New: Track which users were notified for Admin visibility
        const allUsers = [...freelancers, ...cofounders, ...founders];

        for (const userMatch of matchResults) {
            const targetId = userMatch.NOTIFY_ID || userMatch.user_id;
            const user = allUsers.find(u => String(u.NOTIFY_ID) === String(targetId));
            
            if (!user || !userMatch.matches || userMatch.matches.length === 0) {
                console.log(`⚠️ User ID ${targetId} not found or no matches. Skipping.`);
                continue;
            }

            const isFounder = user.user_type === 'founder';
            const subject = isFounder ? "🎯 High-Potential Talent Matched for You!" : "🎯 New AI Matched Jobs are here!";
            const dashLink = isFounder ? "/startup-dashboard" : (user.user_type === 'cofounder' ? "/cofounder-dashboard" : "/freelancer-dashboard");

            // A. Send Email
            await emailNotificationService.sendEmailNotification(
                user.NOTIFY_ID,
                subject,
                `FoundU AI found ${userMatch.matches.length} perfect matches for you.`,
                "View Dashboard",
                `${process.env.FRONTEND_URL || 'http://localhost:5173'}${dashLink}`
            );

            // B. Send WhatsApp (If Opted In)
            if (user.whatsapp_opt_in && user.whatsapp_number) {
                 // Build Custom Meta-friendly Body
                 let waMatches = userMatch.matches.map((m, i) => {
                     const title = isFounder ? `Talent: ${m.candidate_name}` : `Job: ${m.job_title}`;
                     const company = isFounder ? `(${m.role})` : `@ ${m.startup_name}`;
                     return `*${i+1}. ${title} ${company}*\n💡 ${m.reason}`;
                 }).join('\n\n');

                 const waBody = `🎯 *FoundU AI Match Alert!*\nHi ${user.full_name}, we found ${userMatch.matches.length} new ${isFounder ? 'profiles' : 'jobs'} that perfectly fit:\n\n${waMatches}\n\nCheck them out in your dashboard!`;

                 console.log(`📱 Triggering WhatsApp for ${user.full_name} (${user.user_type})...`);
                 await whatsappService.sendWhatsAppMatchAlert(user.whatsapp_number, user.full_name, userMatch.matches, waBody); 
            }

            // Track for Admin UI
            notifiedUsers.push({
                user_id: user.NOTIFY_ID,
                full_name: user.full_name,
                email: user.email,
                user_type: user.user_type,
                match_count: userMatch.matches.length
            });

            console.log(`✅ Alert sent to ${user.full_name} (${user.user_type})`);
            totalAlerts++;
        }

        console.log(`=== 🏁 MATCHMAKER COMPLETE (${totalAlerts} users notified) ===`);
        return { success: true, totalNotify: totalAlerts, raw_matches: matchResults, notifiedUsers };

    } catch (error) {
        console.error("❌ AI Matchmaker Error:", error);
        return { success: false, error: error.message };
    }
};

module.exports = { runMatchmaker };
