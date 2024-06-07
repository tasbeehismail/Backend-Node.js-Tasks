import postModel from '../../../../database/models/posts.js';
import userModel from '../../../../database/models/users.js';
import commentModel from '../../../../database/models/comments.js';
export const getPosts = async (req, res) => {
    try {
        const posts = await postModel.findAll({
            where: { isDeleted: false },
            include: [
                {
                    model: userModel,
                    as: 'user',
                    attributes: {
                        exclude: ['password', 'email', 'createdAt', 'updatedAt', 'isDeleted']

                    }
                },
                {
                    model: commentModel,
                    as: 'comments',
                    attributes: {
                        exclude: ['post_id', 'isDeleted']
                    }
                }
            ],
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
export const getPost = async (req, res) => {
    const { post_id } = req.params;
    try {
        const post = await postModel.findOne({
            where: { post_id},
            include: [
                {
                    model: userModel,
                    as: 'user',
                    attributes: {
                        exclude: ['password', 'email', 'createdAt', 'updatedAt', 'user_id']
                    }
                }
            ]
        });
        if(post.isDeleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
export const updatePost = async (req, res) => {
    const post_id = req.params.post_id;
    const { title, content } = req.body;
    try {
        const post = await postModel.findOne({ where: { post_id } });
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
    const post_id = req.params.post_id;
    try {
        const post = await postModel.findOne({ where: { post_id } });

        if (!post || post.isDeleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.update({ isDeleted: true });
        await commentModel.update({ isDeleted: true }, { where: { post_id } });

        res.json({ message: 'Post and associated comments deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
export const createPost = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await userModel.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const post = await postModel.create({ user_id, ...req.body });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

