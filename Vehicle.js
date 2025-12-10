import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

// Get all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Add a vehicle
router.post("/", async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

export default router;
