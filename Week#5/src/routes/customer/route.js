import { Router } from "express";
import customerController from "../../controller/customer.js";

const app = Router();


app.route('/signup')
  .post(customerController.signup);

app.route('/login')
  .post(customerController.login);
  
export default app;