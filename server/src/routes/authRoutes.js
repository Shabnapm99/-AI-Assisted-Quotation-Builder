import { Router } from "express";
import { login, logout, register, verifyAuth } from "../controllers/authController.js";
import { validateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify', validateToken, verifyAuth);
router.post('/logout', logout);

export default router;