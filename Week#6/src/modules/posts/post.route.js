import { Router } from "express";
const router = Router();
import * as postController from "./controller/post.js";

router.post('/create', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.patch('/update/:id', postController.updatePost);
router.delete('/delete/:id', postController.deletePost);

export default router;
