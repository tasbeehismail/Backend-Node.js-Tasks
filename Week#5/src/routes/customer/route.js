import { Router } from "express";
import customerController from "../../controller/customer.js";

const app = Router();


app
  .route("/")
  .get(customerController.getAllCustomers)  


export default app;