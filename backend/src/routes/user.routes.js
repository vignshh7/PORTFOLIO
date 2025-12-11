import { Router } from "express";
import { login,logout,register } from "../controllers/user.controller.js";
const router=Router();
router.post("/register", register);

// POST /api/v1/users/login
router.post("/login", login);
router.post("/logout",logout)
export default router;  