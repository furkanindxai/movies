import express from "express";

import userController from "../controllers/userController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = new express.Router();
router.use(authenticateToken)

router.delete("/:email", userController.deleteUser)

router.get("/:movies", userController.getUserMovies)


export default router;