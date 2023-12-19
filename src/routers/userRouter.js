import express from "express";

import userController from "../controllers/userController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = new express.Router();
router.use(authenticateToken)

router.delete("/", userController.deleteUser)

router.get("/me/rated", userController.getUserMovies)

export default router;