import express from "express";

import movieController from "../controllers/movieController.js";
import authenticateToken from "../middleware/authenticateToken.js";
import testDbConnection from "../middleware/testDbConnection.js";

const router = new express.Router();

router.use(testDbConnection)
router.use(authenticateToken)

router.post("/", movieController.addMovie)

router.get("/", movieController.getMovies)

router.patch("/restore/:id", movieController.restoreMovie)

router.get("/:id/ratings", movieController.getMovieRatings)

router.post("/:id/ratings", movieController.rateMovie)

router.get("/:id", movieController.getMovie)

router.delete("/:id", movieController.deleteMovie)

router.put("/:id", movieController.updateDescription)

router.patch("/:id", movieController.addMoviePoster)

export default router;