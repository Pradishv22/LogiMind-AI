require("dotenv").config();

const express = require("express");
const cors = require("cors");

const shipmentRoutes = require("./routes/shipments");
const fleetRoutes = require("./routes/fleet");
const warehouseRoutes = require("./routes/warehouses");
const dashboardRoutes = require("./routes/dashboard");
const aiRoutes = require("./routes/ai");
const mlRoutes = require("./routes/ml");
const decisionRoutes = require("./routes/decision");

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://logi-mind-ai-f2wi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 LogiMind AI Backend Running");
});

// Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/fleet", fleetRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/decision", decisionRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    message: "LogiMind AI Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
