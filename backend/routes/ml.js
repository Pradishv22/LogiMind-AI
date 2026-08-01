const express = require("express");
const { execFile } = require("child_process");
const path = require("path");

const router = express.Router();

router.get("/delay", (req, res) => {
  const args = [
    3, // priority
    1200, // distance
    5, // traffic
    2, // weather
    40, // vehicle health
    25, // fuel
    95, // warehouse utilization
  ];

  const script = path.join(__dirname, "../ml/scripts/predict_delay.py");

  execFile("python", [script, ...args], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        error: stderr || error.message,
      });
    }

    res.json(JSON.parse(stdout));
  });
});

module.exports = router;
