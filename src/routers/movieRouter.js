import express from "express";

import movieController from "../controllers/movieController.js";

import authenticateToken from "../middleware/authenticateToken.js";

const router = new express.Router();
router.use(authenticateToken)

router.post("/", movieController.addMovie)

router.get("/", movieController.getMovies)

router.get("/genres/:genre", movieController.getMovies)

router.get("/:title", movieController.getMovie)

router.get("/search/:title", movieController.searchMovie)

router.post("/rate", movieController.rateMovie)

export default router;