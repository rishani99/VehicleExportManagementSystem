import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  model: { type: String },
  year: { type: Number },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
