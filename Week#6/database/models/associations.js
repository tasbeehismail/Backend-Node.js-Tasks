import userModel from './users.js';
import postModel from './posts.js';
import commentModel from './comments.js';

postModel.belongsTo(userModel, {as: 'user', foreignKey: 'user_id'});
postModel.hasMany(commentModel, {as: 'comments', foreignKey: 'post_id'});

commentModel.belongsTo(userModel, { as: 'user', foreignKey: 'user_id' });
commentModel.belongsTo(postModel, { as: 'post', foreignKey: 'post_id' });

userModel.hasMany(commentModel, {as: 'comments', foreignKey: 'user_id'}); 
userModel.hasMany(postModel, {as: 'posts', foreignKey: 'user_id'}); 


export { userModel, postModel, commentModel };
