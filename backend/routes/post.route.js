import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from '../controllers/post.controller.js';

const router = express.Router();


router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/all", protectRoute, getAllPosts); // this is is to get the all of our posts ..
router.get("/following", protectRoute, getFollowingPosts); // to get all the posts of the people we are following :)
router.get("/user/:username", protectRoute, getUserPosts); // to get all the posts of the people we are following :)

// router.get("/all", protectRoute, getAllPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;