const creditBureau = {
  AaravSharma: 780,
  PriyaMehta: 820,
  RohanPatel: 680,
};

const preApprovedLimits = {
  AaravSharma: 300000,
  PriyaMehta: 500000,
  RohanPatel: 150000,
};

export const runUnderwriting = ({
  customer,
  income,
  requestedAmount,
}) => {
  const key = customer.name.replace(/\s/g, "");
  const creditScore = creditBureau[key] || 720;
  const preApprovedLimit = preApprovedLimits[key] || income * 6;

  // EMI approximation (12 months, 12% interest)
  const emi = Math.round(requestedAmount / 12);

  // ❌ Rule 1: Credit score
  if (creditScore < 700) {
    return {
      status: "REJECTED",
      reason: "Low credit score",
      creditScore,
    };
  }

  // ❌ Rule 2: Above 2x limit
  if (requestedAmount > preApprovedLimit * 2) {
    return {
      status: "REJECTED",
      reason: "Requested amount exceeds eligibility",
      creditScore,
    };
  }

  // 🧾 Rule 3: Needs salary slip
  if (requestedAmount > preApprovedLimit) {
    return {
      status: "SALARY_SLIP_REQUIRED",
      creditScore,
      preApprovedLimit,
    };
  }

  // ❌ Rule 4: EMI affordability
  if (emi > income * 0.5) {
    return {
      status: "REJECTED",
      reason: "EMI exceeds 50% of income",
      creditScore,
    };
  }

  // ✅ Approved
  return {
    status: "APPROVED",
    creditScore,
    preApprovedLimit,
    emi,
  };
};