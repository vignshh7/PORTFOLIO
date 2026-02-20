import { Portfolio } from "../models/portfolio.model.js";

const normalizePayload = (body) => {
  if (!body) return null;
  if (body.data) return body.data;
  return body;
};

const createPortfolio = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "Portfolio data is required." });
    }

    const created = await Portfolio.create({ data: payload });
    return res.status(201).json(created);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getLatestPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found." });
    }
    return res.status(200).json(portfolio);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    return res.status(200).json(portfolios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found." });
    }
    return res.status(200).json(portfolio);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "Portfolio data is required." });
    }

    const updated = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { data: payload },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Portfolio not found." });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const patchPortfolio = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "Portfolio data is required." });
    }

    const updated = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $set: { data: payload } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Portfolio not found." });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const deleted = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Portfolio not found." });
    }
    return res.status(200).json({ message: "Portfolio deleted." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export {
  createPortfolio,
  getLatestPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  patchPortfolio,
  deletePortfolio,
};
