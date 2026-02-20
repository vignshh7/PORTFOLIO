import { Router } from "express";
import {
  createPortfolio,
  getLatestPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  patchPortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller.js";

const router = Router();

router.get("/", getLatestPortfolio);
router.get("/all", getAllPortfolios);
router.get("/:id", getPortfolioById);
router.post("/", createPortfolio);
router.put("/:id", updatePortfolio);
router.patch("/:id", patchPortfolio);
router.delete("/:id", deletePortfolio);

export default router;
