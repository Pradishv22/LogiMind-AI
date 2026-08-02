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

// Allow all origins (for hackathon/demo)
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 LogiMind AI Backend Running");
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend Running",
  });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/fleet", fleetRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/decision", decisionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
