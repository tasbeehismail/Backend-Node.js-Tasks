import { Router } from "express";
import orderController from "../../controller/order.js";
import { or } from "sequelize";

const app = Router();


app.post('/create/:customer_id', orderController.createOrder);
app.get('/average', orderController.getAverageOrderValue)
app.get('/customers-without-orders', orderController.getCustomersWithoutOrders)
app.get('/customer-with-most-items', orderController.getCustomerWithMostItems)
app.get('/top-10-customers', orderController.getTop10Customers)
app.get('/customers-with-at-least-5-orders', orderController.getCustomersWithAtLeast5Orders)
app.get('/percentage', orderController.getPercentageOfCustomersWithMoreThanOneOrder)
app.get('/customer-with-earliest-order', orderController.getCustomerWithEarliestOrder)

export default app;