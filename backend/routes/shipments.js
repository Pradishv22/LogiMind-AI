const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("shipment_id", { ascending: true });

    if (error) {
      return res.status(500).json(error);
    }

    const shipments = data.map((row) => ({
      id: row.shipment_id,
      origin: row.origin,
      destination: row.destination,
      priority: row.priority,
      status: row.status,
      eta: row.eta,
      progress: row.progress,
    }));

    res.json(shipments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
