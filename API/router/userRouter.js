import { Router } from "express";
import userController from "../controller/userController.js";
import authController from "../controller/authController.js";

const router = Router();

router.route("/login").post(userController.loginUser);
router.route("/signup").post(userController.createUser);
router.route("/logout").post(userController.logoutUser);

router.use(authController.protect);
router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(authController.restrictUserChanges, userController.getUser)
  .patch(authController.restrictUserChanges, userController.updateUser)
  .delete(authController.restrictUserChanges, userController.deleteUser);

export default router;
