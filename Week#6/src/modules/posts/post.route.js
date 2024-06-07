import { Router } from "express";
const router = Router();
import * as postController from "./controller/post.js";

router.post('/create/:user_id', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:post_id', postController.getPost);
router.patch('/update/:post_id', postController.updatePost);
router.delete('/delete/:post_id', postController.deletePost);

export default router;
