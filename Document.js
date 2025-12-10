const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  shipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shipment",
    required: true
  },

  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    default: null
  },

  type: {
    type: String,
    enum: ["BL", "Invoice", "VehiclePhoto"],
    required: true
  },

  filename: String,  // original filename
  url: String,       // local path or S3 URL
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Document", DocumentSchema);
