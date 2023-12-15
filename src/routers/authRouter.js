import express from "express";

import authController from "../controllers/authController.js";

const router = new express.Router();

router.post("/signUp", authController.signUp)

router.post("/login", authController.login)

export default router;