import CreditProfile from "../models/CreditProfile.js";
import LoanApplication from "../models/LoanApplication.js";

export const runUnderwriting = async ({
  customerId,
  income,
  requestedAmount,
}) => {
  const credit = await CreditProfile.findOne({ customerId });

  if (!credit) {
    return {
      status: "REJECTED",
      reason: "No credit profile found",
    };
  }

  const creditScore = credit.creditScore;
  const limit = credit.preApprovedLimit;
  const emi = Math.round(requestedAmount / 12);

  let status = "APPROVED";
  let reason = null;

  if (creditScore < 700) {
    status = "REJECTED";
    reason = "Low credit score";
  } else if (requestedAmount > limit * 2) {
    status = "REJECTED";
    reason = "Amount exceeds eligibility";
  } else if (requestedAmount > limit) {
    status = "SALARY_SLIP_REQUIRED";
  } else if (emi > income * 0.5) {
    status = "REJECTED";
    reason = "EMI exceeds affordability";
  }

  await LoanApplication.create({
    customerId,
    income,
    requestedAmount,
    status,
    emi,
  });

  return {
    status,
    creditScore,
    limit,
    emi,
    reason,
  };
};
