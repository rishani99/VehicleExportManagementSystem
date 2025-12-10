const Payment = require("../models/Payment");
const Shipment = require("../models/Shipment");
const { getExchangeRate } = require("../services/s3Service");

// Create Payment (after shipment created)
exports.createPayment = async (req,res)=>{
  try{
    const { shipmentId, amountUSD, currency } = req.body;

    const shipment = await Shipment.findById(shipmentId);
    if(!shipment) return res.status(404).json({msg:"Shipment not found"});

    const rate = await getExchangeRate("USD", currency);
    const amountLocal = amountUSD * rate;

    const payment = await Payment.create({
      shipment: shipmentId,
      amountUSD,
      currency,
      amountLocal,
      paymentStatus: "pending"
    });

    // Update shipment status
    shipment.status = "payment_assigned";
    await shipment.save();

    res.json(payment);
  }catch(err){
    console.log(err);
    res.status(500).json({msg:"Server error"});
  }
};

// Mark payment as paid
exports.markAsPaid = async (req,res)=>{
  try{
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId).populate("shipment");
    if(!payment) return res.status(404).json({msg:"Payment not found"});

    payment.paymentStatus = "paid";
    payment.paidBy = req.user.id;
    payment.paymentDate = new Date();
    await payment.save();

    // Update shipment status
    const shipment = await Shipment.findById(payment.shipment._id);
    shipment.status = "payment_completed";
    await shipment.save();

    res.json(payment);
  }catch(err){
    console.log(err);
    res.status(500).json({msg:"Server error"});
  }
};

// List all payments
exports.getPayments = async (req,res)=>{
  const list = await Payment.find().populate("shipment").populate("paidBy");
  res.json(list);
};

// Get single payment
exports.getPayment = async (req,res)=>{
  const payment = await Payment.findById(req.params.id).populate("shipment").populate("paidBy");
  if(!payment) return res.status(404).json({msg:"Payment not found"});
  res.json(payment);
};
