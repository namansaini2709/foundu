const db = require("../config/db");

// Get only active testimonials for the homepage
exports.getPublicTestimonials = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM homepage_testimonials WHERE is_active = TRUE ORDER BY created_at DESC"
        );
        res.json({ success: true, testimonials: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Get all testimonials (including hidden ones)
exports.getAllTestimonials = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM homepage_testimonials ORDER BY created_at DESC"
        );
        res.json({ success: true, testimonials: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Add a new testimonial
exports.createTestimonial = async (req, res) => {
    const { name, affiliation, rating, review, tagline } = req.body;

    if (!name || !review) {
        return res.status(400).json({ message: "Name and review are required" });
    }

    try {
        const [result] = await db.promise().query(
            "INSERT INTO homepage_testimonials (name, affiliation, rating, review, tagline) VALUES (?, ?, ?, ?, ?)",
            [name, affiliation, rating || 5, review, tagline]
        );
        res.json({ success: true, message: "Testimonial added", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Update a testimonial
exports.updateTestimonial = async (req, res) => {
    const { id } = req.params;
    const { name, affiliation, rating, review, tagline, is_active } = req.body;

    try {
        await db.promise().query(
            "UPDATE homepage_testimonials SET name=?, affiliation=?, rating=?, review=?, tagline=?, is_active=? WHERE id=?",
            [name, affiliation, rating, review, tagline, is_active, id]
        );
        res.json({ success: true, message: "Testimonial updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query("DELETE FROM homepage_testimonials WHERE id = ?", [id]);
        res.json({ success: true, message: "Testimonial deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
