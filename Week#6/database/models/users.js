import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const userModel = sequelize.define('user', {
    user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    username: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true 
    },
    password: {
        type: DataTypes.STRING(250),
        allowNull: false
    }
});



export default userModel;
