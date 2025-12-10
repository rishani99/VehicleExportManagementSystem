const Shipment = require("../models/Shipment");
const Order = require("../models/Order");

// Create Shipment (Head Office)
exports.createShipment = async (req, res) => {
  try {
    const { orderId, vesselName, portOfLoading, portOfDischarge, ETD, ETA } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    const shipment = await Shipment.create({
      order: orderId,
      vesselName,
      portOfLoading,
      portOfDischarge,
      ETD,
      ETA,
      createdBy: req.user.id
    });

    // Autostatus
    shipment.status = "awaiting_payment_assignment";
    await shipment.save();

    res.json(shipment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Assign payment handler (Head Office)
exports.assignPaymentHandler = async (req, res) => {
  try {
    const { handlerId } = req.body;

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ msg: "Shipment not found" });

    shipment.paymentHandler = handlerId;
    shipment.status = "payment_assigned";

    await shipment.save();

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update shipment status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ msg: "Shipment not found" });

    shipment.status = status;
    await shipment.save();

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all shipments
exports.getShipments = async (req, res) => {
  const list = await Shipment.find()
    .populate("order")
    .populate("paymentHandler")
    .populate("createdBy");
  res.json(list);
};
