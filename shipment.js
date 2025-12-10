const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  createShipment,
  assignPaymentHandler,
  updateStatus,
  getShipments
} = require("../controllers/shipmentController");

// Create shipment
router.post("/", auth, createShipment);

// Assign payment handler
router.patch("/:id/assign-payment", auth, assignPaymentHandler);

// Update shipment status
router.patch("/:id/status", auth, updateStatus);

// List all shipments
router.get("/", auth, getShipments);

module.exports = router;
