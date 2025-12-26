import credit from "../data/credit.json" assert { type: "json" };
import offers from "../data/offers.json" assert { type: "json" };

export const runUnderwriting = ({ customer, income, requestedAmount }) => {
  const key = customer.name.replace(/\s/g, "");
  const creditScore = credit[key] || 720;
  const limit = offers[key] || income * 6;

  const emi = Math.round(requestedAmount / 12);

  if (creditScore < 700)
    return { status: "REJECTED", reason: "Low credit score", creditScore };

  if (requestedAmount > limit * 2)
    return { status: "REJECTED", reason: "Above eligibility", creditScore };

  if (requestedAmount > limit)
    return { status: "SALARY_SLIP", creditScore, limit };

  if (emi > income * 0.5)
    return { status: "REJECTED", reason: "EMI too high", creditScore };

  return {
    status: "APPROVED",
    creditScore,
    limit,
    emi,
  };
};
