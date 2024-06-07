import postModel from '../../../../database/models/posts.js';
import userModel from '../../../../database/models/users.js';
import commentModel from '../../../../database/models/comments.js';
export const getPosts = async (req, res) => {
    try {
        const posts = await postModel.findAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
export const getPost = async (req, res) => {
    try {
        const post = await postModel.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: userModel,
                    attributes: {
                        exclude: ['password']
                    }
                }
            ]
        });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    try {
        const post = await postModel.findOne({ where: { post_id: postId } });
        if (!post || post.isDeleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.update({ title, content });

        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
// Soft delete post endpoint
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await postModel.findOne({ where: { post_id: postId } });

        if (!post || post.isDeleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.update({ isDeleted: true });
        await commentModel.update({ isDeleted: true }, { where: { post_id: postId } });

        res.json({ message: 'Post and associated comments deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
export const createPost = async (req, res) => {
    try {
        const post = await postModel.create(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

