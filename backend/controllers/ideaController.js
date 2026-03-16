const db = require("../config/db");

// 1. Create a new Startup Idea
exports.createIdea = (req, res) => {
    const { user_id, title, description } = req.body;
    if (!user_id || !title || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = "INSERT INTO startup_ideas (user_id, title, description) VALUES (?, ?, ?)";
    db.query(query, [user_id, title, description], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const ideaId = result.insertId;

        // --- MOCK AI LOGIC ---
        // Based on keywords in description, generate specific milestones
        let milestones = [
            "Market Research: Identify top 5 competitors",
            "Define Value Proposition: What makes you unique?"
        ];

        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes("app") || lowerDesc.includes("mobile") || lowerDesc.includes("ios") || lowerDesc.includes("android")) {
            milestones.push("Tech: Design wireframes for mobile UI");
            milestones.push("Team: Hire a React Native / Flutter developer from FoundU");
        } else if (lowerDesc.includes("website") || lowerDesc.includes("platform") || lowerDesc.includes("web")) {
            milestones.push("Tech: Setup domain and landing page");
            milestones.push("Team: Hire a Full-stack developer from FoundU");
        }

        if (lowerDesc.includes("market") || lowerDesc.includes("sell") || lowerDesc.includes("customer")) {
            milestones.push("Marketing: Create a social media strategy");
            milestones.push("Growth: Run a pilot program with 10 users");
        }

        // Batch insert milestones
        const milestoneQuery = "INSERT INTO idea_milestones (idea_id, milestone_text) VALUES ?";
        const values = milestones.map(text => [ideaId, text]);

        db.query(milestoneQuery, [values], (mErr) => {
            if (mErr) console.error("Milestone insert error:", mErr);
            res.status(201).json({ 
                success: true, 
                message: "Idea created and AI optimized!",
                idea_id: ideaId 
            });
        });
    });
};

// 2. Get all Ideas for a user
exports.getUserIdeas = (req, res) => {
    const { user_id } = req.params;
    const query = "SELECT * FROM startup_ideas WHERE user_id = ? ORDER BY created_at DESC";
    
    db.query(query, [user_id], (err, ideas) => {
        if (err) return res.status(500).json({ error: err.message });

        if (ideas.length === 0) return res.json({ success: true, ideas: [] });

        // Get milestones for each idea
        const ideaIds = ideas.map(i => i.id);
        const mQuery = "SELECT * FROM idea_milestones WHERE idea_id IN (?)";
        
        db.query(mQuery, [ideaIds], (mErr, milestones) => {
            if (mErr) return res.status(500).json({ error: mErr.message });

            const formattedIdeas = ideas.map(idea => ({
                ...idea,
                milestones: milestones.filter(m => m.idea_id === idea.id)
            }));

            res.json({ success: true, ideas: formattedIdeas });
        });
    });
};

// 3. Toggle Milestone completion
exports.toggleMilestone = (req, res) => {
    const { milestone_id } = req.params;
    const { is_completed } = req.body;

    const query = "UPDATE idea_milestones SET is_completed = ? WHERE id = ?";
    db.query(query, [is_completed, milestone_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Milestone updated" });
    });
};

// 4. Delete an Idea
exports.deleteIdea = (req, res) => {
    const { idea_id } = req.params;
    db.query("DELETE FROM startup_ideas WHERE id = ?", [idea_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Idea deleted" });
    });
};
