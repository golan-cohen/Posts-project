const express = require("express");
const PostController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const extractfile = require("../middleware/file");


const router = express.Router();

router.post("",checkAuth, extractfile , PostController.createPost);

router.put("/:id",checkAuth, extractfile , PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id",checkAuth, PostController.deletePost);

module.exports = router;
