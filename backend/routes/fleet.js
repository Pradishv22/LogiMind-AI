const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("fleet")
      .select("*")
      .order("truck_id", { ascending: true });

    if (error) {
      return res.status(500).json(error);
    }

    const fleet = data.map((row) => ({
      id: row.truck_id,
      driver: row.driver,
      model: row.vehicle,
      fuel: row.fuel,
      health: row.health,
      status: row.status,
      route: `${row.origin} → ${row.destination}`,
      odometer: `${Math.floor(Math.random() * 200000 + 50000)} km`,
      risk: row.risk,
    }));

    res.json(fleet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
