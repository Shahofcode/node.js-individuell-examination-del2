import { Router } from "express";
import { createUser, login, logout } from "../controllers/usersController.js";

const router = Router();

// Log in user
router.post("/login", login);

// Create user
router.post("/signup", createUser);

// Log out user
router.post("/logout", logout);

export default router;
