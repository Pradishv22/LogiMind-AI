const express = require("express");
const { execFile } = require("child_process");
const path = require("path");

const ai = require("../config/gemini");

const router = express.Router();

function parseJson(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

function stringList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function normalizeReport(report) {
  if (!report || typeof report !== "object") throw new Error("Gemini returned an invalid report.");
  return {
    overallScore: typeof report.overallScore === "number" ? report.overallScore : null,
    overallHealth: typeof report.overallHealth === "string" ? report.overallHealth : "Unavailable",
    confidence: typeof report.confidence === "number" ? report.confidence : null,
    riskLevel: typeof report.riskLevel === "string" ? report.riskLevel : "Unavailable",
    businessImpact: stringList(report.businessImpact),
    recommendations: stringList(report.recommendations),
    priorityActions: stringList(report.priorityActions),
    executiveSummary:
      typeof report.executiveSummary === "string"
        ? report.executiveSummary
        : "No executive summary was generated.",
  };
}

function runEngine(scenario) {
  const enginePath = path.join(__dirname, "../ml/engine/decision_engine.py");
  const pythonExecutable = process.env.PYTHON_BIN || "python";
  return new Promise((resolve, reject) => {
    const args = scenario ? [enginePath, scenario] : [enginePath];
    execFile(pythonExecutable, args, { timeout: 30_000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) return reject(new Error(stderr || error.message));
      try {
        return resolve(JSON.parse(stdout));
      } catch (parseError) {
        return reject(parseError);
      }
    });
  });
}

async function createDecision(req, res) {
  try {
    const scenario = req.method === "POST" ? req.body?.scenario : undefined;
    if (
      scenario !== undefined &&
      (typeof scenario !== "string" || !/^[a-z0-9-]+$/.test(scenario))
    ) {
      return res.status(400).json({ success: false, error: "Invalid simulation scenario." });
    }
    const mlResult = await runEngine(scenario);
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `You are LogiMind AI. Summarize this existing machine-learning output for logistics operators. Do not alter, recreate, or add ML prediction values.\n\n${JSON.stringify(mlResult, null, 2)}\n\nReturn valid JSON only: {"overallScore": number, "overallHealth": "Healthy" | "Watch" | "At Risk" | "Critical", "confidence": number, "riskLevel": "Low" | "Medium" | "High" | "Critical", "businessImpact": ["impact"], "recommendations": ["recommendation"], "priorityActions": ["action"], "executiveSummary": "summary"}. Use only supplied output.`,
      config: { responseMimeType: "application/json" },
    });
    const report = normalizeReport(parseJson(response.text));
    return res.json({
      success: true,
      generatedAt: new Date().toISOString(),
      scenario: mlResult.scenario,
      ...report,
      predictions: {
        delay: mlResult.delay,
        eta: mlResult.eta,
        breakdown: mlResult.breakdown,
        warehouse: mlResult.warehouse,
        route: mlResult.route,
      },
      mlPrediction: mlResult,
      aiRecommendation: report.executiveSummary,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

router.get("/", createDecision);
router.post("/", createDecision);

module.exports = router;
