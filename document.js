const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const upload = multer(); // memory storage for S3

const { uploadDocument, getDocumentsByShipment, getDocumentsByPayment } = require("../controllers/documentController");

// Upload document
router.post("/", auth, upload.single("file"), uploadDocument);

// Get documents by shipment
router.get("/shipment/:shipmentId", auth, getDocumentsByShipment);

// Get documents by payment
router.get("/payment/:paymentId", auth, getDocumentsByPayment);

module.exports = router;
