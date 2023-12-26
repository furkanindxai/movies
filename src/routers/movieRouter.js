import express from "express";

import movieController from "../controllers/movieController.js";

import authenticateToken from "../middleware/authenticateToken.js";

const router = new express.Router();

router.use(authenticateToken)

router.post("/", movieController.addMovie)

router.get("/", movieController.getMovies)

router.get("/ratings/:title", movieController.getRating)

router.post("/ratings", movieController.rateMovie)

router.get("/:title", movieController.getMovie)


export default router;