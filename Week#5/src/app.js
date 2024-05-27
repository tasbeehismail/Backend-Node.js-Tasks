import express from 'express';
import dbConnection from './config/database.js'; 
import routes from './routes/index.routes.js';

const app = express();

app.use(express.json());

const PORT = 3000;

async function startServer() {
    await dbConnection;

    app.use(routes);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
});
