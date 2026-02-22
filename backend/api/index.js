import dotenv from "dotenv";
import app from "../src/app.js";
import connectDB from "../src/config/database.js";

dotenv.config({
    path: "./.env",
});

let isConnected = false;

const ensureDb = async () => {
    if (isConnected) {
        return;
    }

    await connectDB();
    isConnected = true;
};

export default async function handler(req, res) {
    try {
        await ensureDb();
        return app(req, res);
    } catch (error) {
        console.error("MongoDB connection failed", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
