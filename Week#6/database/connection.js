import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('social-media', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: '3309'
});

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch(err => {
        console.error('Unable to connect', err);
    });

export default sequelize;