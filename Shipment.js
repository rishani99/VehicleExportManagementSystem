const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  referenceNumber: {
    type: String,
    unique: true
  },

  vesselName: String,
  portOfLoading: String,
  portOfDischarge: String,
  ETD: Date,   // Expected Time of Departure
  ETA: Date,   // Expected Time of Arrival

  status: {
    type: String,
    enum: [
      "created", 
      "awaiting_payment_assignment",
      "payment_assigned",
      "payment_completed",
      "loaded",
      "in_transit",
      "delivered"
    ],
    default: "created"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // head office user
  },

  paymentHandler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // person assigned to handle payments
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto Reference Number
ShipmentSchema.pre("save", function (next) {
  if (!this.referenceNumber) {
    this.referenceNumber = "SHP-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Shipment", ShipmentSchema);
