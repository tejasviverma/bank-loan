import Customer from "../models/Customer.js";

export const verifyCustomer = async (input) => {
  const trimmed = input.trim();
  const phone = trimmed.replace(/\D/g, "");

  let customer = null;

  // 1️⃣ Phone match (most reliable)
  if (phone.length === 10) {
    customer = await Customer.findOne({ phone });
  }

  // 2️⃣ Name match (case-insensitive, partial)
  if (!customer) {
    customer = await Customer.findOne({
      name: { $regex: `^${trimmed}`, $options: "i" },
    });
  }

  if (!customer) {
    return { status: "NOT_FOUND" };
  }

  if (customer.kycStatus !== "VERIFIED") {
    return { status: "PENDING" };
  }

  return {
    status: "VERIFIED",
    customer,
  };
};
