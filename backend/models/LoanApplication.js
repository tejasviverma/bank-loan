import mongoose from "mongoose";

const loanApplicationSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  income: Number,
  requestedAmount: Number,
  status: {
    type: String,
    enum: ["APPROVED", "REJECTED", "SALARY_SLIP_REQUIRED"],
  },
  emi: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LoanApplication", loanApplicationSchema);
