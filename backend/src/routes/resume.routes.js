import { Router } from "express";
import multer from "multer";
import {
  uploadResume,
  downloadResumeById,
  downloadLatestResume,
} from "../controllers/resume.controller.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", upload.single("file"), uploadResume);
router.get("/latest", downloadLatestResume);
router.get("/:id", downloadResumeById);

export default router;
