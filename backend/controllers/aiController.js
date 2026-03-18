const geminiService = require("../services/geminiService");

/**
 * Enriches job details based on user inputs.
 */
exports.enrichJob = async (req, res) => {
  const { role, inputs } = req.body;

  if (!role || !inputs) {
    return res.status(400).json({ message: "Role and inputs are required." });
  }

  try {
    const enrichedData = await geminiService.enrichJobDetails(role, inputs);
    if (!enrichedData) {
      return res.status(500).json({ message: "Failed to enrich job details with AI." });
    }

    res.json({
      success: true,
      data: enrichedData
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ error: error.message });
  }
};
