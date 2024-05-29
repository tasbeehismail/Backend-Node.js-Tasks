import { Router } from "express";
import productController from "../../controller/product.js";

const app = Router();

app.post('/add', productController.addProduct);
app.get('/revenue/by-category', productController.getRevenue);
app.get('/items-sold', productController.getItemsSold);

export default app;