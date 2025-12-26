import express from "express";
import { verifyCustomer } from "../agents/verificationAgent.js";
import { runUnderwriting } from "../agents/underwritingAgent.js";

const router = express.Router();

router.post("/verify", (req, res) => {
  const { input } = req.body;
  const result = verifyCustomer(input);
  res.json(result);
});

router.post("/underwrite", (req, res) => {
  const result = runUnderwriting(req.body);
  res.json(result);
});

export default router;
