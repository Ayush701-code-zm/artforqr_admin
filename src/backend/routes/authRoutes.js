// backend/routes/authRoutes.ts
import express from "express";
import AuthController from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.post("/reset-password", AuthController.resetPassword);
router.get("/me", authMiddleware, AuthController.getCurrentUser);

export default router;
