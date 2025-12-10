const Order = require("../models/Order");
const Vehicle = require("../models/Vehicle");
const { getExchangeRate } = require("../services/s3Service");

exports.createOrder = async (req, res) => {
  try {
    const { buyer, vehicleId, buyerCurrency } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ msg: "Vehicle not found" });

    const rate = await getExchangeRate("USD", buyerCurrency);
    const converted = vehicle.priceUSD * rate;

    const order = await Order.create({
      buyer,
      vehicle: vehicleId,
      priceUSD: vehicle.priceUSD,
      buyerCurrency,
      convertedPrice: converted,
      createdBy: req.user.id
    });

    res.json(order);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  const list = await Order.find().populate("vehicle");
  res.json(list);
};

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("vehicle");
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.json(order);
};

exports.updateStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
};
