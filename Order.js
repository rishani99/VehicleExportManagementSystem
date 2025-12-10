const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { createOrder, getAllOrders, getOrder, updateStatus } =
  require("../controllers/Order_Controller");

// Create Order
router.post("/", auth, createOrder);

// Get all orders
router.get("/", auth, getAllOrders);

// Get single order
router.get("/:id", auth, getOrder);

// Update Order Status
router.patch("/:id/status", auth, updateStatus);

module.exports = router;
