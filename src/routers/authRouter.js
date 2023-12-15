import express from "express";

import authController from "../controllers/authController.js";

const router = new express.Router();

router.post("/signup", authController.signUp)

router.post("/signin", authController.login)

export default router;