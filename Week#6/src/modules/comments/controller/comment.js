import postModel from '../../../../database/models/posts.js';
import userModel from '../../../../database/models/users.js';
import commentModel from '../../../../database/models/comments.js';

// create comment endpoint
export const createComment = async (req, res) => {
    // get post_id and user_id and content from request body
    const { post_id, user_id, content } = req.body;
    if (!post_id || !user_id || !content) {
        return res.status(400).json({ message: 'All fields are required' });
    }   

    try {
        const comment = await commentModel.create({ post_id, user_id, content });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// get comments of specific endpoint 
export const getComments = async (req, res) => {
    const postId = req.params.id;
    try {
        const comments = await commentModel.findAll({ where: { post_id: postId } });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// get comment endpoint
export const getComment = async (req, res) => {
    const commentId = req.params.id;
    try {
        const comment = await commentModel.findOne({ where: { comment_id: commentId } });
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// update comment endpoint
export const updateComment = async (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;
    try {
        const comment = await commentModel.findOne({ where: { comment_id: commentId } });
        if (!comment || comment.isDeleted) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        await comment.update({ content });

        res.json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// delete (softDelete) comment endpoint
export const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    try {
        const comment = await commentModel.findOne({ where: { comment_id: commentId } });
        if (!comment || comment.isDeleted) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        await comment.update({ isDeleted: true });

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}