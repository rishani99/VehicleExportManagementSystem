const Document = require("../models/Document");
const Shipment = require("../models/Shipment");
const Payment = require("../models/Payment");
const { uploadFile } = require("../services/s3Service");

// Local storage option
const path = require("path");
const fs = require("fs");

// Upload document (local or S3)
exports.uploadDocument = async (req,res)=>{
  try{
    const { shipmentId, paymentId, type } = req.body;
    const file = req.file;
    if(!file) return res.status(400).json({msg:"No file uploaded"});

    // Local storage path
    let fileUrl;
    if(process.env.STORAGE === "local"){
      const uploadDir = path.join(__dirname,"../uploads");
      if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      const filePath = path.join(uploadDir, Date.now() + "_" + file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      fileUrl = filePath;
    } else {
      // S3
      fileUrl = await uploadFile(file.buffer, Date.now() + "_" + file.originalname, file.mimetype);
    }

    const doc = await Document.create({
      shipment: shipmentId,
      payment: paymentId || null,
      type,
      filename: file.originalname,
      url: fileUrl,
      uploadedBy: req.user.id
    });

    res.json(doc);

  }catch(err){
    console.log(err);
    res.status(500).json({msg:"Server error"});
  }
};

// Get documents for shipment
exports.getDocumentsByShipment = async (req,res)=>{
  const docs = await Document.find({shipment:req.params.shipmentId}).populate("uploadedBy");
  res.json(docs);
};

// Get documents for payment
exports.getDocumentsByPayment = async (req,res)=>{
  const docs = await Document.find({payment:req.params.paymentId}).populate("uploadedBy");
  res.json(docs);
};
