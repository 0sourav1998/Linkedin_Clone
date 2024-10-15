import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createComment,
  createPost,
  deletePost,
  getFeeds,
  getPostById,
  likePost,
} from "../controllers/Post.js";
const router = express.Router();

router.get("/getFeeds", isAuthenticated, getFeeds);
router.post("/create", isAuthenticated, createPost);
router.delete("/delete/:id", isAuthenticated, deletePost);
router.get("/post/:id", isAuthenticated, getPostById);
router.post("/:id/comment", isAuthenticated, createComment);
router.post("/:id/like", isAuthenticated, likePost);

export default router;
