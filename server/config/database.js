import dotenv from "dotenv";   // ✅ ADD THIS
import { PrismaClient } from "@prisma/client";

dotenv.config();               // ✅ ADD THIS

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export default prisma;