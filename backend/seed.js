import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Customer from "./models/Customer.js";
import CreditProfile from "./models/CreditProfile.js";

const seedData = async () => {
  await connectDB();

  console.log("🌱 Seeding database...");

  await Customer.deleteMany();
  await CreditProfile.deleteMany();

  const customers = await Customer.insertMany([
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
  ]);

  await CreditProfile.insertMany([
    {
      customerId: customers[0]._id,
      creditScore: 780,
      preApprovedLimit: 300000,
    },
    {
      customerId: customers[1]._id,
      creditScore: 820,
      preApprovedLimit: 500000,
    },
  ]);

  console.log("✅ Database seeded successfully");
  process.exit();
};

seedData();
