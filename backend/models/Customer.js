import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  kycStatus: {
    type: String,
    enum: ["VERIFIED", "PENDING"],
    default: "VERIFIED",
  },
});

export default mongoose.model("Customer", customerSchema);
