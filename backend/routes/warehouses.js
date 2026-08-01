const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("warehouses")
      .select("*")
      .order("warehouse_id", { ascending: true });

    if (error) {
      return res.status(500).json(error);
    }

    const warehouses = data.map((row) => ({
      id: row.warehouse_id,
      city: row.city,
      capacity: row.capacity,
      occupied: row.occupied,
      available: row.available,
      temperature: row.temperature,
      risk: row.risk,
    }));

    res.json(warehouses);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
