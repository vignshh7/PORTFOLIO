import dotenv from "dotenv";
import connectDB from "../config/database.js";
import { Portfolio } from "../models/portfolio.model.js";
import { portfolioData } from "../data/portfolioData.js";

dotenv.config({ path: "./.env" });

const seedPortfolio = async () => {
  try {
    await connectDB();

    const existing = await Portfolio.findOne().sort({ createdAt: -1 });

    if (existing) {
      existing.data = portfolioData;
      await existing.save();
      console.log("Updated existing portfolio data.");
    } else {
      await Portfolio.create({ data: portfolioData });
      console.log("Created new portfolio data.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedPortfolio();
