const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  createPayment,
  markAsPaid,
  getPayments,
  getPayment
} = require("../controllers/paymentController");

// Create Payment (assign officer)
router.post("/", auth, createPayment);

// Mark as Paid (payment officer)
router.patch("/:paymentId/paid", auth, markAsPaid);

// Get all payments
router.get("/", auth, getPayments);

// Get single payment
router.get("/:id", auth, getPayment);

module.exports = router;
