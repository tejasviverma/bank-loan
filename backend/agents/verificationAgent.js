import crm from "../data/crm.json" assert { type: "json" };

export const verifyCustomer = (input) => {
  const cleaned = input.replace(/\D/g, "");

  const customer = crm.find(
    (c) =>
      cleaned.includes(c.phone) ||
      input.toLowerCase().includes(c.name.toLowerCase())
  );

  if (!customer) {
    return { status: "NOT_FOUND" };
  }

  if (customer.kycStatus !== "VERIFIED") {
    return { status: "PENDING", name: customer.name };
  }

  return { status: "VERIFIED", customer };
};
