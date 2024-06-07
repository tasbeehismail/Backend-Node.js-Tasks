import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';
import commentModel from './comments.js';
import userModel from './users.js';

const postModel = sequelize.define('post', {
    post_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});



export default postModel;
