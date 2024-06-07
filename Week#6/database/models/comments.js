import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const commentModel = sequelize.define('comment', {
    comment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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


export default commentModel;
