import express from 'express' 
import bootstrap from '../src/bootstrap.js'; 
import cors from 'cors';

const app = express()

bootstrap(app)  
app.use(cors());
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server running on port ${port}$`))  
