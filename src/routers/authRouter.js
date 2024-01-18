import express from "express";

import authController from "../controllers/authController.js";
import testDbConnection from "../middleware/testDbConnection.js";

const router = new express.Router();

router.use(testDbConnection)

router.post("/signup", authController.signUp)

router.post("/signin", authController.login)

export default router;