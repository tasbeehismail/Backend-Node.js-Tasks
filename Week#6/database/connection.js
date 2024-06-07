import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    'mysql://unsag0hutafbgq1t:JqAOVRVcbHAwrKO8nYKg@buw1gdhy8cmuy3ukmgkf-mysql.services.clever-cloud.com:3306/buw1gdhy8cmuy3ukmgkf'
);

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch(err => {
        console.error('Unable to connect', err);
    });

export default sequelize;