import express from 'express' 
import bootstrap from '../src/bootstrap.js'; 
const app = express()

bootstrap(app)  

app.listen(3300, () => console.log('server running on port 3300'))  
