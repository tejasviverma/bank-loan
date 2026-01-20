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

export default router;
