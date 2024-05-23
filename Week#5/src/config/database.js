import mysql from 'mysql2';

const config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "e-commerce_system",
    port: 3308,
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); 
    } else {
        console.log("Connected to database");
    }
});

export default connection;
