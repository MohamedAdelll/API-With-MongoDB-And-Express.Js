import { Router } from "express";
import authController from "../controller/authController.js";
import postController from "../controller/postController.js";

const router = Router();

router.use(authController.protect);
router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.createPost);

router.use("/:id", authController.restrict);
router
  .route("/:id")
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

export default router;
