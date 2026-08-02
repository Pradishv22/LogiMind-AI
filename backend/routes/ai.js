const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");
const ai = require("../config/gemini");

router.get("/", async (req, res) => {
  try {
    const { data: shipments } = await supabase.from("shipments").select("*");
    const { data: fleet } = await supabase.from("fleet").select("*");
    const { data: warehouses } = await supabase.from("warehouses").select("*");

    const prompt = `
You are LogiMind AI.

Analyze the logistics network.

Shipments:
${JSON.stringify(shipments)}

Fleet:
${JSON.stringify(fleet)}

Warehouses:
${JSON.stringify(warehouses)}

Return:
1. Overall Health
2. Risks
3. Recommendations
4. Priority Actions
`;

    const response = await ai.models.generateContent({
     model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    res.json({
      success: true,
      analysis: response.text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
