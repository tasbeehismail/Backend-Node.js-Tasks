import { Router } from "express";
const router = Router();
import * as commentController from "./controller/comment.js";

// create comment endpoint
router.post('/create/:user_id/:post_id', commentController.createComment);

// get comments of specific endpoint 
router.get('/post/:post_id', commentController.getComments);

// get comment endpoint
router.get('/:comment_id', commentController.getComment);   

// update comment endpoint
router.patch('/update/:comment_id', commentController.updateComment);

// delete comment endpoint
router.delete('/delete/:comment_id', commentController.deleteComment);

export default router;
