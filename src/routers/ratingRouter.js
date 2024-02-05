import express from "express";

import ratingController from "../controllers/ratingController.js";
import testDbConnection from "../middleware/testDbConnection.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = new express.Router();

router.use(testDbConnection)
router.use(authenticateToken)

router.delete("/:id", ratingController.deleteRating)

router.patch("/restore/:id", ratingController.restoreRating)

router.get("/", ratingController.getRatings)

export default router;