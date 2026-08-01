const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");

router.get("/", async (req, res) => {
  try {
    const [
      { count: shipments },
      { count: fleet },
      { count: warehouses },
      { count: delayed },
      { count: activeFleet },
      { count: highRisk },
    ] = await Promise.all([
      supabase.from("shipments").select("*", { count: "exact", head: true }),
      supabase.from("fleet").select("*", { count: "exact", head: true }),
      supabase.from("warehouses").select("*", { count: "exact", head: true }),
      supabase
        .from("shipments")
        .select("*", { count: "exact", head: true })
        .eq("status", "Delayed"),
      supabase.from("fleet").select("*", { count: "exact", head: true }).neq("status", "Stopped"),
      supabase.from("warehouses").select("*", { count: "exact", head: true }).eq("risk", "High"),
    ]);

    res.json({
      totalShipments: shipments || 0,
      fleetCount: fleet || 0,
      warehouseCount: warehouses || 0,
      delayedShipments: delayed || 0,
      activeFleet: activeFleet || 0,
      highRiskWarehouses: highRisk || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
