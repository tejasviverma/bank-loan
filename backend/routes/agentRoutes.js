import express from "express";
import { verifyCustomer } from "../agents/verificationAgent.js";
import { runUnderwriting } from "../agents/underwritingAgent.js";

const router = express.Router();

// 🔐 KYC Verification
router.post("/verify", async (req, res) => {
  try {
    const { input } = req.body;
    const result = await verifyCustomer(input);
    res.json(result);
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// 📊 Underwriting
router.post("/underwrite", async (req, res) => {
  try {
    const result = await runUnderwriting(req.body);
    res.json(result);
  } catch (err) {
    console.error("Underwriting error:", err);
    res.status(500).json({ error: "Underwriting failed" });
  }
});

// 📜 Loan History
router.get("/loans/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const loans = await LoanApplication.find({ customerId })
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (err) {
    console.error("Loan history error:", err);
    res.status(500).json({ error: "Failed to fetch loan history" });
  }
});
import LoanApplication from "../models/LoanApplication.js";

// 🧾 Salary Slip Upload
router.post("/upload-salary-slip", async (req, res) => {
  try {
    const { loanId, fileName } = req.body;

    const loan = await LoanApplication.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    loan.salarySlipName = fileName;
    loan.salaryVerified = true;
    loan.status = "UNDER_REVIEW";

    await loan.save();

    res.json({
      message: "Salary slip uploaded successfully",
      status: "UNDER_REVIEW",
    });
  } catch (err) {
    console.error("Salary slip upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
