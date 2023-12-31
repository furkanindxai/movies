import express from "express";

import userController from "../controllers/userController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = new express.Router();
router.use(authenticateToken)

router.delete("/me", userController.deleteUser)

router.get("/me/rated", userController.getUserMovies)

router.patch("/me/password", userController.updatePassword);

router.delete("/:id", userController.deleteUserByAdmin)

router.patch("/restore/:id", userController.restoreAccount)

router.put("/me", userController.updatePassword)

router.get("/", userController.getUsers)

router.get("/:id", userController.getUser)

export default router;