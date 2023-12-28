import express from "express";

import movieController from "../controllers/movieController.js";

import authenticateToken from "../middleware/authenticateToken.js";

const router = new express.Router();

router.use(authenticateToken)

router.post("/", movieController.addMovie)

router.get("/", movieController.getMovies)

router.get("/ratings/:id", movieController.getRating)

router.post("/ratings/:id", movieController.rateMovie)

router.get("/:id", movieController.getMovie)

router.delete("/:id", movieController.deleteMovie)

router.patch("/restore/:id", movieController.restoreMovie)

router.put("/:id", movieController.updateDescription)

export default router;