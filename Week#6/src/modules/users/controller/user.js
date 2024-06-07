import userModel from '../../../../database/models/users.js';
import commentModel from '../../../../database/models/comments.js';
import postModel from '../../../../database/models/posts.js';
import bcrypt from 'bcrypt';

// signup endpoint
export const signup = async (req, res) => {
    const { username, email, password } = req.body; 
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }  

    try {
        const userExists = await userModel.findOne({ 
            where: { email }
        });

        if (userExists) {
            return res.status(409).json({ message: 'User already exists, email must be unique' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);  // Asynchronous hashing
            const user = await userModel.create({ username, email, password: hashedPassword });
            return res.status(201).json({ message: 'User created successfully', user });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
// login endpoint
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await userModel.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }   
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }   
        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
// logout endpoint
export const logout = async (req, res) => {
    return res.status(200).json({ message: 'Logout successful' });
};
// Special endpoint to get a specific user with a specific post and post’s comments 
export const getUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await userModel.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const posts = await postModel.findAll({ where: { user_id, isDeleted: false }, attributes: { exclude: ['user_id', 'isDeleted']} });
        for (let i = 0; i < posts.length; i++) {
            const comments = await commentModel.findAll({ 
                where: { 
                    post_id: posts[i].post_id, 
                    isDeleted: false 
                }, 
                attributes: {
                    exclude: ['post_id', 'isDeleted']
                } 
            });
            posts[i].dataValues.comments = comments;
        }

        const response = {
            username: user.username,
            posts
        };
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
}   