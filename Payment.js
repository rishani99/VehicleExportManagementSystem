const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  shipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shipment",
    required: true
  },

  invoiceNumber: {
    type: String,
    unique: true
  },

  amountUSD: Number,
  amountLocal: Number,
  currency: String,

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  paymentDate: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto generate invoice number
PaymentSchema.pre("save", function(next){
  if(!this.invoiceNumber){
    this.invoiceNumber = "INV-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Payment", PaymentSchema);
