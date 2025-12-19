const mockCRM = [
  {
    name: "Aarav Sharma",
    phone: "9876543210",
    city: "Mumbai",
    kycStatus: "VERIFIED",
  },
  {
    name: "Priya Mehta",
    phone: "9123456780",
    city: "Delhi",
    kycStatus: "VERIFIED",
  },
  {
    name: "Rohan Patel",
    phone: "9988776655",
    city: "Ahmedabad",
    kycStatus: "PENDING",
  },
];

export const verifyCustomer = (input) => {
  const cleaned = input.replace(/\s+/g, "").toLowerCase();

  const customer = mockCRM.find(
    (c) =>
      cleaned.includes(c.phone) ||
      cleaned.includes(c.name.replace(/\s+/g, "").toLowerCase())
  );

  if (!customer) {
    return {
      status: "NOT_FOUND",
      message: "Customer not found in our records.",
    };
  }

  if (customer.kycStatus !== "VERIFIED") {
    return {
      status: "PENDING",
      message: `KYC for ${customer.name} is pending.`,
    };
  }

  return {
    status: "VERIFIED",
    customer,
    message: `KYC verified successfully for ${customer.name}.`,
  };
};