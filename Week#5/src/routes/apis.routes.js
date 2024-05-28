import { Router } from "express";
const app = Router();
import customer from "./customer/route.js";
import order from "./order/route.js";
import product from "./product/route.js";

app.use("/customer/", customer);
//app.use("/order/", order);
app.use("/product/", product);

app.get("*", async (req, res) => {
  console.log(req.path);
  res.format({
    html: function () {
      res.status(200).send("Hello World!");
    },
    json: function () {
      res.json({
        message: "Hello World!",
      });
    },
  });
});

export default app;
