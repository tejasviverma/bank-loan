import mongoose from "mongoose";

const creditProfileSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  creditScore: {
    type: Number,
    required: true,
  },
  preApprovedLimit: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("CreditProfile", creditProfileSchema);
