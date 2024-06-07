import { Router } from "express";
const router = Router();
import * as commentController from "./controller/comment.js";

// create comment endpoint
router.post('/create', commentController.createComment);

// get comments of specific endpoint 
router.get('/', commentController.getComments);

// get comment endpoint
router.get('/:id', commentController.getComment);   

// update comment endpoint
router.patch('/update/:id', commentController.updateComment);

// delete comment endpoint
router.delete('/delete/:id', commentController.deleteComment);

export default router;
