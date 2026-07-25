const db = require("../config/db");
const emailNotificationService = require("./emailNotificationService");
const whatsappService = require("./whatsappService");
const { generateWithFallback, extractAndParseJSON, cosineSimilarity } = require("./geminiService");

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
                    f.freelancer_type, f.skills_description, f.experience, f.job_profile, f.embedding, f.resume_summary
             FROM users u LEFT JOIN freelancer_profiles f ON u.id = f.user_id 
             WHERE u.is_profile_complete = 1 
               AND u.user_type = 'freelancer'
        `);

        // B. Fetch Co-founder Talent
        const cofounders = await queryAsync(`
             SELECT u.id AS NOTIFY_ID, u.full_name, u.email, u.whatsapp_number, u.whatsapp_opt_in, u.user_type,
                    c.primary_identity, c.superpower1, c.superpower2, c.superpower3, c.domain_iq, c.embedding
             FROM users u LEFT JOIN cofounder_profiles c ON u.id = c.user_id 
             WHERE u.is_profile_complete = 1 
               AND u.user_type = 'cofounder'
        `);

        // C. Fetch Founders (to suggest talent to them)
        const founders = await queryAsync(`
             SELECT id AS NOTIFY_ID, founder_id, full_name, email, whatsapp_number, whatsapp_opt_in, user_type 
             FROM users 
             WHERE user_type = 'founder' 
               AND is_profile_complete = 1
        `);

        // D. Fetch ALL Open Jobs & MAP founder_id TO NOTIFY_ID (user_id)
        const rawJobs = await queryAsync(`
             SELECT job_id, founder_id, startup_name, job_title, domain, role_category, job_requirements, budget_range, job_type, embedding
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
        // 2️⃣ THE BRAIN: Local Vector Matching + Gemini Refinement
        // ---------------------------------------------------------
        console.log("🧠 Performing local vector similarity matching...");
        const matchResults = [];

        // Helper: safe JSON parse for embeddings
        const parseEmbedding = (emb) => {
            if (!emb) return null;
            try {
                return typeof emb === "string" ? JSON.parse(emb) : emb;
            } catch (e) {
                return null;
            }
        };

        // A. Match Freelancers to Jobs
        for (const free of freelancers) {
            const freeVec = parseEmbedding(free.embedding);
            if (!freeVec) continue;

            // Calculate similarity to all jobs
            const jobScores = allJobs
                .map(job => {
                    const jobVec = parseEmbedding(job.embedding);
                    const score = jobVec ? cosineSimilarity(freeVec, jobVec) : 0;
                    return { job, score };
                })
                .sort((a, b) => b.score - a.score)
                .slice(0, 5); // Pick top 5

            if (jobScores.length === 0) continue;

            // Refine top matches using Gemini Flash
            const prompt = `
                You are FoundU's AI talent matchmaker.
                Analyze this freelancer profile and rank the top 3 best matching jobs from the candidates list.
                
                FREELANCER:
                Name: ${free.full_name}
                Skills: ${free.skills_description}
                Experience: ${free.experience}
                Job Profile: ${free.job_profile || "N/A"}
                Resume Summary: ${free.resume_summary || "N/A"}

                CANDIDATE JOBS:
                ${JSON.stringify(jobScores.map(js => ({
                    job_id: js.job.job_id,
                    job_title: js.job.job_title,
                    startup_name: js.job.startup_name,
                    job_requirements: js.job.job_requirements,
                    budget_range: js.job.budget_range
                })))}

                Return ONLY a JSON array format (do not include markdown wrapping or other text):
                [
                  {
                    "job_id": number,
                    "job_title": "React Dev",
                    "startup_name": "T-Corp",
                    "reason": "1-sentence suitability reason",
                    "score": number (0-100 match percentage)
                  }
                ]
            `;

            try {
                const text = await generateWithFallback(prompt);
                const refinedMatches = extractAndParseJSON(text);
                if (refinedMatches && refinedMatches.length > 0) {
                    matchResults.push({
                        NOTIFY_ID: free.NOTIFY_ID,
                        user_type: "freelancer",
                        matches: refinedMatches
                    });
                }
            } catch (e) {
                console.warn(`[Matchmaker] Failed to refine matches for freelancer ${free.full_name}:`, e.message);
            }
        }

        // B. Match Co-founders to Startups
        for (const co of cofounders) {
            const coVec = parseEmbedding(co.embedding);
            if (!coVec) continue;

            // Retrieve startup profiles (which have cofounder needs)
            const startupProfiles = await queryAsync(`
                SELECT user_id, founder_id, startup_name, current_stage, current_need, monthly_investment, solution_building, embedding
                FROM startup_profiles
            `);

            const startupScores = startupProfiles
                .map(s => {
                    const startupVec = parseEmbedding(s.embedding);
                    const score = startupVec ? cosineSimilarity(coVec, startupVec) : 0;
                    return { startup: s, score };
                })
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

            if (startupScores.length === 0) continue;

            const prompt = `
                You are FoundU's AI co-founder matchmaker.
                Analyze this co-founder candidate profile and rank the top 3 best matching startups from the candidates list.
                
                CO-FOUNDER:
                Name: ${co.full_name}
                Expertise: ${co.primary_identity}
                Superpowers: ${co.superpower1 || co.anti_portfolio || "N/A"}

                CANDIDATE STARTUPS:
                ${JSON.stringify(startupScores.map(ss => ({
                    id: ss.startup.user_id,
                    startup_name: ss.startup.startup_name,
                    idea: ss.startup.solution_building,
                    needs: ss.startup.current_need
                })))}

                Return ONLY a JSON array format (do not include markdown wrapping or other text):
                [
                  {
                    "job_id": number, // Use the startup's user_id as job_id here
                    "job_title": "Co-founder Needs",
                    "startup_name": "T-Corp",
                    "reason": "1-sentence suitability reason",
                    "score": number (0-100 match percentage)
                  }
                ]
            `;

            try {
                const text = await generateWithFallback(prompt);
                const refinedMatches = extractAndParseJSON(text);
                if (refinedMatches && refinedMatches.length > 0) {
                    matchResults.push({
                        NOTIFY_ID: co.NOTIFY_ID,
                        user_type: "cofounder",
                        matches: refinedMatches
                    });
                }
            } catch (e) {
                console.warn(`[Matchmaker] Failed to refine matches for co-founder ${co.full_name}:`, e.message);
            }
        }

        // C. Match Founders to Candidates (Freelancers + Co-founders)
        for (const founder of founders) {
            // Find active jobs posted by this founder
            const founderJobs = allJobs.filter(j => String(j.NOTIFY_ID) === String(founder.NOTIFY_ID));
            if (founderJobs.length === 0) continue;

            const founderMatches = [];

            for (const job of founderJobs) {
                const jobVec = parseEmbedding(job.embedding);
                if (!jobVec) continue;

                // Merge freelancers and co-founders as potential candidates
                const candidates = [
                    ...freelancers.map(f => ({ ...f, type: "freelancer" })),
                    ...cofounders.map(c => ({ ...c, type: "cofounder" }))
                ];

                const candidateScores = candidates
                    .map(cand => {
                        const candVec = parseEmbedding(cand.embedding);
                        const score = candVec ? cosineSimilarity(jobVec, candVec) : 0;
                        return { cand, score };
                    })
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5);

                if (candidateScores.length === 0) continue;

                const prompt = `
                    You are FoundU's AI talent matchmaker.
                    Analyze this job posting and rank the top 3 best matching candidates from the candidates list.
                    
                    JOB POSTING:
                    Title: ${job.job_title}
                    Requirements: ${job.job_requirements}

                    CANDIDATES list:
                    ${JSON.stringify(candidateScores.map(cs => ({
                        id: cs.cand.NOTIFY_ID,
                        name: cs.cand.full_name,
                        role: cs.cand.user_type,
                        skills: cs.cand.skills_description || cs.cand.primary_identity || "N/A",
                        experience: cs.cand.experience || "N/A",
                        resume_summary: cs.cand.resume_summary || "N/A"
                    })))}

                    Return ONLY a JSON array format:
                    [
                      {
                        "candidate_id": number,
                        "candidate_name": "Hardick",
                        "role": "Developer",
                        "reason": "1-sentence suitability reason",
                        "score": number (0-100 match percentage)
                      }
                    ]
                `;

                try {
                    const text = await generateWithFallback(prompt);
                    const refinedMatches = extractAndParseJSON(text);
                    if (refinedMatches && refinedMatches.length > 0) {
                        founderMatches.push(...refinedMatches);
                    }
                } catch (e) {
                    console.warn(`[Matchmaker] Failed to match candidates for job ${job.job_title}:`, e.message);
                }
            }

            if (founderMatches.length > 0) {
                matchResults.push({
                    NOTIFY_ID: founder.NOTIFY_ID,
                    user_type: "founder",
                    matches: founderMatches.slice(0, 3) // Pick top 3 total
                });
            }
        }
        
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

            // B. Send WhatsApp (If Subscribed & Opted In)
            if (user.whatsapp_number) {
                 // Build Custom Meta-friendly List for Template Variable {{3}}
                 let waMatches = userMatch.matches.map((m, i) => {
                     const title = isFounder ? `Talent: ${m.candidate_name}` : `Job: ${m.job_title}`;
                     const company = isFounder ? `(${m.role})` : `@ ${m.startup_name}`;
                     return `*${i+1}. ${title} ${company}*\n💡 ${m.reason}`;
                 }).join('\n\n');

                 console.log(`📱 Triggering Meta WhatsApp Alert for ${user.full_name} (${user.user_type})...`);
                 await whatsappService.sendWhatsAppMatchAlert(
                     user.whatsapp_number, 
                     user.full_name,
                     userMatch.matches
                 ); 
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
